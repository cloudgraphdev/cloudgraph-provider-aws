import { AwsCodePipelineWebhook } from '../../types/generated'
import { RawAwsWebhook } from './data'

/**
 * Code Pipeline Webhook
 */
export default ({
  account,
  region,
  service: webhook,
}: {
  account: string
  region: string
  service: RawAwsWebhook
}): AwsCodePipelineWebhook => {
  const {
    arn,
    definition,
  } = webhook

  return {
    accountId: account,
    arn,
    id: arn,
    name: definition?.name || '',
    region,
  }
}
