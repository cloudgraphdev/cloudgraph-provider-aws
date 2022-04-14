import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import { TagList } from 'aws-sdk/clients/ec2'
import { RawAwsAppSync } from './data'

import services from '../../enums/services'
import { RawAwsDynamoDbTable } from '../dynamodb/data'
import { RawAwsLambdaFunction } from '../lambda/data'
import { RawAwsCognitoUserPool } from '../cognitoUserPool/data'
import { RawAwsRdsCluster } from '../rdsCluster/data'
import { RawAwsIamRole } from '../iamRole/data'
import { globalRegionName } from '../../enums/regions'

/**
 * AppSync
 */
export default ({
  service: appSync,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsAppSync & {
    Tags?: TagList
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { apiId: id, awsDataSources, userPoolConfig } = appSync

  /**
   * Find cognito user pools
   * related to this App Sync
   */
  const cognitoUserPools: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.cognitoUserPool)

  if (cognitoUserPools?.data?.[region]) {
    const associatedCognitoUserPools: RawAwsCognitoUserPool[] =
      cognitoUserPools.data[region].filter(
        ({ Id }: RawAwsCognitoUserPool) => Id === userPoolConfig?.userPoolId
      )

    if (!isEmpty(associatedCognitoUserPools)) {
      for (const cognitoUserPool of associatedCognitoUserPools) {
        connections.push({
          id: cognitoUserPool.Id,
          resourceType: services.cognitoUserPool,
          relation: 'child',
          field: 'cognitoUserPool',
        })
      }
    }
  }

  /**
   * Find dynamodb tables
   * related to this App Sync
   */
  const dynamoDbTables: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.dynamodb)

  const dynamodbTableNames = awsDataSources
    ?.filter(({ dynamodbConfig }) => !isEmpty(dynamodbConfig?.tableName))
    .map(({ dynamodbConfig }) => dynamodbConfig?.tableName)

  if (dynamoDbTables?.data?.[region]) {
    const associatedDynamoDbTables: RawAwsDynamoDbTable[] = dynamoDbTables.data[
      region
    ].filter(({ TableName }: RawAwsDynamoDbTable) =>
      dynamodbTableNames.includes(TableName)
    )

    if (!isEmpty(associatedDynamoDbTables)) {
      for (const dynamoDbTable of associatedDynamoDbTables) {
        connections.push({
          id: dynamoDbTable.TableId || dynamoDbTable.TableArn,
          resourceType: services.dynamodb,
          relation: 'child',
          field: 'dynamodb',
        })
      }
    }
  }

  /**
   * Find lambda functions
   * related to this App Sync
   */
  const lambdaFunctions: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.lambda)

  const functionArns = awsDataSources?.map(
    ({ lambdaConfig }) => lambdaConfig?.lambdaFunctionArn
  )

  if (lambdaFunctions?.data?.[region]) {
    const associatedLambdaFunctions: RawAwsLambdaFunction[] =
      lambdaFunctions.data[region].filter(
        ({ FunctionArn }: RawAwsLambdaFunction) =>
          functionArns.includes(FunctionArn)
      )

    if (!isEmpty(associatedLambdaFunctions)) {
      for (const lambdaFunction of associatedLambdaFunctions) {
        connections.push({
          id: lambdaFunction.FunctionArn,
          resourceType: services.lambda,
          relation: 'child',
          field: 'lambda',
        })
      }
    }
  }

  /**
   * Find rds clusters
   * related to this App Sync
   */
  const rdsClusters: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.rdsCluster)

  const rdsClusterArns = awsDataSources?.map(
    ({ relationalDatabaseConfig }) =>
      relationalDatabaseConfig?.rdsHttpEndpointConfig?.dbClusterIdentifier
  )

  if (rdsClusters?.data?.[region]) {
    const associatedRdsClusters: RawAwsRdsCluster[] = rdsClusters.data[
      region
    ].filter(({ DBClusterArn }: RawAwsRdsCluster) =>
      rdsClusterArns.includes(DBClusterArn)
    )

    if (!isEmpty(associatedRdsClusters)) {
      for (const rdsCluster of associatedRdsClusters) {
        connections.push({
          id: rdsCluster.DBClusterArn,
          resourceType: services.rdsCluster,
          relation: 'child',
          field: 'rdsCluster',
        })
      }
    }
  }

  /**
   * Find related IAM Roles
   */
  const roles: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.iamRole)

  const roleArns = awsDataSources?.map(({ serviceRoleArn }) => serviceRoleArn)

  if (roles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      role => roleArns.includes(role.Arn)
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { Arn: arn }: RawAwsIamRole = instance

        connections.push({
          id: arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRoles',
        })
      }
    }
  }

  const appSyncResult = {
    [id]: connections,
  }
  return appSyncResult
}
