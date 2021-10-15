import { RawAwsrdsCluster } from './data'
import { 
  AwsrdsCluster, 
} from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account,
}: 
{
  service: RawAwsrdsCluster
  account: string
}): AwsrdsCluster => {
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
