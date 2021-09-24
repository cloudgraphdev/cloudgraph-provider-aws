import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'

import KinesisStreamClass from '../src/services/kinesisStream'
import KinesisFirehoseClass from '../src/services/kinesisFirehose'
import { initTestConfig } from "../src/utils"
import { credentials, region } from '../src/properties/test'
import { RawAwsKinesisFirehose } from '../src/services/kinesisFirehose/data'
import services from '../src/enums/services'

xdescribe('Kinesis Firehose Service Test: ', () => {
  let getDataResult
  let formatResult
  let kinesisFirehoseConnections
  let kinesisFirehoseId

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const kinesisFirehoseClass = new KinesisFirehoseClass({ logger: CloudGraph.logger })
          const kinesisStreamClass = new KinesisStreamClass({ logger: CloudGraph.logger })
          
          getDataResult = await kinesisFirehoseClass.getData({
            credentials,
            regions: region,
          })

          formatResult = getDataResult[region].map((item: RawAwsKinesisFirehose) =>
            kinesisFirehoseClass.format({ service: item, region })
          )
          // Get Kinesis Stream data
          const kinesisStreamData = await kinesisStreamClass.getData({
            credentials,
            regions: region,
          })

          const [kinesisFirehose] = getDataResult[region]
          kinesisFirehoseId = kinesisFirehose.DeliveryStreamARN

          kinesisFirehoseConnections = kinesisFirehoseClass.getConnections({
            service: kinesisFirehose,
            data: [
              {
                name: services.kinesisStream,
                data: kinesisStreamData,
                region,
              }
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
            DeliveryStreamName: expect.any(String),
            DeliveryStreamARN: expect.any(String),
            DeliveryStreamStatus: expect.any(String),
            DeliveryStreamType: expect.any(String),
            VersionId: expect.any(String),
            Destinations: expect.arrayContaining([
              expect.objectContaining({
                DestinationId: expect.any(String)
              })
            ]),
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
            deliveryStreamStatus: expect.any(String),
            versionId: expect.any(String),
            region: expect.any(String),
            destinations: expect.arrayContaining([
              expect.objectContaining({
                destinationId: expect.any(String),
              })
            ]),
          })
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to kinesis stream', async () => {
      const kinesisStreamConnections = kinesisFirehoseConnections[kinesisFirehoseId].filter(
        connection => connection.resourceType === services.kinesisStream
      )

      expect(kinesisStreamConnections).toBeDefined()
      expect(kinesisStreamConnections.length).toBe(1)
    })
  })
})
