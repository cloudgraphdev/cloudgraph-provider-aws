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
  account: accountId,
}: 
{
  service: AwsApiGatewayResource
  account: string
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
    accountId,
    arn: apiGatewayMethodArn({ resourceArn: arn, httpMethod }),
    httpMethod,
    authorization: authorizationType,
    apiKeyRequired,
  }))

  return {
    id,
    accountId,
    arn,
    path,
    methods,
  }
}
