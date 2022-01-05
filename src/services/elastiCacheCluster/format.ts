import cuid from 'cuid'
import { AwsElastiCacheCluster } from '../../types/generated'
import { RawAwsElastiCacheCluster } from './data'
import { formatTagsFromMap } from '../../utils/format'

/**
 * ElastiCache cluster
 */

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsElastiCacheCluster
  account: string
  region: string
}): AwsElastiCacheCluster => {
  const {
    ARN: arn,
    CacheClusterId: cacheClusterId,
    ConfigurationEndpoint: configurationEndpoint,
    ClientDownloadLandingPage: clientDownloadLandingPage,
    CacheNodeType: cacheNodeType,
    Engine: engine,
    EngineVersion: engineVersion,
    CacheClusterStatus: cacheClusterStatus,
    NumCacheNodes: numCacheNodes,
    PreferredAvailabilityZone: preferredAvailabilityZone,
    PreferredOutpostArn: preferredOutpostArn,
    CacheClusterCreateTime: cacheClusterCreateTime,
    PreferredMaintenanceWindow: preferredMaintenanceWindow,
    PendingModifiedValues: pendingModifiedValues,
    NotificationConfiguration: notificationConfiguration,
    CacheSecurityGroups: cacheSecurityGroups,
    CacheParameterGroup: cacheParameterGroup,
    CacheSubnetGroupName: cacheSubnetGroupName,
    CacheNodes: cacheNodes,
    AutoMinorVersionUpgrade: autoMinorVersionUpgrade,
    ReplicationGroupId: replicationGroupId,
    SnapshotRetentionLimit: snapshotRetentionLimit,
    SnapshotWindow: snapshotWindow,
    AuthTokenEnabled: authTokenEnabled,
    AuthTokenLastModifiedDate: authTokenLastModifiedDate,
    TransitEncryptionEnabled: transitEncryptionEnabled,
    AtRestEncryptionEnabled: atRestEncryptionEnabled,
    ReplicationGroupLogDeliveryEnabled: replicationGroupLogDeliveryEnabled,
    LogDeliveryConfigurations: logDeliveryConfigurations,
    Tags = {},
    CacheSubnetGroup: cacheSubnetGroup,
  } = service

  return {
    id: arn,
    arn,
    accountId: account,
    region,
    cacheClusterId,
    configurationEndpoint: {
      address: configurationEndpoint?.Address,
      port: configurationEndpoint?.Port,
    },
    clientDownloadLandingPage,
    cacheNodeType,
    engine,
    engineVersion,
    cacheClusterStatus,
    numCacheNodes,
    preferredAvailabilityZone,
    preferredOutpostArn,
    cacheClusterCreateTime: cacheClusterCreateTime?.toISOString(),
    preferredMaintenanceWindow,
    pendingModifiedValues: {
      numCacheNodes: pendingModifiedValues?.NumCacheNodes,
      cacheNodeIdsToRemove: pendingModifiedValues?.CacheNodeIdsToRemove,
      engineVersion: pendingModifiedValues?.EngineVersion,
      cacheNodeType: pendingModifiedValues?.CacheNodeType,
      authTokenStatus: pendingModifiedValues?.AuthTokenStatus,
      logDeliveryConfigurations:
        pendingModifiedValues?.LogDeliveryConfigurations?.map(config => ({
          id: cuid(),
          logType: config.LogType,
          destinationType: config.DestinationType,
          destinationDetails: {
            cloudWatchLogsDetails: {
              logGroup:
                config.DestinationDetails?.CloudWatchLogsDetails?.LogGroup,
            },
            kinesisFirehoseDetails: {
              deliveryStream:
                config.DestinationDetails?.KinesisFirehoseDetails
                  ?.DeliveryStream,
            },
          },
          logFormat: config.LogFormat,
        })),
    },
    notificationConfiguration: {
      topicArn: notificationConfiguration?.TopicArn,
      topicStatus: notificationConfiguration?.TopicStatus,
    },
    cacheSecurityGroups: cacheSecurityGroups?.map(sg => ({
      id: cuid(),
      cacheSecurityGroupName: sg.CacheSecurityGroupName,
      status: sg.Status,
    })),
    cacheParameterGroup: {
      cacheParameterGroupName: cacheParameterGroup?.CacheParameterGroupName,
      parameterApplyStatus: cacheParameterGroup?.ParameterApplyStatus,
      cacheNodeIdsToReboot: cacheParameterGroup?.CacheNodeIdsToReboot,
    },
    cacheSubnetGroupName,
    cacheNodes: cacheNodes?.map(node => ({
      id: cuid(),
      cacheNodeId: node.CacheNodeId,
      cacheNodeStatus: node.CacheNodeStatus,
      cacheNodeCreateTime: node.CacheNodeCreateTime?.toISOString(),
      endpoint: {
        address: node.Endpoint?.Address,
        port: node.Endpoint?.Port,
      },
      parameterGroupStatus: node.ParameterGroupStatus,
      sourceCacheNodeId: node.SourceCacheNodeId,
      customerAvailabilityZone: node.CustomerAvailabilityZone,
      customerOutpostArn: node.CustomerOutpostArn,
    })),
    autoMinorVersionUpgrade,
    replicationGroupId,
    snapshotRetentionLimit,
    snapshotWindow,
    authTokenEnabled,
    authTokenLastModifiedDate: authTokenLastModifiedDate?.toISOString(),
    transitEncryptionEnabled,
    atRestEncryptionEnabled,
    replicationGroupLogDeliveryEnabled,
    logDeliveryConfigurations: logDeliveryConfigurations?.map(config => ({
      id: cuid(),
      logType: config.LogType,
      destinationType: config.DestinationType,
      destinationDetails: {
        cloudWatchLogsDetails: {
          logGroup: config.DestinationDetails?.CloudWatchLogsDetails?.LogGroup,
        },
        kinesisFirehoseDetails: {
          deliveryStream:
            config.DestinationDetails?.KinesisFirehoseDetails?.DeliveryStream,
        },
      },
      logFormat: config.LogFormat,
      status: config.Status,
      message: config.Message,
    })),
    tags: formatTagsFromMap(Tags),
    cacheSubnetGroup: {
      cacheSubnetGroupName: cacheSubnetGroup?.CacheSubnetGroupName,
      cacheSubnetGroupDescription:
        cacheSubnetGroup?.CacheSubnetGroupDescription,
      vpcId: cacheSubnetGroup?.VpcId,
      subnets:
        cacheSubnetGroup?.Subnets?.map(subnet => ({
          subnetIdentifier: subnet?.SubnetIdentifier,
          subnetAvailabilityZone: subnet?.SubnetAvailabilityZone?.Name || '',
        })) || [],
    },
  }
}
