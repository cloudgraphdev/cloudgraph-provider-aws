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
export const route53RecordArn = ({
  hostedZoneId,
  id,
}: {
  hostedZoneId: string
  id: string
}): string => `arn:aws:route53:::hostedzone/${hostedZoneId}/recordset/${id}`
