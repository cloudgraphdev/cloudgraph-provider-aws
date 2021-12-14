import { formatTagsFromMap } from '../../utils/format'
import { RawAwsCustomerGateway } from './data'
import { AwsCustomerGateway } from '../../types/generated'
import { customerGatewayArn } from '../../utils/generateArns'

/**
 * Customer Gateway
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsCustomerGateway
  account: string
  region: string
}): AwsCustomerGateway => {
  const {
    BgpAsn: bgpAsn,
    CustomerGatewayId: customerGatewayId,
    IpAddress: ipAddress,
    Type: type,
    Tags: tags,
  } = rawData

  // Customer Gateway Tags
  const customerGatewayTags = formatTagsFromMap(tags)

  const customerGateway = {
    id: customerGatewayId,
    accountId: account,
    arn: customerGatewayArn({ region, account, id: customerGatewayId }),
    region,
    type,
    bgpAsn,
    ipAddress,
    tags: customerGatewayTags,
  }

  return customerGateway
}
