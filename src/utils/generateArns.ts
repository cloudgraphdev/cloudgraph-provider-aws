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
}) : string => `arn:aws:kms:${region}:${account}:key/${id}`

export const ecsContainerArn = ({
  region,
  account,
  name,
}: {
  region: string
  account: string
  name: string
}): string => `arn:aws:ecs:${region}:${account}:container-definition/${name}`
