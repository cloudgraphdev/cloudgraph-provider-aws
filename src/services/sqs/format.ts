import { AwsSqs } from './data'
import { AwsSqs as AwsSqsType } from '../../types/generated'
import t from '../../properties/translations'
import getTime from '../../utils/dateutils'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'

/**
 * SQS
 */

export default ({
  service: key,
  account,
  region,
}: {
  service: AwsSqs
  account: string
  region: string
}): AwsSqsType => {
  const { queueUrl, Tags = {} } = key

  const {
    QueueArn: arn,
    ApproximateNumberOfMessages: approximateNumberOfMessages,
    ApproximateNumberOfMessagesNotVisible:
      approximateNumberOfMessagesNotVisible,
    ApproximateNumberOfMessagesDelayed: approximateNumberOfMessagesDelayed,
    VisibilityTimeout: visibilityTimeout,
    MaximumMessageSize: maximumMessageSize,
    MessageRetentionPeriod: messageRetentionPeriod,
    DelaySeconds: delaySeconds,
    Policy: policy,
    ReceiveMessageWaitTimeSeconds: receiveMessageWaitTimeSeconds,
    KmsMasterKeyId: kmsMasterKeyId,
    KmsDataKeyReusePeriodSeconds: kmsDataKeyReusePeriodSeconds,
    SqsManagedSseEnabled: sqsManagedSseEnabled,
    FifoQueue: fifoQueue,
    DeduplicationScope: deduplicationScope,
    FifoThroughputLimit: fifoThroughputLimit,
    ContentBasedDeduplication: contentBasedDeduplication,
  } = key?.sqsAttributes || {}

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    queueUrl,
    queueType: arn.includes('.fifo') ? t.fifo : t.standard,
    approximateNumberOfMessages: parseInt(approximateNumberOfMessages, 10),
    approximateNumberOfMessagesNotVisible: parseInt(
      approximateNumberOfMessagesNotVisible,
      10
    ),
    approximateNumberOfMessagesDelayed: parseInt(
      approximateNumberOfMessagesDelayed,
      10
    ),
    visibilityTimeout: getTime(visibilityTimeout),
    maximumMessageSize: Math.round(
      parseInt(maximumMessageSize, 10) * 0.001 // This is a conversion from bytes to Kbytes
    ),
    messageRetentionPeriod: getTime(messageRetentionPeriod),
    delaySeconds: `${delaySeconds} ${t.seconds}`,
    rawPolicy: policy,
    policy: formatIamJsonPolicy(policy),
    receiveMessageWaitTimeSeconds: getTime(receiveMessageWaitTimeSeconds),
    kmsMasterKeyId,
    kmsDataKeyReusePeriodSeconds,
    sqsManagedSseEnabled: sqsManagedSseEnabled === t.true,
    fifoQueue: fifoQueue === t.true,
    deduplicationScope,
    fifoThroughputLimit,
    contentBasedDeduplication: contentBasedDeduplication === t.true,
    tags: formatTagsFromMap(Tags),
  }
}
