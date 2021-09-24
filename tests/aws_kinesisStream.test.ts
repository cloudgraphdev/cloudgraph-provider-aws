import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'

import KinesisClass from '../src/services/kinesisStream'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'
import { RawAwsKinesisStream } from '../src/services/kinesisStream/data'

xdescribe('Kinesis Stream Service Test: ', () => {
  let getDataResult
  let formatResult

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const kinesisClass = new KinesisClass({ logger: CloudGraph.logger })

          getDataResult = await kinesisClass.getData({
            credentials,
            regions: region,
          })
          formatResult = getDataResult[region].map(
            (item: RawAwsKinesisStream) =>
              kinesisClass.format({ service: item, region })
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
            StreamName: expect.any(String),
            StreamARN: expect.any(String),
            StreamStatus: expect.any(String),
            Shards: expect.arrayContaining([
              expect.objectContaining({
                ShardId: expect.any(String),
                HashKeyRange: expect.objectContaining({
                  StartingHashKey: expect.any(String),
                  EndingHashKey: expect.any(String),
                }),
                SequenceNumberRange: expect.objectContaining({
                  StartingSequenceNumber: expect.any(String),
                }),
              }),
            ]),
            EnhancedMonitoring: expect.arrayContaining([
              expect.objectContaining({
                ShardLevelMetrics: expect.arrayContaining([expect.any(String)]),
              }),
            ]),
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
            streamName: expect.any(String),
            streamStatus: expect.any(String),
            region: expect.any(String),
            shards: expect.arrayContaining([
              expect.objectContaining({
                shardId: expect.any(String),
                hashKeyRangeStarting: expect.any(String),
                hashKeyRangeEnding: expect.any(String),
                sequenceNumberRangeStaring: expect.any(String),
              }),
            ]),
            retentionPeriodHours: expect.any(Number),
            enhancedMonitoring: expect.arrayContaining([
              expect.objectContaining({
                shardLevelMetrics: expect.arrayContaining([expect.any(String)]),
              }),
            ]),
          }),
        ])
      )
    })
  })
})
