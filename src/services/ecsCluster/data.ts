import { Config } from 'aws-sdk'
import { AWSError } from 'aws-sdk/lib/error'
import ECS, {
  Cluster,
  ListClustersRequest,
  ListClustersResponse,
} from 'aws-sdk/clients/ecs'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ECS cluster'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsEcsCluster extends Omit<Cluster, 'Tags'> {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsEcsCluster[] }> =>
  new Promise(async resolve => {
    /**
     * Get the arns of all the ECS Clusters
     */
    const ecsClusterData: RawAwsEcsCluster[] = []
    const ecsClusterArns: Array<{ region: string; clusterArns: string[] }> = []
    const regionPromises = []

    const listClusterArns = async ({
      ecs,
      region,
      token: nextToken = '',
      resolveRegion,
    }: {
      ecs: ECS
      region: string
      token?: string
      resolveRegion: Function
    }) => {
      let args: ListClustersRequest = {}

      if (nextToken) {
        args = { ...args, nextToken }
      }

      return ecs.listClusters(
        args,
        (err: AWSError, data: ListClustersResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ecs:listClusters',
              err,
            })
          }

          /**
           * No Cluster data for this region
           */
          if (isEmpty(data)) {
            return resolveRegion()
          }

          const { clusterArns, nextToken: token } = data

          logger.debug(lt.fetchedEcsClusters(clusterArns.length))

          /**
           * No Clusters Found
           */

          if (isEmpty(clusterArns)) {
            return resolveRegion()
          }

          /**
           * Check to see if there are more
           */

          if (token) {
            listClusterArns({ region, token, ecs, resolveRegion })
          }

          /**
           * Add the found Clusters to the ecsClusterArns
           */

          ecsClusterArns.push({ region, clusterArns })

          /**
           * If this is the last page of data then return
           */

          if (!token) {
            resolveRegion()
          }
        }
      )
    }

    regions.split(',').map(region => {
      const ecs = new ECS({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(resolveRegion =>
        listClusterArns({ ecs, region, resolveRegion })
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    /**
     * Get the details for each cluster
     */

    const clusterPromises = ecsClusterArns.map(
      async ({ region, clusterArns: clusters }) =>
        new Promise<void>(resolveEcsData =>
          new ECS({ ...config, region, endpoint }).describeClusters(
            { clusters },
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
