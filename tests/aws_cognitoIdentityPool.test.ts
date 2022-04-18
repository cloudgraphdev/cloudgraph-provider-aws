import CloudGraph from '@cloudgraph/sdk'

import CognitoClass from '../src/services/cognitoIdentityPool'
import IAMRole from '../src/services/iamRole'
import IAMOpenIdConnectProvider from '../src/services/iamOpenIdConnectProvider'
import IAMSamlProvider from '../src/services/iamSamlProvider'
import { initTestConfig } from '../src/utils'
import { account, credentials, region } from '../src/properties/test'
import services from '../src/enums/services'

// TODO: requires localstack pro
describe.skip('Cognito Identity Pool Service Test: ', () => {
  let getDataResult
  let formatResult
  let connections
  let id

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const cognitoClass = new CognitoClass({ logger: CloudGraph.logger })
          const iamRoleService = new IAMRole({ logger: CloudGraph.logger })
          const iamOpenIdConnectProvider = new IAMOpenIdConnectProvider({ logger: CloudGraph.logger })
          const iamSamlProvider = new IAMSamlProvider({ logger: CloudGraph.logger })

          // Get Cognito data
          getDataResult = await cognitoClass.getData({
            credentials,
            regions: region,
          })
          // Format Cognito data
          formatResult = getDataResult[region].map(cognitoData =>
            cognitoClass.format({ service: cognitoData, region })
          )
          // Get IAM Role data
          const iamRoleData = await iamRoleService.getData({
            credentials,
            regions: region,
          })
          // Get IAM OpenId Connect Provider data
          const iamOpenIdConnectProviderData = await iamOpenIdConnectProvider.getData({
            credentials,
            regions: region,
          })
          // Get IAM Saml Provider data
          const iamSamlProviderData = await iamSamlProvider.getData({
            credentials,
            regions: region,
          })

          const [cognitoIdentityPool] = getDataResult[region]
          id = cognitoIdentityPool.IdentityPoolId

          connections = cognitoClass.getConnections({
            service: cognitoIdentityPool,
            data: [
              {
                name: services.iamRole,
                data: iamRoleData,
                account,
                region,
              },
              {
                name: services.iamOpenIdConnectProvider,
                data: iamOpenIdConnectProviderData,
                account,
                region,
              },
              {
                name: services.iamSamlProvider,
                data: iamSamlProviderData,
                account,
                region,
              }
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

  describe('connections', () => {
    test('should verify the connection to ec2 instance', async () => {
      const iamOpenIdConnectProviderConnections = connections[id].filter(
        connection => connection.resourceType === services.iamOpenIdConnectProvider
      )

      expect(iamOpenIdConnectProviderConnections).toBeDefined()
      expect(iamOpenIdConnectProviderConnections.length).toBe(1)
    })

    test('should verify the connection to security groups', async () => {
      const iamSamlProviderConnections = connections[id].filter(
        connection => connection.resourceType === services.iamSamlProvider
      )

      expect(iamSamlProviderConnections).toBeDefined()
      expect(iamSamlProviderConnections.length).toBe(1)
    })

    test('should verify the connection to iam', async () => {
      const iamConnections = connections[id].filter(
        connection => connection.resourceType === services.iamRole
      )

      expect(iamConnections).toBeDefined()
      expect(iamConnections.length).toBe(1)
    })
  })
})
