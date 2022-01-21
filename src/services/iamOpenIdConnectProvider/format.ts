import { OpenIDConnectProviderListEntry } from 'aws-sdk/clients/iam'

import { AwsIamOpenIdConnectProvider } from '../../types/generated'

/**
 * IAM OpenId Connect Provider
 */

export default ({
  service: rawData,
  account,
}: {
  service: OpenIDConnectProviderListEntry
  account: string
  region: string
}): AwsIamOpenIdConnectProvider => {
  const { Arn: arn = '' } = rawData

  return {
    id: arn,
    accountId: account,
    arn,
  }
}
