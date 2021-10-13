import CloudGraph from '@cloudgraph/sdk'
import SesClass from '../src/services/ses'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'
import { RawAwsSes } from '../src/services/ses/data'

describe('SES Service Test: ', () => {
  let getDataResult
  let formatResult

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const sesClass = new SesClass({ logger: CloudGraph.logger })
          getDataResult = await sesClass.getData({
            credentials,
            regions: region,
          })

          formatResult = getDataResult[region].map((item: RawAwsSes) =>
            sesClass.format({ service: item, region })
          )
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
        }
        resolve()
      })
  )

  describe('getData', () => {
    it('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    it('should return data from a region in the correct format', () => {
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Identity: expect.any(String),
            region: expect.any(String),
            VerificationStatus: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('format', () => {
    it('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            arn: expect.any(String),
            email: expect.any(String),
            verificationStatus: expect.any(String),
          }),
        ])
      )
    })
  })
})
