import kebabCase from 'lodash/kebabCase'
import resources from '../../enums/resources'
import { AwsIamRole } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsRole } from './data'

/**
 * IAM Role
 */

export default ({
  service: rawData,
}: {
  service: RawAwsRole
  account: string
  region: string
}): AwsIamRole => {
  const {
    RoleName: name,
    Arn: arn,
    Path: path,
    CreateDate: createdAt,
    Description: description,
    AssumeRolePolicyDocument: assumeRolePolicy,
    MaxSessionDuration: maxSessionDuration,
    // ManagedPolicies: managedPolicies,
    Tags: tags = {},
  } = rawData

  // Format Role Tags
  const roleTags = formatTagsFromMap(tags)

  const role = {
    id: `${name}-${kebabCase(resources.iamRole)}`,
    arn,
    name,
    path,
    createdAt: createdAt?.toISOString() || '',
    description,
    assumeRolePolicy,
    maxSessionDuration,
    tags: roleTags,
  }
  return role
}
