import { formatTagsFromMap } from '../../utils/format'
import { RawAwsTransitGateway } from './data'
import { AwsTransitGateway } from '../../types/generated'

/**
 * Transit Gateway
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsTransitGateway
  account: string
  region: string
}): AwsTransitGateway => {
  const {
    TransitGatewayId: id,
    TransitGatewayArn: arn,
    OwnerId: ownerId,
    Description: description,
    Options: options,
    Tags: tags,
  } = rawData

  // Transit Gateway Tags
  const transitGatewayTags = formatTagsFromMap(tags)

  const transitGateway = {
    id,
    accountId: account,
    arn,
    region,
    ownerId,
    description,
    dnsSupport: options?.DnsSupport,
    vpnEcmpSupport: options?.VpnEcmpSupport,
    amazonSideAsn: options?.AmazonSideAsn?.toString(),
    autoAcceptSharedAttachments: options?.AutoAcceptSharedAttachments,
    defaultRouteTableAssociation: options?.DefaultRouteTableAssociation,
    defaultRouteTablePropagation: options?.DefaultRouteTablePropagation,
    associationDefaultRouteTableId: options?.AssociationDefaultRouteTableId,
    propagationDefaultRouteTableId: options?.PropagationDefaultRouteTableId,
    tags: transitGatewayTags,
  }

  return transitGateway
}
