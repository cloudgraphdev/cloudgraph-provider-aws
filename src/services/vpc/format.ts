import { AwsVpc } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsVpc } from './data'

/**
 * VPC
 */
export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsVpc
  account: string
  region: string
}): AwsVpc => {
  const {
    CidrBlock,
    DhcpOptionsId,
    InstanceTenancy: instanceTenancy,
    Ipv6CidrBlockAssociationSet,
    IsDefault,
    State: state,
    Tags,
    VpcId: id,
    enableDnsHostnames,
    enableDnsSupport,
  } = rawData

  return {
    id,
    arn: `arn:aws:ec2:${region}:${account}:vpc/${id}`,
    tags: formatTagsFromMap(Tags),
    ipV4Cidr: CidrBlock,
    ipV6Cidr: (Ipv6CidrBlockAssociationSet || [])
      .map(({ Ipv6CidrBlock }) => Ipv6CidrBlock)
      .join(', '),
    dhcpOptionsSet: DhcpOptionsId,
    instanceTenancy,
    enableDnsSupport,
    enableDnsHostnames,
    state,
    defaultVpc: IsDefault,
  }
}
