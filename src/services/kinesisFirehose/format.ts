import { RawAwsKinesisFirehose } from './data'
import { formatTagsFromMap } from '../../utils/format'
import { AwsKinesisFirehose } from '../../types/generated'

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsKinesisFirehose
  account: string
  region: string
}): AwsKinesisFirehose => {
  const {
    DeliveryStreamName: deliveryStreamName,
    DeliveryStreamARN: deliveryStreamARN,
    DeliveryStreamStatus: deliveryStreamStatus,
    FailureDescription: failureDescription,
    DeliveryStreamEncryptionConfiguration:
      deliveryStreamEncryptionConfiguration,
    DeliveryStreamType: deliveryStreamType,
    VersionId: versionId,
    CreateTimestamp: createTimestamp,
    LastUpdateTimestamp: lastUpdateTimestamp,
    Source: source,
    Tags: tags = {},
  } = rawData

  return {
    id: deliveryStreamARN,
    accountId: account,
    arn: deliveryStreamARN,
    name: deliveryStreamName,
    deliveryStreamStatus,
    failureDescriptionType: failureDescription?.Type || '',
    failureDescriptionDetails: failureDescription?.Details || '',
    encryptionConfig: {
      keyARN: deliveryStreamEncryptionConfiguration?.KeyARN || '',
      keyType: deliveryStreamEncryptionConfiguration?.KeyType || '',
      status: deliveryStreamEncryptionConfiguration?.Status || '',
      failureDescriptionType:
        deliveryStreamEncryptionConfiguration?.FailureDescription?.Type || '',
      failureDescriptionDetails:
        deliveryStreamEncryptionConfiguration?.FailureDescription?.Details ||
        '',
    },
    deliveryStreamType,
    versionId,
    createTimestamp: createTimestamp
      ? createTimestamp.toISOString()
      : undefined,
    lastUpdateTimestamp: lastUpdateTimestamp
      ? lastUpdateTimestamp.toISOString()
      : undefined,
    source: {
      kinesisStreamARN:
        source?.KinesisStreamSourceDescription?.KinesisStreamARN || '',
      roleARN: source?.KinesisStreamSourceDescription?.RoleARN || '',
      deliveryStartTimestamp:
        source?.KinesisStreamSourceDescription?.DeliveryStartTimestamp.toISOString() ||
        undefined,
    },
    region,
    tags: formatTagsFromMap(tags),
  }
}
