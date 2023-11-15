import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsOpsWorksStack } from './data'
import { RawAwsOpsWorksInstance } from '../opsworksInstance/data'
import { RawAwsOpsWorksApp } from '../opsworksApp/data'


export default ({
  service: opsworksStack,
  data,
  region,
}: {
  service: RawAwsOpsWorksStack
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const {
    StackId, DefaultSubnetId, VpcId
  } = opsworksStack
  const connections: ServiceConnection[] = []

  /**
   * Find any opsworks Instances
   * related to this opsworks Stack
   */
  const opsworksInstances = data.find(({ name }) => name === services.opsWorksInstance)
  if (opsworksInstances?.data?.[region]) {
    const dataAtRegion: RawAwsOpsWorksInstance[] = opsworksInstances.data[region].filter(
      ({ StackId: stackId }: RawAwsOpsWorksInstance) => stackId === StackId
    )
    for (const opsWorksInstance of dataAtRegion) {
      connections.push({
        id: opsWorksInstance.Arn,
        resourceType: services.opsWorksInstance,
        relation: 'child',
        field: 'opsWorksInstances',
      })
    }
  }

  /**
   * Find any opsworks App
   * related to this opsworks Stack
   */
  const opsworksApp = data.find(({ name }) => name === services.opsWorksApp)
  if (opsworksApp?.data?.[region]) {
    const dataAtRegion: RawAwsOpsWorksApp[] = opsworksApp.data[region].filter(
      ({ StackId: stackId }: RawAwsOpsWorksApp) =>
      stackId === StackId
    )
    for (const opsWorksInstance of dataAtRegion) {
      connections.push({
        id: opsWorksInstance.AppId,
        resourceType: services.opsWorksApp,
        relation: 'child',
        field: 'opsWorksApps',
      })
    }
  }

  /**
   * Add subnets
   */
  connections.push({
    id: DefaultSubnetId,
    resourceType: services.subnet,
    relation: 'child',
    field: 'subnet',
  })

  const natResult = {
    [StackId]: connections,
  }
  return natResult
}
