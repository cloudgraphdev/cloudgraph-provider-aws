import { Config } from 'aws-sdk'
import { AWSError } from 'aws-sdk/lib/error'
import Cloud9, {
  Environment,
  EnvironmentId,
  EnvironmentIdList,
  EnvironmentList,
  ListEnvironmentsRequest,
  ListEnvironmentsResult,
  DescribeEnvironmentsRequest,
  DescribeEnvironmentsResult,
  ListTagsForResourceResponse,
} from 'aws-sdk/clients/cloud9'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import chunk from 'lodash/chunk'
import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Cloud9 environment'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const MAX_ITEMS = 25

const listEnvironmentsForRegion = async ({ 
  cloud9, 
  resolveRegion,
}: {
  cloud9: Cloud9
  resolveRegion: () => void
}): Promise<EnvironmentId[]> =>
  new Promise<EnvironmentId[]>(resolve => {
    const environmentIdList: EnvironmentIdList = []
    const listEnvironmentsOpts: ListEnvironmentsRequest = {}
    const listAllEnvironments = (token?: string): void => {
      if (token) {
        listEnvironmentsOpts.nextToken = token
      }
      try {
        cloud9.listEnvironments(
          listEnvironmentsOpts,
          (err: AWSError, data: ListEnvironmentsResult) => {
            const { nextToken, environmentIds } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'cloud9:listEnvironments',
                err,
              })
            }
            /**
             * No Cloud9 environments for this region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            environmentIdList.push(...environmentIds)

            if (nextToken) {
              logger.debug(
                lt.foundMoreCloud9Environments(environmentIds.length)
              )
              listAllEnvironments(nextToken)
            } else {
              resolve(environmentIdList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllEnvironments()
  })

const getEnvironmentAttributes = async (
  cloud9: Cloud9,
  ids: EnvironmentIdList
): Promise<EnvironmentList> =>
  new Promise(resolve => {
    const descEnvironmentsOpts: DescribeEnvironmentsRequest = {
      environmentIds: ids,
    }
    try {
      cloud9.describeEnvironments(
        descEnvironmentsOpts,
        (err: AWSError, data: DescribeEnvironmentsResult) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'cloud9:describeEnvironments',
              err,
            })
          }
          resolve(data.environments)
        }
      )
    } catch (error) {
      resolve([])
    }
  })

const getEnvironmentTags = async (
  cloud9: Cloud9,
  arn: string
): Promise<TagMap> =>
  new Promise(resolve => {
    try {
      cloud9.listTagsForResource(
        { ResourceARN: arn },
        (err: AWSError, data: ListTagsForResourceResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'cloud9:listTagsForResource',
              err,
            })
            return resolve({})
          }

          const { Tags = [] } = data || {}
          resolve(convertAwsTagsToTagMap(Tags as AwsTag[]))
        }
      )
    } catch (error) {
      resolve({})
    }
  })

export interface RawAwsCloud9Environment
  extends Omit<Environment, 'arn' | 'ownerArn' | 'type'> {
  arn?: string
  ownerArn?: string
  region: string
  Tags?: TagMap
  type?: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsCloud9Environment[]
}> =>
  new Promise(async resolve => {
    const cloud9Data: RawAwsCloud9Environment[] = []
    const environmentPromises = []
    const regionPromises = []
    const tagsPromises = []

    // get all environments for all regions
    regions.split(',').map(region => {
      const cloud9 = new Cloud9({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const environmentIdList = await listEnvironmentsForRegion({
          cloud9,
          resolveRegion,
        })
        cloud9Data.push(
          ...environmentIdList.map((environmentId: EnvironmentId) => ({
            id: environmentId,
            region,
          }))
        )
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    // get all attributes for each environment using batched ids
    Object.entries(groupBy(cloud9Data, 'region')).map(
      (group: [string, RawAwsCloud9Environment[]]) => {
        const region = group[0]
        const cloud9 = new Cloud9({ ...config, region, endpoint })
        chunk(
          group[1].map(data => data.id),
          MAX_ITEMS
        ).map(ids => {
          const environmentPromise = new Promise<void>(
            async resolveEnvironment => {
              const environmentAttributes = await getEnvironmentAttributes(
                cloud9,
                ids
              )
              environmentAttributes.map((attributes, idx) => {
                cloud9Data[idx] = {
                  ...cloud9Data[idx],
                  ...attributes,
                }
              })
              resolveEnvironment()
            }
          )
          environmentPromises.push(environmentPromise)
        })
      }
    )

    logger.debug(lt.gettingCloud9Environments)
    await Promise.all(environmentPromises)

    // get all tags for each environment
    cloud9Data.map(({ arn, region }, idx) => {
      const cloud9 = new Cloud9({ ...config, region, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        const envTags: TagMap = await getEnvironmentTags(cloud9, arn)
        cloud9Data[idx].Tags = envTags
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    logger.debug(lt.gettingCloud9EnvironmentTags)
    await Promise.all(tagsPromises)
    errorLog.reset()

    resolve(groupBy(cloud9Data, 'region'))
  })
