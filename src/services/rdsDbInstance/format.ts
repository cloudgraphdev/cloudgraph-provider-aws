import { generateUniqueId } from '@cloudgraph/sdk'

import upperFirst from 'lodash/upperFirst'
import { RawAwsRdsDbInstance } from './data'
import {
  AwsRdsDbInstance,
} from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account,
  region
}:
  {
    service: RawAwsRdsDbInstance
    account: string
    region: string
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
    LicenseModel: licenseModel,
    Tags = {},
  } = service

  const subnetGroup = service.DBSubnetGroup?.DBSubnetGroupName || ''

  const parameterGroups = service.DBParameterGroups.map(
    (parameter) => {
      const { DBParameterGroupName, ParameterApplyStatus } = parameter
      return ({
        id: generateUniqueId({
          arn,
          ...parameter
        }),
        description: `${DBParameterGroupName} (${ParameterApplyStatus})`,
        name: DBParameterGroupName,
        status: ParameterApplyStatus
      })
    }
  )

  const optionsGroups = service.OptionGroupMemberships.map(
    (option) => {
      const { OptionGroupName, Status } = option
      return ({
        id: generateUniqueId({
          arn,
          ...option
        }),
        description: `${OptionGroupName} (${upperFirst(Status)})`,
        groupName: OptionGroupName,
        status: Status
      })
    }

  )

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    name: dBInstanceIdentifier,
    port: endpoint?.Port,
    address: endpoint?.Address,
    hostedZoneId: endpoint?.HostedZoneId,
    username,
    resourceId,
    engine,
    engineVersion,
    createdTime: createdTime?.toISOString(),
    copyTagsToSnapshot,
    deletionProtection,
    dBInstanceIdentifier,
    performanceInsightsEnabled,
    autoMinorVersionUpgrade,
    iamDbAuthenticationEnabled,
    optionsGroups,
    parameterGroups,
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
    licenseModel,
    tags: formatTagsFromMap(Tags),
  }
}
