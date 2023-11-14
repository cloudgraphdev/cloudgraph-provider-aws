import { AwsConfigurationDeliveryChannel } from '../../types'
import { RawAwsConfigurationDeliveryChannel } from './data'

/**
 * Configuration Delivery Channel
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsConfigurationDeliveryChannel
  account: string
  region: string
}): AwsConfigurationDeliveryChannel => {
  const { name } = rawData

  return {
    id: name,
    accountId: account,
    arn: name,
    region,
    name,
  }
}
