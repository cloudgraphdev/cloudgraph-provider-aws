import t from '../../properties/translations'
import { AwsSubnet } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsSubnet } from './data'

/**
 * Subnet
 */

export default ({ service: rawData, account }: { service: RawAwsSubnet, account: string }): AwsSubnet => {
  const {
    AssignIpv6AddressOnCreation: autoAssignPublicIpv6Address,
    AvailabilityZone: availabilityZone,
    AvailableIpAddressCount: availableIpV4Addresses,
    CidrBlock: ipV4Cidr,
    DefaultForAz: defaultForAz,
    Ipv6CidrBlockAssociationSet: ipV6CidrSet,
    MapPublicIpOnLaunch: autoAssignPublicIpv4Address,
    State: state,
    SubnetArn: arn,
    SubnetId: id,
    Tags,
  } = rawData

  return {
    id,
    arn,
    accountId: account,
    tags: formatTagsFromMap(Tags),
    availabilityZone,
    autoAssignPublicIpv4Address: autoAssignPublicIpv4Address ? t.yes : t.no,
    autoAssignPublicIpv6Address: autoAssignPublicIpv6Address ? t.yes : t.no,
    ipV4Cidr,
    ipV6Cidr: (ipV6CidrSet || [])
      .map(({ Ipv6CidrBlock }) => Ipv6CidrBlock)
      .join(', '),
    state,
    defaultForAz,
    availableIpV4Addresses,
  }
}
