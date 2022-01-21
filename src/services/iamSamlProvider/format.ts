import { SAMLProviderListEntry } from 'aws-sdk/clients/iam'

import { AwsIamSamlProvider } from '../../types/generated'

/**
 * IAM SAML Provider
 */

export default ({
  service: rawData,
  account,
}: {
  service: SAMLProviderListEntry
  account: string
  region: string
}): AwsIamSamlProvider => {
  const { Arn: arn = '', ValidUntil, CreateDate } = rawData

  return {
    id: arn,
    arn,
    accountId: account,
    validUntil: ValidUntil?.toISOString() || '',
    createdDate: CreateDate?.toISOString() || '',
  }
}
