import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import { TransitGatewayAttachment, TagList } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'
import { RawAwsVpnConnection } from '../vpnConnection/data'
import { RawAwsVpc } from '../vpc/data'
import { RawAwsTransitGateway } from '../transitGateway/data'
import { RawAwsTransitGatewayRouteTable } from '../transitGatewayRouteTable/data'

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
  service: TransitGatewayAttachment & {
    Tags?: TagList
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    TransitGatewayAttachmentId: id,
    TransitGatewayId: transitGatewayId,
    Association: association,
    ResourceId: resourceId,
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
   * Find Transit Gateway Route Table
   * related to this Transit Gateway Attachment
   */
  const routeTables: {
    name: string
    data: { [property: string]: RawAwsTransitGatewayRouteTable[] }
  } = data.find(({ name }) => name === services.transitGatewayRouteTable)

  if (routeTables?.data?.[region]) {
    const associatedRouteTables: RawAwsTransitGatewayRouteTable[] = routeTables.data[
      region
    ].filter(
      ({ TransitGatewayRouteTableId }: RawAwsTransitGatewayRouteTable) =>
      TransitGatewayRouteTableId === association?.TransitGatewayRouteTableId
    )

    if (!isEmpty(associatedRouteTables)) {
      for (const routeTable of associatedRouteTables) {
        connections.push({
          id: routeTable.TransitGatewayRouteTableId,
          resourceType: services.transitGatewayRouteTable,
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

  const transitGatewayAttachmentResult = {
    [id]: connections,
  }
  return transitGatewayAttachmentResult
}
