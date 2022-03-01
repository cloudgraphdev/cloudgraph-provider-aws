import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawFlowLog } from '../flowLogs/data'
import { RawAwsManagedAirflow } from '../managedAirflow/data'
import { RawAwsElasticSearchDomain } from '../elasticSearchDomain/data'

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
     const dataAtRegion: RawAwsElasticSearchDomain[] = domains.data[region].filter(
       ({
         VPCOptions: { SubnetIds = [] } = {},
       }: RawAwsElasticSearchDomain) => SubnetIds.includes(SubnetId)
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

  const natResult = {
    [SubnetId]: connections,
  }
  return natResult
}
