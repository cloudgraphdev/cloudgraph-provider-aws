import CloudGraph from '@cloudgraph/sdk'

import ApiGatewayResource from '../src/services/apiGatewayResource'
import { credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

initTestConfig()

describe('APIGatewayResource Service Test: ', () => {
  let getDataResult
  let formatResult
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const classInstance = new ApiGatewayResource({ logger: CloudGraph.logger })
          getDataResult = await classInstance.getData({
            credentials,
            regions: region,
          })
          formatResult = getDataResult[region].map((item: ApiGatewayResource) =>
            classInstance.format({ service: item })
          )
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
        }
        resolve()
      })
  )

  describe('format', () => {
    it('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([expect.objectContaining({
          id: expect.any(String),
          arn: expect.any(String),
          path: expect.any(String),
          methods: expect.arrayContaining([
            expect.objectContaining({
              arn: expect.any(String),
              httpMethod: expect.any(String),
              authorization: expect.any(String),
              apiKeyRequired: expect.any(Boolean),
            })
          ])
        })])
      )
    })
  })
})
