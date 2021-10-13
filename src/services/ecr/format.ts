import { AwsEcr } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEcr } from './data'

export default ({
  service: rawData,
  account,
}: {
  service: RawAwsEcr
  account: string
}): AwsEcr => {
  const {
    repositoryArn: arn,
    registryId: registryAccountId,
    repositoryName: name,
    repositoryUri,
    createdAt,
    imageTagMutability,
    imageScanningConfiguration: { scanOnPush: imageScanOnPush = false } = {},
    encryptionConfiguration: { encryptionType: type = 'none', kmsKey = '' } = {},
    Tags,
  } = rawData

  return {
    id: arn,
    arn,
    accountId: account,
    createdAt: createdAt.toISOString(),
    encryptionConfig: { type, kmsKey },
    imageScanOnPush,
    imageTagMutability,
    name,
    registryAccountId,
    repositoryUri,
    tags: formatTagsFromMap(Tags),
  }
}