import { AwsIamRole } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

import { RawAwsInstanceProfile } from './data'

/**
 * IAM Instance Profile
 */

export default ({
  service: rawData,
  account,
}: {
  service: RawAwsInstanceProfile
  account: string
  region: string
}): AwsIamRole => {
  const {
    InstanceProfileId: instanceProfileId,
    InstanceProfileName: instanceProfileName = '',
    Arn: arn = '',
    Path: path = '',
    CreateDate: createDate,
    Tags: tags = {},
  } = rawData

  const role = {
    id: instanceProfileId,
    arn,
    accountId: account,
    path,
    name: instanceProfileName,
    createDate: createDate?.toISOString(),
    tags: formatTagsFromMap(tags),
  }
  return role
}
