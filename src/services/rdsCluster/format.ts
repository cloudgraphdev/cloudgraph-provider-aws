import { RawAwsRdsCluster } from './data'
import { 
  AwsRdsCluster, 
} from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account,
  region
}: 
{
  service: RawAwsRdsCluster
  account: string
  region: string
}): AwsRdsCluster => {
  const {
    DBClusterArn: arn,
    DBClusterIdentifier: dbClusterIdentifier,
    DBSubnetGroup: subnets,
    Status: status,
    Engine: engine,
    EngineVersion: engineVersion,
    MasterUsername: username,
    AllocatedStorage: allocatedStorage,
    ClusterCreateTime: createdTime,
    MultiAZ: multiAZ,
    StorageEncrypted: encrypted,
    KmsKeyId: kmsKey,
    CopyTagsToSnapshot: copyTagsToSnapshot,
    DeletionProtection: deletionProtection,
    IAMDatabaseAuthenticationEnabled: iamDbAuthenticationEnabled,
    DbClusterResourceId: resourceId,
    BackupRetentionPeriod: backupRetentionPeriod,
    CharacterSetName: characterSetName,
    DatabaseName: databaseName,
    PercentProgress: percentProgress,
    ReaderEndpoint: readerEndpoint,
    Port: port,
    ReplicationSourceIdentifier: replicationSourceIdentifier,
    HostedZoneId: hostedZoneId,
    CloneGroupId: cloneGroupId,
    Capacity: capacity,
    EngineMode: engineMode,
    HttpEndpointEnabled: httpEndpointEnabled,
    CrossAccountClone: crossAccountClone,
    GlobalWriteForwardingRequested: globalWriteForwardingRequested,
    Tags = {},
  } = service

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    allocatedStorage,
    backupRetentionPeriod,
    characterSetName,
    databaseName,
    dbClusterIdentifier,
    subnets,
    status,
    percentProgress,
    readerEndpoint,
    multiAZ,
    engine,
    engineVersion,
    port,
    username,
    replicationSourceIdentifier,
    hostedZoneId,
    encrypted,
    kmsKey,
    resourceId,
    iamDbAuthenticationEnabled,
    cloneGroupId,
    createdTime: createdTime.toISOString(),
    capacity,
    engineMode,
    deletionProtection,
    httpEndpointEnabled,
    copyTagsToSnapshot,
    crossAccountClone,
    tags: formatTagsFromMap(Tags),
    globalWriteForwardingRequested,
  }
}
