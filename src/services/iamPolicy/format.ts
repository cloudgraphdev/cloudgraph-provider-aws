import resources from '../../enums/resources'
import { AwsIamPolicy } from '../../types/generated'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'
import { getIamId } from '../../utils/ids'
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
    PolicyId: id = '',
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
    id: getIamId({
      resourceId: id,
      resourceName: name,
      resourceType: resources.iamPolicy,
    }),
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
