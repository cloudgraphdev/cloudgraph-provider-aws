import { RawAwsSecurityHubMember } from './data'
import { AwsSecurityHubMember } from '../../types/generated'

/**
 * Security Hub Member
 */

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSecurityHubMember
  account: string
  region: string
}): AwsSecurityHubMember => {
  const { AccountId: accountId } = service

  return {
    id: accountId,
    accountId: account,
    arn: accountId,
    region,
  }
}
