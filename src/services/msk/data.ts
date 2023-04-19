import CloudGraph from '@cloudgraph/sdk'
import Kafka, { Cluster, ListClustersV2Request, ListClustersV2Response } from 'aws-sdk/clients/kafka'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'
import { TagMap } from '../../types'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_DOMAIN_NAMES = 500
const serviceName = 'Msk'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export const getMskClustersForRegion = async (
  kafka: Kafka
): Promise<Cluster[]> =>
  new Promise(async resolve => {
    const mskClusterList: Cluster[] = []
    const listClusterV2Opts: ListClustersV2Request = {}
    const listAllMskClusters = (token?: string): void => {
      listClusterV2Opts.MaxResults = MAX_DOMAIN_NAMES
      if (token) {
        listClusterV2Opts.NextToken = token
      }
      try {
        kafka.listClustersV2(
          listClusterV2Opts,
          (err: AWSError, data: ListClustersV2Response) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'kafka:listClustersV2',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { NextToken: nextToken, ClusterInfoList: clusters = [] } = data || {}

            if (isEmpty(clusters)) {
              return resolve([])
            }

            logger.debug(lt.fetchedMskClusters(clusters.length))

            mskClusterList.push(...clusters)

            if (nextToken) {
              listAllMskClusters(nextToken)
            } else {
              resolve(mskClusterList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllMskClusters()
  })

export interface RawAwsMskCluster extends Omit<Cluster, 'Tags'> {
  region: string
  Tags: TagMap
  account
}

export default async ({
  regions,
  config,
  account,
}: {
  account: string
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsMskCluster[]
}> =>
  new Promise(async resolve => {
    const mskClustersResult: RawAwsMskCluster[] = []

    const regionPromises = regions.split(',').map(region => {
      const kafka = new Kafka({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })

      return new Promise<void>(async resolveMskClusterData => {
        // Get Msk Cluster Data
        const mskClusters = await getMskClustersForRegion(kafka)

        if (!isEmpty(mskClusters)) {
          for (const cluster of mskClusters) {
            mskClustersResult.push({
              ...cluster,
              region,
              Tags: cluster.Tags,
              account,
            })
          }
        }

        resolveMskClusterData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(mskClustersResult, 'region'))
  })
