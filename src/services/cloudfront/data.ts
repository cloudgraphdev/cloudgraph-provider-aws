import CloudGraph from '@cloudgraph/sdk'
import { AWSError, Config } from 'aws-sdk'
import Cloudfront, {
  DistributionConfig,
  DistributionSummary,
  GetDistributionConfigResult,
  ListDistributionsRequest,
  ListDistributionsResult,
  ListTagsForResourceResult,
} from 'aws-sdk/clients/cloudfront'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { initTestEndpoint, settleAllPromises } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { globalRegionName } from '../../enums/regions'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Cloudfront'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface CloudfrontDistributionConfig {
  config?: DistributionConfig
  etag?: string
}
export interface RawAwsCloudfront extends CloudfrontDistributionConfig {
  region: string
  config?: DistributionConfig
  etag?: string
  summary: DistributionSummary
  Tags?: TagMap
}

const listCloudfrontDistributions = async (
  cloudFront: Cloudfront
): Promise<DistributionSummary[]> =>
  new Promise<DistributionSummary[]>(resolve => {
    const distributions: DistributionSummary[] = []
    const listDistOpts: ListDistributionsRequest = {}
    const listDistributions = (marker?: string): void => {
      if (marker) {
        listDistOpts.Marker = marker
      }
      cloudFront.listDistributions(
        listDistOpts,
        (err: AWSError, data: ListDistributionsResult) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'cloudfront:listDistributions',
              err,
            })
          }

          const {
            DistributionList: {
              Items = [],
              NextMarker: nextToken = '',
              IsTruncated = false,
            } = {},
          } = data || {}

          /**
           * No Distributions Found
           */
          if (isEmpty(Items)) {
            return resolve([])
          }

          distributions.push(...Items)

          if (IsTruncated) {
            listDistributions(nextToken)
          } else {
            resolve(distributions)
          }
        }
      )
    }
    listDistributions()
  })

const getDistributionTags = async (
  cloudfront: Cloudfront,
  arn: string
): Promise<TagMap> =>
  new Promise<TagMap>(resolve => {
    cloudfront.listTagsForResource(
      {
        Resource: arn,
      },
      (err: AWSError, data: ListTagsForResourceResult) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'cloudfront:listTagsForResource',
            err,
          })
        }

        const {
          Tags: { Items: tags = [] },
        } = data || { Tags: {} }

        if (!isEmpty(data)) {
          resolve(convertAwsTagsToTagMap(tags as AwsTag[]))
        }
        resolve({})
      }
    )
  })

const getDistributionConfig = async (
  cloudfront: Cloudfront,
  id: string
): Promise<CloudfrontDistributionConfig> =>
  new Promise<CloudfrontDistributionConfig>(resolve => {
    cloudfront.getDistributionConfig(
      {
        Id: id,
      },
      (err: AWSError, data: GetDistributionConfigResult) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'cloudfront:getDistributionConfig',
            err,
          })
        }

        if (!isEmpty(data)) {
          resolve({ config: data.DistributionConfig, etag: data.ETag })
        }
        resolve({})
      }
    )
  })

/**
 * Cloudfront
 */
export default async ({
  config,
}: {
  config: Config
}): Promise<{ [property: string]: RawAwsCloudfront[] }> => {
  const cloudfront = new Cloudfront({ ...config, endpoint })
  const distributionList: DistributionSummary[] =
    await listCloudfrontDistributions(cloudfront)

  let numOfDistributions = 0
  let cloudfrontData: RawAwsCloudfront[] = []
  if (!isEmpty(distributionList)) {
    numOfDistributions += distributionList.length
    cloudfrontData = distributionList.map(item => ({
      summary: item,
      region: globalRegionName,
    }))
  }
  logger.debug(lt.fetchedCloudFrontDistros(numOfDistributions))

  await Promise.all(
    cloudfrontData.map(
      async (dist, distIndex) =>
        new Promise<void>(async resolveDistributionTags => {
          const promises: [
            Promise<TagMap>,
            Promise<CloudfrontDistributionConfig>
          ] = [
            getDistributionTags(cloudfront, dist.summary.ARN),
            getDistributionConfig(cloudfront, dist.summary.Id),
          ]

          const [Tags, distConfig] = await settleAllPromises(promises)
          const { config, etag } = distConfig
          cloudfrontData[distIndex] = {
            ...dist,
            Tags,
            config,
            etag,
          }
          resolveDistributionTags()
        })
    )
  )
  errorLog.reset()

  return groupBy(cloudfrontData, 'region')
}
