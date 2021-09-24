import CloudGraph from '@cloudgraph/sdk'

import CognitoClass from '../src/services/cognitoIdentityPool'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'

// TODO: requires localstack pro
describe.skip('Cognito Identity Pool Service Test: ', () => {
  let getDataResult
  let formatResult

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const cognitoClass = new CognitoClass({ logger: CloudGraph.logger })

          // Get Cognito data
          getDataResult = await cognitoClass.getData({
            credentials,
            regions: region,
          })
          // Format Cognito data
          formatResult = getDataResult[region].map(cognitoData =>
            cognitoClass.format({ service: cognitoData, region })
          )
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
      console.log(getDataResult)
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            IdentityPoolId: expect.any(String),
            IdentityPoolName: expect.any(String),
            AllowUnauthenticatedIdentities: expect.any(Boolean),
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
            identityPoolName: expect.any(String),
            allowUnauthenticatedIdentities: expect.any(String),
            allowClassicFlow: expect.any(String),
            region: expect.any(String),
          }),
        ])
      )
    })
  })
})
