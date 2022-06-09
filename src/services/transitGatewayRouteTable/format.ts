import { generateUniqueId } from '@cloudgraph/sdk'

import { formatTagsFromMap } from '../../utils/format'
import { RawAwsTransitGatewayRouteTable } from './data'
import { AwsTransitGatewayRouteTable } from '../../types/generated'
import { transitGatewayRouteTableArn } from '../../utils/generateArns'

/**
 * Transit Gateway Route Table
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsTransitGatewayRouteTable
  account: string
  region: string
}): AwsTransitGatewayRouteTable => {
  const {
    TransitGatewayRouteTableId: id,
    State: state,
    DefaultAssociationRouteTable: defaultAssociationRouteTable,
    DefaultPropagationRouteTable: defaultPropagationRouteTable,
    CreationTime: creationTime,
    TransitGatewayId: transitGatewayId,
    Tags: tags,
    Routes: routes = [],
  } = rawData

  const arn = transitGatewayRouteTableArn({ region, account, id })

  const transitGatewayRouteTable = {
    id,
    accountId: account,
    arn,
    region,
    state,
    defaultAssociationRouteTable,
    defaultPropagationRouteTable,
    creationTime: creationTime?.toISOString(),
    transitGatewayId,
    tags: formatTagsFromMap(tags),
    routes:
      routes?.map(r => ({
        id: generateUniqueId({
          arn,
          ...r,
        }),
        destinationCidrBlock: r.DestinationCidrBlock,
        type: r.Type,
        state: r.State,
        prefixListId: r.PrefixListId,
        transitGatewayAttachments:
          r.TransitGatewayAttachments?.map(a => ({
            id: generateUniqueId({
              arn,
              ...a,
            }),
            resourceId: a.ResourceId,
            transitGatewayAttachmentId: a.TransitGatewayAttachmentId,
            resourceType: a.ResourceType,
          })) || [],
      })) || [],
  }

  return transitGatewayRouteTable
}
