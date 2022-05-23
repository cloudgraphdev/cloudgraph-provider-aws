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
    Tags: tags,
  } = rawData

  const transitGatewayRouteTable = {
    id,
    accountId: account,
    arn: transitGatewayRouteTableArn({ region, account, id }),
    region,
    state,
    defaultAssociationRouteTable,
    defaultPropagationRouteTable,
    creationTime: creationTime?.toISOString(),
    tags: formatTagsFromMap(tags),
  }

  return transitGatewayRouteTable
}
