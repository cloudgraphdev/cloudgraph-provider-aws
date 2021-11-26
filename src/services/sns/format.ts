import cuid from 'cuid'
import { RawAwsSns } from './data'
import { AwsSns, AwsSnsSubscription } from '../../types/generated'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'
import { Subscription } from 'aws-sdk/clients/sns'

/**
 * SNS
 */

 const awsSNSSubscriptionConverter = (
  subscription: Subscription
): AwsSnsSubscription => ({
  id: cuid(),
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
    subscriptions,
  } = service

  return {
    id: arn,
    accountId: account,
    arn,
    tags: formatTagsFromMap(Tags),
    policy: formatIamJsonPolicy(policy),
    displayName,
    deliveryPolicy,
    subscriptions: subscriptions.map(awsSNSSubscriptionConverter),
  }
}
