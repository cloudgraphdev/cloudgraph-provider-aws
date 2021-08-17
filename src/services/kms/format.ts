import t from '../../properties/translations'
import { AwsKms } from './data'
import { AwsKms as AwsKmsType } from '../../types/generated';
import { formatTagsFromMap } from '../../utils/format'

/**
 * KMS
 */

export default ({
  service: key,
}: // allTagData,
{
  service: AwsKms
  // allTagData: Tags[]
}): AwsKmsType => {
  const {
    Arn: arn,
    Tags,
    Description: description,
    KeyId: id,
    policy,
    enableKeyRotation,
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

  /**
   * Add these tags to the list of global tags so we can filter by tag on the front end
   */

  // combineElementsTagsWithExistingGlobalTags({
  //   tags,
  //   allTagData,
  // })

  return {
    arn,
    id,
    description,
    enableKeyRotation: enableKeyRotation ? t.yes : t.no,
    usage,
    policy,
    enabled: enabled ? t.yes : t.no,
    keyState,
    customerMasterKeySpec,
    tags: formatTagsFromMap(Tags),
    creationDate: creationDate ? creationDate.toString(): undefined,
    keyManager,
    origin,
    deletionDate: deletionDate ? deletionDate.toString(): undefined,
    validTo: validTo? validTo.toString() : undefined,
  }
}
