import t from '../../properties/translations'
import { AwsKms } from './data'
import { AwsKms as AwsKmsType } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

/**
 * KMS
 */

export default ({ service: key }: { service: AwsKms }): AwsKmsType => {
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
  } = key

  return {
    arn,
    id,
    description,
    keyRotationEnabled: keyRotationEnabled ? t.yes : t.no,
    usage,
    policy,
    enabled: enabled ? t.yes : t.no,
    keyState,
    customerMasterKeySpec,
    tags: formatTagsFromMap(Tags),
    creationDate: creationDate ? creationDate.toString() : undefined,
    keyManager,
    origin,
    deletionDate: deletionDate ? deletionDate.toString() : undefined,
    validTo: validTo ? validTo.toString() : undefined,
  }
}
