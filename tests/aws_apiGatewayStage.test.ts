import CloudGraph from '@cloudgraph/sdk'

import ApiGatewayStage from '../src/services/apiGatewayStage'
import { credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

describe('APIGatewayStage Service Test: ', () => {
  let getDataResult
  let formatResult
  initTestConfig()
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const classInstance = new ApiGatewayStage({
            logger: CloudGraph.logger,
          })
          getDataResult = await classInstance.getData({
            credentials,
            rawData: [],
            regions: region,
          })
          formatResult = getDataResult[region].map((item: ApiGatewayStage) =>
            classInstance.format({ service: item })
          )
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
        }
        resolve()
      })
  )

  describe('format', () => {
    test('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            arn: expect.any(String),
            //restApi: [awsApiGatewayRestApi] @hasInverse(field: stages)
            name: expect.any(String),
            description: expect.any(String),
            cacheCluster: expect.any(Boolean),
            cacheClusterSize: expect.any(String),
            accessLogSettings: expect.objectContaining({
              format: expect.any(String),
              destinationArn: expect.any(String),
            }),
            documentationVersion: expect.any(String),
            clientCertificateId: expect.any(String),
            xrayTracing: expect.any(Boolean),
            variables: expect.arrayContaining([]),
            tags: expect.arrayContaining([]),
          }),
        ])
      )
    })
  })
})
