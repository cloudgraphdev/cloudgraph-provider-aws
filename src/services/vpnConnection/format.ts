import cuid from 'cuid'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsVpnConnection } from './data'
import { AwsVpnConnection } from '../../types/generated'

/**
 * Vpn Connections
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsVpnConnection
  account: string
  region: string
}): AwsVpnConnection => {
  const {
    Tags: tags,
    VpnConnectionId: id,
    CustomerGatewayId: cgwId,
    Category: category,
    State: state,
    Type: type,
    VpnGatewayId: vpnGatewayId,
    TransitGatewayId: tgwId,
    Options: options,
    Routes: routes,
    VgwTelemetry: vgwTelemetry,
  } = rawData

  const vpnConnectionTags = formatTagsFromMap(tags)

  const vpnOptions = {
    id: cuid(),
    enableAcceleration: options?.EnableAcceleration,
    staticRoutesOnly: options?.StaticRoutesOnly,
    localIpv4NetworkCidr: options?.LocalIpv4NetworkCidr,
    remoteIpv4NetworkCidr: options?.RemoteIpv4NetworkCidr,
    tunnelInsideIpVersion: options?.TunnelInsideIpVersion,
    tunnelOptions: options?.TunnelOptions?.map(
      ({
        OutsideIpAddress: outsideIpAddress,
        TunnelInsideCidr: tunnelInsideCidr,
        PreSharedKey: preSharedKey,
      }) => {
        return {
          id: cuid(),
          outsideIpAddress,
          tunnelInsideCidr,
          preSharedKey,
        }
      }
    ),
  }

  const vpnVgwTelemetry = vgwTelemetry.map(
    ({
      AcceptedRouteCount: acceptedRouteCount,
      LastStatusChange: lastStatusChange,
      CertificateArn: certificateArn,
      OutsideIpAddress: outsideIpAddress,
      Status: status,
      StatusMessage: statusMessage,
    }) => {
      return {
        id: cuid(),
        acceptedRouteCount,
        lastStatusChange: lastStatusChange?.toISOString(),
        certificateArn,
        outsideIpAddress,
        status: status?.toString(),
        statusMessage,
      }
    }
  )

  const vpnRoutes = routes.map(
    ({
      DestinationCidrBlock: destinationCidrBlock,
      Source: source,
      State: routeState,
    }) => {
      return {
        id: cuid(),
        destinationCidrBlock,
        source,
        state: routeState
      }
    }
  )

  const vpnConnection = {
    id,
    arn: `arn:aws:ec2:${region}:${account}:vpn-connection/${id}`,
    tags: vpnConnectionTags,
    category,
    customerGatewayId: cgwId,
    state,
    type,
    vpnGatewayId,
    transitGatewayId: tgwId,
    options: vpnOptions,
    routes: vpnRoutes,
    vgwTelemetry: vpnVgwTelemetry,
  }

  return vpnConnection
}
