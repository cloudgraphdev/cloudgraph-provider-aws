import CloudGraph from '@cloudgraph/sdk'

import IamServerCertificateService from '../src/services/iamServerCertificate'
import { account, credentials, region } from '../src/properties/test'
import { globalRegionName } from '../src/enums/regions'

describe('IAM Server Certificate Service Test: ', () => {
  let getDataResult
  let formatResult
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const iamServerCertificateService = new IamServerCertificateService({
        logger: CloudGraph.logger,
      })

      getDataResult = await iamServerCertificateService.getData({
        credentials,
        regions: region,
      })

      formatResult = (getDataResult?.[globalRegionName] || []).map(
        iamGlobalData =>
          iamServerCertificateService.format({
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
            Path: expect.any(String),
            ServerCertificateId: expect.any(String),
            ServerCertificateName: expect.any(String),
            Expiration: expect.any(Date),
            UploadDate: expect.any(Date),
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
            path: expect.any(String),
            certificateId: expect.any(String),
            name: expect.any(String),
            expiration: expect.any(String),
            uploadDate: expect.any(String),
          }),
        ])
      )
    })

    test('should return data in the correct format using default values when fields are not available', () => {
      const iamServerCertificateService = new IamServerCertificateService({
        logger: CloudGraph.logger,
      })

      const result = iamServerCertificateService.format({
        service: {},
        region,
        account,
      })

      expect(result).toEqual(
        expect.objectContaining({
          accountId: account,
          arn: '',
          path: '',
          certificateId: '',
          name: '',
          expiration: '',
          uploadDate: '',
        })
      )
    })
  })
})
