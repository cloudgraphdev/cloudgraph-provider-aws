import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { SecurityGroup } from 'aws-sdk/clients/ec2'
import { DBInstance, DBCluster } from 'aws-sdk/clients/rds'

import services from '../../enums/services'
import { RawAwsRdsClusterSnapshot } from '../rdsClusterSnapshot/data'

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
  const {
    DBClusterArn: id,
    DBClusterIdentifier: clusterId,
    VpcSecurityGroups,
  } = service
  const sgIds = VpcSecurityGroups.map(
    ({ VpcSecurityGroupId }) => VpcSecurityGroupId
  )

  /**
   * Find rds db instances
   */
  const instances: {
    name: string
    data: { [property: string]: DBInstance[] }
  } = data.find(({ name }) => name === services.rdsDbInstance)

  if (instances?.data?.[region]) {
    const instancesInRegion: DBInstance[] = instances.data[region].filter(
      ({ DBClusterIdentifier }: DBInstance) => DBClusterIdentifier === clusterId
    )
    if (!isEmpty(instancesInRegion)) {
      for (const instance of instancesInRegion) {
        const { DBInstanceArn: id } = instance
        connections.push({
          id,
          resourceType: services.rdsDbInstance,
          relation: 'child',
          field: 'instances',
        })
      }
    }
  }

  /**
   * Find cluster snapshots
   */
   const snapshots: {
    name: string
    data: { [property: string]: RawAwsRdsClusterSnapshot[] }
  } = data.find(({ name }) => name === services.rdsClusterSnapshot)

  if (snapshots?.data?.[region]) {
    const dataInRegion: RawAwsRdsClusterSnapshot[] = snapshots.data[region].filter(
      ({ DBClusterIdentifier }: RawAwsRdsClusterSnapshot) => DBClusterIdentifier === clusterId
    )
    if (!isEmpty(dataInRegion)) {
      for (const snapshot of dataInRegion) {
        connections.push({
          id: snapshot.DBClusterSnapshotIdentifier,
          resourceType: services.rdsClusterSnapshot,
          relation: 'child',
          field: 'snapshots',
        })
      }
    }
  }

  /**
   * Find SecurityGroups
   */
  const securityGroups: {
    name: string
    data: { [property: string]: SecurityGroup[] }
  } = data.find(({ name }) => name === services.sg)

  if (securityGroups?.data?.[region]) {
    const sgsInRegion: SecurityGroup[] = securityGroups.data[region].filter(
      ({ GroupId }: SecurityGroup) => sgIds.includes(GroupId)
    )

    if (!isEmpty(sgsInRegion)) {
      for (const sg of sgsInRegion) {
        connections.push({
          id: sg.GroupId,
          resourceType: services.sg,
          relation: 'child',
          field: 'securityGroups',
        })
      }
    }
  }

  const rdsClusterResult = {
    [id]: connections,
  }
  return rdsClusterResult
}
