import { generateUniqueId } from '@cloudgraph/sdk'

import upperFirst from 'lodash/upperFirst'
import { RawAwsRdsDbInstance } from './data'
import {
  AwsRdsDbInstance, AwsRdsDbInstanceGroupOption, AwsRdsDbInstanceParameterGroup, AwsRdsDbInstanceSnapshot,
} from '../../types/generated'
import { convertAwsTagsToTagMap, formatTagsFromMap } from '../../utils/format'
import { AwsTag } from '../../types'

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
    Snapshots = []
  } = service

  const subnetGroup = service.DBSubnetGroup?.DBSubnetGroupName || ''

  const parameterGroups: AwsRdsDbInstanceParameterGroup[] = service.DBParameterGroups.map(
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

  const optionsGroups: AwsRdsDbInstanceGroupOption[] = service.OptionGroupMemberships.map(
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

  const snapshots: AwsRdsDbInstanceSnapshot[] = Snapshots.map(
    (snapshot) => {
      const tags = convertAwsTagsToTagMap(snapshot.TagList as AwsTag[])
      return ({
        id: generateUniqueId({
          arn,
          ...snapshot
        }),
        dBSnapshotIdentifier: snapshot.DBSnapshotIdentifier,
        dBInstanceIdentifier: snapshot.DBInstanceIdentifier,
        snapshotCreateTime: snapshot.SnapshotCreateTime?.toISOString(),
        engine: snapshot.Engine,
        allocatedStorage: snapshot.AllocatedStorage,
        status: snapshot.Status,
        port: snapshot.Port,
        availabilityZone: snapshot.AvailabilityZone,
        vpcId: snapshot.VpcId,
        instanceCreateTime: snapshot.InstanceCreateTime?.toISOString(),
        masterUsername: snapshot.MasterUsername,
        engineVersion: snapshot.EngineVersion,
        licenseModel: snapshot.LicenseModel,
        snapshotType: snapshot.SnapshotType,
        iops: snapshot.Iops,
        optionGroupName: snapshot.OptionGroupName,
        percentProgress: snapshot.PercentProgress,
        sourceRegion: snapshot.SourceRegion,
        sourceDBSnapshotIdentifier: snapshot.SourceDBSnapshotIdentifier,
        storageType: snapshot.StorageType,
        tdeCredentialArn: snapshot.TdeCredentialArn,
        encrypted: snapshot.Encrypted,
        kmsKeyId: snapshot.KmsKeyId,
        dBSnapshotArn: snapshot.DBSnapshotArn,
        timezone: snapshot.Timezone,
        iAMDatabaseAuthenticationEnabled: snapshot.IAMDatabaseAuthenticationEnabled,
        processorFeatures: snapshot.ProcessorFeatures?.map(p => ({
          id: generateUniqueId({
            arn,
            ...p
          }),
          name: p.Name,
          value: p.Value
        })),
        dbiResourceId: snapshot.DbiResourceId,
        tagList: snapshot.TagList,
        originalSnapshotCreateTime: snapshot.OriginalSnapshotCreateTime?.toISOString(),
        snapshotDatabaseTime: snapshot.SnapshotDatabaseTime?.toISOString(),
        snapshotTarget: snapshot.SnapshotTarget,
        storageThroughput: snapshot.StorageThroughput,
        tags: formatTagsFromMap(tags)
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
    snapshots,
    tags: formatTagsFromMap(Tags),
  }
}
