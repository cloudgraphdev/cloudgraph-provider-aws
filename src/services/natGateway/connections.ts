import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'

import {
  NatGateway,
  NetworkInterface,
} from 'aws-sdk/clients/ec2'

import services from '../../enums/services'

export default ({
  service: natGw,
  data,
  region,
}: {
  service: NatGateway
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { NatGatewayId, NatGatewayAddresses } = natGw
  const connections: ServiceConnection[] = []
  /**
   * Find Network Interfaces used in NatGW
   */
  const netInterfaces: {
    name: string
    data: { [property: string]: NetworkInterface[] }
  } = data.find(({ name }) => name === services.networkInterface)
  if (netInterfaces?.data?.[region]) {
    const connectedNatInterfaces: NetworkInterface[] = netInterfaces.data[
      region
    ].filter(
      ({ NetworkInterfaceId: targetNetworkInterfaceId }: NetworkInterface) =>
        !!NatGatewayAddresses.find(
          ({ NetworkInterfaceId }) =>
            NetworkInterfaceId === targetNetworkInterfaceId
        )
    )
    if (!isEmpty(connectedNatInterfaces)) {
      for (const netInterface of connectedNatInterfaces) {
        const { NetworkInterfaceId: id } = netInterface
        connections.push({
          id,
          resourceType: services.networkInterface,
          relation: 'child',
          field: 'networkInterface',
        })
      }
    }
  }

  const natResult = {
    [NatGatewayId]: connections,
  }
  return natResult
}
