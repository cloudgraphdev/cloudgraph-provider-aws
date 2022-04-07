import { isEmpty } from 'lodash'
import t from '../../properties/translations'
import { AwsEc2 } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { ec2InstanceArn } from '../../utils/generateArns'
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
    KeyPair: {
      id: keyPairId,
      name,
      type,
      fingerprint,
      tags: keyPairTags = {},
    } = {},
    cloudWatchMetricData,
    PlatformDetails: platformDetails,
    InstanceLifecycle: instanceLifecycle,
    LaunchTime: launchTime,
    PublicIpAddress: publicIpAddress,
  } = rawData

  const securityGroupIds = securityGroups.map(({ GroupId }) => GroupId)

  const { NetworkInterfaceId: networkInterfaceId = '' } =
    networkInterfaces.find(
      ({ Attachment: { DeviceIndex } }) => DeviceIndex === 0
    ) || {}

  const ipv6Addresses = networkInterfaces
    .map(({ Ipv6Addresses }) => Ipv6Addresses)
    .reduce((current, acc) => [...acc, ...current], [])
    .map(({ Ipv6Address }) => Ipv6Address)

  const ephemeralBlockDevices = blockDeviceMappings
    .filter(({ Ebs: { DeleteOnTermination } }) => DeleteOnTermination)
    .map(({ DeviceName }) => ({ deviceName: DeviceName }))

  // Instance tags
  const instanceTags = formatTagsFromMap(tags)

  // Instance life cicle
  const mapInstanceLifecycle = (lifecycle: string): string => {
    if (isEmpty(lifecycle)) return 'on_demand'

    switch (lifecycle) {
      case 'scheduled': {
        return 'reserved'
      }
      default: {
        return lifecycle
      }
    }
  }

  const ec2 = {
    accountId: account,
    arn: ec2InstanceArn({ region, account, id }),
    id,
    region,
    ami,
    tenancy: placement?.Tenancy || '',
    publicDns,
    privateDns,
    monitoring: monitoring?.State || '',
    privateIps,
    keyPair: {
      id: keyPairId,
      name,
      type,
      fingerprint,
      tags: formatTagsFromMap(keyPairTags),
    },
    cpuCoreCount: cpuOptions?.CoreCount || 0,
    hibernation: hibernationOptions?.Configured ? t.yes : t.no,
    ebsOptimized: ebsOptimized ? t.yes : t.no,
    instanceType,
    ipv6Addresses,
    placementGroup: placement?.GroupName || '',
    instanceState: instanceState?.Name || '',
    sourceDestCheck: sourceDestCheck ? t.yes : t.no,
    availabilityZone: placement?.AvailabilityZone || '',
    cpuThreadsPerCore: cpuOptions?.ThreadsPerCore || 0,
    deletionProtection: deletionProtection ? t.yes : t.no,
    primaryNetworkInterface: networkInterfaceId,
    metadataOptions: {
      state: metadata?.State || '',
      httpTokens: metadata?.HttpTokens || '',
      httpPutResponseHopLimit: metadata?.HttpPutResponseHopLimit || 0,
      httpEndpoint: metadata?.HttpEndpoint || '',
    },
    securityGroupIds,
    ephemeralBlockDevices,
    cloudWatchMetricData,
    tags: instanceTags,
    platformDetails: platformDetails || '',
    instanceLifecycle: mapInstanceLifecycle(instanceLifecycle),
    publicIpAddress,
    launchTime: launchTime?.toISOString() || '',
  }
  return ec2
}
