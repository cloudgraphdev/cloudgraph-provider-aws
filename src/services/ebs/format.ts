import { generateUniqueId } from '@cloudgraph/sdk'

import { AwsEbs } from '../../types/generated'
import t from '../../properties/translations'
import { formatTagsFromMap } from '../../utils/format'
import { ebsVolumeArn } from '../../utils/generateArns'
import { RawAwsEBS } from './data'

/**
 * EBS
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsEBS
  account: string
  region: string
}): AwsEbs => {
  const {
    Attachments: attachments = [],
    AvailabilityZone: availabilityZone,
    CreateTime: createTime,
    Encrypted: encrypted,
    MultiAttachEnabled: multiAttachEnabled,
    State: state,
    Size: size,
    SnapshotId: snapshot,
    Iops: iops,
    VolumeType: volumeType,
    Permissions: permissions = [],
    VolumeId: id,
    Tags: tags,
  } = rawData
  const arn = ebsVolumeArn({ region, account, id })

  // Format volume permissions
  const volumePermissions = permissions.map(permission => {
    return {
      id: generateUniqueId({ arn, ...permission }),
      group: permission.Group,
      userId: permission.UserId,
    }
  })

  // Format volume attachments
  const volumeAttachments = attachments.map(attachment => {
    const attachmentId = `${attachment.InstanceId}:${attachment.Device} (${attachment.State})`
    return {
      id: attachmentId,
      attachmentInformation: attachmentId,
      attachedTime: attachment.AttachTime.toISOString(),
      deleteOnTermination: attachment.DeleteOnTermination,
    }
  })

  // Format volume tags
  const volumeTags = formatTagsFromMap(tags)

  const ebs = {
    id,
    accountId: account,
    arn,
    region,
    attachments: volumeAttachments,
    iops,
    size: `${size} ${t.gib}`,
    state,
    created: createTime.toISOString(),
    snapshot,
    encrypted,
    isBootDisk: false, // TODO: Linked to EC2 instance !isEmpty(attachments.find(({ device }) => device === bootId)),
    volumeType,
    availabilityZone,
    multiAttachEnabled,
    permissions: volumePermissions,
    tags: volumeTags,
  }

  return ebs
}
