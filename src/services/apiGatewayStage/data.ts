import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  RestApis,
  ListOfRestApi,
  GetRestApisRequest,
  Stage,
  Stages,
  ListOfStage,
  GetStagesRequest,
  Tags,
} from 'aws-sdk/clients/apigateway'
import { AWSError } from 'aws-sdk/lib/error'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import {
  apiGatewayArn,
  apiGatewayRestApiArn,
  apiGatewayStageArn,
} from '../../utils/generateArns'
import { Credentials, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const {logger} = CloudGraph
const MAX_REST_API = 500
const serviceName = 'API Gateway Stage'
const endpoint = initTestEndpoint(serviceName)

export interface AwsApiGatewayStage extends Omit<Stage, 'tags'> {
  restApiId: string
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
            generateAwsErrorLog(serviceName, 'apiGw:getStages', err)
          }
          resolve(item)
        }
      )
    } catch (error) {
      resolve([])
    }
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
}): Promise<{ [property: string]: AwsApiGatewayStage[] }> =>
  new Promise(async resolve => {
    const apiGatewayData = []
    const apiGatewayStages = []
    const regionPromises = []
    const additionalPromises = []
    const tagsPromises = []

    regions.split(',').map(region => {
      const apiGw = new APIGW({ region, credentials, endpoint })
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
      const apiGw = new APIGW({ region, credentials, endpoint })
      const additionalPromise = new Promise<void>(async resolveAdditional => {
        const stages = await getStages({ apiGw, restApiId })
        apiGatewayStages.push(...stages.map(stage => ({
          ...stage,
          restApiId,
          region,
        })))

        resolveAdditional()
      })
      additionalPromises.push(additionalPromise)
    })

    await Promise.all(additionalPromises)
    logger.debug(lt.fetchedApiGatewayStages(apiGatewayStages.length))

    // get all tags for each stage
    apiGatewayStages.map(stage => {
      const { stageName, restApiId, region } = stage
      const apiGw = new APIGW({ region, credentials, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        const arn = apiGatewayRestApiArn({
          restApiArn: apiGatewayArn({ region }),
          id: restApiId,
        })
        stage.tags = await getTags({
          apiGw,
          arn: apiGatewayStageArn({
            restApiArn: arn,
            name: stageName,
          }),
        })
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    logger.debug(lt.gettingApiGatewayStageTags)
    await Promise.all(tagsPromises)

    resolve(groupBy(apiGatewayStages, 'region'))
  })
