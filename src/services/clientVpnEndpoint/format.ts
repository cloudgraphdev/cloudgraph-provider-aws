import { generateUniqueId } from '@cloudgraph/sdk'

import { formatTagsFromMap } from '../../utils/format'
import { RawAwsClientVpnEndpoint } from './data'
import { AwsClientVpnEndpoint } from '../../types/generated'
import { clientVpnEndpointArn } from '../../utils/generateArns'

/**
 * Client Vpn Endpoint
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
    AssociatedTargetNetworks: associatedTargetNetworkSet,
    ServerCertificateArn: serverCertificateArn,
    AuthenticationOptions: clientVpnAuthenticationList,
    ConnectionLogOptions: connectionLogOptions,
    SecurityGroupIds: securityGroupIds = [],
    ClientConnectOptions: clientConnectOptions,
  } = rawData

  const arn = clientVpnEndpointArn({ region, account, id })

  // Client Vpn Endpoint Tags
  const clientVpnEndpointTags = formatTagsFromMap(tags)

  // Associated Target Networks
  const associatedTargetNetworks =
    associatedTargetNetworkSet?.map(
      ({ NetworkId: networkId, NetworkType: networkType }) => {
        return {
          id: generateUniqueId({
            arn,
            networkId,
            networkType,
          }),
          networkId,
          networkType,
        }
      }
    ) || []

  // Authentication Options
  const authenticationOptions =
    clientVpnAuthenticationList?.map(
      ({
        Type: type,
        ActiveDirectory: activeDirectory,
        MutualAuthentication: mutualAuthentication,
        FederatedAuthentication: federatedAuthentication,
      }) => {
        return {
          id: generateUniqueId({
            arn,
            type,
            activeDirectory,
            mutualAuthentication,
            federatedAuthentication,
          }),
          type: type?.toString(),
          activeDirectory: {
            directoryId: activeDirectory?.DirectoryId,
          },
          mutualAuthentication: {
            clientRootCertificateChain:
              mutualAuthentication?.ClientRootCertificateChain,
          },
          federatedAuthentication: {
            samlProviderArn: federatedAuthentication?.SamlProviderArn,
            selfServiceSamlProviderArn:
              federatedAuthentication?.SelfServiceSamlProviderArn,
          },
        }
      }
    ) || []

  const clientVpnEndpoint = {
    id,
    accountId: account,
    arn,
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
    connectionLogOptions: {
      enabled: connectionLogOptions?.Enabled,
      cloudwatchLogGroup: connectionLogOptions?.CloudwatchLogGroup,
      cloudwatchLogStream: connectionLogOptions?.CloudwatchLogStream,
    },
    securityGroupIds,
    tags: clientVpnEndpointTags,
    clientConnectOptions: {
      enabled: clientConnectOptions?.Enabled,
      cloudwatchLogGroup: clientConnectOptions?.LambdaFunctionArn,
      status: clientConnectOptions?.Status?.Code,
    },
  }

  return clientVpnEndpoint
}
