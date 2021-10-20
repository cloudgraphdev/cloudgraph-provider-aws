import { OpenIDConnectProviderListEntry } from 'aws-sdk/clients/iam'

import resources from '../../enums/resources'
import { AwsIamOpenIdConnectProvider } from '../../types/generated'
import { getIamGlobalId } from '../../utils/ids'

/**
 * IAM OpenId Connect Provider
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: OpenIDConnectProviderListEntry
  account: string
  region: string
}): AwsIamOpenIdConnectProvider => {
  const { Arn: arn } = rawData

  return {
    id: getIamGlobalId({
      accountId: account,
      region,
      resourceType: resources.iamOpenIdConnectProvider,
    }),
    accountId: account,
    arn,
  }
}
