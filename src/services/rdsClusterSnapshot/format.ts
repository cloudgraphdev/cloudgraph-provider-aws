import { generateUniqueId } from '@cloudgraph/sdk'

import { formatTagsFromMap } from '../../utils/format'
import { AwsRdsClusterSnapshot } from '../../types/generated'
import { RawAwsRdsClusterSnapshot } from './data'

/**
 * RdsClusterSnapshot
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsRdsClusterSnapshot
  region: string
}): AwsRdsClusterSnapshot => {
  const {
    AvailabilityZones: availabilityZones,
    DBClusterSnapshotIdentifier: dbClusterSnapshotIdentifier,
    DBClusterIdentifier: dbClusterIdentifier,
    SnapshotCreateTime: snapshotCreateTime,
    Engine: engine,
    EngineMode: engineMode,
    AllocatedStorage: allocatedStorage,
    Status: status,
    Port: port,
    VpcId: vpcId,
    ClusterCreateTime: clusterCreateTime,
    MasterUsername: masterUsername,
    EngineVersion: engineVersion,
    LicenseModel: licenseModel,
    SnapshotType: snapshotType,
    PercentProgress: percentProgress,
    StorageEncrypted: storageEncrypted,
    KmsKeyId: kmsKeyId,
    DBClusterSnapshotArn: dbClusterSnapshotArn,
    SourceDBClusterSnapshotArn: sourceDBClusterSnapshotArn,
    IAMDatabaseAuthenticationEnabled: iamDatabaseAuthenticationEnabled,
    Tags,
    attributes,
  } = rawData

  const mappedAttributes = attributes?.map(
    ({ AttributeName, AttributeValues }) => ({
      id: generateUniqueId({
        AttributeName,
        AttributeValues,
      }),
      name: AttributeName,
      values: AttributeValues,
    })
  )

  return {
    id: dbClusterSnapshotIdentifier,
    arn: dbClusterSnapshotArn,
    region,
    accountId: account,
    availabilityZones,
    dbClusterIdentifier,
    snapshotCreateTime: snapshotCreateTime?.toISOString(),
    engine,
    engineMode,
    allocatedStorage,
    status,
    port,
    vpcId,
    clusterCreateTime: clusterCreateTime?.toISOString(),
    masterUsername,
    engineVersion,
    licenseModel,
    snapshotType,
    percentProgress,
    storageEncrypted,
    kmsKeyId,
    iamDatabaseAuthenticationEnabled,
    sourceDBClusterSnapshotArn,
    tags: formatTagsFromMap(Tags ?? {}),
    attributes: mappedAttributes,
  }
}
