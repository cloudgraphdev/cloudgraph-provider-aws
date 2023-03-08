export const apiGatewayArn = ({ region }) => `arn:aws:apigateway:${region}::`
export const apiGatewayRestApiArn = ({ restApiArn, id }) =>
  `${restApiArn}/restapis/${id}`
export const apiGatewayStageArn = ({ restApiArn, name }) =>
  `${restApiArn}/stages/${name}`
export const apiGatewayResourceArn = ({ restApiArn, id }) =>
  `${restApiArn}/resources/${id}`
export const apiGatewayMethodArn = ({ resourceArn, httpMethod }) =>
  `${resourceArn}/methods/${httpMethod}`
export const route53HostedZoneArn = ({ id }: { id: string }): string =>
  `arn:aws:route53:::hostedzone/${id}`

export const routeTableArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:route-table/${id}`
export const s3BucketArn = ({ name }: { name: string }): string =>
  `arn:aws:s3:::${name}`

export const natGatewayArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:natgateway/${id}`

export const networkAclArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:network-acl/${id}`

export const sesArn = ({
  region,
  account,
  email,
}: {
  region: string
  account: string
  email: string
}): string => `arn:aws:ses:${region}:${account}:identity/${email}`

export const redshiftArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:redshift:${region}:${account}:cluster:${id}`

export const kmsArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:kms:${region}:${account}:key/${id}`

export const ecsContainerArn = ({
  region,
  account,
  name,
}: {
  region: string
  account: string
  name: string
}): string => `arn:aws:ecs:${region}:${account}:container-definition/${name}`

export const customerGatewayArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:customergateway/${id}`

export const vpnGatewayArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:vpngateway/${id}`

export const ebsVolumeArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:volume/${id}`

export const ebsSnapshotArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:snapshot/${id}`

export const ec2InstanceArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:instance/${id}`

export const eipAllocationArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:eip-allocation/${id}`

export const elbArn = ({
  region,
  account,
  name,
}: {
  region: string
  account: string
  name: string
}): string =>
  `arn:aws:elasticloadbalancing:${region}:${account}:loadbalancer/${name}`

export const igwArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:internet-gateway/${id}`

export const networkInterfaceArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:network-interface/${id}`

export const securityGroupArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:security-group/${id}`

export const vpcArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:vpc/${id}`

export const clientVpnEndpointArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:clientvpnendpoint/${id}`

export const vpnConnectionArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:vpn-connection/${id}`

export const transitGatewayAttachmentArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string =>
  `arn:aws:ec2:${region}:${account}:transit-gateway-attachment/${id}`

export const configurationRecorderArn = ({
  region,
  account,
  name,
}: {
  region: string
  account: string
  name: string
}): string => `arn:aws:ec2:${region}:${account}:configuration-recorder/${name}`

export const athenaDataCatalogArn = ({
  region,
  account,
  name,
}: {
  region: string
  account: string
  name: string
}): string => `arn:aws:athena:${region}:${account}:datacatalog/${name}`

export const glueJobArn = ({
  region,
  account,
  name,
}: {
  region: string
  account: string
  name: string
}): string => `arn:aws:glue:${region}:${account}:job/${name}`

export const ssmManagedInstanceArn = ({
  region,
  account,
  name,
}: {
  region: string
  account: string
  name: string
}): string => `arn:aws:ssm:${region}:${account}:managed-instance/${name}`

export const ssmDocumentArn = ({
  region,
  account,
  name,
}: {
  region: string
  account: string
  name: string
}): string => `arn:aws:ssm:${region}:${account}:document/${name}`

export const cognitoIdentityPoolArn = ({
  region,
  account,
  identityPoolId,
}: {
  region: string
  account: string
  identityPoolId: string
}): string =>
  `arn:aws:cognito-identity:${region}:${account}:identitypool/${identityPoolId}`

export const flowLogsArn = ({
  region,
  account,
  flowLogId,
}: {
  region: string
  account: string
  flowLogId: string
}): string => `arn:aws:ec2:${region}:${account}:vpc-flow-log/${flowLogId}`

export const guardDutyArn = ({
  region,
  account,
  detectorId,
}: {
  region: string
  account: string
  detectorId: string
}): string => `arn:aws:guardduty:${region}:${account}:detector/${detectorId}`

export const vpcEndpointArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:vpcendpoint/${id}`

export const domainNameArn = ({
  region,
  account,
  name,
}: {
  region: string
  account: string
  name: string
}): string =>
  `arn:aws:apigategay:${region}:${account}:domainname/${name}`

export const vpcPeeringConnectionArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:vpc-peering-connection/${id}`

export const transitGatewayRouteTableArn = ({
  region,
  account,
  id,
}: {
  region: string
  account: string
  id: string
}): string => `arn:aws:ec2:${region}:${account}:transit-gateway-routetable/${id}`