import { AwsNatGateway } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { natGatewayArn } from '../../utils/generateArns'
import { RawAwsNATGateway } from './data'

/**
 * NAT Gateway
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsNATGateway
  account: string
  region: string
}) : AwsNatGateway => {
  const {
    NatGatewayId: id,
    State: state,
    CreateTime: createTime,
    Tags
  } = rawData

  return {
    id,
    tags: formatTagsFromMap(Tags),
    accountId: account,
    arn: natGatewayArn({ region, account, id }),
    state,
    createTime: createTime.toUTCString(),
  }
}
