export const apiGatewayArn = ({ region }) => `arn:aws:apigateway:${region}::`
export const apiGatewayRestApiArn = ({ restApiArn, id }) =>
  `${restApiArn}/restapis/${id}`
export const apiGatewayStageArn = ({ restApiArn, name }) =>
  `${restApiArn}/stages/${name}`
export const apiGatewayResourceArn = ({ restApiArn, id }) =>
  `${restApiArn}/resources/${id}`
export const apiGatewayMethodArn = ({ resourceArn, httpMethod }) =>
  `${resourceArn}/methods/${httpMethod}`