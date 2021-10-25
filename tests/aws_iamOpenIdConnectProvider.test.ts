import CloudGraph from '@cloudgraph/sdk'

import IamOpenIdConnectProviderService from '../src/services/iamOpenIdConnectProvider'
import { account, credentials, region } from '../src/properties/test'
import { globalRegionName } from '../src/enums/regions'

describe('IAM OpenId Connect Provider Service Test: ', () => {
  let getDataResult
  let formatResult
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const iamOpenIdConnectProviderService =
        new IamOpenIdConnectProviderService({
          logger: CloudGraph.logger,
        })

      getDataResult = await iamOpenIdConnectProviderService.getData({
        credentials,
        regions: region,
      })

      formatResult = (getDataResult?.[globalRegionName] || []).map(
        iamGlobalData =>
          iamOpenIdConnectProviderService.format({
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
            Arn: expect.any(String),
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
            arn: expect.any(String),
          }),
        ])
      )
    })

    test('should return data in the correct format using default values when fields are not available', () => {
      const iamOpenIdConnectProviderService =
        new IamOpenIdConnectProviderService({
          logger: CloudGraph.logger,
        })

      const result = iamOpenIdConnectProviderService.format({
        service: {},
        region,
        account,
      })

      expect(result).toEqual(
        expect.objectContaining({
          accountId: account,
          arn: '',
        })
      )
    })
  })
})
