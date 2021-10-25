import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import {
  Lambda,
  FunctionConfiguration,
  ListFunctionsRequest,
  ListFunctionsResponse,
  ListTagsResponse,
  GetFunctionConcurrencyRequest,
  GetFunctionConcurrencyResponse,
} from '@aws-sdk/client-lambda'
// import { AWSError } from 'aws-sdk/lib/error'
// import { Config } from 'aws-sdk/lib/config'
import CloudGraph from '@cloudgraph/sdk'
import awsLoggerText from '../../properties/logger'

import { TagMap } from '../../types'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const MAX_ITEMS = 50
const { logger } = CloudGraph
const serviceName = 'Lambda'
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsLambdaFunction extends FunctionConfiguration {
  Tags?: TagMap
  region: string
  reservedConcurrentExecutions: number
}

const listFunctionsForRegion = async ({
  lambda,
  resolveRegion,
}: {
  lambda: Lambda
  resolveRegion: () => void
}): Promise<FunctionConfiguration[]> =>
  new Promise<FunctionConfiguration[]>(resolve => {
    const functionsList: FunctionConfiguration[] = []
    const listFunctionsOpts: ListFunctionsRequest = {}
    const listAllFunctions = (token?: string): void => {
      listFunctionsOpts.MaxItems = MAX_ITEMS
      if (token) {
        listFunctionsOpts.Marker = token
      }
      try {
        lambda.listFunctions(
          listFunctionsOpts,
          (err: any, data: ListFunctionsResponse) => {
            const { NextMarker, Functions = [] } = data || {}
            if (err) {
              generateAwsErrorLog(serviceName, 'lambda:listFunctions', err)
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
            }

            resolve(functionsList)
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
): Promise<number> =>
  new Promise(resolve => {
    const getFunctionConcurrencyOpts: GetFunctionConcurrencyRequest = {
      FunctionName,
    }
    try {
      lambda.getFunctionConcurrency(
        getFunctionConcurrencyOpts,
        (err: any, data: GetFunctionConcurrencyResponse) => {
          const { ReservedConcurrentExecutions: reservedConcurrentExecutions } =
            data || {}
          if (err) {
            generateAwsErrorLog(serviceName, 'lambda:getFunctionConcurrency', err)
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
        (err: any, data: ListTagsResponse) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'lambda:listTags', err)
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

export default async ({
  regions,
  config,
}: {
  regions: string
  config: any
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

    // get all tags for each Lambda
    lambdaData.map(({ FunctionArn: arn, region }, idx) => {
      const lambda = new Lambda({ ...config, region, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        const envTags: TagMap = await getResourceTags(lambda, arn)
        lambdaData[idx].Tags = envTags
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    logger.debug(lt.gettingLambdaTags)
    await Promise.all(tagsPromises)

    resolve(groupBy(lambdaData, 'region'))
  })
