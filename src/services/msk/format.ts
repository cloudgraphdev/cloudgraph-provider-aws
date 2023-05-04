import { generateUniqueId } from '@cloudgraph/sdk'

import { RawAwsMskCluster } from './data'
import { AwsMskCluster } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsMskCluster
  account: string
  region: string
}): AwsMskCluster => {
  const {
    ActiveOperationArn: activeOperationArn,
    ClusterType: clusterType,
    ClusterArn: arn,
    ClusterName: clusterName,
    CreationTime: creationTime,
    CurrentVersion: currentVersion,
    State: state,
    StateInfo: stateInfo,
    Provisioned: provisioned,
    Serverless: serverless,
    Tags: tags = {},
  } = service

  const {
    BrokerNodeGroupInfo: brokerNodeGroupInfo,
    CurrentBrokerSoftwareInfo: currentBrokerSoftwareInfo,
    ClientAuthentication: clientAuthentication,
    EncryptionInfo: encryptionInfo,
    EnhancedMonitoring: enhancedMonitoring,
    OpenMonitoring: openMonitoring,
    LoggingInfo: loggingInfo,
    NumberOfBrokerNodes: numberOfBrokerNodes,
    ZookeeperConnectString: zookeeperConnectString,
    ZookeeperConnectStringTls: zookeeperConnectStringTls,
    StorageMode: storageMode,
  } = provisioned || {}


  const {
    VpcConfigs: vpcConfigs,
    ClientAuthentication: serverlessClientAuthentication,
  } = serverless || {}

  return {
    id: arn,
    accountId,
    arn,
    region,
    activeOperationArn,
    clusterType,
    clusterName,
    creationTime: creationTime?.toISOString(),
    currentVersion,
    state,
    stateInfo: {
      code: stateInfo?.Code,
      message: stateInfo?.Message,
    },
    provisioned: {
      brokerNodeGroupInfo: {
        brokerAZDistribution: brokerNodeGroupInfo?.BrokerAZDistribution,
        clientSubnets: brokerNodeGroupInfo?.ClientSubnets,
        instanceType: brokerNodeGroupInfo?.InstanceType,
        securityGroups: brokerNodeGroupInfo?.SecurityGroups,
        ebsStorageInfo: {
          provisionedThroughputEnabled: brokerNodeGroupInfo?.StorageInfo?.EbsStorageInfo?.ProvisionedThroughput?.Enabled,
          provisionedThroughputVolumeThroughput:  brokerNodeGroupInfo?.StorageInfo?.EbsStorageInfo?.ProvisionedThroughput?.VolumeThroughput,
          volumeSize: brokerNodeGroupInfo?.StorageInfo?.EbsStorageInfo?.VolumeSize,
        },
        connectivityInfo: {
          publicAccessType: brokerNodeGroupInfo?.ConnectivityInfo?.PublicAccess?.Type,
        },
      },
      currentBrokerSoftwareInfo: {
        configurationArn: currentBrokerSoftwareInfo?.ConfigurationArn,
        configurationRevision: currentBrokerSoftwareInfo?.ConfigurationRevision,
        kafkaVersion: currentBrokerSoftwareInfo?.KafkaVersion,
      },
      clientAuthentication: {
        sasl: {
          scramEnabled: clientAuthentication?.Sasl?.Scram?.Enabled,
          iamEnabled: clientAuthentication?.Sasl?.Iam?.Enabled,
        },
        tls: {
          certificateAuthorityArnList: clientAuthentication?.Tls?.CertificateAuthorityArnList,
          enabled: clientAuthentication?.Tls?.Enabled,
        },
        unauthenticatedEnabled: clientAuthentication?.Unauthenticated?.Enabled,
      },
      encryptionInfo: {
        encryptionAtRest: {
          dataVolumeKMSKeyId: encryptionInfo?.EncryptionAtRest?.DataVolumeKMSKeyId,
        },
        encryptionInTransit: {
          clientBroker: encryptionInfo?.EncryptionInTransit?.ClientBroker,
          inCluster: encryptionInfo?.EncryptionInTransit?.InCluster,
        },
      },
      enhancedMonitoring,
      openMonitoringPrometheus: {
        jmxExporterEnabledInBroker: openMonitoring?.Prometheus?.JmxExporter?.EnabledInBroker,
        nodeExporterInfoEnabledInBroker: openMonitoring?.Prometheus?.NodeExporter?.EnabledInBroker
      },
      loggingInfo: {
        cloudWatchLogs: {
          enabled: loggingInfo?.BrokerLogs?.CloudWatchLogs.Enabled,
          logGroup: loggingInfo?.BrokerLogs?.CloudWatchLogs.LogGroup,
        },
        firehose: {
          deliveryStream: loggingInfo?.BrokerLogs?.Firehose?.DeliveryStream,
          enabled: loggingInfo?.BrokerLogs?.Firehose?.Enabled,
        },
        s3: {
          bucket: loggingInfo?.BrokerLogs?.S3?.Bucket,
          enabled: loggingInfo?.BrokerLogs?.S3?.Enabled,
          prefix: loggingInfo?.BrokerLogs?.S3?.Prefix,
        },
      },
      numberOfBrokerNodes,
      zookeeperConnectString,
      zookeeperConnectStringTls,
      storageMode,
    },
    serverless: {
      vpcConfigs: vpcConfigs?.map(vc => ({
        id: generateUniqueId({
          arn,
          ...vc,
        }),
        subnetIds: vc.SubnetIds || [],
        securityGroupIds: vc.SecurityGroupIds || [],
      })) || [],
      serverlessClientAuthentication: {
        sasl: {
          iamEnabled: serverlessClientAuthentication?.Sasl?.Iam?.Enabled,
        }
      },
    },
    tags: formatTagsFromMap(tags),
  }
}
