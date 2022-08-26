import { generateUniqueId } from '@cloudgraph/sdk'

import { formatTagsFromMap } from '../../utils/format'
import { RawAwsVpnConnection } from './data'
import { AwsVpnConnection } from '../../types/generated'
import { vpnConnectionArn } from '../../utils/generateArns'

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
  const arn = vpnConnectionArn({ region, account, id })

  const vpnOptions = {
    id: generateUniqueId({
      arn,
      ...options,
    }),
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
          id: generateUniqueId({
            arn,
            outsideIpAddress,
            tunnelInsideCidr,
            preSharedKey,
          }),
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
        id: generateUniqueId({
          arn,
          acceptedRouteCount,
          lastStatusChange,
          certificateArn,
          outsideIpAddress,
          status,
          statusMessage,
        }),
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
        id: generateUniqueId({
          arn,
          destinationCidrBlock,
          source,
          routeState,
        }),
        destinationCidrBlock,
        source,
        state: routeState,
      }
    }
  )

  const vpnConnection = {
    id,
    accountId: account,
    arn,
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
