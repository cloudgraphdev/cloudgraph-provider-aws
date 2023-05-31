import { UserAuthConfigInfo } from 'aws-sdk/clients/rds'
import { AwsRdsDbProxies, AwsRdsDbProxiesUserAuthConfigInfo } from '../../types/generated'
import { RawAwsRdsDbProxies } from './data'
import { generateUniqueId } from '@cloudgraph/sdk'

/**
 * RdsDbProxies
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account,
  service: RawAwsRdsDbProxies
  region,
}): AwsRdsDbProxies => {
  const {
    DBProxyName: dBProxyName,
    DBProxyArn: arn,
    Status: status,
    EngineFamily: engineFamily,
    VpcId: vpcId,
    VpcSecurityGroupIds: vpcSecurityGroupIds = [],
    VpcSubnetIds: vpcSubnetIds = [],
    Auth: auth,
    RoleArn: roleArn,
    Endpoint: endpoint,
    RequireTLS: requireTLS,
    IdleClientTimeout: idleClientTimeout,
    DebugLogging: debugLogging,
    CreatedDate: createdDate,
    UpdatedDate: updatedDate,
  } = rawData



  const formatUserAuthConfigInfo = (
    configList?: UserAuthConfigInfo[]
  ): AwsRdsDbProxiesUserAuthConfigInfo[] => {
    return (
      configList?.map(c => ({
        id: generateUniqueId({
          arn,
          ...c,
        }),
        description: c.Description,
        userName: c.UserName,
        authScheme: c.AuthScheme,
        secretArn: c.SecretArn,
        iAMAuth: c.IAMAuth,
        clientPasswordAuthType: c.ClientPasswordAuthType
      })) || []
    )
  }




  return {
    id: arn,
    accountId: account,
    region,
    dBProxyName,
    arn,
    status,
    engineFamily,
    vpcId,
    vpcSecurityGroupIds,
    vpcSubnetIds,
    auth: formatUserAuthConfigInfo(auth),
    roleArn,
    endpoint,
    requireTLS,
    idleClientTimeout,
    debugLogging,
    createdDate: createdDate.toISOString(),
    updatedDate: updatedDate.toISOString(),
  }
}
