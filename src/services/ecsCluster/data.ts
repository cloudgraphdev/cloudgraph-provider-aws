import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import ECS, {
  Cluster,
  ListClustersRequest,
  ListClustersResponse,
} from 'aws-sdk/clients/ecs'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ECS cluster'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const MAX_ITEMS = 100
export interface RawAwsEcsCluster extends Omit<Cluster, 'Tags'> {
  region: string
  Tags?: TagMap
}

export const listClusterArnsForRegion = async (ecs: ECS): Promise<string[]> =>
  new Promise<string[]>(resolve => {
    const clusterArnList: string[] = []
    const args: ListClustersRequest = {}
    const listAllClusterArns = (token?: string): void => {
      args.maxResults = MAX_ITEMS
      if (token) {
        args.nextToken = token
      }
      try {
        ecs.listClusters(args, (err: AWSError, data: ListClustersResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ecs:listClusters',
              err,
            })
          }

          if (isEmpty(data)) {
            return resolve([])
          }

          const { clusterArns = [], nextToken } = data || {}

          clusterArnList.push(...clusterArns)

          if (nextToken) {
            listAllClusterArns(nextToken)
          } else {
            resolve(clusterArnList)
          }
        })
      } catch (error) {
        resolve([])
      }
    }
    listAllClusterArns()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsEcsCluster[] }> =>
  new Promise(async resolve => {
    /**
     * Get all ECS Clusters Arns
     */
    const ecsClusterData: RawAwsEcsCluster[] = []
    const ecsClusterArns: Array<{ region: string; clusterArns: string[] }> = []
    const regionPromises = []

    regions.split(',').forEach(region => {
      const ecs = new ECS({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const clusterArnsList = await listClusterArnsForRegion(ecs)
        if (!isEmpty(clusterArnsList)) {
          ecsClusterArns.push({
            clusterArns: clusterArnsList,
            region,
          })
        }
        resolveRegion()
      })

      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    /**
     * Get the details for each cluster
     */

    const clusterPromises = ecsClusterArns.map(
      async ({ region, clusterArns }) =>
        new Promise<void>(resolveEcsData =>
          new ECS({ ...config, region, endpoint }).describeClusters(
            { clusters: clusterArns },
            (err, data) => {
              if (err) {
                errorLog.generateAwsErrorLog({
                  functionName: 'ecs:describeClusters',
                  err,
                })
              }

              if (isEmpty(data)) {
                return resolveEcsData()
              }

              const { clusters = [] } = data

              logger.debug(lt.fetchedEcsClusters(clusters.length))

              ecsClusterData.push(
                ...clusters.map(cluster => ({
                  ...cluster,
                  Tags: convertAwsTagsToTagMap(cluster.tags as AwsTag[]),
                  region,
                }))
              )

              resolveEcsData()
            }
          )
        )
    )

    await Promise.all(clusterPromises)
    errorLog.reset()

    resolve(groupBy(ecsClusterData, 'region'))
  })
