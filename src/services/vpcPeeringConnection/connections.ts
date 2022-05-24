import isEmpty from 'lodash/isEmpty'
import { ServiceConnection } from '@cloudgraph/sdk'
import services from '../../enums/services'
import { RawAwsVpcPeeringConnection } from './data'
import { RawAwsVpc } from '../vpc/data'

/**
 * Vpc Peering Connection
 */

export default ({
  service: vpcPeeringConnection,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsVpcPeeringConnection
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    VpcPeeringConnectionId: id,
    AccepterVpcInfo: accepterVpcInfo,
    RequesterVpcInfo: requesterVpcInfo,
  } = vpcPeeringConnection

  /**
   * Find VPCs
   * related to this Vpc Peering Connection
   */
  const vpcs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.vpc)

  if (vpcs?.data?.[region]) {
    const dataAtRegion: RawAwsVpc[] = vpcs.data[region].filter(
      ({ VpcId }: RawAwsVpc) =>
        VpcId === accepterVpcInfo?.VpcId || VpcId === requesterVpcInfo?.VpcId
    )

    if (!isEmpty(dataAtRegion)) {
      for (const vpc of dataAtRegion) {
        const { VpcId }: RawAwsVpc = vpc
        connections.push({
          id: VpcId,
          resourceType: services.vpc,
          relation: 'child',
          field: 'vpc',
        })
      }
    }
  }

  const vpcPeeringConnectionResult = {
    [id]: connections,
  }
  return vpcPeeringConnectionResult
}
