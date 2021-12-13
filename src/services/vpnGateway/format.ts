import { formatTagsFromMap } from '../../utils/format'
import { RawAwsVpnGateway } from './data'
import { AwsVpnGateway } from '../../types/generated'
import { vpnGatewayArn } from '../../utils/generateArns'

/**
 * Vpn Gateway
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsVpnGateway
  account: string
  region: string
}): AwsVpnGateway => {
  const {
    State: state,
    Type: type,
    VpcAttachments: vpcAttachments,
    VpnGatewayId: vpnGatewayId,
    AmazonSideAsn: amazonSideAsn,
    Tags: tags,
  } = rawData

  // Vpn Gateway Tags
  const vpnGatewayTags = formatTagsFromMap(tags)

  const vpnGateway = {
    id: vpnGatewayId,
    accountId: account,
    arn: vpnGatewayArn({ region, account, id: vpnGatewayId }),
    region,
    type,
    state,
    amazonSideAsn,
    vpcIds: vpcAttachments.map(({ VpcId }) => VpcId),
    tags: vpnGatewayTags,
  }

  return vpnGateway
}
