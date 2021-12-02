import { AwsRedshiftCluster } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsRedshiftCluster } from './data'
import { redshiftArn } from '../../utils/generateArns'

/**
 * Redshift
 */
export default ({
  service,
  account,
  region,
}: {
  service: RawAwsRedshiftCluster
  account: string
  region: string
}): AwsRedshiftCluster => {
  const {
    ClusterIdentifier: id,
    Tags = {},
    AllowVersionUpgrade: allowVersionUpgrade,
    AutomatedSnapshotRetentionPeriod: automatedSnapshotRetentionPeriod,
    AvailabilityZone: availabilityZone,
    ClusterAvailabilityStatus: clusterAvailabilityStatus,
    ClusterCreateTime: clusterCreateTime,
    ClusterRevisionNumber: clusterRevisionNumber,
    ClusterStatus: clusterStatus,
    ClusterSubnetGroupName: clusterSubnetGroupName,
    ClusterVersion: clusterVersion,
    DBName: dBName,
    Encrypted: encrypted,
    EnhancedVpcRouting: enhancedVpcRouting,
    ManualSnapshotRetentionPeriod: manualSnapshotRetentionPeriod,
    MasterUsername: masterUsername,
    ModifyStatus: modifyStatus,
    NodeType: nodeType,
    NumberOfNodes: numberOfNodes,
    PreferredMaintenanceWindow: preferredMaintenanceWindow,
    PubliclyAccessible: publiclyAccessible,
  } = service

  const arn = redshiftArn({region, account, id})

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    allowVersionUpgrade,
    automatedSnapshotRetentionPeriod,
    availabilityZone,
    clusterAvailabilityStatus,
    clusterCreateTime: clusterCreateTime.toISOString(),
    clusterRevisionNumber,
    clusterStatus,
    clusterSubnetGroupName,
    clusterVersion,
    dBName,
    encrypted,
    enhancedVpcRouting,
    manualSnapshotRetentionPeriod,
    masterUsername,
    modifyStatus,
    nodeType,
    numberOfNodes,
    preferredMaintenanceWindow,
    publiclyAccessible,
    tags: formatTagsFromMap(Tags),
  }
}
