import CloudGraph from '@cloudgraph/sdk'
import APIGW2, {
  Api,
  Authorizer,
  Deployment,
  Integration,
  IntegrationResponse,
  Model,
  Route,
  RouteResponse,
  Stage,
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

type RawAwsApiGatewayV2HttpApiIntegration = Integration & {
  integrationResponses: IntegrationResponse[]
}

type RawAwsApiGatewayV2HttpApiRoute = Route & {
  routeResponses: RouteResponse[]
}

export interface RawAwsApiGatewayV2HttpApi extends Omit<Api, 'Tags'> {
  Tags: TagMap
  region: string
  authorizers: Authorizer[]
  deployments: Deployment[]
  models: Model[]
  stages: Stage[]
  integrations: RawAwsApiGatewayV2HttpApiIntegration[]
  routes: RawAwsApiGatewayV2HttpApiRoute[]
}

export const getHttpApisForRegion = async (apiGw2: APIGW2): Promise<Api[]> =>
  new Promise<Api[]>(resolve => {
    const httpApiList: Api[] = []
    const getApisOpts: APIGW2.GetApisRequest = {}
    const listAllHttpApis = (token?: string): void => {
      getApisOpts.MaxResults = MAX_HTTP_API
      if (token) {
        getApisOpts.NextToken = token
      }
      try {
        apiGw2.getApis(
          getApisOpts,
          (err: AWSError, data: APIGW2.GetApisResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw2:getApis',
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
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllHttpApis()
  })

const getAuthorizers = async ({
  apiGw2,
  apiId,
}: {
  apiGw2: APIGW2
  apiId: string
}): Promise<Authorizer[]> =>
  new Promise<Authorizer[]>(resolve => {
    const authorizerList: Authorizer[] = []
    const getAuthorizerOpts: APIGW2.GetAuthorizersRequest = { ApiId: apiId }
    const listAllAuthorizer = (token?: string): void => {
      if (token) {
        getAuthorizerOpts.NextToken = token
      }
      try {
        apiGw2.getAuthorizers(
          getAuthorizerOpts,
          (err: AWSError, data: APIGW2.GetAuthorizersResponse) => {
            const { NextToken, Items: items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw2:getAuthorizers',
                err,
              })
            }

            authorizerList.push(...items)

            if (NextToken) {
              listAllAuthorizer(NextToken)
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

const getDeployments = async ({
  apiGw2,
  apiId,
}: {
  apiGw2: APIGW2
  apiId: string
}): Promise<Deployment[]> =>
  new Promise<Deployment[]>(resolve => {
    const deploymentList: Deployment[] = []
    const getDeploymentReponseOpts: APIGW2.GetDeploymentsRequest = {
      ApiId: apiId,
    }
    const listAllDeployments = (token?: string): void => {
      if (token) {
        getDeploymentReponseOpts.NextToken = token
      }
      try {
        apiGw2.getDeployments(
          getDeploymentReponseOpts,
          (err: AWSError, data: APIGW2.GetDeploymentsResponse) => {
            const { NextToken, Items: items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw2:getDeployments',
                err,
              })
            }

            deploymentList.push(...items)

            if (NextToken) {
              listAllDeployments(NextToken)
            } else {
              resolve(deploymentList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllDeployments()
  })

const getModels = async ({
  apiGw2,
  apiId,
}: {
  apiGw2: APIGW2
  apiId: string
}): Promise<Model[]> =>
  new Promise<Model[]>(resolve => {
    const modelList: Model[] = []
    const getModelOpts: APIGW2.GetModelsRequest = { ApiId: apiId }
    const listAllModels = (token?: string): void => {
      if (token) {
        getModelOpts.NextToken = token
      }
      try {
        apiGw2.getModels(
          getModelOpts,
          (err: AWSError, data: APIGW2.GetModelsResponse) => {
            const { NextToken, Items: items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw2:getModels',
                err,
              })
            }

            modelList.push(...items)

            if (NextToken) {
              listAllModels(NextToken)
            } else {
              resolve(modelList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllModels()
  })

const getStages = async ({
  apiGw2,
  apiId,
}: {
  apiGw2: APIGW2
  apiId: string
}): Promise<Stage[]> =>
  new Promise<Stage[]>(resolve => {
    const stageList: Stage[] = []
    const getStagesReponseOpts: APIGW2.GetStagesRequest = {
      ApiId: apiId,
    }
    const listAllStages = (token?: string): void => {
      if (token) {
        getStagesReponseOpts.NextToken = token
      }
      try {
        apiGw2.getStages(
          getStagesReponseOpts,
          (err: AWSError, data: APIGW2.GetStagesResponse) => {
            const { NextToken, Items: items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw2:getStages',
                err,
              })
            }

            stageList.push(...items)

            if (NextToken) {
              listAllStages(NextToken)
            } else {
              resolve(stageList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllStages()
  })

const getIntegrations = async ({
  apiGw2,
  apiId,
}: {
  apiGw2: APIGW2
  apiId: string
}): Promise<RawAwsApiGatewayV2HttpApiIntegration[]> =>
  new Promise<RawAwsApiGatewayV2HttpApiIntegration[]>(resolve => {
    const integrationsList: RawAwsApiGatewayV2HttpApiIntegration[] = []
    const getIntegrationsOpts: APIGW2.GetIntegrationsRequest = {
      ApiId: apiId,
    }
    const listAllIntegrations = (token?: string): void => {
      if (token) {
        getIntegrationsOpts.NextToken = token
      }
      try {
        apiGw2.getIntegrations(
          getIntegrationsOpts,
          (err: AWSError, data: APIGW2.GetIntegrationsResponse) => {
            const { NextToken, Items: items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw2:GetIntegrations',
                err,
              })
            }

            integrationsList.push(
              ...items.map(i => ({ ...i, integrationResponses: [] }))
            )

            if (NextToken) {
              listAllIntegrations(NextToken)
            } else {
              resolve(integrationsList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllIntegrations()
  })

const getIntegrationResponses = async ({
  apiGw2,
  apiId,
  integrationId,
}: {
  apiGw2: APIGW2
  apiId: string
  integrationId: string
}): Promise<IntegrationResponse[]> =>
  new Promise<IntegrationResponse[]>(resolve => {
    const integrationResponsesList: IntegrationResponse[] = []
    const getIntegrationsOpts: APIGW2.GetIntegrationResponsesRequest = {
      ApiId: apiId,
      IntegrationId: integrationId,
    }
    const listAllIntegrationsResponses = (token?: string): void => {
      if (token) {
        getIntegrationsOpts.NextToken = token
      }
      try {
        apiGw2.getIntegrationResponses(
          getIntegrationsOpts,
          (err: AWSError, data: APIGW2.GetIntegrationResponsesResponse) => {
            const { NextToken, Items: items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw2:GetIntegrationResponses',
                err,
              })
            }

            integrationResponsesList.push(...items)

            if (NextToken) {
              listAllIntegrationsResponses(NextToken)
            } else {
              resolve(integrationResponsesList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllIntegrationsResponses()
  })

const getRoutes = async ({
  apiGw2,
  apiId,
}: {
  apiGw2: APIGW2
  apiId: string
}): Promise<RawAwsApiGatewayV2HttpApiRoute[]> =>
  new Promise<RawAwsApiGatewayV2HttpApiRoute[]>(resolve => {
    const routesList: RawAwsApiGatewayV2HttpApiRoute[] = []
    const getRoutesOpts: APIGW2.GetRoutesRequest = {
      ApiId: apiId,
    }
    const listAllRoutes = (token?: string): void => {
      if (token) {
        getRoutesOpts.NextToken = token
      }
      try {
        apiGw2.getRoutes(
          getRoutesOpts,
          (err: AWSError, data: APIGW2.GetRoutesResponse) => {
            const { NextToken, Items: items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw2:GetRoutes',
                err,
              })
            }

            routesList.push(...items.map(r => ({ ...r, routeResponses: [] })))

            if (NextToken) {
              listAllRoutes(NextToken)
            } else {
              resolve(routesList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllRoutes()
  })

const getRouteResponses = async ({
  apiGw2,
  apiId,
  routeId,
}: {
  apiGw2: APIGW2
  apiId: string
  routeId: string
}): Promise<RouteResponse[]> =>
  new Promise<RouteResponse[]>(resolve => {
    const routeResponsesList: RouteResponse[] = []
    const getRoutesOpts: APIGW2.GetRouteResponsesRequest = {
      ApiId: apiId,
      RouteId: routeId,
    }
    const listAllRoutesResponses = (token?: string): void => {
      if (token) {
        getRoutesOpts.NextToken = token
      }
      try {
        apiGw2.getRouteResponses(
          getRoutesOpts,
          (err: AWSError, data: APIGW2.GetRouteResponsesResponse) => {
            const { NextToken, Items: items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw2:GetRouteResponses',
                err,
              })
            }

            routeResponsesList.push(...items)

            if (NextToken) {
              listAllRoutesResponses(NextToken)
            } else {
              resolve(routeResponsesList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllRoutesResponses()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsApiGatewayV2HttpApi[] }> =>
  new Promise(async resolve => {
    const apiGatewayData: RawAwsApiGatewayV2HttpApi[] = []
    const regionPromises = []
    const authorizerPromises = []
    const modelPromises = []
    const deploymentPromises = []
    const stagePromises = []
    const routePromises = []
    const routeResponsesPromises = []
    const integrationPromises = []
    const integrationResponsesPromises = []

    regions.split(',').forEach(region => {
      const apiGw2 = new APIGW2({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const httpApiList = await getHttpApisForRegion(apiGw2)
        if (!isEmpty(httpApiList)) {
          apiGatewayData.push(
            ...httpApiList.map(httpApi => ({
              ...httpApi,
              region,
              apiMappings: [],
              authorizers: [],
              deployments: [],
              domainNames: [],
              integrations: [],
              integrationResponses: [],
              models: [],
              routes: [],
              routeResponses: [],
              stages: [],
              Tags: {},
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedApiGatewayV2HttpApis(apiGatewayData.length))

    if (apiGatewayData.length) {
      // get all authorizers for each http api
      apiGatewayData.forEach(({ ApiId: id, region }, idx) => {
        const apiGw2 = new APIGW2({
          ...config,
          region,
          endpoint,
          ...customRetrySettings,
        })
        const authorizerPromise = new Promise<void>(async resolveAuthorizer => {
          apiGatewayData[idx].authorizers = await getAuthorizers({
            apiGw2,
            apiId: id,
          })
          resolveAuthorizer()
        })
        authorizerPromises.push(authorizerPromise)
      })

      logger.debug(lt.gettingApiGatewayV2Authorizers)
      await Promise.all(authorizerPromises)

      // get all deployments for each http api
      apiGatewayData.forEach(({ ApiId: id, region }, idx) => {
        const apiGw2 = new APIGW2({
          ...config,
          region,
          endpoint,
          ...customRetrySettings,
        })
        const deploymentPromise = new Promise<void>(async resolveDeployment => {
          apiGatewayData[idx].deployments = await getDeployments({
            apiGw2,
            apiId: id,
          })
          resolveDeployment()
        })
        deploymentPromises.push(deploymentPromise)
      })

      logger.debug(lt.gettingApiGatewayV2Deployments)
      await Promise.all(deploymentPromises)

      // get all models for each http api
      apiGatewayData.forEach(({ ApiId: id, region }, idx) => {
        const apiGw2 = new APIGW2({
          ...config,
          region,
          endpoint,
          ...customRetrySettings,
        })
        const modelPromise = new Promise<void>(async resolveModel => {
          apiGatewayData[idx].models = await getModels({
            apiGw2,
            apiId: id,
          })
          resolveModel()
        })
        modelPromises.push(modelPromise)
      })

      logger.debug(lt.gettingApiGatewayV2Models)
      await Promise.all(modelPromises)

      // get all stages for each http api
      apiGatewayData.forEach(({ ApiId: id, region }, idx) => {
        const apiGw2 = new APIGW2({
          ...config,
          region,
          endpoint,
          ...customRetrySettings,
        })
        const stagePromise = new Promise<void>(async resolveStage => {
          apiGatewayData[idx].stages = await getStages({
            apiGw2,
            apiId: id,
          })
          resolveStage()
        })
        stagePromises.push(stagePromise)
      })

      logger.debug(lt.gettingApiGatewayV2Stages)
      await Promise.all(stagePromises)

      // get all integrations for each http api
      apiGatewayData.forEach(({ ApiId: id, region }, idx) => {
        const apiGw2 = new APIGW2({
          ...config,
          region,
          endpoint,
          ...customRetrySettings,
        })
        const integrationPromise = new Promise<void>(
          async resolveIntegration => {
            apiGatewayData[idx].integrations = await getIntegrations({
              apiGw2,
              apiId: id,
            })
            resolveIntegration()
          }
        )
        integrationPromises.push(integrationPromise)
      })

      logger.debug(lt.gettingApiGatewayV2Integrations)
      await Promise.all(integrationPromises)

      // get all integrations responses for each http api
      apiGatewayData.forEach(({ ApiId: id, region, integrations }, idx) => {
        const apiGw2 = new APIGW2({
          ...config,
          region,
          endpoint,
          ...customRetrySettings,
        })

        integrations.forEach(({ IntegrationId }, idInt) => {
          const integrationPromise = new Promise<void>(
            async resolveIntegrationResponses => {
              apiGatewayData[idx].integrations[idInt].integrationResponses =
                await getIntegrationResponses({
                  apiGw2,
                  apiId: id,
                  integrationId: IntegrationId,
                })
              resolveIntegrationResponses()
            }
          )
          integrationResponsesPromises.push(integrationPromise)
        })
      })

      logger.debug(lt.gettingApiGatewayV2IntegrationsResponses)
      await Promise.all(integrationResponsesPromises)

      // get all routes for each http api
      apiGatewayData.forEach(({ ApiId: id, region }, idx) => {
        const apiGw2 = new APIGW2({
          ...config,
          region,
          endpoint,
          ...customRetrySettings,
        })
        const routePromise = new Promise<void>(async resolveRoutes => {
          apiGatewayData[idx].routes = await getRoutes({
            apiGw2,
            apiId: id,
          })
          resolveRoutes()
        })
        routePromises.push(routePromise)
      })

      logger.debug(lt.gettingApiGatewayV2Routes)
      await Promise.all(routePromises)

      // get all routes responses for each http api
      apiGatewayData.forEach(({ ApiId: id, region, routes }, idx) => {
        const apiGw2 = new APIGW2({
          ...config,
          region,
          endpoint,
          ...customRetrySettings,
        })

        routes.forEach(({ RouteId }, idRoute) => {
          const routeResponsesPromise = new Promise<void>(
            async resolveRouteResponses => {
              apiGatewayData[idx].routes[idRoute].routeResponses =
                await getRouteResponses({
                  apiGw2,
                  apiId: id,
                  routeId: RouteId,
                })
              resolveRouteResponses()
            }
          )
          routeResponsesPromises.push(routeResponsesPromise)
        })
      })

      logger.debug(lt.gettingApiGatewayV2RoutesResponses)
      await Promise.all(routeResponsesPromises)
    }

    errorLog.reset()

    resolve(groupBy(apiGatewayData, 'region'))
  })
