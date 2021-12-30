import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsLogGroup } from './data'
import { RawAwsCloudwatch } from '../cloudwatch/data'
import services from '../../enums/services'

export default ({
  service: logGroup,
  data,
  region,
}: {
  account: string
  service: RawAwsLogGroup
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { logGroupName: id, kmsKeyId, MetricFilters: metricFilters } = logGroup
  const connections: ServiceConnection[] = []

  /**
   * Find KMS
   */
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(
      kmsKey => kmsKey.Arn === kmsKeyId
    )
    if (!isEmpty(kmsKeyInRegion)) {
      for (const kms of kmsKeyInRegion) {
        connections.push({
          id: kms.KeyId,
          resourceType: services.kms,
          relation: 'child',
          field: 'kms',
        })
      }
    }
  }

  /**
   * Find Metric Alarms
   */
  const metricAlarms = data.find(({ name }) => name === services.cloudwatch)

  let metricNames: string[] = []
  metricFilters
    ?.map(({ metricTransformations }) => metricTransformations)
    ?.forEach(transformation => {
      metricNames = metricNames.concat(
        transformation?.map(({ metricName }) => metricName)
      )
    })

  if (metricAlarms?.data?.[region] && !isEmpty(metricNames)) {
    const metricAlarmsInRegion: RawAwsCloudwatch[] = metricAlarms.data[
      region
    ].filter(({ MetricName }: RawAwsCloudwatch) =>
      metricNames.includes(MetricName)
    )

    if (!isEmpty(metricAlarmsInRegion)) {
      for (const metricAlarm of metricAlarmsInRegion) {
        connections.push({
          id: metricAlarm.AlarmName,
          resourceType: services.cloudwatch,
          relation: 'child',
          field: 'cloudwatch',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
