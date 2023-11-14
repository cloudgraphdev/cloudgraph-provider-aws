import { RawAwsDocDBCluster } from './data'
import { AwsDocdbCluster } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsDocDBCluster
  account: string
  region: string
}): AwsDocdbCluster => {
  const {
    AvailabilityZones = [],
    BackupRetentionPeriod: backupRetentionPeriod,
    DBClusterIdentifier: dBClusterIdentifier,
    DBClusterParameterGroup: dBClusterParameterGroup,
    DBSubnetGroup: dBSubnetGroup,
    Status: status,
    PercentProgress: percentProgress,
    EarliestRestorableTime: earliestRestorableTime,
    Endpoint: endpoint,
    ReaderEndpoint: readerEndpoint,
    MultiAZ: multiAZ,
    Engine: engine,
    EngineVersion: engineVersion,
    LatestRestorableTime: latestRestorableTime,
    Port: port,
    MasterUsername: masterUsername,
    PreferredBackupWindow: preferredBackupWindow,
    PreferredMaintenanceWindow: preferredMaintenanceWindow,
    ReplicationSourceIdentifier: replicationSourceIdentifier,
    ReadReplicaIdentifiers: readReplicaIdentifiers,
    DBClusterMembers = [],
    VpcSecurityGroups = [],
    HostedZoneId: hostedZoneId,
    StorageEncrypted: storageEncrypted,
    KmsKeyId: kmsKeyId,
    DbClusterResourceId: dbClusterResourceId,
    DBClusterArn: arn,
    CloneGroupId: cloneGroupId,
    ClusterCreateTime: clusterCreateTime,
    DeletionProtection: deletionProtection,
  } = service

  const availabilityZones = AvailabilityZones.map(az => az)
  const dBClusterMembers = DBClusterMembers.map(dbinstance => dbinstance.DBInstanceIdentifier)
  const vpcSecurityGroups = VpcSecurityGroups.map(vpcsg => vpcsg.VpcSecurityGroupId)

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    availabilityZones,
    backupRetentionPeriod,
    dBClusterIdentifier,
    dBClusterParameterGroup,
    dBSubnetGroup,
    status,
    percentProgress,
    earliestRestorableTime: earliestRestorableTime?.toISOString(),
    endpoint,
    readerEndpoint,
    multiAZ,
    engine,
    engineVersion,
    latestRestorableTime: latestRestorableTime?.toISOString(),
    port,
    masterUsername,
    preferredBackupWindow,
    preferredMaintenanceWindow,
    replicationSourceIdentifier,
    readReplicaIdentifiers,
    dBClusterMembers,
    vpcSecurityGroups,
    hostedZoneId,
    storageEncrypted,
    kmsKeyId,
    dbClusterResourceId,
    cloneGroupId,
    clusterCreateTime: clusterCreateTime?.toISOString(),
    deletionProtection,
  }
}
