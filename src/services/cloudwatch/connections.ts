import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsCloudwatch } from './data'
import services from '../../enums/services'

export default ({
  service: cloudwatch,
  data,
  region,
}: {
  account: string
  service: RawAwsCloudwatch
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { AlarmName: id, AlarmActions: alarmActions } = cloudwatch
  const connections: ServiceConnection[] = []

  /**
   * Find SNS topic
   * related to the cloudTrail
   */
  const snsTopics = data.find(({ name }) => name === services.sns)
  if (snsTopics?.data?.[region]) {
    const snsTopicsInRegion = snsTopics.data[region].filter(topic =>
      alarmActions?.includes(topic.TopicArn)
    )

    if (!isEmpty(snsTopicsInRegion)) {
      for (const topic of snsTopicsInRegion) {
        connections.push({
          id: topic.TopicArn,
          resourceType: services.sns,
          relation: 'child',
          field: 'sns',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
