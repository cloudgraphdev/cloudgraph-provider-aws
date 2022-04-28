import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsVpnConnection } from '../vpnConnection/data'
import { RawAwsVpc } from '../vpc/data'
import { RawAwsTransitGateway } from '../transitGateway/data'
import { RawAwsTransitGatewayAttachment } from '../transitGatewayAttachment/data'
import { RawAwsRouteTable } from '../routeTable/data'
import { RawAwsSubnet } from '../subnet/data'

/**
 * Transit Gateway Attachment
 */

export default ({
  service: transitGatewayAttachment,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsTransitGatewayAttachment
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    TransitGatewayAttachmentId: id,
    TransitGatewayId: transitGatewayId,
    Association: association,
    ResourceId: resourceId,
    SubnetIds: subnetIds,
  } = transitGatewayAttachment

  /**
   * Find Transit Gateway
   * related to this Transit Gateway Attachment
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

    if (!isEmpty(awsTransitGateways)) {
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
   * Find Route Tables
   * related to this Transit Gateway Attachment
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
        RouteTableId === association?.TransitGatewayRouteTableId
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

  /**
   * Find VPCs
   * related to this Transit Gateway Attachment
   */
  const vpcs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.vpc)

  if (vpcs?.data?.[region]) {
    const associatedVPCs: RawAwsVpc[] = vpcs.data[region].filter(
      ({ VpcId }: RawAwsVpc) => VpcId === resourceId
    )

    if (!isEmpty(associatedVPCs)) {
      for (const vpc of associatedVPCs) {
        connections.push({
          id: vpc.VpcId,
          resourceType: services.vpc,
          relation: 'child',
          field: 'vpc',
        })
      }
    }
  }

  /**
   * Find Vpn Connections
   * related to this Transit Gateway Attachment
   */
  const vpnConnections: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.vpnConnection)

  if (vpnConnections?.data?.[region]) {
    const associatedVpnConnections: RawAwsVpnConnection[] = vpnConnections.data[
      region
    ].filter(
      ({ VpnConnectionId }: RawAwsVpnConnection) =>
        VpnConnectionId === resourceId
    )

    if (!isEmpty(associatedVpnConnections)) {
      for (const vpnConnection of associatedVpnConnections) {
        connections.push({
          id: vpnConnection.VpnConnectionId,
          resourceType: services.vpnConnection,
          relation: 'child',
          field: 'vpnConnection',
        })
      }
    }
  }

  /**
   * Find Subnets
   * related to this Transit Gateway Attachment
   */
  const subnets = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion = subnets.data[region].filter(
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

  const transitGatewayAttachmentResult = {
    [id]: connections,
  }
  return transitGatewayAttachmentResult
}
