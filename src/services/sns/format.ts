import { RawAwsSns } from './data'
import { AwsSns, AwsSnsSubscription } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { Subscription } from 'aws-sdk/clients/sns'

/**
 * SNS
 */

 const awsSNSSubscriptionConverter = (
  subscription: Subscription
): AwsSnsSubscription => ({
  arn: subscription.SubscriptionArn,
  endpoint: subscription.Endpoint,
  protocol: subscription.Protocol,
})

export default ({ 
  service,
  account,
  region,
}:{
  service: RawAwsSns
  account: string
  region: string
}): AwsSns => {
  const {
    TopicArn: arn,
    Tags = {},
    Policy: policy,
    DisplayName: displayName,
    DeliveryPolicy: deliveryPolicy,
    KmsMasterKeyId: kmsMasterKeyId,
    subscriptions,
  } = service

  return {
    id: arn,
    accountId: account,
    arn,
    tags: formatTagsFromMap(Tags),
    policy,
    displayName,
    deliveryPolicy,
    kmsMasterKeyId,
    subscriptions: subscriptions.map(awsSNSSubscriptionConverter),
  }
}
