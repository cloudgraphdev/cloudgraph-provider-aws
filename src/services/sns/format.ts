import { generateUniqueId } from '@cloudgraph/sdk'
import { Subscription } from 'aws-sdk/clients/sns'

import { RawAwsSns } from './data'
import { AwsSns, AwsSnsSubscription } from '../../types/generated'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'

/**
 * SNS
 */

const awsSNSSubscriptionConverter = (
  subscription: Subscription
): AwsSnsSubscription => ({
  id: generateUniqueId({
    ...subscription,
  }),
  arn: subscription.SubscriptionArn,
  endpoint: subscription.Endpoint,
  protocol: subscription.Protocol,
})

export default ({
  service,
  account,
  region,
}: {
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
    subscriptions = [],
  } = service

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    tags: formatTagsFromMap(Tags),
    rawPolicy: policy,
    policy: formatIamJsonPolicy(policy),
    displayName,
    deliveryPolicy,
    subscriptions: subscriptions?.map(awsSNSSubscriptionConverter) || [],
  }
}
