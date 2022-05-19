import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  RestApi,
  RestApis,
  ListOfRestApi,
  GetRestApisRequest,
  Tags,
} from 'aws-sdk/clients/apigateway'
import APIGWv2, { DomainName } from 'aws-sdk/clients/apigatewayv2'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { apiGatewayArn, apiGatewayRestApiArn } from '../../utils/generateArns'
import { TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'
import services from '../../enums/services'
import {
  RawAwsApiGatewayDomainName,
  getDomainNamesForRegion,
} from '../apiGatewayDomainName/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_REST_API = 500
const serviceName = 'API Gateway Rest API'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export interface RawAwsApiGatewayRestApi extends Omit<RestApi, 'Tags'> {
  accountId: string
  Tags: TagMap
  domainNames: string[]
  region: string
}

export const getRestApisForRegion = async (
  apiGw: APIGW
): Promise<ListOfRestApi> =>
  new Promise<ListOfRestApi>(resolve => {
    const restApiList: ListOfRestApi = []
    const getRestApisOpts: GetRestApisRequest = {}
    const listAllRestApis = (token?: string): void => {
      getRestApisOpts.limit = MAX_REST_API
      if (token) {
        getRestApisOpts.position = token
      }
      try {
        apiGw.getRestApis(getRestApisOpts, (err: AWSError, data: RestApis) => {
          const { position, items = [] } = data || {}
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'apiGw:getRestApis',
              err,
            })
          }

          restApiList.push(...items)

          if (position) {
            listAllRestApis(position)
          } else {
            resolve(restApiList)
          }
        })
      } catch (error) {
        resolve([])
      }
    }
    listAllRestApis()
  })

export const getTags = async ({
  apiGw,
  arn,
}: {
  apiGw: APIGW
  arn: string
}): Promise<TagMap> =>
  new Promise(resolve => {
    try {
      apiGw.getTags({ resourceArn: arn }, (err: AWSError, data: Tags) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'apiGw:getTags',
            err,
          })
          resolve({})
        }
        const { tags = {} } = data || {}
        resolve(tags)
      })
    } catch (error) {
      resolve({})
    }
  })

export default async ({
  regions,
  config,
  rawData,
}: {
  regions: string
  config: Config
  rawData: any
}): Promise<{ [property: string]: RawAwsApiGatewayRestApi[] }> =>
  new Promise(async resolve => {
    const apiGatewayData = []
    let domainNamesData: DomainName[] = []
    const regionPromises = []
    const tagsPromises = []

    const existingData: { [property: string]: RawAwsApiGatewayDomainName[] } =
      rawData.find(({ name }) => name === services.apiGatewayDomainName)
        ?.data || {}

    regions.split(',').map(region => {
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const regionPromise = new Promise<void>(async resolveRegion => {
        if (isEmpty(existingData)) {
          const apiGwV2 = new APIGWv2({
            ...config,
            region,
            endpoint,
            ...customRetrySettings,
          })
          domainNamesData = await getDomainNamesForRegion(apiGwV2)
        } else {
          domainNamesData = existingData[region] || []
        }

        const restApiList = await getRestApisForRegion(apiGw)
        if (!isEmpty(restApiList)) {
          apiGatewayData.push(
            ...restApiList.map(restApi => ({
              ...restApi,
              domainNames: domainNamesData?.map(domain => domain.DomainName) || [],
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

    // get all tags for each rest api
    apiGatewayData.map(({ id, region }, idx) => {
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const tagsPromise = new Promise<void>(async resolveTags => {
        const arn = apiGatewayRestApiArn({
          restApiArn: apiGatewayArn({ region }),
          id,
        })
        apiGatewayData[idx].Tags = await getTags({ apiGw, arn })
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    logger.debug(lt.gettingApiGatewayTags)
    await Promise.all(tagsPromises)
    errorLog.reset()

    resolve(groupBy(apiGatewayData, 'region'))
  })
