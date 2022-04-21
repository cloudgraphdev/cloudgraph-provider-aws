import t from '../../properties/translations'
import { AwsEip } from '../../types/generated'
import { RawAwsEip } from './data'
import { formatTagsFromMap } from '../../utils/format'
import { eipAllocationArn } from '../../utils/generateArns'

/**
 * EIP
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsEip
  account: string
  region: string
}): AwsEip => {
  const {
    AllocationId: id,
    AssociationId: ec2InstanceAssociationId,
    CustomerOwnedIp: customerOwnedIp,
    CustomerOwnedIpv4Pool: customerOwnedIpv4Pool,
    Domain: domain,
    InstanceId: instanceId,
    NetworkBorderGroup: networkBorderGroup,
    NetworkInterfaceId: networkInterfaceId,
    NetworkInterfaceOwnerId: networkInterfaceOwnerId,
    PrivateIpAddress: privateIp,
    PublicIp: publicIp,
    PublicIpv4Pool: publicIpv4Pool,
    Tags: tags = {},
  } = rawData

  // Format Tags
  const eipTags = formatTagsFromMap(tags)

  return {
    id,
    accountId: account,
    arn: eipAllocationArn({region, account, id}),
    region,
    isVpc: domain === 'vpc' ? t.yes : t.no,
    customerOwnedIp,
    customerOwnedIpv4Pool,
    domain,
    ec2InstanceAssociationId,
    instanceId,
    networkBorderGroup,
    networkInterfaceId,
    networkInterfaceOwnerId,
    privateIp,
    publicIp,
    publicIpv4Pool,
    tags: eipTags,
  }
}
