import { Config } from 'aws-sdk'
import { AWSError } from 'aws-sdk/lib/error'
import ECR, {
  DescribeRepositoriesRequest,
  DescribeRepositoriesResponse,
  ListTagsForResourceResponse,
  Repository,
  RepositoryList,
} from 'aws-sdk/clients/ecr'
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
const serviceName = 'ECR'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const MAX_ITEMS = 1000

export interface RawAwsEcr extends Repository {
  region: string
  Tags?: TagMap
}

const listReposForRegion = async ({
  ecr,
  resolveRegion,
}): Promise<RepositoryList> =>
  new Promise<RepositoryList>(resolve => {
    const repositoryList: RepositoryList = []
    const descRepositoryOpts: DescribeRepositoriesRequest = {}
    const listAllRepos = (token?: string): void => {
      descRepositoryOpts.maxResults = MAX_ITEMS
      if (token) {
        descRepositoryOpts.nextToken = token
      }
      try {
        ecr.describeRepositories(
          descRepositoryOpts,
          (err: AWSError, data: DescribeRepositoriesResponse) => {
            const { nextToken, repositories } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ecr:describeRepositories',
                err,
              })
            }
            /**
             * No repositories for this region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            repositoryList.push(...repositories)

            if (nextToken) {
              logger.debug(lt.foundMoreECRRepos(repositories.length))
              listAllRepos(nextToken)
            } else {
              logger.debug(lt.fetchedECRRepos(repositoryList.length))
              resolve(repositoryList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllRepos()
  })

const getResourceTags = async (ecr: ECR, arn: string): Promise<TagMap> =>
  new Promise(resolve => {
    try {
      ecr.listTagsForResource(
        { resourceArn: arn },
        (err: AWSError, data: ListTagsForResourceResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ecr:listTagsForResource',
              err,
            })
            return resolve({})
          }
          const { tags = [] } = data || {}
          resolve(convertAwsTagsToTagMap(tags as AwsTag[]))
        }
      )
    } catch (error) {
      resolve({})
    }
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsEcr[]
}> =>
  new Promise(async resolve => {
    const ecrData: RawAwsEcr[] = []
    const regionPromises = []
    const tagsPromises = []

    // get all repositories for all regions
    regions.split(',').map(region => {
      const ecr = new ECR({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const repositoryList = await listReposForRegion({
          ecr,
          resolveRegion,
        })
        if (!isEmpty(repositoryList)) {
          ecrData.push(
            ...repositoryList.map(repo => ({
              ...repo,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    logger.debug(lt.gettingECRRepos)
    await Promise.all(regionPromises)

    // get all tags for each repository
    ecrData.map(({ repositoryArn, region }, idx) => {
      const ecr = new ECR({ ...config, region, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        const envTags: TagMap = await getResourceTags(ecr, repositoryArn)
        ecrData[idx].Tags = envTags
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    logger.debug(lt.gettingECRRepoTags)
    await Promise.all(tagsPromises)
    errorLog.reset()

    resolve(groupBy(ecrData, 'region'))
  })
