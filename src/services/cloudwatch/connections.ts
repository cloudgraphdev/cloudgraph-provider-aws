import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsCloudwatch } from './data'
import { RawAwsCloudfront } from '../cloudfront/data'
import services from '../../enums/services'
import { globalRegionName } from '../../enums/regions'

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
  const {
    AlarmName: id,
    AlarmActions: alarmActions,
    Dimensions: dimensions,
  } = cloudwatch
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

  /**
   * Find Cloudfront
   * related to the cloudwatch
   */
  const cloudfronts = data.find(({ name }) => name === services.cloudfront)
  if (cloudfronts?.data?.[globalRegionName]) {
    const cloudfrontsInRegion: RawAwsCloudfront[] = cloudfronts.data[
      globalRegionName
    ].filter(({ summary: { Id: cloudfrontId } }: RawAwsCloudfront) =>
      dimensions?.some(d => d.Value === cloudfrontId)
    )

    if (!isEmpty(cloudfrontsInRegion)) {
      for (const cf of cloudfrontsInRegion) {
        const {
          summary: { Id: cloudfrontId },
        }: RawAwsCloudfront = cf
        connections.push({
          id: cloudfrontId,
          resourceType: services.cloudfront,
          relation: 'child',
          field: 'cloudfront',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
