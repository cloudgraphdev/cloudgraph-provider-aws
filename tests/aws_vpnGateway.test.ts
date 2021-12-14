import CloudGraph from '@cloudgraph/sdk'
import VpnGateway from '../src/services/vpnGateway'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'
import Vpc from '../src/services/vpc'

describe('Vpn Gateway Service Test: ', () => {
  let getDataResult
  let formatResult
  let vpnGatewayConnections
  let vpnGatewayId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const vpcService = new Vpc({ logger: CloudGraph.logger })
      const classInstance = new VpnGateway({ logger: CloudGraph.logger })
      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(elbData =>
        classInstance.format({ service: elbData, region, account })
      )

      // Get VPC data
      const vpcData = await vpcService.getData({
        credentials,
        regions: region,
      })

      const [vpnGateway] = getDataResult[region]
      vpnGatewayId = vpnGateway.VpnGatewayId

      vpnGatewayConnections = classInstance.getConnections({
        service: vpnGateway,
        data: [
          {
            name: services.vpc,
            data: vpcData,
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
            AvailabilityZone: expect.any(String),
            State: expect.any(String),
            Type: expect.any(String),
            VpcAttachments: expect.any(Array),
            VpnGatewayId: expect.any(String),
            Tags: expect.any(Object),
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
            type: expect.any(String),
            state: expect.any(String),
            amazonSideAsn: undefined,
            vpcIds: expect.any(Array),
            tags: expect.any(Array),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to vpc', () => {
      const vpcConnections = vpnGatewayConnections[vpnGatewayId]?.filter(
        connection => connection.resourceType === services.vpc
      )

      expect(vpcConnections).toBeDefined()
      expect(vpcConnections.length).toBe(1)
    })
  })
})
