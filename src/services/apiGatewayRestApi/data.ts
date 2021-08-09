import * as Sentry from '@sentry/node'
import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  RestApis,
  ListOfRestApi,
  GetRestApisRequest,
  Stages,
  ListOfStage,
  GetStagesRequest,
  ListOfResource,
  Tags,
  GetResourcesRequest,
  Resources,
} from 'aws-sdk/clients/apigateway'
import { AWSError } from 'aws-sdk/lib/error'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import {
  apiGatewayArn,
  apiGatewayRestApiArn,
  apiGatewayStageArn,
} from '../../utils/generateArns'
import { Credentials } from '../../types'
import awsLoggerText from '../../properties/logger'
import { Tag } from '../../types/generated'

const lt = { ...awsLoggerText }
const {logger} = CloudGraph
const MAX_REST_API = 500
const MAX_RESOURCES = 500

/**
 * API Gateway
 */

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
            logger.error(err)
            Sentry.captureException(new Error(err.message))
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

const getStages = async ({ apiGw, restApiId }) =>
  new Promise<ListOfStage>(resolve => {
    const getFunctionConcurrencyOpts: GetStagesRequest = {
      restApiId,
    }
    try {
      apiGw.getStages(
        getFunctionConcurrencyOpts,
        (err: AWSError, data: Stages) => {
          const { item = [] } = data || {}
          if (err) {
            logger.error(err)
            Sentry.captureException(new Error(err.message))
          }
          resolve(item)
        }
      )
    } catch (error) {
      resolve([])
    }
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
              logger.error(err)
              Sentry.captureException(new Error(err.message))
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

const getTags = async ({ apiGw, arn }): Promise<Tag> =>
  new Promise(resolve => {
    try {
      apiGw.getTags({ resourceArn: arn }, (err: AWSError, data: Tags) => {
        if (err) {
          logger.error(err)
          Sentry.captureException(new Error(err.message))
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
}) =>
  new Promise(async resolve => {
    const apiGatewayData = []
    const regionPromises = []
    const additionalPromises = []
    const tagsPromises = []

    regions.split(',').map(region => {
      const apiGw = new APIGW({ region, credentials })
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
    logger.info(lt.fetchedApiGatewayRestApis(apiGatewayData.length))

    apiGatewayData.map(({ id: restApiId, region }, idx) => {
      const apiGw = new APIGW({ region, credentials })
      const additionalPromise = new Promise<void>(async resolveAdditional => {
        apiGatewayData[idx].stages = await getStages({ apiGw, restApiId })
        apiGatewayData[idx].resources = await getResources({ apiGw, restApiId })
        apiGatewayData[idx].methods = apiGatewayData[idx].resources
          .map(resource =>
            resource.resourceMethods
              ? Object.values(resource.resourceMethods)
              : []
          )
          .flat()
        apiGatewayData[idx].integrations = apiGatewayData[idx].methods
          .map(method => method.methodIntegration || [])
          .flat()

        resolveAdditional()
      })
      additionalPromises.push(additionalPromise)
    })

    await Promise.all(additionalPromises)

    // get all tags for each domain name, rest api, stage
    apiGatewayData.map(({ id, region }, idx) => {
      const apiGw = new APIGW({ region, credentials })
      const tagsPromise = new Promise<void>(async resolveTags => {
        const arn = apiGatewayRestApiArn({
          restApiArn: apiGatewayArn({ region }),
          id,
        })
        await apiGatewayData[idx].stages.map(
          async stage => {
            (stage.tags = await getTags({
              apiGw,
              arn: apiGatewayStageArn({
                restApiArn: arn,
                name: stage.stageName,
              }),
            }))
          }
        )
        apiGatewayData[idx].tags = await getTags({ apiGw, arn })
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    logger.info(lt.gettingApiGatewayTags)
    await Promise.all(tagsPromises)

    resolve(groupBy(apiGatewayData, 'region'))
  })
