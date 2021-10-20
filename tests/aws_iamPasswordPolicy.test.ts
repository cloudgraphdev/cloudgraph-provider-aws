import CloudGraph from '@cloudgraph/sdk'

import IamPasswordPolicyService from '../src/services/iamPasswordPolicy'
import { account, credentials, region } from '../src/properties/test'
import { globalRegionName } from '../src/enums/regions'

describe('IAM Password Policy Service Test: ', () => {
  let getDataResult
  let formatResult
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const iamPasswordPolicyService = new IamPasswordPolicyService({
        logger: CloudGraph.logger,
      })

      getDataResult = await iamPasswordPolicyService.getData({
        credentials,
        regions: region,
      })

      formatResult = (getDataResult?.[globalRegionName] || []).map(
        iamGlobalData =>
          iamPasswordPolicyService.format({
            service: iamGlobalData,
            region,
            account,
          })
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
        ])
      )
    })

    test('should return data in the correct format using default values when fields are not available', () => {
      const iamPasswordPolicyService = new IamPasswordPolicyService({
        logger: CloudGraph.logger,
      })

      const result = iamPasswordPolicyService.format({
        service: {},
        region,
        account,
      })

      expect(result).toEqual(
        expect.objectContaining({
          accountId: account,
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
        })
      )
    })
  })
})
