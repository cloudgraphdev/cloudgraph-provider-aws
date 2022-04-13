import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawFlowLog } from '../flowLogs/data'
import { RawNetworkInterface } from './data'
import { RawAwsSageMakerNotebookInstance } from '../sageMakerNotebookInstance/data'
import { AwsSecurityGroup } from '../securityGroup/data'

export default ({
  service: networkInterface,
  data,
  region,
}: {
  service: RawNetworkInterface
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { NetworkInterfaceId, SubnetId, Groups = [] } = networkInterface
  const sgIds = Groups.map(({ GroupId }) => GroupId)
  const connections: ServiceConnection[] = []
  /**
   * Find Subnets used in Network Interface
   */
  const subnets: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId: sId }: RawAwsSubnet) => sId === SubnetId
    )
    if (!isEmpty(subnetsInRegion)) {
      for (const subnet of subnetsInRegion) {
        const { SubnetId: id } = subnet
        connections.push({
          id,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnet',
        })
      }
    }
  }

  /**
   * Find any FlowLog related data
   */
  const flowLogs = data.find(({ name }) => name === services.flowLog)
  if (flowLogs?.data?.[region]) {
    const dataAtRegion: RawFlowLog[] = flowLogs.data[region].filter(
      ({ ResourceId }: RawFlowLog) => ResourceId === NetworkInterfaceId
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
   * Find any sageMakerNotebookInstance related data
   */
  const notebooks = data.find(
    ({ name }) => name === services.sageMakerNotebookInstance
  )
  if (notebooks?.data?.[region]) {
    const dataAtRegion: RawAwsSageMakerNotebookInstance[] = notebooks.data[
      region
    ].filter(
      ({
        NetworkInterfaceId: notebookNetworkInterfaceId,
      }: RawAwsSageMakerNotebookInstance) =>
        notebookNetworkInterfaceId === NetworkInterfaceId
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

  /**
   * Find related security groups
   */
  const securityGroups: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.sg)
  if (securityGroups?.data?.[region]) {
    const securityGroupsInRegion: AwsSecurityGroup[] = securityGroups.data[
      region
    ].filter(
      ({ GroupId }: AwsSecurityGroup) =>
        !isEmpty(sgIds) &&
        sgIds.filter(str => str.toLowerCase().includes(GroupId.toLowerCase()))
          .length > 0
    )
    if (!isEmpty(securityGroupsInRegion)) {
      for (const securityGroup of securityGroupsInRegion) {
        const { GroupId: id } = securityGroup
        connections.push({
          id,
          resourceType: services.sg,
          relation: 'child',
          field: 'securityGroups',
        })
      }
    }
  }

  const natResult = {
    [NetworkInterfaceId]: connections,
  }
  return natResult
}
