import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import Lambda, {
  FunctionConfiguration,
  FunctionList,
  ListFunctionsRequest,
  ListFunctionsResponse,
  ListTagsResponse,
  GetFunctionConcurrencyRequest,
  GetFunctionConcurrencyResponse,
  ReservedConcurrentExecutions,
  GetPolicyResponse
} from 'aws-sdk/clients/lambda'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import CloudGraph from '@cloudgraph/sdk'
import awsLoggerText from '../../properties/logger'

import { TagMap } from '../../types'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const MAX_ITEMS = 50
const { logger } = CloudGraph
const serviceName = 'Lambda'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsLambdaFunction extends FunctionConfiguration {
  Tags?: TagMap
  region: string
  reservedConcurrentExecutions: ReservedConcurrentExecutions
  PolicyData?: {
    Policy?: string
    RevisionId?: string
  }
}

const listFunctionsForRegion = async ({
  lambda,
  resolveRegion,
}: {
  lambda: Lambda
  resolveRegion: () => void
}): Promise<FunctionList> =>
  new Promise<FunctionList>(resolve => {
    const functionsList: FunctionList = []
    const listFunctionsOpts: ListFunctionsRequest = {}
    const listAllFunctions = (token?: string): void => {
      listFunctionsOpts.MaxItems = MAX_ITEMS
      if (token) {
        listFunctionsOpts.Marker = token
      }
      try {
        lambda.listFunctions(
          listFunctionsOpts,
          (err: AWSError, data: ListFunctionsResponse) => {
            const { NextMarker, Functions = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'lambda:listFunctions',
                err,
              })
            }
            /**
             * No Lambdas for this region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            functionsList.push(...Functions)

            if (NextMarker) {
              logger.debug(lt.foundMoreLambdas(Functions.length))
              listAllFunctions(NextMarker)
            } else {
              resolve(functionsList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllFunctions()
  })

const getFunctionConcurrency = async (
  lambda: Lambda,
  FunctionName: string
): Promise<ReservedConcurrentExecutions> =>
  new Promise(resolve => {
    const getFunctionConcurrencyOpts: GetFunctionConcurrencyRequest = {
      FunctionName,
    }
    try {
      lambda.getFunctionConcurrency(
        getFunctionConcurrencyOpts,
        (err: AWSError, data: GetFunctionConcurrencyResponse) => {
          const { ReservedConcurrentExecutions: reservedConcurrentExecutions } =
            data || {}
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'lambda:getFunctionConcurrency',
              err,
            })
          }
          resolve(reservedConcurrentExecutions || -1)
        }
      )
    } catch (error) {
      resolve(null)
    }
  })

const getResourceTags = async (lambda: Lambda, arn: string): Promise<TagMap> =>
  new Promise(resolve => {
    try {
      lambda.listTags(
        { Resource: arn },
        (err: AWSError, data: ListTagsResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'lambda:listTags',
              err,
            })
            resolve({})
          }
          const { Tags = {} } = data || {}
          resolve(Tags)
        }
      )
    } catch (error) {
      resolve({})
    }
  })

  const getLambdaPolicy = async (lambda: Lambda, arn: string): Promise<{ Policy?: string; RevisionId?: string }> =>
  new Promise(resolve => {
    try {
      lambda.getPolicy(
        { FunctionName: arn },
        (err: AWSError, data: GetPolicyResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'lambda:getPolicy',
              err,
            })
            resolve({})
          }
          const { Policy = '', RevisionId = '' } = data || {}
          resolve({ Policy, RevisionId })
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
}): Promise<{ [property: string]: RawAwsLambdaFunction[] }> =>
  new Promise(async resolve => {
    const lambdaData: RawAwsLambdaFunction[] = []
    const regionPromises = []
    const tagsPromises = []

    // get all Lambdas for all regions
    regions.split(',').map(region => {
      const lambda = new Lambda({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const functionsList = await listFunctionsForRegion({
          lambda,
          resolveRegion,
        })
        if (!isEmpty(functionsList)) {
          const promises = functionsList.map(async fn => ({
            ...fn,
            reservedConcurrentExecutions: await getFunctionConcurrency(
              lambda,
              fn.FunctionName
            ),
            region,
          }))
          lambdaData.push(...(await Promise.all(promises)))
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedLambdas(lambdaData.length))

    // get all tags and policy for each Lambda
    lambdaData.map(({ FunctionArn: arn, region }, idx) => {
      const lambda = new Lambda({ ...config, region, endpoint })
      const tagsAndPolicyPromise = new Promise<void>(async resolveData => {
        const envTags: TagMap = await getResourceTags(lambda, arn)
        lambdaData[idx].Tags = envTags
        const policy = await getLambdaPolicy(lambda, arn)
        lambdaData[idx].PolicyData = policy
        resolveData()
      })
      tagsPromises.push(tagsAndPolicyPromise)
    })

    logger.debug(lt.gettingLambdaTags)
    await Promise.all(tagsPromises)
    errorLog.reset()

    resolve(groupBy(lambdaData, 'region'))
  })
