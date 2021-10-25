import CloudGraph from '@cloudgraph/sdk'
import { AppSync, Type, Resolver, GraphqlApi, ApiKey, DataSource, FunctionConfiguration } from '@aws-sdk/client-appsync'

import { groupBy } from 'lodash'
import { TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'AppSync'
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsFunction extends FunctionConfiguration {
  resolvers: Resolver[]
}

export interface RawAwsType extends Type {
  resolvers: Resolver[]
}

export interface RawAwsAppSync extends Omit<GraphqlApi, 'tags'> {
  awsApiKeys: ApiKey[]
  awsDataSources: DataSource[]
  awsFunctions: RawAwsFunction[]
  awsTypes: RawAwsType[]
  region: string
  Tags?: TagMap
}

const listGraphqlApiData = async (
  appSync: AppSync
): Promise<GraphqlApi[]> => {
  try {
    const fullResources: GraphqlApi[] = []

    let graphqlApis = await appSync.listGraphqlApis({})
    fullResources.push(...graphqlApis.graphqlApis)
    let { nextToken } = graphqlApis

    while (nextToken) {
      graphqlApis = await appSync.listGraphqlApis({ nextToken })
      fullResources.push(...graphqlApis.graphqlApis)
      nextToken = graphqlApis.nextToken
    }

    logger.debug(lt.fetchedAppSync(fullResources.length))

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listGraphqlApiData', err)
  }
  return []
}

const listApiKeysData = async (
  appSync: AppSync,
  apiId: string
): Promise<ApiKey[]> => {
  try {
    const fullResources: ApiKey[] = []

    let apiKeys = await appSync.listApiKeys({ apiId })
    fullResources.push(...apiKeys.apiKeys)
    let { nextToken } = apiKeys

    while (nextToken) {
      apiKeys = await appSync.listApiKeys({ apiId, nextToken })
      fullResources.push(...apiKeys.apiKeys)
      nextToken = apiKeys.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listApiKeysData', err)
  }
  return []
}

const listDataSourcesData = async (
  appSync: AppSync,
  apiId: string
): Promise<DataSource[]> => {
  try {
    const fullResources: DataSource[] = []

    let dataSources = await appSync.listDataSources({ apiId })
    fullResources.push(...dataSources.dataSources)
    let { nextToken } = dataSources

    while (nextToken) {
      dataSources = await appSync
        .listDataSources({ apiId, nextToken })
      fullResources.push(...dataSources.dataSources)
      nextToken = dataSources.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listDataSourcesData', err)
  }
  return []
}

const listFunctionsData = async (
  appSync: AppSync,
  apiId: string
): Promise<FunctionConfiguration[]> => {
  try {
    const fullResources: FunctionConfiguration[] = []

    let functions = await appSync.listFunctions({ apiId })
    fullResources.push(...functions.functions)
    let { nextToken } = functions

    while (nextToken) {
      functions = await appSync.listFunctions({ apiId, nextToken })
      fullResources.push(...functions.functions)
      nextToken = functions.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listFunctionsData', err)
  }
  return []
}

const listResolversByFunction = async (
  appSync: AppSync,
  apiId: string,
  functionId: string
): Promise<Resolver[]> => {
  try {
    const fullResources: Resolver[] = []

    let resolvers = await appSync
      .listResolversByFunction({ apiId, functionId })
    fullResources.push(...resolvers.resolvers)
    let { nextToken } = resolvers

    while (nextToken) {
      resolvers = await appSync
        .listResolversByFunction({ apiId, functionId })
      fullResources.push(...resolvers.resolvers)
      nextToken = resolvers.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listResolversByFunction', err)
  }
  return null
}

const listTypesData = async (
  appSync: AppSync,
  apiId: string
): Promise<Type[]> => {
  try {
    const fullResources: Type[] = []

    let types = await appSync.listTypes({ apiId, format: 'JSON' })
    fullResources.push(...types.types)
    let { nextToken } = types

    while (nextToken) {
      types = await appSync.listApiKeys({ apiId, nextToken })
      fullResources.push(...types.types)
      nextToken = types.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listTypesData', err)
  }
  return []
}

const listTypesResolverData = async (
  appSync: AppSync,
  apiId: string,
  typeName: string
): Promise<Resolver[]> => {
  try {
    const fullResources: Resolver[] = []

    let resolvers = await appSync.listResolvers({ apiId, typeName })
    fullResources.push(...resolvers.resolvers)
    let { nextToken } = resolvers

    while (nextToken) {
      resolvers = await appSync.listResolvers({ apiId, typeName })
      fullResources.push(...resolvers.resolvers)
      nextToken = resolvers.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listTypesData', err)
  }
  return []
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: any
}): Promise<{
  [region: string]: RawAwsAppSync[]
}> => {
  const graphqlApiData: RawAwsAppSync[] = []

  for (const region of regions.split(',')) {
    const appSync = new AppSync({ ...config, region, endpoint })
    const graphqlApis = await listGraphqlApiData(appSync)

    for (const graphqlApi of graphqlApis) {
      const apiKeyList = await listApiKeysData(appSync, graphqlApi.apiId)
      const dataSourceList = await listDataSourcesData(
        appSync,
        graphqlApi.apiId
      )
      const functionList = await listFunctionsData(appSync, graphqlApi.apiId)
      const functions: RawAwsFunction[] = []
      for (const functionData of functionList) {
        const resolvers = await listResolversByFunction(
          appSync,
          graphqlApi.apiId,
          functionData.functionId
        )
        functions.push({
          ...functionData,
          resolvers,
        })
      }
      const typeList = await listTypesData(appSync, graphqlApi.apiId)
      const types: RawAwsType[] = []
      for (const typeData of typeList) {
        const resolvers = await listTypesResolverData(
          appSync,
          graphqlApi.apiId,
          typeData.name
        )
        types.push({
          ...typeData,
          resolvers,
        })
      }

      const { tags: Tags, ...appSyncApi } = graphqlApi
      graphqlApiData.push({
        ...appSyncApi,
        awsApiKeys: apiKeyList,
        awsDataSources: dataSourceList,
        awsFunctions: functions,
        awsTypes: types,
        Tags,
        region,
      })
    }
  }

  logger.debug(lt.doneFetchedAppSync)

  return groupBy(graphqlApiData, 'region')
}
