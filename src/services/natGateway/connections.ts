import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'

import { NatGateway, NetworkInterface } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'

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
  const { NatGatewayId, NatGatewayAddresses, SubnetId } = natGw
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
  /**
   * Find Subnets used in NatGW
   */
  const subnets: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId: sId }: RawAwsSubnet) => sId === SubnetId
    )
    if (!isEmpty(subnetsInRegion)) {
      for (const subnet of subnetsInRegion) {
        const { SubnetId: id } = subnet
        connections.push({
          id,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnet',
        })
      }
    }
  }

  const natResult = {
    [NatGatewayId]: connections,
  }
  return natResult
}
