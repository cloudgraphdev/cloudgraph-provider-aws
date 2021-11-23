import CloudGraph from '@cloudgraph/sdk'
import SqsClass from '../src/services/sqs'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'
import { AwsSqs } from '../src/services/sqs/data'

describe('SQS Service Test: ', () => {
  let getDataResult
  let formatResult

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const sqsClass = new SqsClass({ logger: CloudGraph.logger })
          getDataResult = await sqsClass.getData({
            credentials,
            regions: region,
          })

          formatResult = getDataResult[region].map((item: AwsSqs) =>
            sqsClass.format({ service: item, region })
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
            queueUrl: expect.any(String),
            region: expect.any(String),
            sqsAttributes: expect.objectContaining({
              QueueArn: expect.any(String),
            }),
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
            queueUrl: expect.any(String),
            queueType: expect.any(String),
            policy: expect.objectContaining({
              id: expect.any(String),
              statement: expect.arrayContaining([
                expect.objectContaining({
                  action: expect.arrayContaining([expect.any(String)]),
                  effect: expect.any(String),
                  resource: expect.arrayContaining([expect.any(String)]),
                }),
              ]),
              version: expect.any(String),
            }),
          }),
        ])
      )
    })
  })
})
