import { AwsGlueTrigger } from '../../types/generated'
import { glueTriggerArn } from '../../utils/generateArns'
import { RawAwsGlueTrigger } from './data'

/**
 * Glue Trigger
 */
export default ({
  account,
  region,
  service: crawler,
}: {
  account: string
  region: string
  service: RawAwsGlueTrigger
}): AwsGlueTrigger => {
  const { Name: name } = crawler

  const arn = glueTriggerArn({ region, account, name })

  return {
    accountId: account,
    arn,
    id: arn,
    region,
    name
  }
}
