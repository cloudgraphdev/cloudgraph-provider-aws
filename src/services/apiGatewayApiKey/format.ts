import { RawAwsApiGatewayApiKey } from './data'
import { AwsApiGatewayApiKey } from '../../types/generated'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsApiGatewayApiKey
  account: string
  region: string
}): AwsApiGatewayApiKey => {
  const { id, value, name } = service

  return {
    id,
    arn: id,
    accountId,
    region,
    value,
    name,
  }
}
