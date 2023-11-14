import { AwsRdsEventSubscription } from '../../types/generated'
import { RawAwsRdsEventSubscription } from './data'

/**
 * RdsEventSubscription
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account,
  service: RawAwsRdsEventSubscription
  region,
}): AwsRdsEventSubscription => {
  const {
    EventSubscriptionArn: arn,
    CustomerAwsId: customerAwsId,
    CustSubscriptionId: custSubscriptionId,
    SnsTopicArn: snsTopicArn,
    Status: status,
    SubscriptionCreationTime: subscriptionCreationTime,
    SourceType: sourceType,
    SourceIdsList: sourceIdsList = [],
    EventCategoriesList: eventCategoriesList = [],
    Enabled: enabled
  } = rawData

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    customerAwsId,
    custSubscriptionId,
    snsTopicArn,
    status,
    subscriptionCreationTime,
    sourceType,
    sourceIdsList,
    eventCategoriesList,
    enabled
  }
}
