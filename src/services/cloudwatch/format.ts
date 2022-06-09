import { MetricAlarm } from 'aws-sdk/clients/cloudwatch'

import t from '../../properties/translations'
import { TagMap } from '../../types'
import { AwsCloudwatch } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

/**
 * CloudWatch
 */
export default ({
  service,
  account,
  region,
}: {
  service: MetricAlarm & { Tags?: TagMap; region: string }
  account: string
  region: string
}): AwsCloudwatch => {
  const {
    AlarmDescription: description,
    ActionsEnabled: actionsEnabled,
    AlarmActions: actions,
    AlarmArn: arn,
    AlarmName: name,
    ComparisonOperator: comparisonOperator,
    Dimensions: dimensions = [],
    EvaluationPeriods: evaluationPeriods,
    MetricName: metric,
    Namespace: namespace,
    Period: period,
    Statistic: statistic,
    Threshold: threshold,
    Unit: unit = '',
    Tags,
  } = service
  return {
    id: name,
    accountId: account,
    arn,
    region,
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
    dimensions: dimensions.map(({ Name, Value }) => ({
      id: `${Name}:${Value}`,
      name: Name,
      value: Value,
    })),
    tags: formatTagsFromMap(Tags),
  }
}
