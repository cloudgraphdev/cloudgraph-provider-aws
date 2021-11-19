import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawFlowLog } from '../flowLogs/data'

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

  const natResult = {
    [SubnetId]: connections,
  }
  return natResult
}
