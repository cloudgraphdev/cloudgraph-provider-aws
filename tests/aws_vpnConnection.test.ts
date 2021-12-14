import CloudGraph from '@cloudgraph/sdk'
import CustomerGateway from '../src/services/customerGateway'
import TransitGateway from '../src/services/transitGateway'
import VpnConnection from '../src/services/vpnConnection'
import VpnGateway from '../src/services/vpnGateway'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'

describe('Vpn Connection Service Test: ', () => {
  let getDataResult
  let formatResult
  let vpnConnections
  let vpnConnectionId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const transitGatewayService = new TransitGateway({
        logger: CloudGraph.logger,
      })
      const customerGatewayService = new CustomerGateway({
        logger: CloudGraph.logger,
      })
      const vpnGatewayService = new VpnGateway({
        logger: CloudGraph.logger,
      })
      const classInstance = new VpnConnection({ logger: CloudGraph.logger })
      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(data =>
        classInstance.format({ service: data, region, account })
      )

      // Get Transit Gateway data
      const transitGatewayData = await transitGatewayService.getData({
        credentials,
        regions: region,
      })

      // Get Customer Gateway data
      const customerGatewayData = await customerGatewayService.getData({
        credentials,
        regions: region,
      })

      // Get Vpn Gateway data
      const vpnGatewayData = await vpnGatewayService.getData({
        credentials,
        regions: region,
      })

      const [vpnConnection] = getDataResult[region]
      vpnConnectionId = vpnConnection.VpnConnectionId

      vpnConnections = classInstance.getConnections({
        service: vpnConnection,
        data: [
          {
            name: services.customerGateway,
            data: customerGatewayData,
            account,
            region,
          },
          {
            name: services.transitGateway,
            data: transitGatewayData,
            account,
            region,
          },
          {
            name: services.vpnGateway,
            data: vpnGatewayData,
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
            VpnConnectionId: expect.any(String),
            CustomerGatewayId: expect.any(String),
            State: expect.any(String),
            Type: expect.any(String),
            VpnGatewayId: expect.any(String),
            region: expect.any(String),
            Tags: expect.any(Object),
            Routes: expect.any(Array),
            VgwTelemetry: expect.any(Array),
            CustomerGatewayConfiguration: expect.any(String),
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
            id: expect.any(String),
            accountId: expect.any(String),
            arn: expect.any(String),
            category: undefined,
            customerGatewayId: expect.any(String),
            state: expect.any(String),
            type: expect.any(String),
            vpnGatewayId: expect.any(String),
            transitGatewayId: expect.any(String),
            options: expect.any(Object),
            routes: expect.any(Array),
            vgwTelemetry: expect.any(Array),
            tags: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                key: expect.any(String),
                value: expect.any(String),
              }),
            ]),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to customer gateway', () => {
      const customerGatewayConnections = vpnConnections[
        vpnConnectionId
      ]?.filter(
        connection => connection.resourceType === services.customerGateway
      )

      expect(customerGatewayConnections).toBeDefined()
      expect(customerGatewayConnections.length).toBe(1)
    })

    test('should verify the connection to transit gateway', () => {
      const transitGatewayConnections = vpnConnections[vpnConnectionId]?.filter(
        connection => connection.resourceType === services.transitGateway
      )

      expect(transitGatewayConnections).toBeDefined()
      expect(transitGatewayConnections.length).toBe(1)
    })

    test('should verify the connection to vpn gateway', () => {
      const vpnGatewayConnections = vpnConnections[vpnConnectionId]?.filter(
        connection => connection.resourceType === services.vpnGateway
      )

      expect(vpnGatewayConnections).toBeDefined()
      expect(vpnGatewayConnections.length).toBe(0)
    })
  })
})
