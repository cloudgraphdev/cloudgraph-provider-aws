import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  Stage,
  Stages,
  ListOfStage,
  GetStagesRequest,
} from 'aws-sdk/clients/apigateway'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import {
  apiGatewayArn,
  apiGatewayRestApiArn,
  apiGatewayStageArn,
} from '../../utils/generateArns'
import { TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'
import {
  getRestApisForRegion,
  getTags,
  RawAwsApiGatewayRestApi,
} from '../apiGatewayRestApi/data'
import services from '../../enums/services'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'API Gateway Stage'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export interface RawAwsApiGatewayStage extends Omit<Stage, 'Tags'> {
  restApiId: string
  Tags?: TagMap
  region: string
  arn: string
}

const getStages = async ({ apiGw, restApiId }): Promise<ListOfStage> =>
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
            errorLog.generateAwsErrorLog({
              functionName: 'apiGw:getStages',
              err,
            })
          }
          resolve(item)
        }
      )
    } catch (error) {
      resolve([])
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
}): Promise<{ [property: string]: RawAwsApiGatewayStage[] }> =>
  new Promise(async resolve => {
    const apiGatewayData = []
    const apiGatewayStages: RawAwsApiGatewayStage[] = []
    const regionPromises: Array<Promise<void>> = []
    const additionalPromises: Array<Promise<void>> = []
    const tagsPromises: Array<Promise<void>> = []

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
        const stages = await getStages({ apiGw, restApiId })
        const arn = apiGatewayRestApiArn({
          restApiArn: apiGatewayArn({ region }),
          id: restApiId,
        })
        apiGatewayStages.push(
          ...stages.map(stage => ({
            ...stage,
            restApiId,
            region,
            arn: apiGatewayStageArn({
              restApiArn: arn,
              name: stage.stageName,
            }),
          }))
        )

        resolveAdditional()
      })
      additionalPromises.push(additionalPromise)
      return null
    })

    await Promise.all(additionalPromises)
    logger.debug(lt.fetchedApiGatewayStages(apiGatewayStages.length))

    // get all tags for each stage
    apiGatewayStages.map(stage => {
      const { arn, region } = stage
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const tagsPromise = new Promise<void>(async resolveTags => {
        stage.Tags = await getTags({
          apiGw,
          arn,
        })
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
      return null
    })

    logger.debug(lt.gettingApiGatewayStageTags)
    await Promise.all(tagsPromises)
    errorLog.reset()

    resolve(groupBy(apiGatewayStages, 'region'))
  })
