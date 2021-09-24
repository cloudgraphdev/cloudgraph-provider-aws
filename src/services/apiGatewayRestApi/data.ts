import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  RestApi,
  RestApis,
  ListOfRestApi,
  GetRestApisRequest,
  Tags,
} from 'aws-sdk/clients/apigateway'
import { AWSError } from 'aws-sdk/lib/error'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { apiGatewayArn, apiGatewayRestApiArn } from '../../utils/generateArns'
import { Credentials, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog, setAwsRetryOptions } from '../../utils'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_REST_API = 500
const serviceName = 'API Gateway Rest API'
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({ baseDelay: API_GATEWAY_CUSTOM_DELAY })

export interface AwsApiGatewayRestApi extends Omit<RestApi, 'tags'> {
  tags: TagMap
  region: string
}

const getRestApisForRegion = async apiGw =>
  new Promise<ListOfRestApi>(resolve => {
    const restApiList: ListOfRestApi = []
    const getRestApisOpts: GetRestApisRequest = {}
    const listAllRestApis = (token?: string) => {
      getRestApisOpts.limit = MAX_REST_API
      if (token) {
        getRestApisOpts.position = token
      }
      try {
        apiGw.getRestApis(getRestApisOpts, (err: AWSError, data: RestApis) => {
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
      apiGw.getTags({ resourceArn: arn }, (err: AWSError, data: Tags) => {
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

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{ [property: string]: AwsApiGatewayRestApi[] }> =>
  new Promise(async resolve => {
    const apiGatewayData = []
    const regionPromises = []
    const tagsPromises = []

    regions.split(',').map(region => {
      const apiGw = new APIGW({ region, credentials, endpoint, ...customRetrySettings })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const restApiList = await getRestApisForRegion(apiGw)
        if (!isEmpty(restApiList)) {
          apiGatewayData.push(
            ...restApiList.map(restApi => ({
              ...restApi,
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
      const apiGw = new APIGW({ region, credentials, endpoint, ...customRetrySettings })
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
