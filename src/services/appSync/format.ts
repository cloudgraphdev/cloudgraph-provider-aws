import { generateUniqueId } from '@cloudgraph/sdk'
import { ApiKey, DataSource, Resolver } from 'aws-sdk/clients/appsync'

import t from '../../properties/translations'
import {
  AwsAppSyncApiKey,
  AwsAppSyncDataSource,
  AwsAppSyncFunction,
  AwsAppSync,
  AwsAppSyncGraphqlApiUris,
  AwsAppSyncResolver,
  AwsAppSyncType,
} from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsAppSync, RawAwsFunction, RawAwsType } from './data'

/**
 * AppSync
 */

const formatApiKey = ({
  id,
  description,
  expires,
}: ApiKey): AwsAppSyncApiKey => {
  return {
    id,
    description,
    expires,
  }
}

const formatDataSource = ({
  dataSourceArn: id,
  name,
  description,
  type,
  serviceRoleArn,
  dynamodbConfig,
  lambdaConfig,
  elasticsearchConfig,
  httpConfig,
  relationalDatabaseConfig,
}: DataSource): AwsAppSyncDataSource => {
  return {
    id,
    arn: id,
    name,
    description,
    type,
    serviceRoleArn,
    dynamodbTableName: dynamodbConfig?.tableName || '',
    dynamodbAwsRegion: dynamodbConfig?.awsRegion || '',
    dynamodbUseCallerCredentials: dynamodbConfig?.useCallerCredentials
      ? t.yes
      : t.no,
    dynamodbDeltaSyncBaseTableTTL:
      dynamodbConfig?.deltaSyncConfig?.baseTableTTL || 0,
    dynamodbDeltaSyncTableName:
      dynamodbConfig?.deltaSyncConfig?.deltaSyncTableName || '',
    dynamodbDeltaSyncTableTTL:
      dynamodbConfig?.deltaSyncConfig?.deltaSyncTableTTL || 0,
    dynamodbVersioned: dynamodbConfig?.versioned ? t.yes : t.no,
    lambdaFunctionArn: lambdaConfig?.lambdaFunctionArn || '',
    elasticsearchEndpoint: elasticsearchConfig?.endpoint || '',
    elasticsearchAwsRegion: elasticsearchConfig?.awsRegion || '',
    httpEndpoint: httpConfig?.endpoint || '',
    httpAuthorizationType:
      httpConfig?.authorizationConfig?.authorizationType || '',
    httpAuthorizationIamSigningRegion:
      httpConfig?.authorizationConfig?.awsIamConfig?.signingRegion || '',
    httpAuthorizationIamSigningServiceName:
      httpConfig?.authorizationConfig?.awsIamConfig?.signingServiceName || '',
    relationalDatabaseSourceType:
      relationalDatabaseConfig?.relationalDatabaseSourceType || '',
    relationalDatabaseAwsRegion:
      relationalDatabaseConfig?.rdsHttpEndpointConfig?.awsRegion || '',
    relationalDatabaseClusterIdentifier:
      relationalDatabaseConfig?.rdsHttpEndpointConfig?.dbClusterIdentifier ||
      '',
    relationalDatabaseName:
      relationalDatabaseConfig?.rdsHttpEndpointConfig?.databaseName || '',
    relationalDatabaseSchema:
      relationalDatabaseConfig?.rdsHttpEndpointConfig?.schema || '',
    relationalDatabaseAwsSecretStoreArn:
      relationalDatabaseConfig?.rdsHttpEndpointConfig?.awsSecretStoreArn || '',
  }
}

const formatResolver = ({
  resolverArn,
  typeName,
  fieldName,
  dataSourceName,
  requestMappingTemplate,
  responseMappingTemplate,
  kind,
  pipelineConfig,
  syncConfig,
  cachingConfig,
}: Resolver): AwsAppSyncResolver => {
  return {
    id: resolverArn,
    arn: resolverArn,
    typeName,
    fieldName,
    dataSourceName,
    requestMappingTemplate,
    responseMappingTemplate,
    kind,
    pipelineFunctionIds: pipelineConfig?.functions || [],
    syncConflictHandler: syncConfig?.conflictHandler || '',
    syncConflictDetection: syncConfig?.conflictDetection || '',
    syncLambdaConflictHandlerArn:
      syncConfig?.lambdaConflictHandlerConfig?.lambdaConflictHandlerArn || '',
    cachingTTL: cachingConfig?.ttl || 0,
    cachingKeys: cachingConfig?.cachingKeys || [],
  }
}

const formatFunction = ({
  functionId: id,
  functionArn: arn,
  name,
  description,
  dataSourceName,
  requestMappingTemplate,
  responseMappingTemplate,
  functionVersion,
  resolvers,
}: RawAwsFunction): AwsAppSyncFunction => {
  return {
    id,
    arn,
    name,
    description,
    dataSourceName,
    requestMappingTemplate,
    responseMappingTemplate,
    functionVersion,
    resolvers: resolvers?.map(resolver => formatResolver(resolver)) || [],
  }
}

const formatType = ({
  arn,
  name,
  description,
  definition,
  format,
  resolvers,
}: RawAwsType): AwsAppSyncType => {
  return {
    id: arn,
    arn,
    name,
    description,
    definition,
    format,
    resolvers: resolvers?.map(resolver => formatResolver(resolver)) || [],
  }
}

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsAppSync
  account: string
  region: string
}): AwsAppSync => {
  const {
    name,
    apiId: id,
    authenticationType,
    logConfig,
    userPoolConfig,
    openIDConnectConfig,
    arn,
    uris,
    Tags = {},
    additionalAuthenticationProviders,
    xrayEnabled,
    wafWebAclArn,
    lambdaAuthorizerConfig,
    awsApiKeys,
    awsDataSources,
    awsFunctions,
    awsTypes,
  } = rawData

  const additionalAuthenticationProviderList =
    additionalAuthenticationProviders?.map(
      ({
        authenticationType: additionalAuthenticationType,
        openIDConnectConfig: additionalOpenIDConnectConfig,
        userPoolConfig: additionalUserPoolConfig,
      }) => {
        return {
          id: generateUniqueId({
            arn,
            additionalAuthenticationType,
            additionalOpenIDConnectConfig,
            additionalUserPoolConfig,
          }),
          authenticationType: additionalAuthenticationType || '',
          openIDConnectIssuer: additionalOpenIDConnectConfig?.issuer || '',
          openIDConnectClientId: additionalOpenIDConnectConfig?.clientId || '',
          openIDConnectIatTTL: additionalOpenIDConnectConfig?.iatTTL || 0,
          openIDConnectAuthTTL: additionalOpenIDConnectConfig?.authTTL || 0,
          userPoolId: additionalUserPoolConfig?.userPoolId || '',
          userPoolAwsRegion: additionalUserPoolConfig?.awsRegion || '',
          userPoolAppIdClientRegex:
            additionalUserPoolConfig?.appIdClientRegex || '',
        }
      }
    ) || []

  const formatUrisData = (): AwsAppSyncGraphqlApiUris[] => {
    const result: AwsAppSyncGraphqlApiUris[] = []
    for (const [key, value] of Object.entries(uris)) {
      result.push({ id: `${key}:${value}`, key, value })
    }
    return result
  }

  const appSync = {
    id,
    accountId: account,
    arn,
    name,
    authenticationType,
    logFieldLogLevel: logConfig?.fieldLogLevel || '',
    logCloudWatchLogsRoleArn: logConfig?.cloudWatchLogsRoleArn || '',
    logExcludeVerboseContent: logConfig?.excludeVerboseContent ? t.yes : t.no,
    userPoolId: userPoolConfig?.userPoolId || '',
    userPoolAwsRegion: userPoolConfig?.awsRegion || '',
    userPoolDefaultAction: userPoolConfig?.defaultAction || '',
    userPoolAppIdClientRegex: userPoolConfig?.appIdClientRegex || '',
    openIDConnectIssuer: openIDConnectConfig?.issuer || '',
    openIDConnectClientId: openIDConnectConfig?.clientId || '',
    openIDConnectIatTTL: openIDConnectConfig?.iatTTL || 0,
    openIDConnectAuthTTL: openIDConnectConfig?.authTTL || 0,
    uris: formatUrisData(),
    tags: formatTagsFromMap(Tags),
    additionalAuthenticationProviders: additionalAuthenticationProviderList,
    xrayEnabled: xrayEnabled ? t.yes : t.no,
    wafWebAclArn,
    lambdaAuthorizerResultTtlInSeconds:
      lambdaAuthorizerConfig?.authorizerResultTtlInSeconds || 0,
    lambdaAuthorizerUri: lambdaAuthorizerConfig?.authorizerUri || '',
    lambdaAuthorizerIdentityValidationExpression:
      lambdaAuthorizerConfig?.identityValidationExpression || '',
    region,
    apiKeys: awsApiKeys?.map(apiKey => formatApiKey(apiKey)) || [],
    dataSources:
      awsDataSources?.map(dataSource => formatDataSource(dataSource)) || [],
    functions:
      awsFunctions?.map(functionData => formatFunction(functionData)) || [],
    types: awsTypes?.map(typeData => formatType(typeData)) || [],
  }

  return appSync
}
