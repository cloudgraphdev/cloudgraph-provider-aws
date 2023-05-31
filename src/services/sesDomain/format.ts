import { RawAwsSesDomain } from './data'
import { AwsSesDomain } from '../../types/generated'
import { sesArn } from '../../utils/generateArns'

/**
 * SES Domain
 */

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSesDomain
  account: string
  region: string
}): AwsSesDomain => {
  const {
    Identity: domain,
    VerificationStatus: verificationStatus,
  } = service
  const arn = sesArn({ region, account, identity: domain })

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    domain,
    verificationStatus,
  }
}
