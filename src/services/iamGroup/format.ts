import resources from '../../enums/resources'
import { AwsIamGroup } from '../../types/generated'
import { getIamId } from '../../utils/ids'
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
    GroupId: id = '',
    GroupName: name = '',
    Arn: arn = '',
    Path: path = '',
    Policies: inlinePolicies = [],
  } = rawData

  const record = {
    id: getIamId({
      resourceId: id,
      resourceName: name,
      resourceType: resources.iamGroup,
    }),
    arn,
    accountId: account,
    path,
    name,
    inlinePolicies,
  }
  return record
}
