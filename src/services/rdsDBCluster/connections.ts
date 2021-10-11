import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { DBInstance, DBCluster } from 'aws-sdk/clients/rds'

import services from '../../enums/services'

export default ({
  service,
  data,
  region,
}: {
  service: DBCluster
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const connections: ServiceConnection[] = []
  const { DBClusterIdentifier: id } = service

  /**
   * Find instances
   */
  const instances: { name: string; data: { [property: string]: DBInstance[] } } =
    data.find(({ name }) => name === services.rdsDBInstance)
  if (instances?.data?.[region]) {
    const instancesInRegion: DBInstance[] = instances.data[region].filter(
      ({ DBClusterIdentifier }: DBInstance) => DBClusterIdentifier === id
    )
    if (!isEmpty(instancesInRegion)) {
      for (const instance of instancesInRegion) {
        const { DBInstanceArn: id } = instance
        connections.push({
          id,
          resourceType: services.rdsDBInstance,
          relation: 'child',
          field: 'instances',
        })
      }
    }
  }

  const rdsDBInstanceResult = {
    [id]: connections,
  }
  return rdsDBInstanceResult
}