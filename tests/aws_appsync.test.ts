import CloudGraph from '@cloudgraph/sdk'

import AppSyncClass from '../src/services/appSync'
import { RawAwsAsg } from '../src/services/asg/data'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'

describe.skip('AppSync Service Test: ', () => {
  let getDataResult
  let formatResult

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const appSyncClass = new AppSyncClass({ logger: CloudGraph.logger })

          getDataResult = await appSyncClass.getData({
            credentials,
            regions: region,
          })
          formatResult = getDataResult[region].map((item: RawAwsAsg) =>
            appSyncClass.format({ service: item, region })
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
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            apiId: expect.any(String),
            arn: expect.any(String),
            region: expect.any(String),
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
            name: expect.any(String),
            region: expect.any(String),
          }),
        ])
      )
    })
  })
})
