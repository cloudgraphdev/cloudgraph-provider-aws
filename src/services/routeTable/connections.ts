import { ServiceConnection } from '@cloudgraph/sdk'
import { SecurityGroup } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsRouteTable } from './data'

/**
 * Route Table
 */

export default ({
  service: routeTable,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsRouteTable
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { Associations, RouteTableId: id, VpcId: vpcId } = routeTable

  /**
   * Find VPCs
   * related to this Route table
   */
  const vpcs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.vpc)

  if (vpcs?.data?.[region]) {
    const vpc = vpcs.data[region].find(
      ({ VpcId }: SecurityGroup) => VpcId === vpcId
    )

    if (vpc) {
      connections.push({
        id: vpc.VpcId,
        resourceType: services.vpc,
        relation: 'child',
        field: 'vpc',
      })
    }
  }

  /**
   * Find Subnets
   * related to this Route Table
   */
  const subnets: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.subnet)
  const subnetIds = Associations.map(({ SubnetId }) => SubnetId)
  if (subnets?.data?.[region]) {
    const subnet = subnets.data[region].find(({ SubnetId }: RawAwsSubnet) =>
      subnetIds.includes(SubnetId)
    )

    if (subnet) {
      connections.push({
        id: subnet.SubnetId,
        resourceType: services.subnet,
        relation: 'child',
        field: 'subnet',
      })
    }
  }

  const routeTableResult = {
    [id]: connections,
  }
  return routeTableResult
}
