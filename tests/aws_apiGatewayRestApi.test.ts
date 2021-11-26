import CloudGraph from '@cloudgraph/sdk'

import APIGatewayRestApi from '../src/services/apiGatewayRestApi'
import APIGatewayResource from '../src/services/apiGatewayResource'
import APIGatewayStage from '../src/services/apiGatewayStage'
import services from '../src/enums/services'
import { credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

describe('APIGatewayRestApi Service Test: ', () => {
  let getDataResult
  let formatResult
  let initiatorTestData
  let initiatorGetConnectionsResult
  initTestConfig()
  beforeAll(async () => {
    try {
      const classInstance = new APIGatewayRestApi({ logger: CloudGraph.logger })
      const apiGWResource = new APIGatewayResource({
        logger: CloudGraph.logger,
      })
      const apiGWStage = new APIGatewayStage({ logger: CloudGraph.logger })
      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })
      formatResult = getDataResult[region].map((item: APIGatewayRestApi) =>
        classInstance.format({ service: item })
      )
      initiatorTestData = [
        {
          name: services.apiGatewayRestApi,
          data: getDataResult,
        },
        {
          name: services.apiGatewayResource,
          data: await apiGWResource.getData({ credentials, rawData: [], regions: region }),
        },
        {
          name: services.apiGatewayStage,
          data: await apiGWStage.getData({ credentials, rawData: [], regions: region }),
        },
      ]
      initiatorGetConnectionsResult = initiatorTestData[0].data[region].map(
        restApi =>
          classInstance.getConnections({
            service: restApi,
            data: initiatorTestData,
            region,
          })
      )
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
  })

  describe('format', () => {
    test('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            arn: expect.any(String),
            description: expect.any(String),
            policy: expect.objectContaining({
              id: expect.any(String),
              statement: expect.arrayContaining([
                expect.objectContaining({
                  action: expect.arrayContaining([expect.any(String)]),
                  effect: expect.any(String),
                  resource: expect.arrayContaining([expect.any(String)]),
                }),
              ]),
              version: expect.any(String),
            }),
            endpointConfiguration: expect.objectContaining({
              types: expect.arrayContaining([expect.any(String)]),
            }),
            apiKeySource: expect.any(String),
            createdDate: expect.any(String),
            minimumCompressionSize: expect.any(Number),
            binaryMediaTypes: expect.any(Array),
            //tags:
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    let connections

    beforeAll(() => {
      connections = Object.values(initiatorGetConnectionsResult[0]).flat()
    })

    test('should have a connection to an API gateway resource', () => {
      expect(connections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            resourceType: services.apiGatewayResource,
          }),
        ])
      )
    })

    test('should have a connection to an API gateway stage', () => {
      expect(connections).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            resourceType: services.apiGatewayStage,
          }),
        ])
      )
    })
  })
})
