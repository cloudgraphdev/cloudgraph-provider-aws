export const apiGatewayArn = ({ region }) => `arn:aws:apigateway:${region}::`
export const apiGatewayRestApiArn = ({ restApiArn, id }) =>
  `${restApiArn}/restapis/${id}`
export const apiGatewayStageArn = ({ restApiArn, name }) =>
  `${restApiArn}/stages/${name}`