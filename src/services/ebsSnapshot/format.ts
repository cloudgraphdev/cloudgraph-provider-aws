import { generateUniqueId } from '@cloudgraph/sdk'

import { AwsEbsSnapshot } from '../../types/generated'
import t from '../../properties/translations'
import { formatTagsFromMap } from '../../utils/format'
import { ebsSnapshotArn } from '../../utils/generateArns'
import { RawAwsEBSSnapshot } from './data'

/**
 * EBS Snapshot
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsEBSSnapshot
  account: string
  region: string
}): AwsEbsSnapshot => {
  const {
    DataEncryptionKeyId: dataEncryptionKeyId,
    Description: description,
    Encrypted: encrypted,
    KmsKeyId: kmsKeyId,
    OwnerId: ownerId,
    Progress: progress,
    SnapshotId: id,
    StartTime: startTime,
    State: state,
    StateMessage: stateMessage,
    VolumeId: volumeId,
    VolumeSize: volumeSize,
    OwnerAlias: ownerAlias,
    OutpostArn: outpostArn,
    Tags: tags,
    StorageTier: storageTier,
    Permissions: permissions = [],
    RestoreExpiryTime: restoreExpiryTime,
  } = rawData
  const arn = ebsSnapshotArn({ region, account, id })

  // Format volume permissions
  const volumePermissions = permissions.map(permission => {
    return {
      id: generateUniqueId({ arn, ...permission }),
      group: permission.Group,
      userId: permission.UserId,
    }
  })

  // Format volume tags
  const snapshotTags = formatTagsFromMap(tags)

  const ebsSnapshot = {
    id,
    accountId: account,
    arn,
    region,
    dataEncryptionKeyId,
    description,
    encrypted,
    kmsKeyId,
    ownerId,
    progress,
    startTime: startTime?.toISOString() || '',
    state,
    stateMessage,
    volumeId,
    volumeSize: `${volumeSize} ${t.gib}`,
    ownerAlias,
    outpostArn,
    storageTier,
    restoreExpiryTime: restoreExpiryTime?.toISOString() || '',
    permissions: volumePermissions,
    tags: snapshotTags,
  }

  return ebsSnapshot
}
