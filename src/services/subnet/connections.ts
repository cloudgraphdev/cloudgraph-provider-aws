import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawFlowLog } from '../flowLogs/data'
import { RawAwsManagedAirflow } from '../managedAirflow/data'
import { RawAwsElasticSearchDomain } from '../elasticSearchDomain/data'
import { RawAwsDmsReplicationInstance } from '../dmsReplicationInstance/data'
import { RawAwsSageMakerNotebookInstance } from '../sageMakerNotebookInstance/data'

export default ({
  service: subnet,
  data,
  region,
}: {
  service: RawAwsSubnet
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { SubnetId } = subnet
  const connections: ServiceConnection[] = []

  /**
   * Find any FlowLog related data
   */
  const flowLogs = data.find(({ name }) => name === services.flowLog)
  if (flowLogs?.data?.[region]) {
    const dataAtRegion: RawFlowLog[] = flowLogs.data[region].filter(
      ({ ResourceId }: RawFlowLog) => ResourceId === SubnetId
    )
    for (const flowLog of dataAtRegion) {
      connections.push({
        id: flowLog.FlowLogId,
        resourceType: services.flowLog,
        relation: 'child',
        field: 'flowLogs',
      })
    }
  }

  /**
   * Find any managedAirflow related data
   */
  const airflows = data.find(({ name }) => name === services.managedAirflow)
  if (airflows?.data?.[region]) {
    const dataAtRegion: RawAwsManagedAirflow[] = airflows.data[region].filter(
      ({
        NetworkConfiguration: { SubnetIds = [] } = {},
      }: RawAwsManagedAirflow) => SubnetIds.includes(SubnetId)
    )
    for (const airflow of dataAtRegion) {
      connections.push({
        id: airflow.Arn,
        resourceType: services.managedAirflow,
        relation: 'child',
        field: 'managedAirflows',
      })
    }
  }

  /**
   * Find any elasticSearchDomain related data
   */
  const domains = data.find(({ name }) => name === services.elasticSearchDomain)
  if (domains?.data?.[region]) {
    const dataAtRegion: RawAwsElasticSearchDomain[] = domains.data[
      region
    ].filter(
      ({ VPCOptions: { SubnetIds = [] } = {} }: RawAwsElasticSearchDomain) =>
        SubnetIds.includes(SubnetId)
    )
    for (const domain of dataAtRegion) {
      connections.push({
        id: domain.DomainId,
        resourceType: services.elasticSearchDomain,
        relation: 'child',
        field: 'elasticSearchDomains',
      })
    }
  }

  /**
   * Find any elasticSearchDomain related data
   */
  const replications = data.find(
    ({ name }) => name === services.dmsReplicationInstance
  )
  if (replications?.data?.[region]) {
    const dataAtRegion: RawAwsDmsReplicationInstance[] = replications.data[
      region
    ].filter(
      ({
        ReplicationSubnetGroup: { Subnets = [] } = {},
      }: RawAwsDmsReplicationInstance) => {
        for (const replicationSubnet of Subnets) {
          if (replicationSubnet.SubnetIdentifier === SubnetId) {
            return true
          }
        }
        return false
      }
    )
    for (const replication of dataAtRegion) {
      connections.push({
        id: replication.ReplicationInstanceArn,
        resourceType: services.dmsReplicationInstance,
        relation: 'child',
        field: 'dmsReplicationInstances',
      })
    }
  }

  /**
   * Find any sageMakerNotebookInstance related data
   */
  const notebooks = data.find(
    ({ name }) => name === services.sageMakerNotebookInstance
  )
  if (notebooks?.data?.[region]) {
    const dataAtRegion: RawAwsSageMakerNotebookInstance[] = notebooks.data[
      region
    ].filter(
      ({ SubnetId: notebookSubnetId }: RawAwsSageMakerNotebookInstance) =>
        notebookSubnetId === SubnetId
    )
    for (const notebook of dataAtRegion) {
      connections.push({
        id: notebook.NotebookInstanceArn,
        resourceType: services.sageMakerNotebookInstance,
        relation: 'child',
        field: 'sageMakerNotebookInstances',
      })
    }
  }

  const natResult = {
    [SubnetId]: connections,
  }
  return natResult
}
