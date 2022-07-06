import { generateUniqueId } from '@cloudgraph/sdk'

import t from '../../properties/translations'
import { AwsAsg } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsAsg } from './data'

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsAsg
  account: string
  region: string
}): AwsAsg => {
  const {
    AutoScalingGroupARN: arn,
    AutoScalingGroupName: name,
    LaunchConfigurationName: launchConfigurationName,
    LaunchTemplate: launchTemplate,
    MixedInstancesPolicy: mixedInstancesPolicy,
    MinSize: minSize,
    MaxSize: maxSize,
    DesiredCapacity: desiredCapacity,
    PredictedCapacity: predictedCapacity,
    DefaultCooldown: cooldown,
    AvailabilityZones: availabilityZones = [],
    LoadBalancerNames: loadBalancerNames = [],
    TargetGroupARNs: targetGroupARNs,
    HealthCheckType: healthCheckType,
    HealthCheckGracePeriod: healthCheckGracePeriod,
    Instances: instances = [],
    SuspendedProcesses: suspendedProcesses = [],
    PlacementGroup: placementGroup,
    VPCZoneIdentifier: vpcZoneIdentifier,
    EnabledMetrics: enabledMetrics,
    Status: status,
    Tags: tags = {},
    TerminationPolicies: terminationPolicies,
    NewInstancesProtectedFromScaleIn: newInstancesProtectedFromScaleIn,
    ServiceLinkedRoleARN: serviceLinkedRoleARN,
    MaxInstanceLifetime: maxInstanceLifetime,
    CapacityRebalance: capacityRebalanceEnabled,
    WarmPoolConfiguration: warmPoolConfiguration,
    WarmPoolSize: warmPoolSize,
    Context: context,
    LaunchConfiguration: launchConfiguration,
  } = rawData

  const ec2InstanceIds = instances.map(({ InstanceId }) => InstanceId)

  const launchTemplateOverrideList =
    mixedInstancesPolicy?.LaunchTemplate?.Overrides.map(
      ({
        InstanceType: instanceType,
        WeightedCapacity: weightedCapacity,
        LaunchTemplateSpecification: launchTemplateSpecification,
      }) => {
        return {
          id: generateUniqueId({
            arn,
            instanceType,
            weightedCapacity,
            launchTemplateSpecification,
          }),
          instanceType,
          weightedCapacity,
          launchTemplateId: launchTemplateSpecification?.LaunchTemplateId || '',
          launchTemplateName:
            launchTemplateSpecification?.LaunchTemplateName || '',
          launchTemplateVersion: launchTemplateSpecification?.Version || '',
        }
      }
    ) || []

  const suspendedProcessList =
    suspendedProcesses.map(
      ({ ProcessName: processName, SuspensionReason: suspensionReason }) => {
        return {
          id: generateUniqueId({
            arn,
            processName,
            suspensionReason,
          }),
          processName,
          suspensionReason,
        }
      }
    ) || []

  const enabledMetricsList =
    enabledMetrics.map(({ Metric: metric, Granularity: granularity }) => {
      return {
        id: generateUniqueId({
          arn,
          metric,
          granularity,
        }),
        metric,
        granularity,
      }
    }) || []

  const blockDeviceMappingList =
    launchConfiguration?.BlockDeviceMappings?.map(
      ({
        VirtualName: virtualName,
        DeviceName: deviceName,
        NoDevice: noDevice,
      }) => {
        return {
          id: generateUniqueId({
            arn,
            virtualName,
            deviceName,
            noDevice,
          }),
          virtualName,
          deviceName,
          noDevice: noDevice ? t.yes : t.no,
        }
      }
    ) || []

  return {
    id: arn,
    accountId: account,
    arn,
    name,
    region,
    launchConfigurationName,
    launchTemplateId: launchTemplate?.LaunchTemplateId || '',
    launchTemplateName: launchTemplate?.LaunchTemplateName || '',
    launchTemplateVersion: launchTemplate?.Version || '',
    mixedInstancesPolicy: {
      launchTemplateId:
        mixedInstancesPolicy?.LaunchTemplate?.LaunchTemplateSpecification
          ?.LaunchTemplateId || '',
      launchTemplateName:
        mixedInstancesPolicy?.LaunchTemplate?.LaunchTemplateSpecification
          ?.LaunchTemplateName || '',
      launchTemplateVersion:
        mixedInstancesPolicy?.LaunchTemplate?.LaunchTemplateSpecification
          ?.Version || '',
      launchTemplateOverrides: launchTemplateOverrideList,
      instDistrOnDemandAllocationStrategy:
        mixedInstancesPolicy?.InstancesDistribution
          ?.OnDemandAllocationStrategy || '',
      instDistrOnDemandBaseCapacity:
        mixedInstancesPolicy?.InstancesDistribution?.OnDemandBaseCapacity || 0,
      instDistrOnDemandPercentageAboveBaseCapacity:
        mixedInstancesPolicy?.InstancesDistribution
          ?.OnDemandPercentageAboveBaseCapacity || 0,
      instDistrSpotAllocationStrategy:
        mixedInstancesPolicy?.InstancesDistribution?.SpotAllocationStrategy ||
        '',
      instDistrSpotInstancePools:
        mixedInstancesPolicy?.InstancesDistribution?.SpotInstancePools || 0,
      instDistrSpotMaxPrice:
        mixedInstancesPolicy?.InstancesDistribution?.SpotMaxPrice || '',
    },
    minSize,
    maxSize,
    desiredCapacity,
    predictedCapacity: predictedCapacity || 0,
    cooldown,
    availabilityZones,
    loadBalancerNames,
    targetGroupARNs,
    healthCheckType,
    healthCheckGracePeriod,
    ec2InstanceIds,
    suspendedProcesses: suspendedProcessList,
    placementGroup: placementGroup || '',
    vpcZoneIdentifier,
    enabledMetrics: enabledMetricsList,
    status: status || '',
    terminationPolicies,
    newInstancesProtectedFromScaleIn: newInstancesProtectedFromScaleIn
      ? t.yes
      : t.no,
    serviceLinkedRoleARN,
    maxInstanceLifetime: maxInstanceLifetime || 0,
    capacityRebalanceEnabled: capacityRebalanceEnabled ? t.yes : t.no,
    warmPoolConfigMaxGroupPreparedCapacity:
      warmPoolConfiguration?.MaxGroupPreparedCapacity || 0,
    warmPoolConfigMinSize: warmPoolConfiguration?.MinSize || 0,
    warmPoolConfigPoolState: warmPoolConfiguration?.PoolState || '',
    warmPoolConfigStatus: warmPoolConfiguration?.Status || '',
    warmPoolSize: warmPoolSize || 0,
    context: context || '',
    tags: formatTagsFromMap(tags),
    launchConfiguration: {
      launchConfigurationName:
        launchConfiguration?.LaunchConfigurationName || '',
      launchConfigurationARN: launchConfiguration?.LaunchConfigurationARN || '',
      imageId: launchConfiguration?.ImageId || '',
      keyName: launchConfiguration?.KeyName || '',
      securityGroups: launchConfiguration?.SecurityGroups || [],
      classicLinkVPCId: launchConfiguration?.ClassicLinkVPCId || '',
      classicLinkVPCSecurityGroups:
        launchConfiguration?.ClassicLinkVPCSecurityGroups || [],
      userData: launchConfiguration?.UserData || '',
      instanceType: launchConfiguration?.InstanceType || '',
      kernelId: launchConfiguration?.KernelId || '',
      ramdiskId: launchConfiguration?.RamdiskId || '',
      blockDeviceMappings: blockDeviceMappingList,
      instanceMonitoring: launchConfiguration?.InstanceMonitoring?.Enabled
        ? t.yes
        : t.no,
      spotPrice: launchConfiguration?.SpotPrice || '',
      iamInstanceProfile: launchConfiguration?.IamInstanceProfile || '',
      ebsOptimized: launchConfiguration?.EbsOptimized ? t.yes : t.no,
      associatePublicIpAddress: launchConfiguration?.AssociatePublicIpAddress
        ? t.yes
        : t.no,
      placementTenancy: launchConfiguration?.PlacementTenancy || '',
      metadataOptHttpTokens:
        launchConfiguration?.MetadataOptions?.HttpTokens || '',
      metadataOptHttpPutResponseHopLimit:
        launchConfiguration?.MetadataOptions?.HttpPutResponseHopLimit || 0,
      metadataOptHttpEndpoint:
        launchConfiguration?.MetadataOptions?.HttpEndpoint || '',
    },
  }
}
