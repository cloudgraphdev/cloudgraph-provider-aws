import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'
import resources from '../../enums/resources'
import { AwsIamGroup } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsIamUser } from '../iamUser/data'

/**
 * IAM User
 */

export default ({
  service: rawData,
}: {
  service: RawAwsIamUser
  account: string
  region: string
}): AwsIamGroup => {
  const {
    Arn: arn,
    UserName: name,
    Path: path,
    CreateDate: creationTime,
    PasswordLastUsed: passwordLastUsed,
    AccessKeyLastUsedData: accessKeys = [],
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
    id: `${name}-${kebabCase(resources.iamUser)}`,
    arn,
    name,
    path,
    creationTime: creationTime?.toISOString() || '',
    accessKeyData,
    passwordLastUsed: passwordLastUsed?.toISOString() || '',
    tags: userTags,
  }
  return user
}
