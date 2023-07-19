import { RawAwsSecurityHubStandardSubscription } from './data'
import { AwsSecurityHubStandardSubscription } from '../../types/generated'

/**
 * Security Hub Standard Subscription
 */

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSecurityHubStandardSubscription
  account: string
  region: string
}): AwsSecurityHubStandardSubscription => {
  const { StandardsArn: arn } = service

  return {
    id: arn,
    accountId: account,
    arn,
    region,
  }
}
