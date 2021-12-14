
import CloudGraph from '@cloudgraph/sdk'
import CustomerGateway from '../src/services/customerGateway'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'


describe('Customer Gateway Service Test: ', () => {
  let getDataResult
  let formatResult
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const classInstance = new CustomerGateway({ logger: CloudGraph.logger })
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
            BgpAsn: expect.any(String),
            CustomerGatewayId: expect.any(String),
            IpAddress: expect.any(String),
            State: expect.any(String),
            Tags: expect.any(Object),
            Type: expect.any(String),
            region: expect.any(String),
          })
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
            type: expect.any(String),
            bgpAsn: expect.any(String),
            ipAddress: expect.any(String),
            region: expect.any(String),
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