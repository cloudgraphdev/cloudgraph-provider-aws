import CloudGraph from '@cloudgraph/sdk'
import Elasticache, {
  ReplicationGroup,
  DescribeReplicationGroupsMessage,
  ReplicationGroupMessage,
  TagListMessage,
} from 'aws-sdk/clients/elasticache'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import awsLoggerText from '../../properties/logger'
import { TagMap, AwsTag } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ElastiCache replication group'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const getElasticacheReplicationGroups = async (
  elastiCache: Elasticache
): Promise<ReplicationGroup[]> =>
  new Promise<ReplicationGroup[]>(resolve => {
    const groupList: ReplicationGroup[] = []
    const descGroupOpts: DescribeReplicationGroupsMessage = {}
    const listAllGroups = (token?: string): void => {
      if (token) {
        descGroupOpts.Marker = token
      }
      try {
        elastiCache.describeReplicationGroups(
          descGroupOpts,
          (err: AWSError, data: ReplicationGroupMessage) => {
            const { Marker, ReplicationGroups = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'elastiCache:describeReplicationGroups',
                err,
              })
            }

            groupList.push(...ReplicationGroups)

            if (Marker) {
              listAllGroups(Marker)
            } else {
              resolve(groupList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllGroups()
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

export interface RawAwsElastiCacheReplicationGroup extends ReplicationGroup {
  Tags?: TagMap
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsElastiCacheReplicationGroup[] }> =>
  new Promise(async resolve => {
    const elastiCacheData: RawAwsElastiCacheReplicationGroup[] = []
    const regionPromises = []
    const tagsPromises = []

    // Get all the replication groups for the region
    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(async resolveRegion => {
        const elastiCache = new Elasticache({ ...config, region, endpoint })
        const groups = await getElasticacheReplicationGroups(elastiCache)

        if (!isEmpty(groups)) {
          elastiCacheData.push(
            ...groups.map(group => ({
              ...group,
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

    // get all tags for each replication group
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
