import CloudGraph from '@cloudgraph/sdk'

import IamGlobalService from '../src/services/iamGlobal'
import { account, credentials, region } from '../src/properties/test'
import { globalRegionName } from '../src/enums/regions'

describe('IAM Global Service Test: ', () => {
  let getDataResult
  let formatResult
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const iamGlobalService = new IamGlobalService({
        logger: CloudGraph.logger,
      })

      getDataResult = await iamGlobalService.getData({
        credentials,
        regions: region,
      })

      formatResult = (getDataResult?.[globalRegionName] || []).map(
        iamGlobalData =>
          iamGlobalService.format({ service: iamGlobalData, region, account })
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
      expect(getDataResult?.[globalRegionName]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            PasswordPolicy: expect.objectContaining({
              AllowUsersToChangePassword: expect.any(Boolean),
              ExpirePasswords: expect.any(Boolean),
              HardExpiry: expect.any(Boolean),
              RequireLowercaseCharacters: expect.any(Boolean),
              RequireNumbers: expect.any(Boolean),
              RequireSymbols: expect.any(Boolean),
              RequireUppercaseCharacters: expect.any(Boolean),
              MaxPasswordAge: expect.any(Number),
              MinimumPasswordLength: expect.any(Number),
              PasswordReusePrevention: expect.any(Number),
            }),
            region: expect.any(String),
            OpenIdConnectProviders: expect.arrayContaining([
              expect.objectContaining({
                Arn: expect.any(String),
              }),
            ]),
            ServerCertificates: expect.arrayContaining([
              expect.objectContaining({
                Arn: expect.any(String),
                Path: expect.any(String),
                ServerCertificateId: expect.any(String),
                ServerCertificateName: expect.any(String),
                Expiration: expect.any(Date),
                UploadDate: expect.any(Date),
              }),
            ]),
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
            accountId: expect.any(String),
            passwordPolicy: expect.objectContaining({
              allowUsersToChangePassword: expect.any(Boolean),
              expirePasswords: expect.any(Boolean),
              hardExpiry: expect.any(Boolean),
              requireLowercaseCharacters: expect.any(Boolean),
              requireNumbers: expect.any(Boolean),
              requireSymbols: expect.any(Boolean),
              requireUppercaseCharacters: expect.any(Boolean),
              maxPasswordAge: expect.any(Number),
              minimumPasswordLength: expect.any(Number),
              passwordReusePrevention: expect.any(Number),
            }),
            openIdConnectProviders: expect.arrayContaining([
              expect.objectContaining({
                arn: expect.any(String),
              }),
            ]),
            serverCertificates: expect.arrayContaining([
              expect.objectContaining({
                arn: expect.any(String),
                path: expect.any(String),
                id: expect.any(String),
                name: expect.any(String),
                expiration: expect.any(String),
                uploadDate: expect.any(String),
              }),
            ]),
          }),
        ])
      )
    })

    test('should return data in the correct format using default values when fields are not available', () => {
      const iamGlobalService = new IamGlobalService({
        logger: CloudGraph.logger,
      })

      const result = iamGlobalService.format({ service: {}, region, account })

      expect(result).toEqual(
        expect.objectContaining({
          accountId: account,
          passwordPolicy: expect.objectContaining({
            allowUsersToChangePassword: false,
            expirePasswords: false,
            hardExpiry: false,
            requireLowercaseCharacters: false,
            requireNumbers: false,
            requireSymbols: false,
            requireUppercaseCharacters: false,
            maxPasswordAge: 0,
            minimumPasswordLength: 0,
            passwordReusePrevention: 0,
          }),
          openIdConnectProviders: [],
          samlProviders: [],
          serverCertificates: [],
        })
      )
    })
  })
})
