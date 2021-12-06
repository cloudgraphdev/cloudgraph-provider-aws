import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsEcsTask } from '../ecsTask/data'
import { RawAwsEcsContainer } from '../ecsContainer/data'
import { RawAwsEcsCluster } from '../ecsCluster/data'
import { RawAwsEcsTaskDefinition } from '../ecsTaskDefinition/data'
import services from '../../enums/services'

export default ({
  account,
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsEcsTask
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { taskArn: id } = service
  const connections: ServiceConnection[] = []

  /**
   * Find ECS containers
   */
  const containers: {
    name: string
    data: { [property: string]: RawAwsEcsContainer[] }
  } = data.find(({ name }) => name === services.ecsContainer)
  if (containers?.data?.[region]) {
    const containersInRegion: RawAwsEcsContainer[] = containers.data[region].filter(
      ({ containerInstanceArn }) => containerInstanceArn === service.containerInstanceArn
    )
    if (!isEmpty(containersInRegion)) {
      for (const container of containersInRegion) {
        const { containerInstanceArn } = container

        connections.push({
          id: containerInstanceArn,
          resourceType: services.ecsContainer,
          relation: 'child',
          field: 'ecsContainer',
        })
      }
    }
  }

  /**
   * Find ECS clusters
   */
  const clusters: {
    name: string
    data: { [property: string]: RawAwsEcsCluster[] }
  } = data.find(({ name }) => name === services.ecsCluster)
  if (clusters?.data?.[region]) {
    const clustersInRegion: RawAwsEcsCluster[] = clusters.data[region].filter(
      ({ clusterArn }) => clusterArn === service.clusterArn
    )
    if (!isEmpty(clustersInRegion)) {
      for (const instance of clustersInRegion) {

        connections.push({
          id: instance.clusterArn,
          resourceType: services.ecsCluster,
          relation: 'child',
          field: 'ecsCluster',
        })
      }
    }
  }

  /**
   * Find ECS task definition
   */
  const taskDefinitions: {
    name: string
    data: { [property: string]: RawAwsEcsTaskDefinition[] }
  } = data.find(({ name }) => name === services.ecsTaskDefinition)
  if (taskDefinitions?.data?.[region]) {
    const taskDefinitionsInRegion: RawAwsEcsTaskDefinition[] = taskDefinitions.data[region].filter(
      ({ taskDefinitionArn }) => taskDefinitionArn === service.taskDefinitionArn
    )
    if (!isEmpty(taskDefinitionsInRegion)) {
      for (const instance of taskDefinitionsInRegion) {

        connections.push({
          id: instance.taskDefinitionArn,
          resourceType: services.ecsTaskDefinition,
          relation: 'child',
          field: 'ecsTaskDefinition',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
