import { RawAwsApiGatewayRestApi } from './data'
import { AwsApiGatewayRestApi as AwsAGRestApiType } from '../../types/generated'
import { apiGatewayArn, apiGatewayRestApiArn } from '../../utils/generateArns'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsApiGatewayRestApi
  account: string
  region: string
}): AwsAGRestApiType => {
  const {
    id,
    description,
    policy,
    endpointConfiguration,
    apiKeySource,
    createdDate,
    minimumCompressionSize,
    binaryMediaTypes,
    tags = {},
  } = service
  const arn = apiGatewayRestApiArn({
    restApiArn: apiGatewayArn({ region: service.region }),
    id,
  })

  return {
    id,
    accountId,
    arn,
    region,
    description,
    rawPolicy: policy,
    policy: formatIamJsonPolicy(policy),
    endpointConfiguration,
    apiKeySource,
    createdDate: createdDate.toISOString(),
    minimumCompressionSize,
    binaryMediaTypes,
    tags: formatTagsFromMap(tags),
  }
}
