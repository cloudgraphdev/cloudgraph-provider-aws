import CloudGraph from '@cloudgraph/sdk'
import Elasticache, {
  CacheCluster,
  CacheClusterMessage,
  TagListMessage,
} from 'aws-sdk/clients/elasticache'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import awsLoggerText from '../../properties/logger'
import { TagMap, AwsTag } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { generateAwsErrorLog, initTestEndpoint } from '../../utils'
const lt = { ...awsLoggerText }
const {logger} = CloudGraph
const serviceName = 'ElastiCache cluster'
const endpoint = initTestEndpoint(serviceName)

const getElasticacheClusters = async elastiCache =>
  new Promise<CacheCluster[]>(resolve => {
    const clusterList: CacheCluster[] = []
    const descClustersOpts: CacheClusterMessage = {}
    const listAllClusters = (token?: string) => {
      if (token) {
        descClustersOpts.Marker = token
      }
      try {
        elastiCache.describeCacheClusters(
          descClustersOpts,
          (err: AWSError, data: CacheClusterMessage) => {
            const { Marker, CacheClusters = [] } = data || {}
            if (err) {
              generateAwsErrorLog(serviceName, 'elastiCache:describeCacheClusters', err)
            }

            clusterList.push(...CacheClusters)

            if (Marker) {
              listAllClusters(Marker)
            }

            resolve(clusterList)
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllClusters()
  })

const getResourceTags = async (elastiCache: Elasticache, arn: string): Promise<TagMap> =>
  new Promise(resolve => {
    try {
      elastiCache.listTagsForResource(
        { ResourceName: arn },
        (err: AWSError, data: TagListMessage) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'elastiCache:listTagsForResource', err)
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

export interface RawAwsElastiCacheCluster extends CacheCluster {
  Tags?: TagMap
  region: string
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
        const clusters = await getElasticacheClusters(elastiCache)

        if (!isEmpty(clusters)) {
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
    resolve(groupBy(elastiCacheData, 'region'))
  })
