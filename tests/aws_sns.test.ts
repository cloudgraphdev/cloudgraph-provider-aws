import CloudGraph from '@cloudgraph/sdk'
import SnsClass from '../src/services/sns'
import KmsClass from '../src/services/kms'
import { initTestConfig } from '../src/utils'
import { account, credentials, region } from '../src/properties/test'
import { RawAwsSns } from '../src/services/sns/data'
import services from '../src/enums/services'

describe('SNS Service Test: ', () => {
  let getDataResult
  let formatResult
  let kmsResult
  let snsConnections
  let arn

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const snsClass = new SnsClass({ logger: CloudGraph.logger })
          const kmsClass = new KmsClass({ logger: CloudGraph.logger })
          getDataResult = await snsClass.getData({
            credentials,
            regions: region,
          })
          kmsResult = await kmsClass.getData({
            credentials,
            regions: region,
          })

          formatResult = getDataResult[region].map((item: RawAwsSns) =>
            snsClass.format({ service: item, region })
          )

          const [sns] = getDataResult[region]
          arn = sns.TopicArn

          snsConnections = snsClass.getConnections({
            account,
            service: sns,
            data: [
              {
                name: services.kms,
                data: kmsResult,
                region,
              },
            ],
            region,
          })
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
            Policy: expect.any(String),
            region: expect.any(String),
            DisplayName: expect.any(String),
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
            arn: expect.any(String),
            region: expect.any(String),
            policy: expect.objectContaining({
              id: expect.any(String),
              statement: expect.arrayContaining([
                expect.objectContaining({
                  action: expect.arrayContaining([expect.any(String)]),
                  condition: expect.arrayContaining([
                    expect.objectContaining({
                      key: expect.any(String),
                      operator: expect.any(String),
                      value: expect.arrayContaining([expect.any(String)]),
                    }),
                  ]),
                  effect: expect.any(String),
                  resource: expect.arrayContaining([expect.any(String)]),
                }),
              ]),
              version: expect.any(String),
            }),
            displayName: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connections to kms', () => {
      const kmsConnections = snsConnections[arn]?.find(
        kms => kms.resourceType === services.kms
      )
      expect(kmsConnections).toBeDefined()
    })
  })
})
