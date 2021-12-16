import CloudGraph from '@cloudgraph/sdk'
import RouteTable from '../src/services/routeTable'
import TransitGateway from '../src/services/transitGateway'
import services from '../src/enums/services'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

describe('Transit Gateway Service Test: ', () => {
  let getDataResult
  let formatResult
  let transitGatewayConnections
  let transitGatewayId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const routeTableService = new RouteTable({
        logger: CloudGraph.logger,
      })
      const classInstance = new TransitGateway({ logger: CloudGraph.logger })
      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(elbData =>
        classInstance.format({ service: elbData, region, account })
      )

      const [transitGateway] = getDataResult[region]
      transitGatewayId = transitGateway.TransitGatewayId

      // Get Route Table data
      const routeTableData = await routeTableService.getData({
        credentials,
        regions: region,
      })

      transitGatewayConnections = classInstance.getConnections({
        service: transitGateway,
        data: [
          {
            name: services.routeTable,
            data: routeTableData,
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
            CreationTime: expect.any(Date),
            Description: expect.any(String),
            Options: expect.objectContaining({
              AmazonSideAsn: expect.any(Number),
              AssociationDefaultRouteTableId: expect.any(String),
              AutoAcceptSharedAttachments: expect.any(String),
              DefaultRouteTableAssociation: expect.any(String),
              DefaultRouteTablePropagation: expect.any(String),
              DnsSupport: expect.any(String),
              PropagationDefaultRouteTableId: expect.any(String),
              TransitGatewayCidrBlocks: expect.any(Array),
              VpnEcmpSupport: expect.any(String),
            }),
            OwnerId: expect.any(String),
            State: expect.any(String),
            Tags: expect.any(Object),
            TransitGatewayArn: expect.any(String),
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
            id: expect.any(String),
            accountId: expect.any(String),
            arn: expect.any(String),
            region: expect.any(String),
            ownerId: expect.any(String),
            description: expect.any(String),
            dnsSupport: expect.any(String),
            vpnEcmpSupport: expect.any(String),
            amazonSideAsn: expect.any(String),
            autoAcceptSharedAttachments: expect.any(String),
            defaultRouteTableAssociation: expect.any(String),
            defaultRouteTablePropagation: expect.any(String),
            associationDefaultRouteTableId: expect.any(String),
            propagationDefaultRouteTableId: expect.any(String),
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
    test('should verify the connection to route table', () => {
      const routeTableConnections = transitGatewayConnections[
        transitGatewayId
      ]?.filter(connection => connection.resourceType === services.routeTable)

      expect(routeTableConnections).toBeDefined()
      expect(routeTableConnections.length).toBe(0)
    })
  })
})
