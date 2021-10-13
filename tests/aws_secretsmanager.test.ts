import CloudGraph from '@cloudgraph/sdk'
import SMClass from '../src/services/secretsManager'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'
import { RawAwsSecretsManager } from '../src/services/secretsManager/data'

describe('Secrets Manager Service Test: ', () => {
  let getDataResult
  let formatResult

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const smClass = new SMClass({ logger: CloudGraph.logger })
          getDataResult = await smClass.getData({
            credentials,
            regions: region,
          })

          formatResult = getDataResult[region].map((item: RawAwsSecretsManager) =>
            smClass.format({ service: item, region })
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
            ARN: expect.any(String),
            Name: expect.any(String),
            Description: expect.any(String),
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
            name: expect.any(String),
            description: expect.any(String),
          }),
        ])
      )
    })
  })
})