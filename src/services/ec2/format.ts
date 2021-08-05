// import head from 'lodash/head'
// import last from 'lodash/last'
// import isEmpty from 'lodash/isEmpty'

import { Instance, TagList } from 'aws-sdk/clients/ec2'

import t from '../../properties/translations'
import { AwsEc2 } from '../../types/generated'
import format from '../../utils/format'

/**
 * EC2
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: Instance & {
    region: string
    DisableApiTermination?: boolean
    KeyPairName?: string
    Tags?: TagList
  }
  region: string
}): AwsEc2 => {
  const {
    InstanceId: id,
    ImageId: ami,
    Placement: { Tenancy: tenancy },
    PublicDnsName: publicDns,
    PrivateDnsName: privateDns,
    Monitoring: { State: monitoring },
    PrivateIpAddress: privateIps,
    NetworkInterfaces: networkInterfaces = [],
    CpuOptions: { CoreCount: cpuCoreCount, ThreadsPerCore: cpuThreadsPerCore },
    HibernationOptions: { Configured: hibernation },
    EbsOptimized: ebsOptimized,
    InstanceType: instanceType,
    State: { Name: instanceState },
    SourceDestCheck: sourceDestCheck,
    Placement: {
      AvailabilityZone: availabilityZone,
      GroupName: placementGroup,
    },
    MetadataOptions: {
      State: state,
      HttpTokens: httpTokens,
      HttpEndpoint: httpEndpoint,
      HttpPutResponseHopLimit: httpPutResponseHopLimit,
    },
    SecurityGroups: securityGroups,
    BlockDeviceMappings: blockDeviceMappings,
    DisableApiTermination: deletionProtection,
    Tags: tags = [],
    KeyPairName: keyPairName,
  } = rawData

  const securityGroupIds = (securityGroups || []).map(({ GroupId }) => GroupId)

  /**
   * Add these tags to the list of global tags so we can filter by tag on the front end
   */

  // combineElementsTagsWithExistingGlobalTags({ tags, allTagData })

  // const ipv4PublicIp = eips.map(({ PublicIp }) => PublicIp).join(', ')

  const { NetworkInterfaceId: networkInterfaceId = '' } =
    networkInterfaces.find(
      ({ Attachment: { DeviceIndex } }) => DeviceIndex === 0
    )

  // const ipv6Addresses = networkInterfaces.map(
  //   ({ Ipv6Addresses }) => Ipv6Addresses
  // )

  const ephemeralBlockDevice = blockDeviceMappings
    .filter(({ Ebs: { DeleteOnTermination } }) => DeleteOnTermination)
    .map(({ DeviceName }) => ({ deviceName: DeviceName }))

  // Instance tags
  const instanceTags = format.tags(tags as { Key: string; Value: string }[])

  const ec2 = {
    arn: `arn:aws:ec2:${region}:${account}:instance/${id}`,
    id,
    region,
    ami,
    tenancy,
    // elasticIps: eips.map(({ AllocationId }) => AllocationId).join(', '),
    publicDns,
    privateDns,
    monitoring,
    privateIps,
    keyPairName,
    cpuCoreCount,
    hibernation: hibernation ? t.yes : t.no,
    ebsOptimized: ebsOptimized ? t.yes : t.no,
    // ipv4PublicIp,
    instanceType,
    ipv6Addresses: [],
    placementGroup,
    instanceState,
    sourceDestCheck: sourceDestCheck ? t.yes : t.no,
    availabilityZone,
    cpuThreadsPerCore,
    // iamInstanceProfile: get(instance[ec2Names.iamInstanceProf], ec2Names.arn),
    deletionProtection: deletionProtection ? t.yes : t.no,
    primaryNetworkInterface: networkInterfaceId,
    metadataOptions: {
      state,
      httpTokens,
      httpPutResponseHopLimit,
      httpEndpoint,
    },
    securityGroupIds,
    ephemeralBlockDevice,
    // associatePublicIpAddress: !isEmpty(ipv4PublicIp) ? t.yes : t.no,
    tags: instanceTags,
  }
  return ec2
}
