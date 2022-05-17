import { kebabCase } from 'lodash'

import { AwsElb } from '../../types/generated'
import t from '../../properties/translations'
import { formatTagsFromMap } from '../../utils/format'
import { elbArn } from '../../utils/generateArns'
import resources from '../../enums/resources'
import { RawAwsElb } from './data'

/**
 * ELB
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsElb
  account: string
  region: string
}): AwsElb => {
  const {
    CanonicalHostedZoneNameID: hostedZone,
    LoadBalancerName: loadBalancerName,
    DNSName: dnsName,
    CreatedTime: createdAt,
    Scheme: scheme,
    VPCId: vpcId,
    Subnets: subnets,
    SecurityGroups: securityGroups = [],
    SourceSecurityGroup: { OwnerAlias: ownerAlias, GroupName: groupName },
    HealthCheck: {
      Target: target,
      Interval: interval,
      Timeout: timeout,
      HealthyThreshold: healthyThreshold,
      UnhealthyThreshold: unhealthyThreshold,
    } = {},
    Attributes: {
      AccessLog: accesslog,
      CrossZoneLoadBalancing: crossZoneLoadBalancing,
      ConnectionSettings: connectionSettings,
      ConnectionDraining: connectionDraining,
    } = {},
    ListenerDescriptions: listenerDescriptions,
    Tags: tags = {},
  } = rawData

  // Format ELB Listeners
  const listeners = listenerDescriptions
    .filter(
      ({ Listener }) =>
        Listener?.Protocol &&
        Listener?.LoadBalancerPort &&
        Listener?.InstanceProtocol &&
        Listener?.LoadBalancerPort
    )
    .map(
      ({
        Listener: {
          Protocol,
          LoadBalancerPort,
          InstanceProtocol,
          InstancePort,
          SSLCertificateId,
        },
      }) => {
        return {
          id: `${loadBalancerName}-${Protocol}-${LoadBalancerPort}-${kebabCase(
            resources.elbListener
          )}`,
          name: `${Protocol}-${LoadBalancerPort} ${t.listener}`,
          loadBalancerPort: LoadBalancerPort,
          loadBalancerProtocol: Protocol,
          instancePort: InstancePort,
          instanceProtocol: InstanceProtocol,
          sslCertificateId: SSLCertificateId,
        }
      }
    )

  // Format ELB Tags
  const elbTags = formatTagsFromMap(tags)
  const arn = elbArn({region, account, name: loadBalancerName})
  const elb = {
    id: arn,
    name: loadBalancerName,
    accountId: account,
    arn,
    region,
    dnsName,
    createdAt: createdAt.toISOString(),
    hostedZone,
    type: t.classic,
    scheme,
    vpcId,
    sourceSecurityGroup: {
      ownerAlias,
      groupName,
    },
    securityGroupsIds: securityGroups,
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
