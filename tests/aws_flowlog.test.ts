import CloudGraph from '@cloudgraph/sdk'
import FlowLogService from '../src/services/flowLogs'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

describe('Flow Log Service Test: ', () => {
  let getDataResult
  let formatResult
  initTestConfig()
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        getDataResult = {}
        formatResult = {}
        try {
          const flowLogService = new FlowLogService({ logger: CloudGraph.logger })

          // Get Flow Log data
          getDataResult = await flowLogService.getData({
            credentials,
            regions: region,
          })

          // Format flow log data
          formatResult = getDataResult[region].map(log =>
            flowLogService.format({ service: log, region, account })
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
            FlowLogId: expect.any(String),
            DeliverLogsErrorMessage: expect.any(String),
            DeliverLogsPermissionArn: expect.any(String),
            DeliverLogsStatus: expect.any(String),
            FlowLogStatus: expect.any(String),
            LogGroupName: expect.any(String),
            ResourceId: expect.any(String),
            TrafficType: expect.any(String),
            LogDestinationType: expect.any(String),
            LogDestination: expect.any(String),
            LogFormat: expect.any(String),
            MaxAggregationInterval: expect.any(Number),
            CreationTime: expect.any(Date),
            Tags: expect.any(Object)
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
            region: expect.any(String),
            deliverLogsErrorMessage: expect.any(String),
            deliverLogsPermissionArn: expect.any(String),
            deliverLogsStatus: expect.any(String),
            logStatus: expect.any(String),
            groupName: expect.any(String),
            resourceId: expect.any(String),
            trafficType: expect.any(String),
            destinationType: expect.any(String),
            destination: expect.any(String),
            format: expect.any(String),
            maxAggregationInterval: expect.any(Number),
            creationTime: expect.any(String),
            tags: expect.any(Array)
          }),
        ])
      )
    })
  })
})
