import RS, { Cluster, ClustersMessage } from 'aws-sdk/clients/redshift'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { AwsTag, TagMap } from '../../types'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Redshift'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

/**
 * Redshift
 */
export interface RawAwsRedshiftCluster extends Omit<Cluster, 'Tags'> {
  Tags?: TagMap
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsRedshiftCluster[] }> =>
  new Promise(async resolve => {
    const rsData: RawAwsRedshiftCluster[] = []
    const regionPromises = []

    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(resolveRegion =>
        new RS({ ...config, region, endpoint }).describeClusters(
          {},
          (err: AWSError, data: ClustersMessage) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'redshift:describeClusters',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolveRegion()
            }

            const { Clusters: clusters = [] } = data

            if (isEmpty(clusters)) {
              return resolveRegion()
            }

            logger.debug(lt.fetchedRedshiftClusters(clusters.length))
            rsData.push(
              ...clusters.map(({ ...cluster }) => ({
                ...cluster,
                region,
                Tags: convertAwsTagsToTagMap(cluster.Tags as AwsTag[]),
              }))
            )

            resolveRegion()
          }
        )
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(rsData, 'region'))
  })
