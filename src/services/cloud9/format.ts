import { RawAwsCloud9Environment } from './data'
import { AwsCloud9Environment } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsCloud9Environment
  account: string
  region: string
}): AwsCloud9Environment => {
  const {
    arn,
    name,
    description,
    type,
    connectionType,
    ownerArn,
    lifecycle,
    managedCredentialsStatus,
    Tags: tags = {},
  } = service

  return {
    id: arn,
    accountId,
    arn,
    region,
    name,
    description,
    type,
    connectionType,
    ownerArn,
    lifecycle,
    managedCredentialsStatus,
    tags: formatTagsFromMap(tags),
  }
}
