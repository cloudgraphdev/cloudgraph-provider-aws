import { AliasListEntry } from 'aws-sdk/clients/kms'
import cuid from 'cuid'
import { AwsKms } from './data'
import { AwsKms as AwsKmsType, AwsKmsAliasListEntry } from '../../types/generated'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'

export const formatAliases = (
  aliases?: AliasListEntry[]
): AwsKmsAliasListEntry[] => {
  return (
    aliases?.map(a => ({
      id: cuid(),
      aliasName: a.AliasName,
      aliasArn: a.AliasArn,
      targetKeyId: a.TargetKeyId,
      creationDate: a.CreationDate?.toISOString(),
      lastUpdatedDate: a.LastUpdatedDate?.toISOString(),
    })) || []
  )
}

/**
 * KMS
 */

export default ({
  service: key,
  account,
  region
}: {
  service: AwsKms
  account: string
  region: string
}): AwsKmsType => {
  const {
    Arn: arn,
    Tags,
    Description: description,
    KeyId: id,
    policy,
    keyRotationEnabled,
    KeyUsage: usage,
    Enabled: enabled,
    KeyState: keyState,
    CustomerMasterKeySpec: customerMasterKeySpec,
    CreationDate: creationDate,
    KeyManager: keyManager,
    Origin: origin,
    DeletionDate: deletionDate,
    ValidTo: validTo,
    Aliases: aliases = []
  } = key

  return {
    accountId: account,
    arn,
    region,
    id,
    description,
    keyRotationEnabled,
    usage,
    policy: formatIamJsonPolicy(policy),
    enabled,
    keyState,
    customerMasterKeySpec,
    tags: formatTagsFromMap(Tags),
    creationDate: creationDate?.toISOString(),
    keyManager,
    origin,
    deletionDate: deletionDate?.toISOString(),
    validTo: validTo?.toISOString(),
    aliases: formatAliases(aliases),
  }
}
