import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  RestApis,
  ListOfRestApi,
  GetRestApisRequest,
  ListOfResource,
  GetResourcesRequest,
  Resources,
  Resource,
} from 'aws-sdk/clients/apigateway'
import { AWSError } from 'aws-sdk/lib/error'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { Credentials } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog, setAwsRetryOptions } from '../../utils'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'

const lt = { ...awsLoggerText }
const {logger} = CloudGraph
const MAX_REST_API = 500
const MAX_RESOURCES = 500
const serviceName = 'API gateway Resource'
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({ baseDelay: API_GATEWAY_CUSTOM_DELAY })

export interface AwsApiGatewayResource extends Resource {
  accountId: string
  restApiId: string
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

const getResources = async ({ apiGw, restApiId }) =>
  new Promise<ListOfResource>(resolve => {
    const resourceList: ListOfResource = []
    const getResourcesOpts: GetResourcesRequest = {
      restApiId,
    }
    const listAllResources = (token?: string) => {
      getResourcesOpts.limit = MAX_RESOURCES
      getResourcesOpts.embed = ['methods']
      if (token) {
        getResourcesOpts.position = token
      }
      try {
        apiGw.getResources(
          getResourcesOpts,
          (err: AWSError, data: Resources) => {
            const { position, items = [] } = data || {}
            if (err) {
              generateAwsErrorLog(serviceName, 'apiGw:getResources', err)
            }
            /**
             * No rest APIs for this region
             */
            if (!isEmpty(data)) {
              resourceList.push(...items)
            }

            if (position) {
              listAllResources(position)
            }

            resolve(resourceList)
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllResources()
  })

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{ [property: string]: AwsApiGatewayResource[] }> =>
  new Promise(async resolve => {
    const apiGatewayData = []
    const apiGatewayResources = []
    const regionPromises = []
    const additionalPromises = []

    regions.split(',').map(region => {
      const apiGw = new APIGW({ region, credentials, endpoint, ...customRetrySettings })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const restApiList = await getRestApisForRegion(apiGw)
        if (!isEmpty(restApiList)) {
          apiGatewayData.push(
            ...restApiList.map(restApi => ({
              restApiId: restApi.id,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    apiGatewayData.map(({ restApiId, region }) => {
      const apiGw = new APIGW({ region, credentials, endpoint, ...customRetrySettings })
      const additionalPromise = new Promise<void>(async resolveAdditional => {
        const resources = await getResources({ apiGw, restApiId })
        apiGatewayResources.push(...resources.map(resource => ({
          ...resource,
          restApiId,
          region,
        })))

        resolveAdditional()
      })
      additionalPromises.push(additionalPromise)
    })

    await Promise.all(additionalPromises)
    logger.debug(lt.fetchedApiGatewayResources(apiGatewayResources.length))

    resolve(groupBy(apiGatewayResources, 'region'))
  })
