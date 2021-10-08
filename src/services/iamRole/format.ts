import kebabCase from 'lodash/kebabCase'
import resources from '../../enums/resources'
import { AwsIamRole } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsIamRole } from './data'

/**
 * IAM Role
 */

export default ({
  service: rawData,
  account,
}: {
  service: RawAwsIamRole
  account: string
  region: string
}): AwsIamRole => {
  const {
    RoleId: id,
    RoleName: name,
    Arn: arn,
    Path: path,
    CreateDate: createdAt,
    Description: description,
    AssumeRolePolicyDocument: assumeRolePolicy,
    MaxSessionDuration: maxSessionDuration,
    Policies: inlinePolicies,
    Tags: tags = {},
  } = rawData

  // Format Role Tags
  const roleTags = formatTagsFromMap(tags)

  const role = {
    id: `${name}-${id}-${kebabCase(resources.iamRole)}`,
    arn,
    accountId: account,
    name,
    path,
    createdAt: createdAt?.toISOString() || '',
    description,
    assumeRolePolicy,
    maxSessionDuration,
    inlinePolicies,
    tags: roleTags,
  }
  return role
}
