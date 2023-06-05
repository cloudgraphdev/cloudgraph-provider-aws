import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import ECS, { ListServicesRequest, Service } from 'aws-sdk/clients/ecs'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import services from '../../enums/services'
import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { listClusterArnsForRegion, RawAwsEcsCluster } from '../ecsCluster/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ECS service'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const MAX_ITEMS = 100
export interface RawAwsEcsService extends Service {
  region: string
  Tags?: TagMap
  ClusterArn: string
}

export const listServicesArnForRegion = async (
  ecs: ECS,
  cluster: string
): Promise<string[]> =>
  new Promise<string[]>(resolve => {
    const serviceArnList: string[] = []
    const getRestApisOpts: ListServicesRequest = {
      cluster,
      maxResults: MAX_ITEMS,
    }
    const listAllServiceArns = (token?: string): void => {
      if (token) {
        getRestApisOpts.nextToken = token
      }
      try {
        ecs.listServices({ cluster }, (err, data) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ecs:listServices',
              err,
            })
          }

          if (isEmpty(data)) {
            return resolve([])
          }

          const { serviceArns = [], nextToken } = data

          serviceArnList.push(...serviceArns)

          if (nextToken) {
            listAllServiceArns(nextToken)
          } else {
            resolve(serviceArnList)
          }
        })
      } catch (error) {
        resolve([])
      }
    }
    listAllServiceArns()
  })

export default async ({
  regions,
  config,
  rawData,
}: {
  regions: string
  config: Config
  rawData: any
}): Promise<{
  [region: string]: RawAwsEcsService[]
}> =>
  new Promise(async resolve => {
    const ecsServices: RawAwsEcsService[] = []
    const regionPromises = []
    const ecsClusterData: Array<{ region: string; clusterArn: string }> = []

    const existingData: { [property: string]: RawAwsEcsCluster[] } =
      rawData?.find(({ name }) => name === services.ecsCluster)?.data || {}

    if (isEmpty(existingData)) {
      // Refresh data
      regions.split(',').map(region => {
        const ecsClient = new ECS({ ...config, region, endpoint })
        const regionPromise = new Promise<void>(async resolveRegion => {
          const clusterArnList = await listClusterArnsForRegion(ecsClient)
          if (!isEmpty(clusterArnList)) {
            ecsClusterData.push(
              ...clusterArnList.map(arn => ({
                clusterArn: arn,
                region,
              }))
            )
          }
          resolveRegion()
        })
        regionPromises.push(regionPromise)
        return null
      })
      await Promise.all(regionPromises)
    } else {
      // Uses existing data
      regions.split(',').map(region => {
        if (!isEmpty(existingData[region])) {
          ecsClusterData.push(
            ...existingData[region].map(ecsCluster => ({
              clusterArn: ecsCluster.clusterArn,
              region,
            }))
          )
        }
        return null
      })
    }

    /**
     * Get the arns of all the services
     */
    let ecsServiceArns: any = await Promise.all(
      ecsClusterData.map(
        async ({ clusterArn: cluster, region }) =>
          new Promise(resolveEcsData =>
            new ECS({ ...config, region, endpoint }).listServices(
              { cluster },
              (err, data) => {
                if (err) {
                  errorLog.generateAwsErrorLog({
                    functionName: 'ecs:listServices',
                    err,
                  })
                }

                if (isEmpty(data)) {
                  return resolveEcsData([])
                }

                const { serviceArns = [] } = data

                resolveEcsData({ region, cluster, serviceArns })
              }
            )
          )
      )
    )
    /**
     * Check to make sure each cluster has services before we search for them
     */
    ecsServiceArns = ecsServiceArns
      .flat()
      .filter(({ serviceArns }) => !isEmpty(serviceArns))

    /**
     * Get all the details for each service
     */
    const ecsServicePromises = ecsServiceArns.map(
      async ({ region, serviceArns, cluster }) =>
        new Promise<void>(resolveEcsData =>
          new ECS({ ...config, region, endpoint }).describeServices(
            { services: serviceArns, cluster },
            (err, data) => {
              if (err) {
                errorLog.generateAwsErrorLog({
                  functionName: 'ecs:describeServices',
                  err,
                })
              }

              if (isEmpty(data)) {
                return resolveEcsData()
              }

              const { services: servicesList = [] } = data

              logger.debug(lt.fetchedEcsServices(servicesList.length))

              ecsServices.push(
                ...servicesList.map(service => ({
                  region,
                  ...service,
                  ClusterArn: cluster,
                  Tags: convertAwsTagsToTagMap(service.tags as AwsTag[]),
                }))
              )

              resolveEcsData()
            }
          )
        )
    )

    await Promise.all(ecsServicePromises)
    errorLog.reset()

    resolve(groupBy(ecsServices, 'region'))
  })
