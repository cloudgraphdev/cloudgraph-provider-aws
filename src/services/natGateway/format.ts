import { generateUniqueId } from '@cloudgraph/sdk'
import { AwsNatGateway } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { natGatewayArn } from '../../utils/generateArns'
import { RawAwsNATGateway } from './data'

/**
 * NAT Gateway
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsNATGateway
  account: string
  region: string
}): AwsNatGateway => {
  const {
    NatGatewayId: id,
    State: state,
    CreateTime: createTime,
    NatGatewayAddresses: natGatewayAddresses,
    Tags,
  } = rawData

  const mappedAddresses =
    natGatewayAddresses?.map(
      ({ AllocationId, NetworkInterfaceId, PrivateIp, PublicIp }) => ({
        id: generateUniqueId({
          AllocationId,
          NetworkInterfaceId,
          PrivateIp,
          PublicIp,
        }),
        allocationId: AllocationId,
        networkInterfaceId: NetworkInterfaceId,
        privateIp: PrivateIp,
        publicIp: PublicIp,
      })
    ) ?? []

  return {
    id,
    tags: formatTagsFromMap(Tags),
    accountId: account,
    arn: natGatewayArn({ region, account, id }),
    region,
    state,
    natGatewayAddresses: mappedAddresses,
    createTime: createTime.toUTCString(),
  }
}
