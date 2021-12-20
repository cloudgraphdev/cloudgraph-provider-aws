import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import { TransitGateway, TagList } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'
import { RawAwsRouteTable } from '../routeTable/data'

/**
 * Transit Gateway
 */

export default ({
  service: transitGateway,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: TransitGateway & {
    Tags?: TagList
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { TransitGatewayId: id, Options: options } = transitGateway

  /**
   * Find Route Tables
   * related to this Transit Gateway
   */
  const routeTables: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.routeTable)

  if (routeTables?.data?.[region]) {
    const associatedRouteTables: RawAwsRouteTable[] = routeTables.data[
      region
    ].filter(
      ({ RouteTableId }: RawAwsRouteTable) =>
        RouteTableId === options?.AssociationDefaultRouteTableId ||
        RouteTableId === options?.PropagationDefaultRouteTableId
    )

    if (!isEmpty(associatedRouteTables)) {
      for (const routeTable of associatedRouteTables) {
        connections.push({
          id: routeTable.RouteTableId,
          resourceType: services.routeTable,
          relation: 'child',
          field: 'routeTable',
        })
      }
    }
  }

  const transitGatewayResult = {
    [id]: connections,
  }
  return transitGatewayResult
}
