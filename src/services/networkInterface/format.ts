import { AwsNetworkInterface } from '../../types/generated'
import format from '../../utils/format'
import { RawNetworkInterface } from './data'

/**
 * Network Interface
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawNetworkInterface
  account: string
  region: string
}): AwsNetworkInterface => {
  const {
    NetworkInterfaceId: id,
    MacAddress: macAddress,
    Description: description,
    PrivateDnsName: privateDnsName,
    SubnetId: subnetId,
    AvailabilityZone: availabilityZone,
    Status: status,
    VpcId: vpcId,
    InterfaceType: interfaceType = '',
    Attachment: {
      AttachmentId: attachementId = '',
      Status: attachmentStatus = '',
      DeleteOnTermination: deleteOnTermination = false,
    },
    Groups: groups = [],
    PrivateIpAddresses: privateIpAddresses = [],
    TagSet: tags = [],
  } = rawData

  const securityGroups = groups.map(({ GroupId }) => GroupId)

  const privateIps = privateIpAddresses.map(
    ({ PrivateIpAddress }) => PrivateIpAddress
  )

  // Format tags
  const networkInterfacesTags = format.tags(
    tags as { Key: string; Value: string }[]
  )

  const networkInterface = {
    id,
    arn: `arn:aws:ec2:${region}:${account}:network-interface/${id}`,
    subnetId,
    macAddress,
    privateIps,
    description,
    availabilityZone,
    status,
    vpcId,
    interfaceType,
    securityGroups,
    privateDnsName,
    attachment: {
      id: attachementId,
      status: attachmentStatus,
      deleteOnTermination,
    },
    tags: networkInterfacesTags,
  }
  return networkInterface
}
