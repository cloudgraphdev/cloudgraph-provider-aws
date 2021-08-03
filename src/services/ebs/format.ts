import { Volume } from 'aws-sdk/clients/ec2'

import { AwsEbs } from '../../types/generated'
import t from '../../properties/translations'

/**
 * EBS
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: Volume & { region: string }
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
    VolumeId: id,
    Tags: tags,
  } = rawData

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
  const volumeTags = tags.map(tag => ({ key: tag.Key, value: tag.Value }))

  const ebs = {
    id,
    arn: `arn:aws:ec2:${region}:${account}:volume/${id}`,
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
    tags: volumeTags,
  }

  return ebs
}
