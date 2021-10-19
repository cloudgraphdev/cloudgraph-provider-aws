import CloudGraph from '@cloudgraph/sdk'
import kebabCase from 'lodash/kebabCase'

import IamUserService from '../src/services/iamUser'
import { account, credentials, region } from '../src/properties/test'
import { globalRegionName } from '../src/enums/regions'
import resources from '../src/enums/resources'

describe('IAM User Service Test: ', () => {
  let getDataResult
  let formatResult
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const iamUserService = new IamUserService({
        logger: CloudGraph.logger,
      })

      getDataResult = await iamUserService.getData({
        credentials,
        regions: region,
      })

      formatResult = (getDataResult?.[globalRegionName] || []).map(
        iamUserData =>
          iamUserService.format({ service: iamUserData, region, account })
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
            UserId: expect.any(String),
            UserName: expect.any(String),
            Arn: expect.any(String),
            Path: expect.any(String),
            Groups: expect.arrayContaining<String>([]),
            Policies: expect.arrayContaining<String>([]),
            region: expect.any(String),
            AccessKeyLastUsedData: expect.arrayContaining([
              expect.objectContaining({
                AccessKeyId: expect.any(String),
                AccessKeyLastUsed: expect.objectContaining({
                  ServiceName: expect.any(String),
                  Region: expect.any(String),
                }),
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
            arn: expect.any(String),
            accountId: expect.any(String),
            name: expect.any(String),
            passwordLastUsed: expect.any(String),
            path: expect.any(String),
            creationTime: expect.any(String),
            groups: expect.arrayContaining<String>([]),
            accessKeyData: expect.arrayContaining([
              expect.objectContaining({
                accessKeyId: expect.any(String),
                lastUsedRegion: expect.any(String),
                lastUsedService: expect.any(String),
              }),
            ]),
          }),
        ])
      )
    })

    test('should return data in the correct format using default values when fields are not available', () => {
      const iamUserService = new IamUserService({
        logger: CloudGraph.logger,
      })

      const result = iamUserService.format({ service: {}, region, account })

      expect(result).toEqual(
        expect.objectContaining({
          id: `${undefined}-${undefined}-${kebabCase(resources.iamUser)}`,
          arn: undefined,
          accountId: account,
          name: undefined,
          passwordLastUsed: '',
          path: undefined,
          creationTime: '',
          groups: [],
          accessKeyData: [],
          mfaDevices: [],
        })
      )
    })
  })
})
