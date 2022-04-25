import { AwsIamPolicy } from '../../types/generated'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'
import { RawAwsIamPolicy } from './data'

const GLOBAL_ARN_PREFIX = '::aws:'

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
    accountId: arn.includes(GLOBAL_ARN_PREFIX) ? 'global' : account, // Uses global for AWS managed policies
    path,
    rawPolicy: policyContent,
    policyContent: formatIamJsonPolicy(policyContent),
    description,
    tags: policyTags,
  }
  return policy
}
