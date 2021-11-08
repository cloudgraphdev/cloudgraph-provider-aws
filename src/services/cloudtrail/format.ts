import cuid from 'cuid'
import t from '../../properties/translations'
import { AwsCloudtrail } from '../../types/generated';
import { formatTagsFromMap } from '../../utils/format';
import { RawAwsCloudTrail } from './data';

export default ({
  service: rawData,
  region,
  account
}: {
  service: RawAwsCloudTrail
  account: string
  region: string
}): AwsCloudtrail => {
  const {
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
    Tags,
  } = rawData

  const cloudTrail = {
    id: arn,
    cgId: cuid(),
    arn,
    accountId: account,
    name,
    s3BucketName,
    s3KeyPrefix,
    includeGlobalServiceEvents: includeGlobalServiceEvents? t.yes : t.no,
    isMultiRegionTrail: isMultiRegionTrail? t.yes : t.no,
    homeRegion,
    logFileValidationEnabled: logFileValidationEnabled? t.yes : t.no,
    cloudWatchLogsLogGroupArn,
    cloudWatchLogsRoleArn,
    kmsKeyId,
    hasCustomEventSelectors: hasCustomEventSelectors? t.yes : t.no,
    hasInsightSelectors: hasInsightSelectors? t.yes : t.no,
    isOrganizationTrail: isOrganizationTrail? t.yes : t.no,
    tags: formatTagsFromMap(Tags),
    region,
  }

  return cloudTrail
}
