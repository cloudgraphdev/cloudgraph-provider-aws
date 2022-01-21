import { AwsIamPolicy } from '../../types/generated'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'
import { RawAwsIamPolicy } from './data'

/**
 * IAM Policy
 */

export default ({
  service: rawData,
  account,
}: {
  service: RawAwsIamPolicy
  account: string
  region: string
}): AwsIamPolicy => {
  const {
    PolicyName: name = '',
    Arn: arn = '',
    Path: path = '',
    Description: description = '',
    Document: policyContent = '',
    Tags: tags = {},
  } = rawData

  // Format Policy Tags
  const policyTags = formatTagsFromMap(tags)

  const policy = {
    id: arn,
    name,
    arn,
    accountId: account,
    path,
    policyContent: formatIamJsonPolicy(policyContent),
    description,
    tags: policyTags,
  }
  return policy
}
