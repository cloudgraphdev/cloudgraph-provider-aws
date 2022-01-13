import { Config } from 'aws-sdk'
import ECS, { Service } from 'aws-sdk/clients/ecs'
import CloudGraph from '@cloudgraph/sdk'
import flatMap from 'lodash/flatMap'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'
import EcsClusterClass from '../ecsCluster'
import { RawAwsEcsCluster } from '../ecsCluster/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ECS service'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsEcsService extends Service {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsEcsService[]
}> =>
  new Promise(async resolve => {
    const ecsServices: RawAwsEcsService[] = []
    const ecsClusterClass = new EcsClusterClass({ logger: CloudGraph.logger })
    const clusterResult = await ecsClusterClass.getData({
      ...config,
      regions,
    })
    const ecsClusters: RawAwsEcsCluster[] = flatMap(clusterResult)

    /**
     * Get the arns of all the services
     */
    let ecsServiceArns: any = await Promise.all(
      ecsClusters.map(
        async ({ clusterName: cluster, region }) =>
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
      async ({ region, serviceArns: services, cluster }) =>
        new Promise<void>(resolveEcsData =>
          new ECS({ ...config, region, endpoint }).describeServices(
            { services, cluster },
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

              const { services = [] } = data

              logger.debug(lt.fetchedEcsServices(services.length))

              ecsServices.push(
                ...services.map(service => ({
                  region,
                  ...service,
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
