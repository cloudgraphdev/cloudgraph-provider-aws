import { kebabCase } from 'lodash'

import {
  LoadBalancerAttributes,
  LoadBalancerDescription,
  TagList,
} from 'aws-sdk/clients/elb'

import { AwsElb } from '../../types/generated'
import t from '../../properties/translations'
import format from '../../utils/format'
import resources from '../../enums/resources'

/**
 * ELB
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: LoadBalancerDescription & {
    Tags?: TagList
    Attributes?: LoadBalancerAttributes
  }
  account: string
  region: string
}): AwsElb => {
  const {
    CanonicalHostedZoneNameID: hostedZone,
    LoadBalancerName: loadBalancerName,
    DNSName: dnsName,
    CreatedTime: createdAt,
    Scheme: scheme,
    VPCId: vpc,
    Subnets: subnets,
    SecurityGroups: securityGroups,
    SourceSecurityGroup: { OwnerAlias: ownerAlias, GroupName: groupName },
    HealthCheck: {
      Target: target,
      Interval: interval,
      Timeout: timeout,
      HealthyThreshold: healthyThreshold,
      UnhealthyThreshold: unhealthyThreshold,
    },
    Attributes: {
      AccessLog: accesslog,
      CrossZoneLoadBalancing: crossZoneLoadBalancing,
      ConnectionSettings: connectionSettings,
      ConnectionDraining: connectionDraining,
    },
    ListenerDescriptions: listenerDescriptions,
    Instances: instances = [],
    Tags: tags,
  } = rawData

  // Format ELB Listeners
  const listeners = listenerDescriptions.map(({ Listener }) => {
    return {
      id: `${loadBalancerName}-${Listener?.Protocol}-${
        Listener?.LoadBalancerPort
      }-${kebabCase(resources.elbListener)}`,
      name: `${Listener?.Protocol}-${Listener?.LoadBalancerPort} ${t.listener}`,
      loadBalancerPort: Listener?.LoadBalancerPort,
      loadBalancerProtocol: Listener?.Protocol,
      instancePort: Listener?.InstancePort,
      instanceProtocol: Listener?.InstanceProtocol,
    }
  })

  // Format ELB Tags
  const elbTags = format.tags(tags as { Key: string; Value: string }[])

  // Format Instances Ids
  const instancesIds = instances.map(({ InstanceId }) => InstanceId)

  const elb = {
    id: dnsName,
    arn: `arn:aws:elasticloadbalancing:${region}:${account}:loadbalancer/${loadBalancerName}`,
    dnsName,
    createdAt: createdAt.toISOString(),
    hostedZone,
    type: t.classic,
    // status: `${inServiceCount}/${instanceData.length} ${t.inServiceText}`, TODO: Can't be calculated without EC2 instances data
    scheme,
    vpc,
    sourceSecurityGroup: {
      ownerAlias,
      groupName,
    },
    securityGroups,
    subnets,
    accessLogs: accesslog?.Enabled ? t.enabled : t.disabled,
    crossZoneLoadBalancing: crossZoneLoadBalancing?.Enabled
      ? t.enabled
      : t.disabled,
    idleTimeout: `${connectionSettings?.IdleTimeout || 0} ${t.seconds}`,
    instances: {
      connectionDraining: connectionDraining?.Enabled ? t.enabled : t.disabled,
      connectionDrainingTimeout: `${connectionDraining?.Timeout || 0} ${
        t.seconds
      }`,
      instancesIds,
    },
    healthCheck: {
      target,
      interval: `${interval} ${t.seconds}`,
      timeout: `${timeout} ${t.seconds}`,
      healthyThreshold,
      unhealthyThreshold,
    },
    listeners,
    tags: elbTags,
  }
  return elb
}
