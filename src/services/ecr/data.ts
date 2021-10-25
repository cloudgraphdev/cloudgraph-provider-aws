// import { Config } from 'aws-sdk'
// import { AWSError } from 'aws-sdk/lib/error'
import {
  ECR,
  DescribeRepositoriesRequest,
  DescribeRepositoriesResponse,
  ListTagsForResourceResponse,
  Repository,
} from '@aws-sdk/client-ecr'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ECR'
const endpoint = initTestEndpoint(serviceName)
const MAX_ITEMS = 1000

export interface RawAwsEcr extends Repository {
  region: string
  Tags?: TagMap
}

const listReposForRegion = async ({ ecr, resolveRegion }): Promise<Repository[]> =>
  new Promise<Repository[]>(resolve => {
    const repositoryList: Repository[] = []
    const descRepositoryOpts: DescribeRepositoriesRequest = {}
    const listAllRepos = (token?: string): void => {
      descRepositoryOpts.maxResults = MAX_ITEMS
      if (token) {
        descRepositoryOpts.nextToken = token
      }
      try {
        ecr.describeRepositories(
          descRepositoryOpts,
          (err: any, data: DescribeRepositoriesResponse) => {
            const { nextToken, repositories } = data || {}
            if (err) {
              generateAwsErrorLog(serviceName, 'ecr:describeRepositories', err)
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
            }

            logger.debug(lt.fetchedECRRepos(repositoryList.length))
            resolve(repositoryList)
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
        (err: any, data: ListTagsForResourceResponse) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'ecr:listTagsForResource', err)
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
  config: any
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

    resolve(groupBy(ecrData, 'region'))
  })
