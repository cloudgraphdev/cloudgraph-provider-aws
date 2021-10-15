import upperFirst from 'lodash/upperFirst'
import { RawAwsRDSDbInstance } from './data'
import { 
  AwsRdsDbInstance, 
} from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account,
}: 
{
  service: RawAwsRDSDbInstance
  account: string
}): AwsRdsDbInstance => {
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
    Tags = {},
  } = service

  const subnetGroup = service.DBSubnetGroup?.DBSubnetGroupName || ''

  const parameterGroup = service.DBParameterGroups.map(
    ({ DBParameterGroupName, ParameterApplyStatus }) =>
      `${DBParameterGroupName} (${ParameterApplyStatus})`
  ).join(' | ')

  const optionsGroups = service.OptionGroupMemberships.map(
    ({ OptionGroupName, Status }) =>
      `${OptionGroupName} (${upperFirst(Status)})`
  ).join(' | ')

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
    availabilityZone,
    publiclyAccessible,
    certificateAuthority,
    status,
    failoverPriority,
    kmsKey,
    encrypted,
    tags: formatTagsFromMap(Tags),
  }
}
