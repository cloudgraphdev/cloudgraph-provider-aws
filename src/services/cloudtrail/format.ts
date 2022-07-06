import { generateUniqueId } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'

import t from '../../properties/translations'
import { AwsCloudtrail } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsCloudTrail } from './data'

export default ({
  service: rawData,
  region,
  account,
}: {
  service: RawAwsCloudTrail
  account: string
  region: string
}): AwsCloudtrail => {
  const {
    id,
    Name: name,
    S3BucketName: s3BucketName,
    S3KeyPrefix: s3KeyPrefix,
    IncludeGlobalServiceEvents: includeGlobalServiceEvents,
    IsMultiRegionTrail: isMultiRegionTrail,
    HomeRegion: homeRegion,
    TrailARN: arn,
    LogFileValidationEnabled: logFileValidationEnabled,
    CloudWatchLogsLogGroupArn: cloudWatchLogsLogGroupArn,
    CloudWatchLogsRoleArn: cloudWatchLogsRoleArn,
    KmsKeyId: kmsKeyId,
    HasCustomEventSelectors: hasCustomEventSelectors,
    HasInsightSelectors: hasInsightSelectors,
    IsOrganizationTrail: isOrganizationTrail,
    TrailStatus: {
      LatestCloudWatchLogsDeliveryTime: latestCloudWatchLogsDeliveryTime,
      IsLogging: isLogging,
      LatestDeliveryTime: latestDeliveryTime,
      LatestNotificationTime: latestNotificationTime,
      StartLoggingTime: startLoggingTime,
      LatestDigestDeliveryTime: latestDigestDeliveryTime,
      LatestDeliveryAttemptTime: latestDeliveryAttemptTime,
      LatestNotificationAttemptTime: latestNotificationAttemptTime,
      LatestNotificationAttemptSucceeded: latestNotificationAttemptSucceeded,
      LatestDeliveryAttemptSucceeded: latestDeliveryAttemptSucceeded,
      TimeLoggingStarted: timeLoggingStarted,
      TimeLoggingStopped: timeLoggingStopped,
    } = {},
    EventSelectors,
    Tags,
  } = rawData

  let eventSelectors = []
  if (!isEmpty(EventSelectors)) {
    eventSelectors = EventSelectors.map(
      ({ ReadWriteType, IncludeManagementEvents, DataResources }) => ({
        id: generateUniqueId({
          arn,
          ReadWriteType,
          IncludeManagementEvents,
          DataResources,
        }),
        readWriteType: ReadWriteType,
        includeManagementEvents: IncludeManagementEvents,
        dataResources:
          DataResources?.map(({ Type, Values }) => ({
            id: generateUniqueId({
              arn,
              Type,
              Values,
            }),
            type: Type,
            values: Values,
          })) || [],
      })
    )
  }

  const cloudTrail = {
    id,
    arn,
    accountId: account,
    name,
    s3BucketName,
    s3KeyPrefix,
    includeGlobalServiceEvents: includeGlobalServiceEvents ? t.yes : t.no,
    isMultiRegionTrail: isMultiRegionTrail ? t.yes : t.no,
    homeRegion,
    logFileValidationEnabled: logFileValidationEnabled ? t.yes : t.no,
    cloudWatchLogsLogGroupArn,
    cloudWatchLogsRoleArn,
    kmsKeyId,
    hasCustomEventSelectors: hasCustomEventSelectors ? t.yes : t.no,
    hasInsightSelectors: hasInsightSelectors ? t.yes : t.no,
    isOrganizationTrail: isOrganizationTrail ? t.yes : t.no,
    status: {
      isLogging,
      latestDeliveryTime: latestDeliveryTime?.toISOString() || '',
      latestNotificationTime: latestNotificationTime?.toISOString() || '',
      startLoggingTime: startLoggingTime?.toISOString() || '',
      latestDigestDeliveryTime: latestDigestDeliveryTime?.toISOString() || '',
      latestCloudWatchLogsDeliveryTime:
        latestCloudWatchLogsDeliveryTime?.toISOString() || '',
      latestDeliveryAttemptTime,
      latestNotificationAttemptTime,
      latestNotificationAttemptSucceeded,
      latestDeliveryAttemptSucceeded,
      timeLoggingStarted,
      timeLoggingStopped,
    },
    eventSelectors,
    tags: formatTagsFromMap(Tags),
    region,
  }

  return cloudTrail
}
