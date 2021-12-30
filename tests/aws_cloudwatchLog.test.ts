import CloudGraph from '@cloudgraph/sdk'

import CloudwatchLog from '../src/services/cloudwatchLogs'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import Kms from '../src/services/kms'
import CloudWatch from '../src/services/cloudwatch'
import services from '../src/enums/services'

describe('Cloudwatch Logs Service Test: ', () => {
  let getDataResult
  let formatResult
  let cloudwatchLogsConnections
  let cloudwatchLogsId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const kmsService = new Kms({ logger: CloudGraph.logger })
      const cloudWatchService = new CloudWatch({ logger: CloudGraph.logger })
      const classInstance = new CloudwatchLog({ logger: CloudGraph.logger })
      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(cloudwatchLogData =>
        classInstance.format({ service: cloudwatchLogData, region, account })
      )

      // Get KMS data
      const kmsData = await kmsService.getData({
        credentials,
        regions: region,
      })

      // Get Metric Alrams data
      const metricAlarmsData = await cloudWatchService.getData({
        credentials,
        regions: region,
      })

      const [logGroup] = getDataResult[region]
      cloudwatchLogsId = logGroup.logGroupName

      cloudwatchLogsConnections = classInstance.getConnections({
        service: logGroup,
        data: [
          {
            name: services.kms,
            data: kmsData,
            account,
            region,
          },
          {
            name: services.cloudwatch,
            data: metricAlarmsData,
            account,
            region,
          },
        ],
        region,
        account,
      })
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
    return Promise.resolve()
  })

  describe('getData', () => {
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', async () => {
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            logGroupName: expect.any(String),
            creationTime: expect.any(Number),
            retentionInDays: expect.any(Number),
            metricFilterCount: expect.any(Number),
            arn: expect.any(String),
            storedBytes: expect.any(Number),
            kmsKeyId: expect.any(String),
            MetricFilters: expect.any(Array),
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
            accountId: expect.any(String),
            arn: expect.any(String),
            region: expect.any(String),
            creationTime: expect.any(String),
            retentionInDays: expect.any(Number),
            metricFilterCount: expect.any(Number),
            storedBytes: expect.any(String),
            kmsKeyId: expect.any(String),
            metricFilters: expect.any(Array),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to kms', () => {
      const kmsConnections = cloudwatchLogsConnections[
        cloudwatchLogsId
      ]?.filter(connection => connection.resourceType === services.kms)

      expect(kmsConnections).toBeDefined()
      expect(kmsConnections.length).toBe(1)
    })

    test('should verify the connection to metric alarms', () => {
      const metricAlarmsConnections = cloudwatchLogsConnections[
        cloudwatchLogsId
      ]?.filter(connection => connection.resourceType === services.cloudwatch)

      expect(metricAlarmsConnections).toBeDefined()
      expect(metricAlarmsConnections.length).toBe(1)
    })
  })
})
