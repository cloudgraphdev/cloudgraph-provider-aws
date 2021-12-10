import { ServiceConnection } from '@cloudgraph/sdk'

import { VpnConnection, TagList } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'
import { RawAwsTransitGateway } from '../transitGateway/data'
// import { RawAwsCustomerGateway } from '../customerGateway/data'

/**
 * Vpn Connection
 */

export default ({
  service: vpn,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: VpnConnection & {
    Tags?: TagList
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    VpnConnectionId: id,
    TransitGatewayId: transitGatewayId,
    // CustomerGatewayId: customerGatewayId
  } = vpn

  /**
   * Find Transit Gateway
   * related to this Vpn Connection
   */
  const transitGateways: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.transitGateway)

  if (transitGateways?.data?.[region]) {
    const awsTransitGateways: RawAwsTransitGateway[] = transitGateways.data[
      region
    ].filter(
      ({ TransitGatewayId }: RawAwsTransitGateway) =>
        TransitGatewayId === transitGatewayId
    )

    if (awsTransitGateways) {
      for (const transitGateway of awsTransitGateways) {
        connections.push({
          id: transitGateway.TransitGatewayId,
          resourceType: services.transitGateway,
          relation: 'child',
          field: 'transitGateway',
        })
      }
    }
  }

  /**
   * Find Customer Gateway
   * related to this Vpn Connection
   */
  // TODO: Uncomment when customerGateway is available
  //   const customerGateways: {
  //     name: string
  //     data: { [property: string]: any[] }
  //   } = data.find(({ name }) => name === services.customerGateway)

  //   if (customerGateways?.data?.[region]) {
  //     const customerGateway: RawAwsCustomerGateway[] = customerGateways.data[region].filter(
  //         ({ CustomerGatewayId }: RawAwsCustomerGateway) =>
  //         CustomerGatewayId === customerGatewayId
  //     )

  //     if (customerGateway) {
  //       connections.push({
  //         id: customerGateway.CustomerGatewayId,
  //         resourceType: services.customerGateway,
  //         relation: 'child',
  //         field: 'customerGateway',
  //       })
  //     }
  //   }

  const vpnConnectionResult = {
    [id]: connections,
  }
  return vpnConnectionResult
}
