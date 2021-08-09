import { AwsApiGatewayRestApi } from '../../types/generated'
import { toCamel } from '../../utils'
import {
  apiGatewayArn,
  apiGatewayRestApiArn,
} from '../../utils/generateArns'

/**
 * APIGateway
 */
export default ({
  service: rawData,
}: 
{
  service: any
}): AwsApiGatewayRestApi => {
  const apiGateway = toCamel(rawData)
  const { tags } = rawData
  const {id} = apiGateway
  const arn = apiGatewayRestApiArn({
    restApiArn: apiGatewayArn({ region: apiGateway.region }),
    id,
  })
  const {
    name,
    description,
    policy,
    endpointType,
    apiKeySource,
    createdDate,
    minimumCompressionSize,
    binaryMediaTypes,
    stages,
    resources,
  } = apiGateway

  return {
    id: name,
    arn,
    description,
    policy,
    endpointType,
    apiKeySource,
    createdDate,
    minimumCompressionSize,
    binaryMediaTypes,
    tags,
    stages,
    resources,
  }
}
