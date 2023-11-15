import { generateUniqueId } from '@cloudgraph/sdk'

import { RawAwsOpsWorksInstance } from './data'
import { AwsOpsWorksInstance } from '../../types/generated'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsOpsWorksInstance
  account: string
  region: string
}): AwsOpsWorksInstance => {
  const {
    AgentVersion: agentVersion,
    AmiId: amiId,
    Architecture: architecture,
    Arn: arn,
    AutoScalingType: autoScalingType,
    AvailabilityZone: availabilityZone,
    BlockDeviceMappings: blockDeviceMappings,
    CreatedAt: createdAt,
    EbsOptimized: ebsOptimized,
    Ec2InstanceId: ec2InstanceId,
    EcsClusterArn: ecsClusterArn,
    EcsContainerInstanceArn: ecsContainerInstanceArn,
    ElasticIp: elasticIp,
    Hostname: hostname,
    InfrastructureClass: infrastructureClass,
    InstallUpdatesOnBoot: installUpdatesOnBoot,
    InstanceId: instanceId,
    InstanceProfileArn: instanceProfileArn,
    InstanceType: instanceType,
    LastServiceErrorId: lastServiceErrorId,
    LayerIds: layerIds,
    Os: os,
    Platform: platform,
    PrivateDns: privateDns,
    PrivateIp: privateIp,
    PublicDns: publicDns,
    PublicIp: publicIp,
    RegisteredBy: registeredBy,
    ReportedAgentVersion: reportedAgentVersion,
    ReportedOs: reportedOs,
    RootDeviceType: rootDeviceType,
    RootDeviceVolumeId: rootDeviceVolumeId,
    SecurityGroupIds: securityGroupIds,
    SshHostDsaKeyFingerprint: sshHostDsaKeyFingerprint,
    SshHostRsaKeyFingerprint: sshHostRsaKeyFingerprint,
    SshKeyName: sshKeyName,
    StackId: stackId,
    Status: status,
    SubnetId: subnetId,
    Tenancy: tenancy,
    VirtualizationType: virtualizationType,
  } = service

  return {
    id: instanceId,
    accountId,
    arn,
    region,
    agentVersion,
    amiId,
    architecture,
    autoScalingType,
    availabilityZone,
    blockDeviceMappings: blockDeviceMappings.map(bl => ({
      id: generateUniqueId({
        arn,
        ...bl,
      }),
      deviceName: bl.DeviceName,
      noDevice: bl.NoDevice,
      virtualName: bl.VirtualName,
      ebs: {
        snapshotId: bl.Ebs?.SnapshotId,
        iops: bl.Ebs?.Iops,
        volumeSize: bl.Ebs?.VolumeSize,
        volumeType: bl.Ebs?.VolumeType,
        deleteOnTermination: bl.Ebs?.DeleteOnTermination,
      },
    })) || [],
    createdAt,
    ebsOptimized,
    ec2InstanceId,
    ecsClusterArn,
    ecsContainerInstanceArn,
    elasticIp,
    hostname,
    infrastructureClass,
    installUpdatesOnBoot,
    instanceId,
    instanceProfileArn,
    instanceType,
    lastServiceErrorId,
    layerIds,
    os,
    platform,
    privateDns,
    privateIp,
    publicDns,
    publicIp,
    registeredBy,
    reportedAgentVersion,
    reportedOs: {
      family: reportedOs?.Family,
      name: reportedOs?.Name,
      version: reportedOs?.Version,
    },
    rootDeviceType,
    rootDeviceVolumeId,
    securityGroupIds,
    sshHostDsaKeyFingerprint,
    sshHostRsaKeyFingerprint,
    sshKeyName,
    stackId,
    status,
    subnetId,
    tenancy,
    virtualizationType,
  }
}
