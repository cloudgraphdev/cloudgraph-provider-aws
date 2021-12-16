import CloudGraph from '@cloudgraph/sdk'
import ClientVpnEndpoint from '../src/services/clientVpnEndpoint'
import SecurityGroup from '../src/services/securityGroup'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'

// TODO: Test when error requesting certificate on is fixed.
describe.skip('Client Vpn Endpoint Service Test: ', () => {
  let getDataResult
  let formatResult
  let clientVpnEndpointConnections
  let clientVpnEndpointId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const securityGroupService = new SecurityGroup({ logger: CloudGraph.logger })
      const classInstance = new ClientVpnEndpoint({ logger: CloudGraph.logger })
      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(data =>
        classInstance.format({ service: data, region, account })
      )

      // Get Security Group data
      const securityGroupData = await securityGroupService.getData({
        credentials,
        regions: region,
      })

      const [clientVpnEndpoint] = getDataResult[region]
      clientVpnEndpointId = clientVpnEndpoint.ClientVpnEndpointId

      clientVpnEndpointConnections = classInstance.getConnections({
        service: clientVpnEndpoint,
        data: [
          {
            name: services.sg,
            data: securityGroupData,
            account,
            region,
          },
        ],
        region,
        account,
      })
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
    return Promise.resolve()
  })

  describe('getData', () => {
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', async () => {
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            AssociatedTargetNetworks: expect.any(Array),
            AuthenticationOptions: expect.arrayContaining([
              expect.objectContaining({
                Type: expect.any(String),
                MutualAuthentication: expect.any(Object),
              }),
            ]),
            ClientCidrBlock: expect.any(String),
            ClientConnectOptions: expect.objectContaining({
              Enabled: expect.any(Boolean),
              Status: expect.any(Object),
            }),
            ClientVpnEndpointId: expect.any(String),
            ConnectionLogOptions: expect.objectContaining({
              Enabled: expect.any(Boolean),
            }),
            CreationTime: expect.any(String),
            Description: expect.any(String),
            DnsName: expect.any(String),
            DnsServers: expect.any(Array),
            SecurityGroupIds: expect.any(Array),
            ServerCertificateArn: expect.any(String),
            SplitTunnel: expect.any(Boolean),
            Status: expect.objectContaining({
              Code: expect.any(String),
            }),
            Tags: expect.any(Object),
            TransportProtocol: expect.any(String),
            VpcId: expect.any(String),
            VpnPort: expect.any(Number),
            VpnProtocol: expect.any(String),
            region: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('format', () => {
    test('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            accountId: undefined,
            arn: expect.any(String),
            associatedTargetNetworks: expect.any(Array),
            authenticationOptions: expect.arrayContaining([
              expect.objectContaining({
                type: expect.any(String),
                mutualAuthentication: expect.any(Object),
              }),
            ]),
            clientCidrBlock: expect.any(String),
            clientConnectOptions: expect.objectContaining({
              enabled: expect.any(Boolean),
              status: expect.any(String),
            }),
            connectionLogOptions: expect.objectContaining({
              enabled: expect.any(Boolean),
            }),
            creationTime: expect.any(String),
            deletionTime: undefined,
            description: expect.any(String),
            dnsName: expect.any(String),
            dnsServers: expect.any(Array),
            id: expect.any(String),
            region: expect.any(String),
            securityGroupIds: expect.any(Array),
            serverCertificateArn: expect.any(String),
            splitTunnel: expect.any(Boolean),
            status: expect.any(String),
            tags: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                key: expect.any(String),
                value: expect.any(String),
              }),
            ]),
            transportProtocol: expect.any(String),
            vpnPort: expect.any(Number),
            vpnProtocol: expect.any(String),
          }),
        ])
      )
    })
  })
  
  describe('connections', () => {
    test('should verify the connection to the security group', () => {
      const securityGroupConnections = clientVpnEndpointConnections[
        clientVpnEndpointId
      ]?.filter(
        connection => connection.resourceType === services.sg
      )

      expect(securityGroupConnections).toBeDefined()
      expect(securityGroupConnections.length).toBe(1)
    })
  })
})
