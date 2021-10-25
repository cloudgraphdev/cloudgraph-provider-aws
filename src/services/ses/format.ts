import { RawAwsSes } from './data'
import { AwsSes } from '../../types/generated'
import { sesArn } from '../../utils/generateArns'

/**
 * SES
 */

export default ({ 
  service,
  account,
  region,
}:{
  service: RawAwsSes
  account: string
  region: string
}): AwsSes => {
  const {
    Identity: email,
    VerificationStatus: verificationStatus,
  } = service
  const arn = sesArn({region, account, email})

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    email,
    verificationStatus,
  }
}
