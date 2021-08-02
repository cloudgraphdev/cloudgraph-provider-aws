import { Aws_Ebs } from '../../types/generated'
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
  service: any
  account: string
  region: string
}): Aws_Ebs => {
  // const {
  //   // allocationId: id,
  //   // associationId: ec2InstanceAssociationId,
  //   // customerOwnedIp,
  //   // customerOwnedIpv4Pool,
  //   // domain,
  //   // instanceId,
  //   // networkBorderGroup,
  //   // networkInterface,
  //   // networkInterfaceOwnerId,
  //   // privateIpAddress: privateIp,
  //   // publicIp,
  //   // publicIpv4Pool,
  // } = toCamel(rawData)
  console.log('the data', rawData)
  const ebs = {
    id: '',
    arn: `arn:aws:ec2:${region}:${account}:volume/`,
    iops: 0,
    size: '{volume[ebsNames.size]} {t.gib}',
    state: 'volume[ebsNames.state]',
    created: 'volume[ebsNames.created]',
    snapshot: 'volume[ebsNames.snapshot]',
    encrypted: false,
    isBootDisk: false,
    volumeType: 'volume[ebsNames.volumeType]',
    availabilityZone: 'volume[ebsNames.availabilityZone]',
    multiAttachEnabled: false,
    tags: [],
  }
  return ebs
}
