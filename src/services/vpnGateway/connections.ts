import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import { VpnGateway, TagList } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'
import { RawAwsVpc } from '../vpc/data'

/**
 * Vpn Gateway
 */

export default ({
  service: vpnGateway,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: VpnGateway & {
    Tags?: TagList
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { VpnGatewayId: id, VpcAttachments: vpcAttachments } = vpnGateway

  /**
   * Find VPCs
   * related to this Vpn Gateway
   */
  const vpcs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.vpc)

  const vpcIds = vpcAttachments?.map(({ VpcId }) => VpcId)

  if (vpcs?.data?.[region] && vpcIds?.length > 0) {
    const associatedVPCs: RawAwsVpc[] = vpcs.data[region].filter(
      ({ VpcId }: RawAwsVpc) => vpcIds.includes(VpcId)
    )

    if (!isEmpty(associatedVPCs)) {
      for (const vpc of associatedVPCs) {
        connections.push({
          id: vpc.VpcId,
          resourceType: services.vpc,
          relation: 'child',
          field: 'vpc',
        })
      }
    }
  }

  const vpnGatewayResult = {
    [id]: connections,
  }
  return vpnGatewayResult
}
