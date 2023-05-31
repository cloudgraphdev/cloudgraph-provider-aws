import { RawAwsApiGatewayUsagePlan } from './data'
import { AwsApiGatewayUsagePlan } from '../../types/generated'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsApiGatewayUsagePlan
  account: string
  region: string
}): AwsApiGatewayUsagePlan => {
  const { id, name } = service

  return {
    id,
    arn: id,
    accountId,
    region,
    name,
  }
}
