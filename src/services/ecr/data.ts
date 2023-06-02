import { Config } from 'aws-sdk'
import { AWSError } from 'aws-sdk/lib/error'
import ECR, {
  DescribeRepositoriesRequest,
  DescribeRepositoriesResponse,
  GetLifecyclePolicyResponse,
  GetRepositoryPolicyResponse,
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
  lifecyclePolicy: GetLifecyclePolicyResponse
  repositoryPolicy: GetRepositoryPolicyResponse
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

const getLifecyclePolicy = async (
  ecr: ECR,
  registryId: string,
  repositoryName: string
): Promise<GetLifecyclePolicyResponse> =>
  new Promise(resolve => {
    try {
      ecr.getLifecyclePolicy(
        { registryId, repositoryName },
        (err: AWSError, data: GetLifecyclePolicyResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ecr:getLifecyclePolicy',
              err,
            })
            return resolve({})
          }
          resolve(data)
        }
      )
    } catch (error) {
      resolve({})
    }
  })

const getRepositoryPolicy = async (
  ecr: ECR,
  registryId: string,
  repositoryName: string
): Promise<GetRepositoryPolicyResponse> =>
  new Promise(resolve => {
    try {
      ecr.getRepositoryPolicy(
        { registryId, repositoryName },
        (err: AWSError, data: GetRepositoryPolicyResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ecr:getRepositoryPolicy',
              err,
            })
            return resolve({})
          }
          resolve(data)
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
    const lifecyclePoliciesPromises = []
    const repositoryPoliciesPromises = []

    // get all repositories for all regions
    regions.split(',').forEach(region => {
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
              lifecyclePolicy: {},
              repositoryPolicy: {},
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
    ecrData.forEach(({ repositoryArn, region }, idx) => {
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

    // get lifecycle policy for each repository
    ecrData.forEach(({ registryId, repositoryName, region }, idx) => {
      const ecr = new ECR({ ...config, region, endpoint })
      const lifecyclePolicyPromise = new Promise<void>(
        async resolveLifecyclePolicy => {
          const lifecyclePolicy = await getLifecyclePolicy(
            ecr,
            registryId,
            repositoryName
          )
          ecrData[idx].lifecyclePolicy = lifecyclePolicy
          resolveLifecyclePolicy()
        }
      )
      lifecyclePoliciesPromises.push(lifecyclePolicyPromise)
    })

    logger.debug(lt.gettingECRRepoLifecyclePolicy)
    await Promise.all(lifecyclePoliciesPromises)

    // get repository policy for each repository
    ecrData.forEach(({ registryId, repositoryName, region }, idx) => {
      const ecr = new ECR({ ...config, region, endpoint })
      const repositoryPolicyPromise = new Promise<void>(
        async resolveRepositoryPolicy => {
          const repositoryPolicy = await getRepositoryPolicy(
            ecr,
            registryId,
            repositoryName
          )
          ecrData[idx].repositoryPolicy = repositoryPolicy
          resolveRepositoryPolicy()
        }
      )
      repositoryPoliciesPromises.push(repositoryPolicyPromise)
    })

    logger.debug(lt.gettingECRRepoRepositoryPolicy)
    await Promise.all(repositoryPoliciesPromises)

    errorLog.reset()

    resolve(groupBy(ecrData, 'region'))
  })
