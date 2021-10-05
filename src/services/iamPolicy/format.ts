import kebabCase from 'lodash/kebabCase'
import resources from '../../enums/resources'
import { AwsIamPolicy } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsPolicy } from './data'

/**
 * IAM Policy
 */

export default ({
  service: rawData,
}: {
  service: RawAwsPolicy
  account: string
  region: string
}): AwsIamPolicy => {
  const {
    PolicyName: name,
    Arn: arn,
    Path: path,
    Description: description = '',
    Document: policyContent,
    Tags: tags = {},
  } = rawData

  // Format Policy Tags
  const policyTags = formatTagsFromMap(tags)

  const policy = {
    id: `${name}-${kebabCase(resources.iamPolicy)}`,
    name,
    arn,
    path,
    policyContent,
    description,
    tags: policyTags,
  }
  return policy
}
