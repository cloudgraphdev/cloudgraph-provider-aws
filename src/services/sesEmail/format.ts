import { RawAwsSesEmail } from './data'
import { AwsSesEmail } from '../../types/generated'
import { sesArn } from '../../utils/generateArns'

/**
 * SES Email
 */

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSesEmail
  account: string
  region: string
}): AwsSesEmail => {
  const {
    Identity: email,
    VerificationStatus: verificationStatus,
  } = service
  const arn = sesArn({ region, account, identity: email })

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    email,
    verificationStatus,
  }
}
