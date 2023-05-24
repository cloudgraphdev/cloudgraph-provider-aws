import { generateUniqueId } from '@cloudgraph/sdk'
import { AliasListEntry, GrantListEntry } from 'aws-sdk/clients/kms'

import { AwsKms } from './data'
import {
  AwsKms as AwsKmsType,
  AwsKmsAliasListEntry,
  AwsKmsGrantListEntry,
} from '../../types/generated'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'

/**
 * KMS
 */

export default ({
  service: key,
  account,
  region,
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
    Aliases: aliases = [],
    Grants: grants = []
  } = key

  const formatAliases = (
    aliases?: AliasListEntry[]
  ): AwsKmsAliasListEntry[] => {
    return (
      aliases?.map(a => ({
        id: generateUniqueId({
          arn,
          ...a,
        }),
        aliasName: a.AliasName,
        aliasArn: a.AliasArn,
        targetKeyId: a.TargetKeyId,
        creationDate: a.CreationDate?.toISOString(),
        lastUpdatedDate: a.LastUpdatedDate?.toISOString(),
      })) || []
    )
  }

  const formatGrants = (
    grants?: GrantListEntry[]
  ): AwsKmsGrantListEntry[] => {
    return (
      grants?.map(a => ({
        id: generateUniqueId({
          arn,
          ...a,
        }),
        grantId: a.GrantId,
        name: a.Name,
        creationDate: a.CreationDate?.toISOString(),
        granteePrincipal: a.GranteePrincipal,
        retiringPrincipal: a.RetiringPrincipal,
        issuingAccount: a.IssuingAccount,
        keyId: a.KeyId,
        operations: a.Operations
      })) || []
    )
  }

  return {
    accountId: account,
    arn,
    region,
    id,
    description,
    keyRotationEnabled,
    usage,
    rawPolicy: policy,
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
    grants: formatGrants(grants),
  }
}
