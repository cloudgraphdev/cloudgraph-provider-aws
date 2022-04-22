import { ServiceConnection } from '@cloudgraph/sdk'

import isEmpty from 'lodash/isEmpty'
import services from '../../enums/services'
import { RawAwsElasticSearchDomain } from './data'
import { AwsSecurityGroup } from '../securityGroup/data'
import { AwsKms } from '../kms/data'
import { RawAwsCognitoIdentityPool } from '../cognitoIdentityPool/data'
import { RawAwsCognitoUserPool } from '../cognitoUserPool/data'
import { RawAwsIamRole } from '../iamRole/data'
import { RawAwsLogGroup } from '../cloudwatchLogs/data'
import { globalRegionName } from '../../enums/regions'

export default ({
  service: domain,
  data,
  region,
}: {
  service: RawAwsElasticSearchDomain
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const {
    DomainId,
    VPCOptions: { SecurityGroupIds = [] } = {},
    EncryptionAtRestOptions: { KmsKeyId } = {},
    CognitoOptions: { IdentityPoolId, UserPoolId, RoleArn } = {},
    LogPublishingOptions = {},
  } = domain
  const connections: ServiceConnection[] = []
  const logGroupsArns: string[] = Object.entries(LogPublishingOptions).map(
    ([, value]) => value.CloudWatchLogsLogGroupArn
  ) || []
  
  /**
   * Find any securityGroup related data
   */
  const sgs = data.find(({ name }) => name === services.sg)
  if (sgs?.data?.[region]) {
    const dataAtRegion: AwsSecurityGroup[] = sgs.data[region].filter(
      ({ GroupId }: AwsSecurityGroup) => SecurityGroupIds.includes(GroupId)
    )
    for (const sg of dataAtRegion) {
      connections.push({
        id: sg.GroupId,
        resourceType: services.sg,
        relation: 'child',
        field: 'securityGroups',
      })
    }
  }

  /**
   * Find any kms related data
   */
  const keys = data.find(({ name }) => name === services.kms)
  if (keys?.data?.[region]) {
    const dataAtRegion: AwsKms[] = keys.data[region].filter(
      ({ Arn }: AwsKms) => Arn === KmsKeyId
    )
    for (const key of dataAtRegion) {
      connections.push({
        id: key.KeyId,
        resourceType: services.kms,
        relation: 'child',
        field: 'kms',
      })
    }
  }

  /**
   * Find any cognito identity pool related data
   */
  const identityPools = data.find(
    ({ name }) => name === services.cognitoIdentityPool
  )
  if (identityPools?.data?.[region]) {
    const dataAtRegion: RawAwsCognitoIdentityPool[] = identityPools.data[
      region
    ].filter(
      ({ IdentityPoolId: poolId }: RawAwsCognitoIdentityPool) =>
        poolId === IdentityPoolId
    )
    for (const identityPool of dataAtRegion) {
      connections.push({
        id: identityPool.IdentityPoolId,
        resourceType: services.cognitoIdentityPool,
        relation: 'child',
        field: 'cognitoIdentityPool',
      })
    }
  }

  /**
   * Find any cognito user pool related data
   */
  const userPools = data.find(({ name }) => name === services.cognitoUserPool)
  if (userPools?.data?.[region]) {
    const dataAtRegion: RawAwsCognitoUserPool[] = userPools.data[region].filter(
      ({ Id }: RawAwsCognitoUserPool) => Id === UserPoolId
    )
    for (const userPool of dataAtRegion) {
      connections.push({
        id: userPool.Id,
        resourceType: services.cognitoUserPool,
        relation: 'child',
        field: 'cognitoUserPool',
      })
    }
  }

  /**
   * Find any IAM role related data
   */
  const roles = data.find(({ name }) => name === services.iamRole)
  if (roles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      ({ Arn }: RawAwsIamRole) => Arn === RoleArn
    )
    for (const role of dataAtRegion) {
      connections.push({
        id: role.Arn,
        resourceType: services.iamRole,
        relation: 'child',
        field: 'iamRole',
      })
    }
  }

  /**
   * Find any cloudwatch log group related data
   */
  const cloudwatchLogGroups = data.find(
    ({ name }) => name === services.cloudwatchLog
  )
  if (cloudwatchLogGroups?.data?.[region]) {
    const dataAtRegion: RawAwsLogGroup[] = cloudwatchLogGroups.data[
      region
    ].filter(
      ({ arn }: RawAwsLogGroup) =>
        !isEmpty(logGroupsArns) &&
        logGroupsArns.filter(
          str => `${str}:*`.includes(arn) // A small interpolation hack to be able to match the full arn
        ).length > 0
    )
    for (const cloudwatchLogGroup of dataAtRegion) {
      connections.push({
        id: cloudwatchLogGroup.logGroupName,
        resourceType: services.cloudwatchLog,
        relation: 'child',
        field: 'cloudwatchLogs',
      })
    }
  }

  const natResult = {
    [DomainId]: connections,
  }
  return natResult
}
