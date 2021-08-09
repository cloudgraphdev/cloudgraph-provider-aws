import { RestApi } from 'aws-sdk/clients/apigateway'
import { 
  AwsApiGatewayStage, 
  AwsApiGatewayResource, 
  AwsApiGatewayRestApi, 
  Tag,
} from '../../types/generated'
import {
  apiGatewayArn,
  apiGatewayRestApiArn,
} from '../../utils/generateArns'

/**
 * APIGateway
 */
export default ({
  service,
}: 
{
  service: RestApi & { stages: AwsApiGatewayStage[], resources: AwsApiGatewayResource[], region: string, tags?: Tag[] }
}): AwsApiGatewayRestApi => {
  const {
    id,
    name,
    description,
    policy,
    endpointConfiguration,
    apiKeySource,
    createdDate,
    minimumCompressionSize,
    binaryMediaTypes,
    tags,
    stages,
    resources,
  } = service
  const arn = apiGatewayRestApiArn({
    restApiArn: apiGatewayArn({ region: service.region }),
    id,
  })

  return {
    id: name,
    arn,
    description,
    policy,
    endpointConfiguration,
    apiKeySource,
    createdDate: createdDate.toISOString(),
    minimumCompressionSize,
    binaryMediaTypes,
    tags,
    stages,
    resources,
  }
}
