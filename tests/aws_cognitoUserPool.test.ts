import CloudGraph from '@cloudgraph/sdk'

import CognitoClass from '../src/services/cognitoUserPool'
import LambdaClass from '../src/services/lambda'
import { initTestConfig } from '../src/utils'
import { account, credentials, region } from '../src/properties/test'
import services from '../src/enums/services'

// TODO: requires localstack pro

describe.skip('Cognito User Pool Service Test: ', () => {
  let getDataResult
  let formatResult
  let userPoolConnections
  let userPoolId

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const cognitoClass = new CognitoClass({ logger: CloudGraph.logger })
          const lambdaClass = new LambdaClass({ logger: CloudGraph.logger })

          // Get Cognito data
          getDataResult = await cognitoClass.getData({
            credentials,
            regions: region,
          })
          // Format Cognito data
          formatResult = getDataResult[region].map(cognitoData =>
            cognitoClass.format({ service: cognitoData, region })
          )

          // Get Lambda Function data
          const lambdaFunctionData = await lambdaClass.getData({
            credentials,
            regions: region,
          })

          const [userPool] = getDataResult[region]
          userPoolId = userPool.Id

          userPoolConnections = cognitoClass.getConnections({
            service: userPool,
            data: [
              {
                name: services.lambda,
                data: lambdaFunctionData,
                account,
                region,
              },
            ],
            region,
          })
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
        }
        resolve()
      })
  )

  describe('getData', () => {
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', () => {
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Id: expect.any(String),
            Name: expect.any(String),
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
            arn: expect.any(String),
            name: expect.any(String),
            region: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to Lambda function', async () => {
      const lambdaConnections = userPoolConnections[userPoolId].filter(
        connection => connection.resourceType === services.lambda
      )

      expect(lambdaConnections).toBeDefined()
      expect(lambdaConnections.length).toBe(1)
    })
  })
})
