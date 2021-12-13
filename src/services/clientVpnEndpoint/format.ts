import { formatTagsFromMap } from '../../utils/format'
import { RawAwsClientVpnEndpoint } from './data'
import { AwsClientVpnEndpoint } from '../../types/generated'

/**
 * Transit Gateway
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsClientVpnEndpoint
  account: string
  region: string
}): AwsClientVpnEndpoint => {
  const {
    Tags: tags = {},
    ClientVpnEndpointId: id,
    Description: description,
    Status: { Code: status = '' } = {},
    CreationTime: creationTime,
    DeletionTime: deletionTime,
    DnsName: dnsName,
    ClientCidrBlock: clientCidrBlock,
    DnsServers: dnsServers,
    SplitTunnel: splitTunnel,
    VpnProtocol: vpnProtocol,
    TransportProtocol: transportProtocol,
    VpnPort: vpnPort,
    AssociatedTargetNetworks: associatedTargetNetworks,
    ServerCertificateArn: serverCertificateArn,
    AuthenticationOptions: authenticationOptions,
    ConnectionLogOptions: connectionLogOptions,
    SecurityGroupIds: securityGroupIds,
  } = rawData

  // Client Vpn Endpoint Tags
  const clientVpnEndpointTags = formatTagsFromMap(tags)

  const clientVpnEndpoint = {
    id,
    accountId: account,
    arn: `arn:aws:ec2:${region}:${account}:clientvpnendpoint/${id}`,
    region,
    status,
    creationTime,
    description,
    deletionTime,
    dnsName,
    clientCidrBlock,
    dnsServers,
    splitTunnel,
    vpnProtocol,
    transportProtocol,
    vpnPort,
    associatedTargetNetworks,
    serverCertificateArn,
    authenticationOptions,
    connectionLogOptions,
    securityGroupIds,
    tags: clientVpnEndpointTags
  }

  return clientVpnEndpoint
}
