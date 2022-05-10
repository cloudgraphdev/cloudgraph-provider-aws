import CloudGraph from '@cloudgraph/sdk'
import Elasticache, {
  CacheCluster,
  CacheClusterMessage,
  TagListMessage,
  DescribeCacheSubnetGroupsMessage,
  CacheSubnetGroupMessage,
  CacheSubnetGroup,
} from 'aws-sdk/clients/elasticache'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import awsLoggerText from '../../properties/logger'
import { TagMap, AwsTag } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ElastiCache cluster'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const getElasticacheClusters = async (
  elastiCache: Elasticache
): Promise<CacheCluster[]> =>
  new Promise<CacheCluster[]>(resolve => {
    const clusterList: CacheCluster[] = []
    const descClustersOpts: CacheClusterMessage = {}
    const listAllClusters = (token?: string): void => {
      if (token) {
        descClustersOpts.Marker = token
      }
      try {
        elastiCache.describeCacheClusters(
          descClustersOpts,
          (err: AWSError, data: CacheClusterMessage) => {
            const { Marker, CacheClusters = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'elastiCache:describeCacheClusters',
                err,
              })
            }

            clusterList.push(...CacheClusters)

            if (Marker) {
              listAllClusters(Marker)
            } else {
              resolve(clusterList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllClusters()
  })

const getResourceTags = async (
  elastiCache: Elasticache,
  arn: string
): Promise<TagMap> =>
  new Promise(resolve => {
    try {
      elastiCache.listTagsForResource(
        { ResourceName: arn },
        (err: AWSError, data: TagListMessage) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'elastiCache:listTagsForResource',
              err,
            })
            return resolve({})
          }
          const { TagList: tags = [] } = data || {}
          resolve(convertAwsTagsToTagMap(tags as AwsTag[]))
        }
      )
    } catch (error) {
      resolve({})
    }
  })

const getCacheSubnetGroup = async ({
  elastiCache,
  cacheSubnetGroupName,
}: {
  elastiCache: Elasticache
  cacheSubnetGroupName: string
}): Promise<CacheSubnetGroup | unknown> =>
  new Promise<CacheSubnetGroup | unknown>(resolve => {
    const args: DescribeCacheSubnetGroupsMessage = {
      CacheSubnetGroupName: cacheSubnetGroupName,
    }

    try {
      elastiCache.describeCacheSubnetGroups(
        args,
        (err: AWSError, data: CacheSubnetGroupMessage) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'elastiCache:describeCacheSubnetGroups',
              err,
            })
          }

          /**
           * No cache subnet group for this region
           */
          if (isEmpty(data)) {
            return resolve({})
          }

          const { CacheSubnetGroups: cacheSubnetGroups } = data || {}
          const result =
            cacheSubnetGroups && cacheSubnetGroups?.length > 0
              ? cacheSubnetGroups[0]
              : {}
          resolve(result)
        }
      )
    } catch (error) {
      resolve({})
    }
  })
export interface RawAwsElastiCacheCluster extends CacheCluster {
  Tags?: TagMap
  region: string
  CacheSubnetGroup?: CacheSubnetGroup
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsElastiCacheCluster[] }> =>
  new Promise(async resolve => {
    const elastiCacheData: RawAwsElastiCacheCluster[] = []
    const regionPromises = []
    const tagsPromises = []

    // Get all the clusters for the region
    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(async resolveRegion => {
        const elastiCache = new Elasticache({ ...config, region, endpoint })
        let clusters = await getElasticacheClusters(elastiCache)

        if (!isEmpty(clusters)) {
          // Get cache subnet groups for each cluster
          const cacheSubnetGroupNames: string[] = clusters.map(
            cluster => cluster.CacheSubnetGroupName
          )

          if (!isEmpty(cacheSubnetGroupNames)) {
            const cacheSubnetGroups: CacheSubnetGroup[] = await Promise.all(
              cacheSubnetGroupNames.map(cacheSubnetGroupName =>
                getCacheSubnetGroup({
                  elastiCache,
                  cacheSubnetGroupName,
                })
              )
            )

            if (!isEmpty(cacheSubnetGroups)) {
              clusters = clusters.map(cluster => {
                const cacheSubnetGroup: CacheSubnetGroup =
                  cacheSubnetGroups.find(
                    (group: CacheSubnetGroup) =>
                      group.CacheSubnetGroupName ===
                      cluster.CacheSubnetGroupName
                  )
                return {
                  ...cluster,
                  CacheSubnetGroup: cacheSubnetGroup || {},
                }
              })
            }
          }

          elastiCacheData.push(
            ...clusters.map(cluster => ({
              ...cluster,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedElasticacheClusters(elastiCacheData.length))

    // get all tags for each cluster
    elastiCacheData.map(({ ARN: arn, region }, idx) => {
      const elastiCache = new Elasticache({ ...config, region, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        elastiCacheData[idx].Tags = await getResourceTags(elastiCache, arn)
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    await Promise.all(tagsPromises)
    errorLog.reset()

    resolve(groupBy(elastiCacheData, 'region'))
  })
