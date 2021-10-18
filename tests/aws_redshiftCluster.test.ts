import CloudGraph from '@cloudgraph/sdk'
import RSClass from '../src/services/redshift'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'
import { RawAwsRedshiftCluster } from '../src/services/redshift/data'

describe('Redshift Cluster Service Test: ', () => {
  let getDataResult
  let formatResult

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const rsClass = new RSClass({ logger: CloudGraph.logger })
          getDataResult = await rsClass.getData({
            credentials,
            regions: region,
          })

          formatResult = getDataResult[region].map((item: RawAwsRedshiftCluster) =>
            rsClass.format({ service: item, region })
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