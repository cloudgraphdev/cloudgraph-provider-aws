import t from '../../properties/translations'
import { AwsAsg } from '../../types/generated';
import { formatTagsFromMap } from '../../utils/format';
import { RawAwsAsg } from './data';

export default ({
  service: rawData,
  region,
}: {
  service: RawAwsAsg
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
  } = rawData

  const ec2InstanceIds = instances.map(({ InstanceId }) => InstanceId)

  const launchTemplateOverrideList = mixedInstancesPolicy?.LaunchTemplate?.Overrides.map(({
    InstanceType: instanceType,
    WeightedCapacity: weightedCapacity,
    LaunchTemplateSpecification: launchTemplateSpecification,
  }) => {
    return {
      instanceType,
      weightedCapacity,
      launchTemplateId: launchTemplateSpecification?.LaunchTemplateId || '',
      launchTemplateName: launchTemplateSpecification?.LaunchTemplateName || '',
      launchTemplateVersion: launchTemplateSpecification?.Version || '',
    }
  }) || [];

  const suspendedProcessList = suspendedProcesses.map(({
    ProcessName: processName,
    SuspensionReason: suspensionReason,
  }) => {
    return {
      processName,
      suspensionReason,
  }}) || [];

  const enabledMetricsList = enabledMetrics.map(({
    Metric: metric,
    Granularity: granularity,
  }) => {
    return {
      metric,
      granularity,
    }
  }) || [];
  
  const asg = {
    id: arn,
    arn,
    name,
    region,
    launchConfigurationName,
    launchTemplateId: launchTemplate?.LaunchTemplateId || '',
    launchTemplateName: launchTemplate?.LaunchTemplateName || '',
    launchTemplateVersion: launchTemplate?.Version || '',
    mixedInstancesPolicy: {
      launchTemplateId: mixedInstancesPolicy?.LaunchTemplate?.LaunchTemplateSpecification?.LaunchTemplateId || '',
      launchTemplateName: mixedInstancesPolicy?.LaunchTemplate?.LaunchTemplateSpecification?.LaunchTemplateName || '',
      launchTemplateVersion: mixedInstancesPolicy?.LaunchTemplate?.LaunchTemplateSpecification?.Version || '',
      launchTemplateOverrides: launchTemplateOverrideList,
      instDistrOnDemandAllocationStrategy: mixedInstancesPolicy?.InstancesDistribution?.OnDemandAllocationStrategy || '',
      instDistrOnDemandBaseCapacity: mixedInstancesPolicy?.InstancesDistribution?.OnDemandBaseCapacity || 0,
      instDistrOnDemandPercentageAboveBaseCapacity: mixedInstancesPolicy?.InstancesDistribution?.OnDemandPercentageAboveBaseCapacity || 0,
      instDistrSpotAllocationStrategy: mixedInstancesPolicy?.InstancesDistribution?.SpotAllocationStrategy || '',
      instDistrSpotInstancePools: mixedInstancesPolicy?.InstancesDistribution?.SpotInstancePools || 0,
      instDistrSpotMaxPrice: mixedInstancesPolicy?.InstancesDistribution?.SpotMaxPrice || '',
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
    // TODO do we need instance[] here?
    ec2InstanceIds,
    suspendedProcesses: suspendedProcessList,
    placementGroup: placementGroup || '',
    vpcZoneIdentifier,
    enabledMetrics: enabledMetricsList,
    status: status || '',
    terminationPolicies,
    newInstancesProtectedFromScaleIn: newInstancesProtectedFromScaleIn ? t.yes : t.no,
    serviceLinkedRoleARN,
    maxInstanceLifetime: maxInstanceLifetime || 0,
    capacityRebalanceEnabled: capacityRebalanceEnabled ? t.yes : t.no,
    warmPoolConfigMaxGroupPreparedCapacity: warmPoolConfiguration?.MaxGroupPreparedCapacity || 0,
    warmPoolConfigMinSize: warmPoolConfiguration?.MinSize || 0,
    warmPoolConfigPoolState: warmPoolConfiguration?.PoolState || '',
    warmPoolConfigStatus: warmPoolConfiguration?.Status || '',
    warmPoolSize: warmPoolSize || 0,
    context: context || '',
    tags: formatTagsFromMap(tags),
  }
  
  return asg
}
