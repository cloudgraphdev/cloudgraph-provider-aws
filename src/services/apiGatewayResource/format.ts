import { RawAwsApiGatewayResource } from './data'
import { AwsApiGatewayResource as AwsAGResourceType } from '../../types/generated'
import {
  apiGatewayArn,
  apiGatewayResourceArn,
  apiGatewayMethodArn,
} from '../../utils/generateArns'

export default ({
  service,
  region,
  account: accountId,
}: {
  service: RawAwsApiGatewayResource
  region: string
  account: string
}): AwsAGResourceType => {
  const { id, path, restApiId, resourceMethods = {} } = service

  const arn = apiGatewayResourceArn({
    restApiArn: apiGatewayArn({ region: service.region }),
    id,
  })

  const methods = Object.values(resourceMethods).map(
    ({ httpMethod, authorizationType, apiKeyRequired }) => ({
      accountId,
      arn: apiGatewayMethodArn({ resourceArn: arn, httpMethod }),
      httpMethod,
      authorization: authorizationType,
      apiKeyRequired,
    })
  )

  return {
    id,
    accountId,
    arn,
    region,
    path,
    methods,
    restApiId
  }
}
