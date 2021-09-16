import { ServiceConnection } from '@cloudgraph/sdk'
import { SecurityGroup } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'
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
  const { RouteTableId: id, VpcId: vpcId } = routeTable

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
  // TODO: Implement when subnet service is ready

  const routeTableResult = {
    [id]: connections,
  }
  return routeTableResult
}
