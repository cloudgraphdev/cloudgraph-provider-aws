import { formatTagsFromMap } from '../../utils/format'
import { RawAwsVpnGateway } from './data'
import { AwsVpnGateway } from '../../types/generated'

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
    arn: `arn:aws:ec2:${region}:${account}:vpn-gateway/${vpnGatewayId}`,
    region,
    type,
    state,
    amazonSideAsn,
    vpcIds: vpcAttachments.map(({ VpcId }) => VpcId),
    tags: vpnGatewayTags,
  }

  return vpnGateway
}
