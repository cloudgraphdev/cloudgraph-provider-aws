import CloudGraph from '@cloudgraph/sdk'
import { AppSync } from 'aws-sdk'

import { groupBy } from 'lodash'
import { Credentials, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'AppSync'
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsFunction extends AppSync.FunctionConfiguration {
  resolvers: AppSync.Resolver[]
}

export interface RawAwsType extends AppSync.Type {
  resolvers: AppSync.Resolver[]
}

export interface RawAwsAppSync extends Omit<AppSync.GraphqlApi, 'tags'> {
  awsApiKeys: AppSync.ApiKeys
  awsDataSources: AppSync.DataSources
  awsFunctions: RawAwsFunction[]
  awsTypes: RawAwsType[]
  region: string
  Tags?: TagMap
}

const listGraphqlApiData = async (
  appSync: AppSync
): Promise<AppSync.GraphqlApis> => {
  try {
    const fullResources: AppSync.GraphqlApis = []

    let graphqlApis = await appSync.listGraphqlApis().promise()
    fullResources.push(...graphqlApis.graphqlApis)
    let { nextToken } = graphqlApis

    while (nextToken) {
      graphqlApis = await appSync.listGraphqlApis({ nextToken }).promise()
      fullResources.push(...graphqlApis.graphqlApis)
      nextToken = graphqlApis.nextToken
    }

    logger.debug(lt.fetchedAppSync(fullResources.length))

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listGraphqlApiData', err)
  }
  return null
}

const listApiKeysData = async (
  appSync: AppSync,
  apiId: string
): Promise<AppSync.ApiKeys> => {
  try {
    const fullResources: AppSync.ApiKeys = []

    let apiKeys = await appSync.listApiKeys({ apiId }).promise()
    fullResources.push(...apiKeys.apiKeys)
    let { nextToken } = apiKeys

    while (nextToken) {
      apiKeys = await appSync.listApiKeys({ apiId, nextToken }).promise()
      fullResources.push(...apiKeys.apiKeys)
      nextToken = apiKeys.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listApiKeysData', err)
  }
  return null
}

const listDataSourcesData = async (
  appSync: AppSync,
  apiId: string
): Promise<AppSync.DataSources> => {
  try {
    const fullResources: AppSync.DataSources = []

    let dataSources = await appSync.listDataSources({ apiId }).promise()
    fullResources.push(...dataSources.dataSources)
    let { nextToken } = dataSources

    while (nextToken) {
      dataSources = await appSync
        .listDataSources({ apiId, nextToken })
        .promise()
      fullResources.push(...dataSources.dataSources)
      nextToken = dataSources.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listDataSourcesData', err)
  }
  return null
}

const listFunctionsData = async (
  appSync: AppSync,
  apiId: string
): Promise<AppSync.Functions> => {
  try {
    const fullResources: AppSync.Functions = []

    let functions = await appSync.listFunctions({ apiId }).promise()
    fullResources.push(...functions.functions)
    let { nextToken } = functions

    while (nextToken) {
      functions = await appSync.listFunctions({ apiId, nextToken }).promise()
      fullResources.push(...functions.functions)
      nextToken = functions.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listFunctionsData', err)
  }
  return null
}

const listResolversByFunction = async (
  appSync: AppSync,
  apiId: string,
  functionId: string
): Promise<AppSync.Resolvers> => {
  try {
    const fullResources: AppSync.Resolvers = []

    let resolvers = await appSync
      .listResolversByFunction({ apiId, functionId })
      .promise()
    fullResources.push(...resolvers.resolvers)
    let { nextToken } = resolvers

    while (nextToken) {
      resolvers = await appSync
        .listResolversByFunction({ apiId, functionId })
        .promise()
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
): Promise<AppSync.TypeList> => {
  try {
    const fullResources: AppSync.TypeList = []

    let types = await appSync.listTypes({ apiId, format: 'JSON' }).promise()
    fullResources.push(...types.types)
    let { nextToken } = types

    while (nextToken) {
      types = await appSync.listApiKeys({ apiId, nextToken }).promise()
      fullResources.push(...types.types)
      nextToken = types.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listTypesData', err)
  }
  return null
}

const listTypesResolverData = async (
  appSync: AppSync,
  apiId: string,
  typeName: string
): Promise<AppSync.Resolvers> => {
  try {
    const fullResources: AppSync.Resolvers = []

    let resolvers = await appSync.listResolvers({ apiId, typeName }).promise()
    fullResources.push(...resolvers.resolvers)
    let { nextToken } = resolvers

    while (nextToken) {
      resolvers = await appSync.listResolvers({ apiId, typeName }).promise()
      fullResources.push(...resolvers.resolvers)
      nextToken = resolvers.nextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'AppSync:listTypesData', err)
  }
  return null
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: RawAwsAppSync[]
}> => {
  const graphqlApiData: RawAwsAppSync[] = []

  for (const region of regions.split(',')) {
    const appSync = new AppSync({ region, credentials, endpoint })
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
