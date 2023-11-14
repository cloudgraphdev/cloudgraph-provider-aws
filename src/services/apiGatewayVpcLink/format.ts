import { RawAwsApiGatewayVpcLink } from './data'
import { AwsApiGatewayVpcLink } from '../../types/generated'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsApiGatewayVpcLink
  account: string
  region: string
}): AwsApiGatewayVpcLink => {
  const { id, targetArns, name } = service

  return {
    id,
    arn: id,
    accountId,
    region,
    targetArns,
    name,
  }
}
