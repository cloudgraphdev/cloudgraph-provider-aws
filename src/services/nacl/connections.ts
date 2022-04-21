import { ServiceConnection } from '@cloudgraph/sdk'
import isEmpty from 'lodash/isEmpty'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsVpc } from '../vpc/data'
import { RawAwsNetworkAcl } from './data'

/**
 * Network ACL
 */
export default ({
  service: nacl,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
  service: RawAwsNetworkAcl
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    NetworkAclId: id,
    VpcId: NaclVpcId,
    Associations: naclSubnetAssociations = [],
  } = nacl

  const subnetIds = naclSubnetAssociations.map(({ SubnetId }) => SubnetId)

  /**
   * Find related Subnets
   */
  const subnets: {
    name: string
    data: { [property: string]: RawAwsSubnet[] }
  } = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const dataAtRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId }: RawAwsSubnet) =>
        !isEmpty(subnetIds) &&
        subnetIds.filter(str =>
          str.toLowerCase().includes(SubnetId.toLowerCase())
        ).length > 0
    )
    if (!isEmpty(dataAtRegion)) {
      for (const subnet of dataAtRegion) {
        connections.push({
          id: subnet.SubnetId,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnets',
        })
      }
    }
  }

  /**
   * Find related Vpc
   */
  const vpcs: { name: string; data: { [property: string]: RawAwsVpc[] } } =
    data.find(({ name }) => name === services.vpc)
  if (vpcs?.data?.[region]) {
    const vpc: RawAwsVpc = vpcs.data[region].find(
      ({ VpcId }: RawAwsVpc) => VpcId === NaclVpcId
    )
    if (!isEmpty(vpc)) {
      connections.push({
        id: vpc.VpcId,
        resourceType: services.vpc,
        relation: 'child',
        field: 'vpc',
      })
    }
  }

  const naclResult = {
    [id]: connections,
  }
  return naclResult
}
