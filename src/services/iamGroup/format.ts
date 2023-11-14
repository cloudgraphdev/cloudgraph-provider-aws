import { AwsIamGroup } from '../../types/generated'
import { RawAwsIamGroup } from '../iamGroup/data'

/**
 * IAM Group
 */

export default ({
  service: rawData,
  account,
}: {
  service: RawAwsIamGroup
  account: string
  region: string
}): AwsIamGroup => {
  const {
    GroupName: name = '',
    Arn: arn = '',
    Path: path = '',
    Policies: inlinePolicies = [],
    ManagedPolicies: managedPolicies = [],
  } = rawData

  const record = {
    id: arn,
    arn,
    accountId: account,
    path,
    name,
    inlinePolicies,
    managedPolicies: managedPolicies.map(({ PolicyArn, PolicyName }) => ({
      policyArn: PolicyArn,
      policyName: PolicyName,
    })),
  }
  return record
}
