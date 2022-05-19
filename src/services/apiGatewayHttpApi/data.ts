import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  GetApisRequest,
  GetApisResponse,
  Api,
} from 'aws-sdk/clients/apigatewayv2'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_HTTP_API = '500'
const serviceName = 'API Gateway Http API'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export interface RawAwsApiGatewayHttpApi extends Omit<Api, 'Tags'> {
  accountId: string
  Tags: TagMap
  region: string
}

export const getHttpApisForRegion = async (apiGw: APIGW): Promise<Api[]> =>
  new Promise<Api[]>(resolve => {
    const httpApiList: Api[] = []
    const getApisOpts: GetApisRequest = {}
    const listAllHttpApis = (token?: string): void => {
      getApisOpts.MaxResults = MAX_HTTP_API
      if (token) {
        getApisOpts.NextToken = token
      }
      try {
        apiGw.getApis(getApisOpts, (err: AWSError, data: GetApisResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'apiGw:getApis',
              err,
            })
          }

          if (isEmpty(data)) {
            return resolve([])
          }

          const { NextToken: nextToken, Items: items = [] } = data || {}
          
          if (isEmpty(items)) {
            return resolve([])
          }

          httpApiList.push(...items)

          if (nextToken) {
            listAllHttpApis(nextToken)
          } else {
            resolve(httpApiList)
          }
        })
      } catch (error) {
        resolve([])
      }
    }
    listAllHttpApis()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsApiGatewayHttpApi[] }> =>
  new Promise(async resolve => {
    const apiGatewayData = []
    const regionPromises = []

    regions.split(',').map(region => {
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const httpApiList = await getHttpApisForRegion(apiGw)
        if (!isEmpty(httpApiList)) {
          apiGatewayData.push(
            ...httpApiList.map(httpApi => ({
              ...httpApi,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedApiGatewayRestApis(apiGatewayData.length))

    errorLog.reset()

    resolve(groupBy(apiGatewayData, 'region'))
  })
