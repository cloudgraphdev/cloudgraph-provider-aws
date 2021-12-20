import { formatTagsFromMap } from '../../utils/format'
import { RawAwsTransitGatewayAttachment } from './data'
import { AwsTransitGatewayAttachment } from '../../types/generated'
import { transitGatewayAttachmentArn } from '../../utils/generateArns'

/**
 * Transit Gateway Attachment
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsTransitGatewayAttachment
  account: string
  region: string
}): AwsTransitGatewayAttachment => {
  const {
    TransitGatewayAttachmentId: id,
    TransitGatewayId: transitGatewayId,
    TransitGatewayOwnerId: transitGatewayOwnerId,
    ResourceOwnerId: resourceOwnerId,
    ResourceType: resourceType,
    ResourceId: resourceId,
    State: state,
    Association: association,
    CreationTime: creationTime,
    Tags: tags = {},
  } = rawData

  // Transit Gateway Attachment Tags
  const transitGatewayAttachmentTags = formatTagsFromMap(tags)

  const transitGatewayAttachment = {
    id,
    accountId: account,
    arn: transitGatewayAttachmentArn({ region, account, id }),
    region,
    transitGatewayId,
    transitGatewayOwnerId,
    resourceOwnerId,
    resourceType: resourceType || '',
    resourceId,
    state: state || '',
    transitGatewayRouteTableId: association?.TransitGatewayRouteTableId || '',
    creationTime: creationTime?.toISOString() || '',
    tags: transitGatewayAttachmentTags,
  }

  return transitGatewayAttachment
}
