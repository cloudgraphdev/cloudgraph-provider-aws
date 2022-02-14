import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawFlowLog } from '../flowLogs/data'
import { RawAwsManagedAirflow } from '../managedAirflow/data'

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
       ({ ResourceId }: RawFlowLog) =>
         ResourceId === SubnetId
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
        ({ NetworkConfiguration: { SubnetIds = [] } = {} }: RawAwsManagedAirflow) =>
          SubnetIds.includes(SubnetId)
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

  const natResult = {
    [SubnetId]: connections,
  }
  return natResult
}
