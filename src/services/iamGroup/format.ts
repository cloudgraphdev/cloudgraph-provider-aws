import kebabCase from 'lodash/kebabCase'
import resources from '../../enums/resources'
import { AwsIamGroup } from '../../types/generated'
import { RawAwsIamGroup } from '../iamGroup/data'

/**
 * IAM Group
 */

export default ({
  service: rawData,
}: {
  service: RawAwsIamGroup
  account: string
  region: string
}): AwsIamGroup => {
  const {
    GroupName: name,
    Arn: arn,
    Path: path,
    // ManagedPolicies: managedPolicies,
  } = rawData

  const record = {
    id: `${name}-${kebabCase(resources.iamGroup)}`,
    arn,
    path,
    name,
  }
  return record
}
