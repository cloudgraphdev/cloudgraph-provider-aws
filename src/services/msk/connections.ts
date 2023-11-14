import { ServiceConnection } from '@cloudgraph/sdk'

import { Cluster } from 'aws-sdk/clients/kafka'
import services from '../../enums/services'

/**
 * Msk
 */

export default ({
  service: mskCluster,
  data,
  region,
  account,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: Cluster & {
    region: string
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const { ClusterArn: id, Serverless: serverless } = mskCluster || {}

  /**
   * Add subnets
   */
  serverless?.VpcConfigs?.filter(vc => vc.SubnetIds)?.forEach(vc => {
    connections.push(
      ...vc?.SubnetIds?.map(subnetId => ({
        id: subnetId,
        resourceType: services.subnet,
        relation: 'child',
        field: 'subnets',
      }))
    )
  })

  /**
   * Add Security Groups
   */
  serverless?.VpcConfigs?.filter(vc => vc.SecurityGroupIds)?.forEach(vc => {
    connections.push(
      ...vc?.SecurityGroupIds?.map(sgId => ({
        id: sgId,
        resourceType: services.sg,
        relation: 'child',
        field: 'securityGroups',
      }))
    )
  })

  const mskResult = {
    [id]: connections,
  }
  return mskResult
}
