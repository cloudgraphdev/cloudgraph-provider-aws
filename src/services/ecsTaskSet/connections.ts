import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsEcsTaskSet } from '../ecsTaskSet/data'
import { RawAwsEcsTaskDefinition } from '../ecsTaskDefinition/data'
import services from '../../enums/services'

export default ({
  account,
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsEcsTaskSet
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { taskSetArn: id, taskDefinition } = service
  const connections: ServiceConnection[] = []

  /**
   * Find ECS task definition
   */
  const taskDefinitions: {
    name: string
    data: { [property: string]: RawAwsEcsTaskDefinition[] }
  } = data.find(({ name }) => name === services.ecsTaskDefinition)
  if (taskDefinitions?.data?.[region]) {
    const taskDefinitionsInRegion: RawAwsEcsTaskDefinition[] = taskDefinitions.data[region].filter(
      ({ taskDefinitionArn }) => taskDefinitionArn === taskDefinition
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
