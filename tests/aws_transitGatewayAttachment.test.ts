import CloudGraph from '@cloudgraph/sdk'
import RouteTable from '../src/services/routeTable'
import TransitGateway from '../src/services/transitGateway'
import TransitGatewayAttachment from '../src/services/transitGatewayAttachment'
import VpnConnection from '../src/services/vpnConnection'
import Vpc from '../src/services/vpc'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'

describe('Transit Gateway Attachment Service Test: ', () => {
  let getDataResult
  let formatResult
  let transitGatewayAttachmentConnections
  let transitGatewayAttachmentId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const transitGatewayService = new TransitGateway({
        logger: CloudGraph.logger,
      })
      const routeTableService = new RouteTable({
        logger: CloudGraph.logger,
      })
      const vpcService = new Vpc({
        logger: CloudGraph.logger,
      })
      const vpnConnectionService = new VpnConnection({
        logger: CloudGraph.logger,
      })
      const classInstance = new TransitGatewayAttachment({
        logger: CloudGraph.logger,
      })
      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(data =>
        classInstance.format({ service: data, region, account })
      )

      const [transitGatewayAttachment] = getDataResult[region]
      transitGatewayAttachmentId =
        transitGatewayAttachment.TransitGatewayAttachmentId

      // Get Transit Gateway data
      const transitGatewayData = await transitGatewayService.getData({
        credentials,
        regions: region,
      })

      // Get Route Table data
      const routeTableData = await routeTableService.getData({
        credentials,
        regions: region,
      })

      // Get Vpc data
      const vpcData = await vpcService.getData({
        credentials,
        regions: region,
      })

      // Get Vpn Connection data
      const vpnConnectionData = await vpnConnectionService.getData({
        credentials,
        regions: region,
      })

      transitGatewayAttachmentConnections = classInstance.getConnections({
        service: transitGatewayAttachment,
        data: [
          {
            name: services.transitGateway,
            data: transitGatewayData,
            account,
            region,
          },
          {
            name: services.routeTable,
            data: routeTableData,
            account,
            region,
          },
          {
            name: services.vpc,
            data: vpcData,
            account,
            region,
          },
          {
            name: services.vpnConnection,
            data: vpnConnectionData,
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
            Association: expect.objectContaining({
              State: expect.any(String),
              TransitGatewayRouteTableId: expect.any(String),
            }),
            CreationTime: expect.any(Date),
            ResourceId: expect.any(String),
            ResourceOwnerId: expect.any(String),
            ResourceType: expect.any(String),
            State: expect.any(String),
            Tags: expect.any(Object),
            TransitGatewayAttachmentId: expect.any(String),
            TransitGatewayId: expect.any(String),
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
            accountId: expect.any(String),
            arn: expect.any(String),
            creationTime: expect.any(String),
            id: expect.any(String),
            region: expect.any(String),
            resourceId: expect.any(String),
            resourceOwnerId: expect.any(String),
            resourceType: expect.any(String),
            state: expect.any(String),
            transitGatewayId: expect.any(String),
            transitGatewayOwnerId: expect.any(String),
            transitGatewayRouteTableId: expect.any(String),
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
    test('should verify the connection to transit gateway', () => {
      const transitGatewayConnections = transitGatewayAttachmentConnections[
        transitGatewayAttachmentId
      ]?.filter(
        connection => connection.resourceType === services.transitGateway
      )

      expect(transitGatewayConnections).toBeDefined()
      expect(transitGatewayConnections.length).toBe(1)
    })

    test('should verify the connection to route table', () => {
      const routeTableConnections = transitGatewayAttachmentConnections[
        transitGatewayAttachmentId
      ]?.filter(connection => connection.resourceType === services.routeTable)

      expect(routeTableConnections).toBeDefined()
      expect(routeTableConnections.length).toBe(0)
    })

    test('should verify the connection to vpc', () => {
      const vpcConnections = transitGatewayAttachmentConnections[
        transitGatewayAttachmentId
      ]?.filter(connection => connection.resourceType === services.vpc)

      expect(vpcConnections).toBeDefined()
      expect(vpcConnections.length).toBe(1)
    })

    test('should verify the connection to vpn connection', () => {
      const vpnConnections = transitGatewayAttachmentConnections[
        transitGatewayAttachmentId
      ]?.filter(
        connection => connection.resourceType === services.vpnConnection
      )

      expect(vpnConnections).toBeDefined()
      expect(vpnConnections.length).toBe(0)
    })
  })
})
