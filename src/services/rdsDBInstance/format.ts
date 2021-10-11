import { RawAwsRDSDBInstance } from './data'
import { 
  AwsRdsdbInstance, 
} from '../../types/generated'
import upperFirst from 'lodash/upperFirst'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account,
}: 
{
  service: RawAwsRDSDBInstance
  account: string
}): AwsRdsdbInstance => {
  const {
    DBInstanceArn: arn,
    DBInstanceIdentifier: dBInstanceIdentifier,
    DBInstanceClass: instanceClass,
    DBInstanceStatus: status,
    Engine: engine,
    EngineVersion: engineVersion,
    MasterUsername: username,
    AllocatedStorage: allocatedStorage,
    InstanceCreateTime: createdTime,
    AvailabilityZone: availabilityZone,
    MultiAZ: multiAZ,
    AutoMinorVersionUpgrade: autoMinorVersionUpgrade,
    PubliclyAccessible: publiclyAccessible,
    StorageType: storageType,
    StorageEncrypted: encrypted,
    KmsKeyId: kmsKey,
    PromotionTier: failoverPriority,
    CACertificateIdentifier: certificateAuthority,
    CopyTagsToSnapshot: copyTagsToSnapshot,
    DeletionProtection: deletionProtection,
    PerformanceInsightsEnabled: performanceInsightsEnabled,
    IAMDatabaseAuthenticationEnabled: iamDbAuthenticationEnabled,
    DbiResourceId: resourceId,
    Endpoint: endpoint,
    tags = {},
  } = service

  const usedSgs = []
  const subnetGroup = service.DBSubnetGroup?.DBSubnetGroupName || ''

  const parameterGroup = service.DBParameterGroups.map(
    ({ DBParameterGroupName, ParameterApplyStatus }) =>
      `${DBParameterGroupName} (${ParameterApplyStatus})`
  ).join(' | ')

  const optionsGroups = service.OptionGroupMemberships.map(
    ({ OptionGroupName, Status }) =>
      `${OptionGroupName} (${upperFirst(Status)})`
  ).join(' | ')

  const vpcSecurityGroups = service.VpcSecurityGroups.map(
    ({ VpcSecurityGroupId, Status }) => {
      if (!usedSgs.includes(VpcSecurityGroupId)) {
        usedSgs.push(VpcSecurityGroupId)
      }
      return `${VpcSecurityGroupId} (${upperFirst(Status)})`
    }
  )
  const dbSecurityGroups = service.DBSecurityGroups.map(
    ({ DBSecurityGroupName, Status }) => {
      if (!usedSgs.includes(DBSecurityGroupName)) {
        usedSgs.push(DBSecurityGroupName)
      }
      return `${DBSecurityGroupName} (${upperFirst(Status)})`
    }
  )

  const subnets = (service.DBSubnetGroup?.Subnets || []).map(
    ({
      SubnetStatus,
      SubnetIdentifier,
      SubnetAvailabilityZone: { Name: name },
    }) => `${SubnetIdentifier} (${name} - ${SubnetStatus})`
  )

  return {
    id: arn,
    accountId: account,
    arn,
    name: dBInstanceIdentifier,
    port: endpoint?.Port,
    address: endpoint?.Address,
    hostedZoneId: endpoint?.HostedZoneId,
    username,
    resourceId,
    engine,
    engineVersion,
    createdTime: createdTime.toISOString(),
    copyTagsToSnapshot,
    deletionProtection,
    dBInstanceIdentifier,
    performanceInsightsEnabled,
    autoMinorVersionUpgrade,
    iamDbAuthenticationEnabled,
    optionsGroups,
    parameterGroup,
    storageType,
    instanceClass,
    allocatedStorage,
    multiAZ,
    subnetGroup,
    subnets,
    availabilityZone,
    dbSecurityGroups,
    vpcSecurityGroups,
    publiclyAccessible,
    certificateAuthority,
    status,
    failoverPriority,
    kmsKey,
    encrypted,
    tags: formatTagsFromMap(tags),
  }
}
