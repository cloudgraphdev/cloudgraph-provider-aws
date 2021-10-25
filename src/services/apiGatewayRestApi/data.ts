import CloudGraph from '@cloudgraph/sdk'
import {
  APIGateway,
  RestApi,
  RestApis,
  GetRestApisRequest,
  Tags,
  GetDomainNamesRequest,
  DomainNames,
  BasePathMappings,
  DomainName,
} from '@aws-sdk/client-api-gateway'
// import { AWSError } from 'aws-sdk/lib/error'
// import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { apiGatewayArn, apiGatewayRestApiArn } from '../../utils/generateArns'
import { TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog, setAwsRetryOptions } from '../../utils'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_REST_API = 500
const MAX_DOMAIN_NAMES = 500
const serviceName = 'API Gateway Rest API'
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({ baseDelay: API_GATEWAY_CUSTOM_DELAY })

export interface AwsApiGatewayRestApi extends Omit<RestApi, 'tags'> {
  accountId: string
  tags: TagMap
  domainNames: (DomainName & { restApiData?: string[] })[]
  region: string
}

const getRestApisForRegion = async (apiGw: APIGateway) =>
  new Promise<RestApi[]>(resolve => {
    const restApiList: RestApi[] = []
    const getRestApisOpts: GetRestApisRequest = {}
    const listAllRestApis = (token?: string) => {
      getRestApisOpts.limit = MAX_REST_API
      if (token) {
        getRestApisOpts.position = token
      }
      try {
        apiGw.getRestApis(getRestApisOpts, (err: any, data: RestApis) => {
          const { position, items = [] } = data || {}
          if (err) {
            generateAwsErrorLog(serviceName, 'apiGw:getRestApis', err)
          }

          restApiList.push(...items)

          if (position) {
            listAllRestApis(position)
          }

          resolve(restApiList)
        })
      } catch (error) {
        resolve([])
      }
    }
    listAllRestApis()
  })

const getTags = async ({ apiGw, arn }): Promise<TagMap> =>
  new Promise(resolve => {
    try {
      apiGw.getTags({ resourceArn: arn }, (err: any, data: Tags) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'apiGw:getTags', err)
          return resolve({})
        }
        const { tags = {} } = data || {}
        resolve(tags)
      })
    } catch (error) {
      resolve({})
    }
  })

const getAPIMappings = (apiGw: APIGateway, domainName: string) =>
  new Promise<{ domainName: string; restApiData: string[] }>(
    resolveBasePathMapping =>
      apiGw.getBasePathMappings(
        { domainName },
        (err: any, data: BasePathMappings) => {
          /**
           * No Data for the region
           */
          if (isEmpty(data)) {
            return
          }

          if (err) {
            generateAwsErrorLog(serviceName, 'apiGw:getBasePathMappings', err)
          }

          const { items: restApiData = [] } = data || {}

          resolveBasePathMapping({
            domainName,
            restApiData: restApiData.map(({ restApiId }) => restApiId),
          })
        }
      )
  )

export const getDomainNamesForRegion = async (
  apiGw: APIGateway
): Promise<DomainName[]> =>
  new Promise(async resolve => {
    const getDomainNamesOpts: GetDomainNamesRequest = {
      limit: MAX_DOMAIN_NAMES,
    }

    try {
      apiGw.getDomainNames(
        getDomainNamesOpts,
        (err: any, data: DomainNames) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'apiGw:getDomainNames', err)
          }

          const { items = [] } = data || {}

          logger.debug(lt.fetchedApiGwDomainNames(items.length))

          /**
           * No API Gateway Domain Names Found
           */

          if (!isEmpty(items)) {
            resolve(items)
          } else {
            resolve([])
          }
        }
      )
    } catch (error) {
      resolve([])
    }
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: any
}): Promise<{ [property: string]: AwsApiGatewayRestApi[] }> =>
  new Promise(async resolve => {
    const apiGatewayData = []
    let domainNamesData: (DomainName & { restApiData?: string[] })[] = []
    const regionPromises = []
    const tagsPromises = []

    regions.split(',').map(region => {
      const apiGw = new APIGateway({ ...config, region, endpoint, ...customRetrySettings })
      const regionPromise = new Promise<void>(async resolveRegion => {
        domainNamesData = await getDomainNamesForRegion(apiGw)
        const mappingPromises = domainNamesData.map(({ domainName }) =>
          getAPIMappings(apiGw, domainName)
        )
        const mappingData = await Promise.all(mappingPromises)
        const restApiList = await getRestApisForRegion(apiGw)
        if (!isEmpty(restApiList)) {
          apiGatewayData.push(
            ...restApiList.map(restApi => ({
              ...restApi,
              domainNames: domainNamesData.map(domain => ({
                ...domain,
                restApiData: (
                  mappingData?.find(
                    ({ domainName }) => domainName === domain.domainName
                  ) || { restApiData: [] }
                ).restApiData,
              })),
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
      const apiGw = new APIGateway({ ...config, region, endpoint, ...customRetrySettings })
      const tagsPromise = new Promise<void>(async resolveTags => {
        const arn = apiGatewayRestApiArn({
          restApiArn: apiGatewayArn({ region }),
          id,
        })
        apiGatewayData[idx].tags = await getTags({ apiGw, arn })
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    logger.debug(lt.gettingApiGatewayTags)
    await Promise.all(tagsPromises)

    resolve(groupBy(apiGatewayData, 'region'))
  })
