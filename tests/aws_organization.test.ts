import CloudGraph from '@cloudgraph/sdk'
import Organization from '../src/services/organization'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

describe.skip('Transit Organization Service Test: ', () => {
  let getDataResult
  let formatResult
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const classInstance = new Organization({ logger: CloudGraph.logger })
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
            Id:  expect.any(String),
            Arn: expect.any(String),
            FeatureSet: expect.any(String),
            MasterAccountArn: expect.any(String),
            MasterAccountId: expect.any(String),
            MasterAccountEmail: expect.any(String),
            AvailablePolicyTypes: expect.any(Object),
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
            id:  expect.any(String),
            arn: expect.any(String),
            featureSet: expect.any(String),
            masterAccountArn: expect.any(String),
            masterAccountId: expect.any(String),
            masterAccountEmail: expect.any(String),
            availablePolicyTypes: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                type: expect.any(String),
                status: expect.any(String),
              }),
            ]),
          }),
        ])
      )
    })
  })
})
