import { TargetList } from 'aws-sdk/clients/cloudwatchevents'
import { AwsCloudwatchEventRule } from '../../types/generated'
import { RawAwsCloudwatchEventRule } from './data'

const formatTargets = (targets: TargetList): { id: string; arn: string }[] =>
  targets.map(({ Id, Arn }) => ({
    id: Id,
    arn: Arn,
  }))

/**
 * CloudWatch Event Rule
 */
export default ({
  service,
  account,
  region,
}: {
  service: RawAwsCloudwatchEventRule
  account: string
  region: string
}): AwsCloudwatchEventRule => {
  const { EventBusName: eventBusName, Name: id, Arn: arn, targets } = service
  return {
    id,
    accountId: account,
    arn,
    region,
    eventBusName,
    targets: formatTargets(targets),
  }
}
