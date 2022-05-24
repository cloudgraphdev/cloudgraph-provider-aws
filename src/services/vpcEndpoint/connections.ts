import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsVpcEndpoint } from './data'
import { RawAwsVpc } from '../vpc/data'
import { RawAwsRouteTable } from '../routeTable/data'
import { RawAwsSubnet } from '../subnet/data'
import { AwsSecurityGroup } from '../securityGroup/data'
import { RawNetworkInterface } from '../networkInterface/data'

/**
 * Vpc Endpoint
 */

export default ({
  service: vpcEndpoint,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsVpcEndpoint
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    VpcEndpointId: id,
    VpcId: vpcId,
    RouteTableIds: routeTableIds,
    SubnetIds: subnetIds,
    Groups: groups,
    NetworkInterfaceIds: networkInterfaceIds,
  } = vpcEndpoint

  /**
   * Find VPC
   * related to this Vpc Endpoint
   */
  const vpcs: {
    name: string
    data: { [property: string]: RawAwsVpc[] }
  } = data.find(({ name }) => name === services.vpc)

  if (vpcs?.data?.[region]) {
    const vpcsInRegion: RawAwsVpc[] = vpcs.data[region].filter(
      ({ VpcId }: RawAwsVpc) => VpcId === vpcId
    )
    if (!isEmpty(vpcsInRegion)) {
      for (const vpc of vpcsInRegion) {
        const { VpcId }: RawAwsVpc = vpc
        connections.push({
          id: VpcId,
          resourceType: services.vpc,
          relation: 'child',
          field: 'vpc',
        })
      }
    }
  }

  /**
   * Find Route Tables
   * related to this Vpc Endpoint
   */
  const routeTables: {
    name: string
    data: { [property: string]: RawAwsRouteTable[] }
  } = data.find(({ name }) => name === services.routeTable)

  if (routeTables?.data?.[region] && routeTableIds?.length > 0) {
    const routeTablesRegion: RawAwsRouteTable[] = routeTables.data[
      region
    ].filter(({ RouteTableId }: RawAwsRouteTable) =>
      routeTableIds.includes(RouteTableId)
    )

    if (!isEmpty(routeTablesRegion)) {
      for (const routeTable of routeTablesRegion) {
        const { RouteTableId }: RawAwsRouteTable = routeTable
        connections.push({
          id: RouteTableId,
          resourceType: services.routeTable,
          relation: 'child',
          field: 'routeTables',
        })
      }
    }
  }

  /**
   * Find Subnets
   * related to this Vpc Endpoint
   */
  const subnets: {
    name: string
    data: { [property: string]: RawAwsSubnet[] }
  } = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region] && subnetIds?.length > 0) {
    const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId }: RawAwsSubnet) => subnetIds.includes(SubnetId)
    )
    if (!isEmpty(subnetsInRegion)) {
      for (const subnet of subnetsInRegion) {
        const { SubnetId }: RawAwsSubnet = subnet
        connections.push({
          id: SubnetId,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnets',
        })
      }
    }
  }

  /**
   * Find Security Groups
   * related to this Vpc Endpoint
   */
  const securityGroups: {
    name: string
    data: { [property: string]: AwsSecurityGroup[] }
  } = data.find(({ name }) => name === services.sg)

  const sgIds = groups?.map(({ GroupId }: AwsSecurityGroup) => GroupId) || []

  if (securityGroups?.data?.[region] && sgIds?.length > 0) {
    const sgsInRegion: AwsSecurityGroup[] = securityGroups.data[region].filter(
      ({ GroupId }: AwsSecurityGroup) => sgIds.includes(GroupId)
    )

    if (!isEmpty(sgsInRegion)) {
      for (const sg of sgsInRegion) {
        const { GroupId }: AwsSecurityGroup = sg
        connections.push({
          id: GroupId,
          resourceType: services.sg,
          relation: 'child',
          field: 'securityGroups',
        })
      }
    }
  }

  /**
   * Find Network Interfaces
   * related to this Vpc Endpoint
   */
  const netInterfaces = data.find(
    ({ name }) => name === services.networkInterface
  )
  if (netInterfaces?.data?.[region] && networkInterfaceIds?.length > 0) {
    const dataAtRegion: RawNetworkInterface[] = netInterfaces.data[
      region
    ].filter(({ NetworkInterfaceId }: RawNetworkInterface) =>
      networkInterfaceIds.includes(NetworkInterfaceId)
    )
    for (const net of dataAtRegion) {
      const { NetworkInterfaceId }: RawNetworkInterface = net
      connections.push({
        id: NetworkInterfaceId,
        resourceType: services.networkInterface,
        relation: 'child',
        field: 'networkInterfaces',
      })
    }
  }

  const vpnGatewayResult = {
    [id]: connections,
  }
  return vpnGatewayResult
}
