import { AwsConfigurationRule } from '../../types'
import { RawAwsConfigurationRule } from './data'

/**
 * Configuration Rule
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsConfigurationRule
  account: string
  region: string
}): AwsConfigurationRule => {
  const { ConfigRuleId: id, ConfigRuleArn: arn, ConfigRuleName: name } = rawData

  return {
    id,
    accountId: account,
    arn,
    region,
    name,
  }
}
