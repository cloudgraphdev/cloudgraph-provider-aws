import t from '../../properties/translations'
import { AwsEc2 } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEC2 } from './data'

/**
 * EC2
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsEC2
  region: string
}): AwsEc2 => {
  const {
    InstanceId: id,
    ImageId: ami,
    PublicDnsName: publicDns,
    PrivateDnsName: privateDns,
    Monitoring: monitoring,
    PrivateIpAddress: privateIps,
    NetworkInterfaces: networkInterfaces = [],
    CpuOptions: cpuOptions,
    HibernationOptions: hibernationOptions,
    EbsOptimized: ebsOptimized,
    InstanceType: instanceType,
    State: instanceState,
    SourceDestCheck: sourceDestCheck,
    Placement: placement,
    MetadataOptions: metadata,
    SecurityGroups: securityGroups = [],
    BlockDeviceMappings: blockDeviceMappings = [],
    DisableApiTermination: deletionProtection,
    Tags: tags = {},
    KeyPairName: keyPairName,
    IamInstanceProfile: iamInstanceProfile,
  } = rawData

  const securityGroupIds = securityGroups.map(({ GroupId }) => GroupId)

  // const ipv4PublicIp = eips.map(({ PublicIp }) => PublicIp).join(', ')

  const { NetworkInterfaceId: networkInterfaceId = '' } =
    networkInterfaces.find(
      ({ Attachment: { DeviceIndex } }) => DeviceIndex === 0
    )

  const ipv6Addresses = networkInterfaces
    .map(({ Ipv6Addresses }) => Ipv6Addresses)
    .reduce((current, acc) => [...acc, ...current], [])
    .map(({ Ipv6Address }) => Ipv6Address)

  const ephemeralBlockDevice = blockDeviceMappings
    .filter(({ Ebs: { DeleteOnTermination } }) => DeleteOnTermination)
    .map(({ DeviceName }) => ({ deviceName: DeviceName }))

  // Instance tags
  const instanceTags = formatTagsFromMap(tags)

  const ec2 = {
    arn: `arn:aws:ec2:${region}:${account}:instance/${id}`,
    id,
    region,
    ami,
    tenancy: placement?.Tenancy || '',
    // elasticIps: eips.map(({ AllocationId }) => AllocationId).join(', '),  TODO: Can't be calculated without EIP data
    publicDns,
    privateDns,
    monitoring: monitoring?.State || '',
    privateIps,
    keyPairName: keyPairName || '',
    cpuCoreCount: cpuOptions?.CoreCount || 0,
    hibernation: hibernationOptions?.Configured ? t.yes : t.no,
    ebsOptimized: ebsOptimized ? t.yes : t.no,
    // ipv4PublicIp,  TODO: Can't be calculated without EIP data
    instanceType,
    ipv6Addresses,
    placementGroup: placement?.GroupName || '',
    instanceState: instanceState?.Name || '',
    sourceDestCheck: sourceDestCheck ? t.yes : t.no,
    availabilityZone: placement?.AvailabilityZone || '',
    cpuThreadsPerCore: cpuOptions?.ThreadsPerCore || 0,
    iamInstanceProfile: iamInstanceProfile?.Arn || '',
    deletionProtection: deletionProtection ? t.yes : t.no,
    primaryNetworkInterface: networkInterfaceId,
    metadataOptions: {
      state: metadata?.State || '',
      httpTokens: metadata?.HttpTokens || '',
      httpPutResponseHopLimit: metadata?.HttpPutResponseHopLimit || 0,
      httpEndpoint: metadata?.HttpEndpoint || '',
    },
    securityGroupIds,
    ephemeralBlockDevice,
    // associatePublicIpAddress: !isEmpty(ipv4PublicIp) ? t.yes : t.no, TODO: Can't be calculated without EIP data
    tags: instanceTags,
  }
  return ec2
}
