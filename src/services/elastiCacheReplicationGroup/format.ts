import cuid from 'cuid'
import { AwsElastiCacheReplicationGroup } from '../../types/generated'
import { RawAwsElastiCacheReplicationGroup } from './data'
import { formatTagsFromMap } from '../../utils/format'

/**
 * ElastiCache replication group
 */

export default ({
  service,
  account,
}: {
  service: RawAwsElastiCacheReplicationGroup
  account: string
  region: string
}): AwsElastiCacheReplicationGroup => {
  const {
    ARN: arn,
    ReplicationGroupId: replicationGroupId,
    Description: description,
    GlobalReplicationGroupInfo: globalReplicationGroupInfo,
    Status: status,
    PendingModifiedValues: pendingModifiedValues,
    MemberClusters: memberClusters,
    NodeGroups: nodeGroups,
    SnapshottingClusterId: snapshottingClusterId,
    AutomaticFailover: automaticFailover,
    MultiAZ: multiAZ,
    ConfigurationEndpoint: configurationEndpoint,
    SnapshotRetentionLimit: snapshotRetentionLimit,
    SnapshotWindow: snapshotWindow,
    ClusterEnabled: clusterEnabled,
    CacheNodeType: cacheNodeType,
    AuthTokenEnabled: authTokenEnabled,
    AuthTokenLastModifiedDate: authTokenLastModifiedDate,
    TransitEncryptionEnabled: transitEncryptionEnabled,
    AtRestEncryptionEnabled: atRestEncryptionEnabled,
    MemberClustersOutpostArns: memberClustersOutpostArns,
    UserGroupIds: userGroupIds,
    LogDeliveryConfigurations: logDeliveryConfigurations,
    ReplicationGroupCreateTime: replicationGroupCreateTime,
    Tags = {},
  } = service

  return {
    id: arn,
    arn,
    accountId: account,
    replicationGroupId,
    description,
    globalReplicationGroupInfo: {
      globalReplicationGroupId: globalReplicationGroupInfo?.GlobalReplicationGroupId,
      globalReplicationGroupMemberRole: globalReplicationGroupInfo?.GlobalReplicationGroupMemberRole,
    },
    status,
    pendingModifiedValues: {
      primaryClusterId: pendingModifiedValues?.PrimaryClusterId,
      automaticFailoverStatus: pendingModifiedValues?.AutomaticFailoverStatus,
      resharding: {
        slotMigration: {
          progressPercentage: pendingModifiedValues?.Resharding?.SlotMigration?.ProgressPercentage,
        },
      },
      authTokenStatus: pendingModifiedValues?.AuthTokenStatus,
      userGroups: {
        userGroupIdsToAdd: pendingModifiedValues?.UserGroups?.UserGroupIdsToAdd,
        userGroupIdsToRemove: pendingModifiedValues?.UserGroups?.UserGroupIdsToRemove,
      },
      logDeliveryConfigurations: pendingModifiedValues?.LogDeliveryConfigurations?.map(config => ({
        id: cuid(),
        logType: config.LogType,
        destinationType: config.DestinationType,
        destinationDetails: {
          cloudWatchLogsDetails: {
            logGroup: config.DestinationDetails?.CloudWatchLogsDetails?.LogGroup,
          },
          kinesisFirehoseDetails: {
            deliveryStream: config.DestinationDetails?.KinesisFirehoseDetails?.DeliveryStream,
          },
        },
        logFormat: config.LogFormat,
      })),
    },
    memberClusters,
    nodeGroups: nodeGroups?.map(ng => ({
      id: cuid(),
      nodeGroupId: ng.NodeGroupId,
      status: ng.Status,
      primaryEndpoint: {
        address: ng.PrimaryEndpoint?.Address,
        port: ng.PrimaryEndpoint?.Port,
      },
      readerEndpoint: {
        address: ng.ReaderEndpoint?.Address,
        port: ng.ReaderEndpoint?.Port,
      },
      slots: ng.Slots,
      nodeGroupMembers: ng.NodeGroupMembers?.map(member => ({
        id: cuid(),
        cacheClusterId: member.CacheClusterId,
        cacheNodeId: member.CacheNodeId,
        readEndpoint: {
          address: member.ReadEndpoint?.Address,
          port: member.ReadEndpoint?.Port,
        },
        preferredAvailabilityZone: member.PreferredAvailabilityZone,
        preferredOutpostArn: member.PreferredOutpostArn,
        currentRole: member.CurrentRole,
      }))
    })),
    snapshottingClusterId,
    automaticFailover,
    multiAZ,
    configurationEndpoint: {
      address: configurationEndpoint?.Address,
      port: configurationEndpoint?.Port,
    },
    snapshotRetentionLimit,
    snapshotWindow,
    clusterEnabled,
    cacheNodeType,
    authTokenEnabled,
    authTokenLastModifiedDate: authTokenLastModifiedDate?.toISOString(),
    transitEncryptionEnabled,
    atRestEncryptionEnabled,
    memberClustersOutpostArns,
    userGroupIds,
    logDeliveryConfigurations: logDeliveryConfigurations?.map(config => ({
      id: cuid(),
      logType: config.LogType,
      destinationType: config.DestinationType,
      destinationDetails: {
        cloudWatchLogsDetails: {
          logGroup: config.DestinationDetails?.CloudWatchLogsDetails?.LogGroup,
        },
        kinesisFirehoseDetails: {
          deliveryStream: config.DestinationDetails?.KinesisFirehoseDetails?.DeliveryStream,
        },
      },
      logFormat: config.LogFormat,
      status: config.Status,
      message: config.Message,
    })),
    replicationGroupCreateTime: replicationGroupCreateTime?.toISOString(),
    tags: formatTagsFromMap(Tags),
  }
}
