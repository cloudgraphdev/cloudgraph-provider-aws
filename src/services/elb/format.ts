import { AwsEip } from '../../types/generated'
// import t from '../../properties/translations'

/**
 * ELB
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: any
  account: string
  region: string
}): AwsEip => {
  // const {
  //   allocationId: id,
  //   associationId: ec2InstanceAssociationId,
  //   customerOwnedIp,
  //   customerOwnedIpv4Pool,
  //   domain,
  //   instanceId,
  //   networkBorderGroup,
  //   networkInterface,
  //   networkInterfaceOwnerId,
  //   privateIpAddress: privateIp,
  //   publicIp,
  //   publicIpv4Pool,
  //   tags,
  // } = toCamel(rawData)
  const elb = {
    id: 'id',
    arn: `arn:aws:elasticloadbalancing:${region}:${account}:loadbalancer/${'loadBalancerName'}`,
    // createdAt,
    // dnsName,
    // hostedZone,
    // type: t.classic,
    // status: `${inServiceCount}/${instanceData.length} ${t.inServiceText}`,
    // scheme,
    // vpc: vpcId,
    // sourceSecurityGroup,
    // securityGroups,
    // subnets,
    // accessLogs: accesslog?.enabled ? t.enabled : t.disabled,
    // crossZoneLoadBalancing: crossZoneLoadBalancing.enabled
    //   ? t.enabled
    //   : t.disabled,
    // idleTimeout: `${connectionSettings?.idleTimeout || 0} ${t.seconds}`,
    // instances: {
    //   connectionDraining: connectionDraining?.enabled
    //     ? t.enabled
    //     : t.disabled,
    //   connectionDrainingTimeout: `${connectionDraining?.timeout || 0} ${
    //     t.seconds
    //   }`,
    //   instanceData,
    // },
    // healthCheck: {
    //   target,
    //   interval: `${interval} ${t.seconds}`,
    //   timeout: `${timeout} ${t.seconds}`,
    //   healthyThreshold,
    //   unhealthyThreshold,
    // },
    // tags,
  }
  return elb
}
