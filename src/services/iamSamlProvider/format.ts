import { SAMLProviderListEntry } from 'aws-sdk/clients/iam'

import resources from '../../enums/resources'
import { AwsIamSamlProvider } from '../../types/generated'
import { getIamGlobalId } from '../../utils/ids'

/**
 * IAM SAML Provider
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: SAMLProviderListEntry
  account: string
  region: string
}): AwsIamSamlProvider => {
  const { Arn: arn = '', ValidUntil, CreateDate } = rawData

  return {
    id: getIamGlobalId({
      accountId: account,
      region,
      resourceType: resources.iamSamlProvider,
    }),
    arn,
    accountId: account,
    validUntil: ValidUntil?.toISOString() || '',
    createdDate: CreateDate?.toISOString() || '',
  }
}
