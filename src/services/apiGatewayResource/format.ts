import { AwsApiGatewayResource } from './data'
import { 
  AwsApiGatewayResource as AwsAGResourceType, 
} from '../../types/generated'
import {
  apiGatewayArn,
  apiGatewayResourceArn,
  apiGatewayMethodArn,
} from '../../utils/generateArns'

export default ({
  service,
}: 
{
  service: AwsApiGatewayResource
}): AwsAGResourceType => {
  const {
    id,
    path,
    resourceMethods = {},
  } = service
  
  const arn = apiGatewayResourceArn({
    restApiArn: apiGatewayArn({ region: service.region }),
    id,
  })

  const methods = Object.values(resourceMethods).map(({ httpMethod, authorizationType, apiKeyRequired }) => ({
    arn: apiGatewayMethodArn({ resourceArn: arn, httpMethod }),
    httpMethod,
    authorization: authorizationType,
    apiKeyRequired,
  }))

  return {
    id,
    arn,
    path,
    methods,
  }
}
