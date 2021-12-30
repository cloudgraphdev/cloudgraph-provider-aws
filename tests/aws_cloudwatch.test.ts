import CloudGraph from '@cloudgraph/sdk'

import Cloudwatch from '../src/services/cloudwatch'
import Sns from '../src/services/sns'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'

describe('Cloudwatch Service Test: ', () => {
  let getDataResult
  let formatResult
  let cloudwatchConnections
  let cloudwatchId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const snsService = new Sns({ logger: CloudGraph.logger })
      const classInstance = new Cloudwatch({ logger: CloudGraph.logger })
      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(cloudwatchData =>
        classInstance.format({ service: cloudwatchData, region, account })
      )

      // Get SNS data
      const snsData = await snsService.getData({
        credentials,
        regions: region,
      })

      const [cloudwatch] = getDataResult[region]
      cloudwatchId = cloudwatch.AlarmName

      cloudwatchConnections = classInstance.getConnections({
        service: cloudwatch,
        data: [
          {
            name: services.sns,
            data: snsData,
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
            ActionsEnabled: expect.any(Boolean),
            AlarmArn: expect.any(String),
            AlarmActions: expect.arrayContaining<string>([]),
            AlarmConfigurationUpdatedTimestamp: expect.any(Date),
            StateUpdatedTimestamp: expect.any(Date),
            AlarmDescription: expect.any(String),
            AlarmName: expect.any(String),
            ComparisonOperator: expect.any(String),
            MetricName: expect.any(String),
            Namespace: expect.any(String),
            StateReason: expect.any(String),
            StateValue: expect.any(String),
            Statistic: expect.any(String),
            TreatMissingData: expect.any(String),
            DatapointsToAlarm: expect.any(Number),
            EvaluationPeriods: expect.any(Number),
            Threshold: expect.any(Number),
            Period: expect.any(Number),
            Dimensions: expect.arrayContaining([
              expect.objectContaining({
                Name: expect.any(String),
                Value: expect.any(String),
              }),
            ]),
            Tags: expect.objectContaining({
              Key: expect.any(String),
              Value: expect.any(String),
            }),
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
            actionsEnabled: expect.any(String),
            comparisonOperator: expect.any(String),
            description: expect.any(String),
            metric: expect.any(String),
            namespace: expect.any(String),
            period: expect.any(String),
            statistic: expect.any(String),
            evaluationPeriods: expect.any(Number),
            threshold: expect.any(String),
            actions: expect.arrayContaining<string>([]),
            dimensions: expect.arrayContaining([
              expect.objectContaining({
                name: expect.any(String),
                value: expect.any(String),
              }),
            ]),
            tags: expect.arrayContaining([
              expect.objectContaining({
                key: expect.any(String),
                value: expect.any(String),
              }),
            ]),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connections to SNS Topic', () => {
      const snsConnections = cloudwatchConnections[cloudwatchId]?.find(
        connection => connection.resourceType === services.sns
      )
      expect(snsConnections).toBeDefined()
    })
  })
})
