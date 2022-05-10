import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  ListOfResource,
  GetResourcesRequest,
  Resources,
  Resource,
} from 'aws-sdk/clients/apigateway'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'
import {
  getRestApisForRegion,
  RawAwsApiGatewayRestApi,
} from '../apiGatewayRestApi/data'
import services from '../../enums/services'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_RESOURCES = 500
const serviceName = 'API gateway Resource'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export interface RawAwsApiGatewayResource extends Resource {
  restApiId: string
  region: string
}

const getResources = async ({ apiGw, restApiId }): Promise<ListOfResource> =>
  new Promise<ListOfResource>(resolve => {
    const resourceList: ListOfResource = []
    const getResourcesOpts: GetResourcesRequest = {
      restApiId,
    }
    const listAllResources = (token?: string): void => {
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
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw:getResources',
                err,
              })
            }
            /**
             * No rest APIs for this region
             */
            if (!isEmpty(data)) {
              resourceList.push(...items)
            }

            if (position) {
              listAllResources(position)
            } else {
              resolve(resourceList)
            }
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
  config,
  rawData,
}: {
  regions: string
  config: Config
  rawData: any
}): Promise<{ [property: string]: RawAwsApiGatewayResource[] }> =>
  new Promise(async resolve => {
    const apiGatewayData: Array<{ region: string; restApiId: string }> = []
    const apiGatewayResources: RawAwsApiGatewayResource[] = []
    const regionPromises: Array<Promise<void>> = []
    const additionalPromises: Array<Promise<void>> = []

    const existingData: { [property: string]: RawAwsApiGatewayRestApi[] } =
      rawData.find(({ name }) => name === services.apiGatewayRestApi)?.data ||
      {}

    if (isEmpty(existingData)) {
      // Refresh data
      regions.split(',').map(region => {
        const apiGw = new APIGW({
          ...config,
          region,
          endpoint,
          ...customRetrySettings,
        })
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
        return null
      })
      await Promise.all(regionPromises)
    } else {
      // Uses existing data
      regions.split(',').map(region => {
        if (!isEmpty(existingData[region])) {
          apiGatewayData.push(
            ...existingData[region].map(restApi => ({
              restApiId: restApi.id,
              region,
            }))
          )
        }
        return null
      })
    }

    apiGatewayData.map(({ restApiId, region }) => {
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const additionalPromise = new Promise<void>(async resolveAdditional => {
        const resources = await getResources({ apiGw, restApiId })
        apiGatewayResources.push(
          ...resources.map(resource => ({
            ...resource,
            restApiId,
            region,
          }))
        )

        resolveAdditional()
      })
      additionalPromises.push(additionalPromise)
      return null
    })

    await Promise.all(additionalPromises)
    logger.debug(lt.fetchedApiGatewayResources(apiGatewayResources.length))
    errorLog.reset()

    resolve(groupBy(apiGatewayResources, 'region'))
  })
