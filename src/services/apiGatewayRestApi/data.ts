import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  RestApi,
  RestApis,
  ListOfRestApi,
  GetRestApisRequest,
  Tags,
  ListOfAuthorizer,
  Authorizers,
  GetAuthorizersRequest,
  ListOfDocumentationPart,
  GetDocumentationPartsRequest,
  DocumentationParts,
  ListOfGatewayResponse,
  GetGatewayResponsesRequest,
  GatewayResponses,
  GetModelsRequest,
  Models,
  ListOfModel,
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
} from '../apiGateway2DomainName/data'

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
  authorizers: ListOfAuthorizer
  documentationParts: ListOfDocumentationPart
  gatewayResponses: ListOfGatewayResponse
  models: ListOfModel
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

const getAuthorizers = async ({
  apiGw,
  restApiId,
}: {
  apiGw: APIGW
  restApiId: string
}): Promise<ListOfAuthorizer> =>
  new Promise<ListOfAuthorizer>(resolve => {
    const authorizerList: ListOfAuthorizer = []
    const getAuthorizerOpts: GetAuthorizersRequest = { restApiId }
    const listAllAuthorizer = (token?: string): void => {
      if (token) {
        getAuthorizerOpts.position = token
      }
      try {
        apiGw.getAuthorizers(
          getAuthorizerOpts,
          (err: AWSError, data: Authorizers) => {
            const { position, items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw:getAuthorizers',
                err,
              })
            }

            authorizerList.push(...items)

            if (position) {
              listAllAuthorizer(position)
            } else {
              resolve(authorizerList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllAuthorizer()
  })

const getDocumentationParts = async ({
  apiGw,
  restApiId,
}: {
  apiGw: APIGW
  restApiId: string
}): Promise<ListOfDocumentationPart> =>
  new Promise<ListOfDocumentationPart>(resolve => {
    const documentationPartList: ListOfDocumentationPart = []
    const getDocumentationPartOpts: GetDocumentationPartsRequest = { restApiId }
    const listAllDocumentationParts = (token?: string): void => {
      if (token) {
        getDocumentationPartOpts.position = token
      }
      try {
        apiGw.getDocumentationParts(
          getDocumentationPartOpts,
          (err: AWSError, data: DocumentationParts) => {
            const { position, items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw:getDocumentationParts',
                err,
              })
            }

            documentationPartList.push(...items)

            if (position) {
              listAllDocumentationParts(position)
            } else {
              resolve(documentationPartList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllDocumentationParts()
  })

const getGatewayResponses = async ({
  apiGw,
  restApiId,
}: {
  apiGw: APIGW
  restApiId: string
}): Promise<ListOfGatewayResponse> =>
  new Promise<ListOfGatewayResponse>(resolve => {
    const gatewayReponseList: ListOfGatewayResponse = []
    const getGatewayReponseOpts: GetGatewayResponsesRequest = { restApiId }
    const listAllGatewayReponses = (token?: string): void => {
      if (token) {
        getGatewayReponseOpts.position = token
      }
      try {
        apiGw.getGatewayResponses(
          getGatewayReponseOpts,
          (err: AWSError, data: GatewayResponses) => {
            const { position, items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw:getGatewayResponses',
                err,
              })
            }

            gatewayReponseList.push(...items)

            if (position) {
              listAllGatewayReponses(position)
            } else {
              resolve(gatewayReponseList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllGatewayReponses()
  })

const getModels = async ({
  apiGw,
  restApiId,
}: {
  apiGw: APIGW
  restApiId: string
}): Promise<ListOfModel> =>
  new Promise<ListOfModel>(resolve => {
    const modelList: ListOfModel = []
    const getModelOpts: GetModelsRequest = { restApiId }
    const listAllModels = (token?: string): void => {
      if (token) {
        getModelOpts.position = token
      }
      try {
        apiGw.getModels(getModelOpts, (err: AWSError, data: Models) => {
          const { position, items = [] } = data || {}
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'apiGw:getModels',
              err,
            })
          }

          modelList.push(...items)

          if (position) {
            listAllModels(position)
          } else {
            resolve(modelList)
          }
        })
      } catch (err) {
        resolve([])
      }
    }
    listAllModels()
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
    const authorizerPromises = []
    const documentationPartPromises = []
    const gatewayReponsePromises = []
    const modelPromises = []

    const existingData: { [property: string]: RawAwsApiGatewayDomainName[] } =
      rawData.find(({ name }) => name === services.apiGatewayDomainName)
        ?.data || {}

    regions.split(',').forEach(region => {
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
              domainNames:
                domainNamesData?.map(domain => domain.DomainName) || [],
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
    apiGatewayData.forEach(({ id, region }, idx) => {
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

    // get all authorizers for each rest api
    apiGatewayData.forEach(({ id, region }, idx) => {
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const authorizerPromise = new Promise<void>(async resolveAuthorizer => {
        apiGatewayData[idx].authorizers = await getAuthorizers({
          apiGw,
          restApiId: id,
        })
        resolveAuthorizer()
      })
      authorizerPromises.push(authorizerPromise)
    })

    logger.debug(lt.gettingApiGatewayAuthorizers)
    await Promise.all(authorizerPromises)

    // get all documentation parts for each rest api
    apiGatewayData.forEach(({ id, region }, idx) => {
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const documentationPartPromise = new Promise<void>(
        async resolveDocumentationPart => {
          apiGatewayData[idx].documentationParts = await getDocumentationParts({
            apiGw,
            restApiId: id,
          })
          resolveDocumentationPart()
        }
      )
      documentationPartPromises.push(documentationPartPromise)
    })

    logger.debug(lt.gettingApiGatewayDocumentationParts)
    await Promise.all(documentationPartPromises)

    // get all gateway responses for each rest api
    apiGatewayData.forEach(({ id, region }, idx) => {
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const gatewayResponsePromise = new Promise<void>(
        async resolveGatewayResponse => {
          apiGatewayData[idx].gatewayResponses = await getGatewayResponses({
            apiGw,
            restApiId: id,
          })
          resolveGatewayResponse()
        }
      )
      gatewayReponsePromises.push(gatewayResponsePromise)
    })

    logger.debug(lt.gettingApiGatewayGatewayResponses)
    await Promise.all(gatewayReponsePromises)

    // get all models for each rest api
    apiGatewayData.forEach(({ id, region }, idx) => {
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const modelPromise = new Promise<void>(async resolveModel => {
        apiGatewayData[idx].models = await getModels({
          apiGw,
          restApiId: id,
        })
        resolveModel()
      })
      modelPromises.push(modelPromise)
    })

    logger.debug(lt.gettingApiGatewayModels)
    await Promise.all(modelPromises)

    errorLog.reset()

    resolve(groupBy(apiGatewayData, 'region'))
  })
