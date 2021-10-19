import isEmpty from 'lodash/isEmpty'
import resources from '../../enums/resources'
import { AwsIamGroup } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { getIamId } from '../../utils/ids'
import { RawAwsIamUser } from '../iamUser/data'

/**
 * IAM User
 */

export default ({
  service: rawData,
  account,
}: {
  service: RawAwsIamUser
  account: string
  region: string
}): AwsIamGroup => {
  const {
    UserId: id,
    Arn: arn,
    UserName: name,
    Path: path,
    CreateDate: creationTime,
    PasswordLastUsed: passwordLastUsed,
    AccessKeyLastUsedData: accessKeys = [],
    Groups: groups = [],
    Tags: tags = {},
  } = rawData

  // Access key
  const accessKeyData = []

  if (!isEmpty(accessKeys)) {
    accessKeys.map(key => {
      accessKeyData.push({
        accessKeyId: key.AccessKeyId,
        lastUsedDate: key.AccessKeyLastUsed.LastUsedDate?.toISOString(),
        lastUsedRegion: key.AccessKeyLastUsed.Region,
        lastUsedService: key.AccessKeyLastUsed.ServiceName,
      })
    })
  }

  // Format User Tags
  const userTags = formatTagsFromMap(tags)

  const user = {
    id: getIamId({
      resourceId: id,
      resourceName: name,
      resourceType: resources.iamUser,
    }),
    arn,
    accountId: account,
    name,
    path,
    creationTime: creationTime?.toISOString() || '',
    accessKeyData,
    passwordLastUsed: passwordLastUsed?.toISOString() || '',
    groups,
    tags: userTags,
  }
  return user
}
