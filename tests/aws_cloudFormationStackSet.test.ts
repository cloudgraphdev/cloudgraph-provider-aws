import CloudGraph from '@cloudgraph/sdk'

import CloudFormationClass from '../src/services/cloudFormationStackSet'

import { credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import { RawAwsCloudFormationStackSet } from '../src/services/cloudFormationStackSet/data'

describe('Cloud formation Service Test: ', () => {
  let getDataResult
  let formatResult

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const cfClass = new CloudFormationClass({ logger: CloudGraph.logger })

          getDataResult = await cfClass.getData({
            credentials,
            regions: region,
          })

          formatResult = getDataResult[region].map(
            (item: RawAwsCloudFormationStackSet) =>
              cfClass.format({ service: item, region })
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
            PermissionModel: expect.any(String),
            StackSetId: expect.any(String),
            StackSetName: expect.any(String),
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
            name: expect.any(String),
            permissionModel: expect.any(String),
            region: expect.any(String),
          }),
        ])
      )
    })
  })
})
