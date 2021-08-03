import { DescribeVolumesResult } from 'aws-sdk/clients/ec2'

import { AwsEbs } from '../../types/generated'
import { toCamel } from '../../utils'
import t from '../../properties/translations'

/**
 * EBS
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: DescribeVolumesResult & { region: string }
  account: string
  region: string
}): AwsEbs => {
  const {
    attachments = [],
    availabilityZone,
    createTime,
    encrypted,
    multiAttachEnabled,
    state,
    size,
    snapshotId: snapshot,
    iops,
    volumeType,
    volumeId: id,
    tags,
  } = toCamel(rawData)

  const volumeAttachments = attachments.map(attachment => {
    const attachmentId = `${attachment.instanceId}:${attachment.device} (${attachment.state})`
    return {
      id: attachmentId,
      attachmentInformation: attachmentId,
      attachedTime: attachment.attachTime,
      deleteOnTermination: attachment.deleteOnTermination,
    }
  })

  const ebs = {
    id,
    arn: `arn:aws:ec2:${region}:${account}:volume/${id}`,
    attachments: volumeAttachments,
    iops,
    size: `${size} ${t.gib}`,
    state,
    created: createTime,
    snapshot,
    encrypted,
    isBootDisk: false, // TODO: Linked to EC2 instance !isEmpty(attachments.find(({ device }) => device === bootId)),
    volumeType,
    availabilityZone,
    multiAttachEnabled,
    tags,
  }

  return ebs
}
