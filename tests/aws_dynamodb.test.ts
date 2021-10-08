import CloudGraph from '@cloudgraph/sdk'
import DynamoDb from '../src/services/dynamodb'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

// TODO: Fails because we need access to a Localstack Pro feature(Backups)
xdescribe('DynamoDB Service Test: ', () => {
  let getDataResult
  let formatResult
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const dynamoDb = new DynamoDb({ logger: CloudGraph.logger })
      getDataResult = await dynamoDb.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(dynamoDbData =>
        dynamoDb.format({ service: dynamoDbData, region, account })
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
            //
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
            //
          }),
        ])
      )
    })
  })
})
