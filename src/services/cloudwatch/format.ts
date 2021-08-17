import { MetricAlarm } from 'aws-sdk/clients/cloudwatch'
import t from '../../properties/translations'
import { TagMap } from '../../types'
import { AwsCloudwatch, Tag } from '../../types/generated'
import { toCamel } from '../../utils'
import { formatTagsFromMap } from '../../utils/format'

/**
 * CloudWatch
 */
export default ({
  // allTagData,
  service: rawData,
}: {
  // allTagData
  service: MetricAlarm & { Tags?: TagMap; region: string }
}): AwsCloudwatch => {
  const { Tags } = rawData
  const tags = formatTagsFromMap(Tags)
  const {
    alarmDescription: description,
    actionsEnabled,
    alarmActions: actions,
    alarmArn: arn,
    alarmName: name,
    comparisonOperator,
    dimensions = [],
    evaluationPeriods,
    metricName: metric,
    namespace,
    period,
    statistic,
    threshold,
    unit = '',
  } = toCamel(rawData)

  /**
   * Add these tags to the list of global tags so we can filter by tag on the front end
   */
  // combineElementsTagsWithExistingGlobalTags({ tags, allTagData })

  return {
    id: name,
    arn,
    metric,
    namespace,
    description,
    actionsEnabled: actionsEnabled ? t.yes : t.no,
    actions,
    comparisonOperator,
    statistic,
    threshold: `${threshold} ${unit}`,
    period: `${period} ${t.seconds}`,
    evaluationPeriods,
    dimensions,
    tags,
  }
}
