import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsEfsMountTarget } from './data'
import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsVpc } from '../vpc/data'
import { RawNetworkInterface } from '../networkInterface/data'

export default ({
  account,
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsEfsMountTarget
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { MountTargetId: id, NetworkInterfaceId: networkInterfaceId, SubnetId: subnetId, VpcId: vpcId } = service
  const connections: ServiceConnection[] = []

  /**
   * Find Network Interfaces
   */
  const netInterfaces: {
    name: string
    data: { [property: string]: RawNetworkInterface[] }
  } = data.find(({ name }) => name === services.networkInterface)
  if (netInterfaces?.data?.[region]) {
    const connectedNatInterfaces: RawNetworkInterface[] = netInterfaces.data[
      region
    ].filter(
      ({ NetworkInterfaceId }: RawNetworkInterface) => NetworkInterfaceId === networkInterfaceId
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
   * Find Subnets
   */
  const subnets: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId }: RawAwsSubnet) => SubnetId === subnetId
    )

    if (!isEmpty(subnetsInRegion)) {
      for (const subnet of subnetsInRegion) {
        connections.push({
          id: subnet.SubnetId,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnet',
        })
      }
    }
  }

  /**
   * Find VPCs
   */
  const vpcs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.vpc)
  
  if (vpcs?.data?.[region]) {
    const vpc = vpcs.data[region].find(
      ({ VpcId }: RawAwsVpc) => VpcId === vpcId
    )

    if (vpc) {
      connections.push({
        id: vpc.VpcId,
        resourceType: services.vpc,
        relation: 'child',
        field: 'vpc',
      })
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
