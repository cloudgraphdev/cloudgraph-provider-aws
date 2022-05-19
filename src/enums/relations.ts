/**
 * Set relations between services to data sharing
 * The key of the object represents the parent or base service,
 * it might contain a array of dependant or childs that must be executed after the parent
 */
export default {
  apiGatewayRestApi: ['apiGatewayResource', 'apiGatewayStage'],
  route53HostedZone: ['route53Record'],
  emrCluster: ['emrInstance', 'emrStep'],
  ecsService: ['ecsTaskSet', 'ecsTaskDefinition'],
  iamInstanceProfile: ['ec2Instance'],
  apiGatewayDomainName: ['apiGatewayRestApi'],
}
