import { RawAwsSecurityHub } from './data'
import {
  AwsSecurityHub
} from '../../types/generated'


/**
 * Security Hub
 */

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSecurityHub
  account: string
  region: string
}): AwsSecurityHub => {
  const {
    HubArn: arn,
    SubscribedAt: subscribedAt,
    AutoEnableControls: autoEnableControls,
  } = service

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    subscribedAt,
    autoEnableControls,
  }
}
