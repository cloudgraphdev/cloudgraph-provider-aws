import { Config } from 'aws-sdk'
import { AWSError } from 'aws-sdk/lib/error'
import EMR, {
  Cluster,
  ClusterSummary,
  DescribeClusterOutput,
  ListClustersOutput,
  ListClustersInput,
} from 'aws-sdk/clients/emr'
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
const serviceName = 'EMR cluster'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const getEmrClusterDescription = async (
  emr: EMR,
  clusterId: string
): Promise<Cluster> =>
  new Promise(resolve => {
    emr.describeCluster(
      { ClusterId: clusterId },
      (err: AWSError, data: DescribeClusterOutput) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'emr:describeCluster',
            err,
          })
        }
        const { Cluster: cluster = {} } = data || {}

        resolve({
          ...cluster,
        })
      }
    )
  })

export const getEmrClusters = async (
  emr: EMR,
  region: string
): Promise<ClusterSummary[]> =>
  new Promise<ClusterSummary[]>(resolve => {
    const clusterList: ClusterSummary[] = []
    const listClustersOpts: ListClustersInput = {}
    const listClusters = (marker?: string): void => {
      if (marker) {
        listClustersOpts.Marker = marker
      }
      emr.listClusters(
        listClustersOpts,
        (err: AWSError, data: ListClustersOutput) => {
          const terminatedStatuses = [
            'TERMINATING',
            'TERMINATED',
            'TERMINATED_WITH_ERRORS',
          ]
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'emr:listClusters',
              err,
            })
          }
          /**
           * No EMR data for this region
           */
          if (isEmpty(data)) {
            return resolve([])
          }

          const { Clusters = [], Marker: nextToken } = data

          clusterList.push(
            ...Clusters.filter(
              cluster => !terminatedStatuses.includes(cluster.Status.State)
            )
          )

          if (nextToken) {
            logger.debug(lt.foundAnotherFiftyClusters(region))
            listClusters(nextToken)
          } else {
            resolve(clusterList)
          }
        }
      )
    }
    listClusters()
  })

export interface RawAwsEmrCluster extends Omit<Cluster, 'Tags'> {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsEmrCluster[] }> =>
  new Promise(async resolve => {
    /**
     * Get all the EMR clusters for this region
     */
    let numOfClusters = 0
    const clusterData: RawAwsEmrCluster[] = []
    await Promise.all(
      regions.split(',').map(
        region =>
          new Promise<void>(async resolveEmrClusters => {
            const emr = new EMR({ ...config, region, endpoint })
            const clusterList: ClusterSummary[] = await getEmrClusters(
              emr,
              region
            )

            if (!isEmpty(clusterList)) {
              numOfClusters += clusterList.length
              clusterData.push(
                ...clusterList.map(cluster => ({
                  Id: cluster.Id,
                  region,
                }))
              )
            }

            resolveEmrClusters()
          })
      )
    )
    logger.debug(lt.fetchedEmrClusters(numOfClusters))

    /**
     * Get the cluster description for each EMR cluster
     */
    const clusterPromises = clusterData.map(
      (cluster: RawAwsEmrCluster, idx) =>
        new Promise<void>(async resolveClusterDescription => {
          const emr = new EMR({ ...config, region: cluster.region, endpoint })
          const clusterDescription: Cluster = await getEmrClusterDescription(
            emr,
            cluster.Id
          )

          if (!isEmpty(clusterDescription)) {
            clusterData[idx] = {
              ...cluster,
              ...clusterDescription,
              Tags: convertAwsTagsToTagMap(clusterDescription.Tags as AwsTag[]),
            }
          }

          resolveClusterDescription()
        })
    )

    await Promise.all(clusterPromises)
    errorLog.reset()

    resolve(groupBy(clusterData, 'region'))
  })
