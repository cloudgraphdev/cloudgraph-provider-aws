import omit from 'lodash/omit'
import head from 'lodash/head'

import { AwsRouteTable } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { routeTableArn } from '../../utils/generateArns'
import { RawAwsRouteTable } from './data'

/**
 * Route Table
 */
export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsRouteTable
  account: string
  region: string
}): AwsRouteTable => {
  const {
    RouteTableId: id,
    VpcId: vpcId,
    Associations: associations = [],
    Routes: routes = [],
    Tags: tags = {},
  } = rawData

  // Subnet associations ids
  const subnetAssociations = associations
    .filter(({ RouteTableId: rtId, SubnetId }) => rtId === id && SubnetId)
    .map(({ SubnetId }) => SubnetId)

  // Formatted routes
  const formattedRoutes = routes.map(route => ({
    destination:
      route.DestinationCidrBlock ||
      route.DestinationIpv6CidrBlock ||
      route.DestinationPrefixListId,
    target: head(
      Object.values(
        omit(route, [
          'DestinationCidrBlock',
          'DestinationIpv6CidrBlock',
          'DestinationPrefixListId',
          'Origin',
          'State',
        ])
      )
    ),
  }))

  // Format Route Table Tags
  const routeTableTags = formatTagsFromMap(tags)

  const mainRouteTable =
    id === (associations.find(({ Main }) => Main) || {}).RouteTableId

  const routeTable = {
    id,
    accountId: account,
    arn: routeTableArn({ region, account, id }),
    region,
    vpcId,
    routes: formattedRoutes,
    mainRouteTable,
    tags: routeTableTags,
    subnetAssociations,
    explicitlyAssociatedWithSubnets: subnetAssociations.length,
  }
  return routeTable
}
