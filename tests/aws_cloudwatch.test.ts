// file: cloudwatch.test.ts
import { CloudWatch } from 'aws-sdk'
import CloudGraph from 'cloud-graph-sdk'

import environment from '../src/config/environment'
import Cloudwatch from '../src/services/cloudWatch'

// TODO: Probably solved by ENG-89
const credentials = {
  accessKeyId: 'test',
  secretAccessKey: 'test',
}

// TODO: Single region for now to match free license Localstack limitation
const regions = 'us-east-1'
const cloudwatch = new CloudWatch({
  region: regions,
  credentials,
  endpoint: environment.LOCALSTACK_AWS_ENDPOINT,
})

// TODO: Will be better implemented using a terraform integration
const testId = 'Instance i-1234567890abcdef0 CPU Utilization'
beforeAll(done => {
  cloudwatch.putMetricAlarm(
    {
      Namespace: 'AWS/EC2',
      MetricName: 'CPUUtilization',
      Dimensions: [
        {
          Name: 'InstanceId',
          Value: 'i-1234567890abcdef0',
        },
      ],
      AlarmActions: ['arn:aws:sns:us-west-1:123456789012:my_sns_topic'],
      ComparisonOperator: 'GreaterThanThreshold',
      DatapointsToAlarm: 3,
      EvaluationPeriods: 4,
      Period: 60,
      Statistic: 'Average',
      Threshold: 40,
      AlarmDescription:
        'CPU Utilization of i-1234567890abcdef0 with 40% as threshold',
      AlarmName: 'Instance i-1234567890abcdef0 CPU Utilization',
      Tags: [{ Key: 'testTag', Value: 'TestValue' }],
    },
    () => done()
  )
})

test('should be a valid request', async () => {
  const config = { logger: CloudGraph.logger }
  const classInstance = new Cloudwatch(config)
  const response = await classInstance.getData({ credentials, regions })
  expect(response[regions][0].tags).toBeDefined()
})

afterAll(done => {
  cloudwatch.deleteAlarms({ AlarmNames: [testId] }, () => done())
})
