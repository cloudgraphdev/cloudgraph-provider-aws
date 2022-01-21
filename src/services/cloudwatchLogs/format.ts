import { generateId } from '@cloudgraph/sdk'
import { AwsCloudwatchLog } from '../../types/generated'
import { RawAwsLogGroup } from './data'

/**
 * CloudWatch Logs
 */
export default ({
  service,
  account,
  region,
}: {
  service: RawAwsLogGroup & { region: string }
  account: string
  region: string
}): AwsCloudwatchLog => {
  const {
    logGroupName,
    creationTime: creationDate,
    retentionInDays,
    metricFilterCount,
    arn,
    storedBytes: bytes,
    kmsKeyId,
    MetricFilters: metricFilters,
  } = service

  const filters = metricFilters?.map(
    ({
      filterName,
      filterPattern,
      creationTime: filterCreationDate,
      logGroupName: filterLogGroupName,
      metricTransformations,
    }) => {
      const obj = {
        filterName,
        filterPattern,
        creationTime: filterCreationDate?.toString() || '',
        logGroupName: filterLogGroupName,
        metricTransformations:
          metricTransformations?.map(
            ({ metricName, metricNamespace, metricValue, defaultValue, unit }) => {
              const transformation = {
                metricName,
                metricNamespace,
                metricValue,
                defaultValue: defaultValue || 0,
                unit: unit || '',
              }
              return {
                id: generateId(transformation),
                ...transformation
              }
            }
          ) || [],
      }
      return {
        id: generateId(obj),
        ...obj
      }
    }
  )

  return {
    id: logGroupName,
    accountId: account,
    arn,
    region,
    creationTime: creationDate?.toString() || '',
    retentionInDays: retentionInDays || 0,
    metricFilterCount: metricFilterCount || 0,
    storedBytes: bytes?.toString() || '',
    kmsKeyId: kmsKeyId || '',
    metricFilters: filters || [],
  }
}
