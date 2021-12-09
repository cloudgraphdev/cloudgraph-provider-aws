import CloudGraph from '@cloudgraph/sdk'
import VpnConnection from '../src/services/vpnConnection'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'


describe('Vpn Connection Service Test: ', () => {
  let getDataResult
  let formatResult
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const classInstance = new VpnConnection({ logger: CloudGraph.logger })
      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(elbData =>
        classInstance.format({ service: elbData, region, account })
      )

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
          })
        ])
      )
    })
  })

  describe.skip('format', () => {
    test('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            arn: expect.any(String),
            category: expect.any(String),
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
})
