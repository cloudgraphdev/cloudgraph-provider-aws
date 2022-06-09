import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsTransitGatewayRouteTable } from './data'
import { RawAwsTransitGateway } from '../transitGateway/data'

/**
 * Transit Gateway Route Table
 */

export default ({
  service: transitGatewayRouteTable,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsTransitGatewayRouteTable
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { TransitGatewayRouteTableId: id, TransitGatewayId: transitGatewayId } =
    transitGatewayRouteTable

  /**
   * Find Transit Gateway
   * related to this Transit Gateway Route Table
   */
  const transitGateways: {
    name: string
    data: { [property: string]: RawAwsTransitGateway[] }
  } = data.find(({ name }) => name === services.transitGateway)

  if (transitGateways?.data?.[region]) {
    const awsTransitGateways: RawAwsTransitGateway[] = transitGateways.data[
      region
    ].filter(
      ({ TransitGatewayId }: RawAwsTransitGateway) =>
        TransitGatewayId === transitGatewayId
    )

    if (!isEmpty(awsTransitGateways)) {
      for (const transitGateway of awsTransitGateways) {
        const { TransitGatewayId }: RawAwsTransitGateway = transitGateway
        connections.push({
          id: TransitGatewayId,
          resourceType: services.transitGateway,
          relation: 'child',
          field: 'transitGateway',
        })
      }
    }
  }

  const transitGatewayRouteTableResult = {
    [id]: connections,
  }
  return transitGatewayRouteTableResult
}
