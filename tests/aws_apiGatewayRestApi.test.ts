import CloudGraph from '@cloudgraph/sdk'

import APIGatewayRestApi from '../src/services/apiGatewayRestApi'
import { credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

initTestConfig()

describe('APIGatewayRestApi Service Test: ', () => {
  let getDataResult
  let formatResult
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const classInstance = new APIGatewayRestApi({ logger: CloudGraph.logger })
          getDataResult = await classInstance.getData({
            credentials,
            regions: region,
          })
          formatResult = getDataResult[region].map((item: APIGatewayRestApi) =>
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
          description: expect.any(String),
          policy: expect.any(String),
          endpointConfiguration: expect.objectContaining({
            types: expect.arrayContaining([expect.any(String)])
          }),
          apiKeySource: expect.any(String),
          createdDate: expect.any(String),
          minimumCompressionSize: expect.any(Number),
          binaryMediaTypes: expect.any(Array),
          //tags:
          stages: expect.arrayContaining([
            expect.objectContaining({
              deploymentId: expect.any(String),
              stageName: expect.any(String)
            })
          ]),
          resources: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              path: expect.any(String)
            })
          ])
        })])
      )
    })
  })
})
