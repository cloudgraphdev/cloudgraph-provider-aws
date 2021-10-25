import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsEcsTask } from '../ecsTask/data'
import { RawAwsEcsContainer } from '../ecsContainer/data'
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
    const containerArns = service?.containers?.map(({ containerArn }) => containerArn)
    const containersInRegion: RawAwsEcsContainer[] = containers.data[region].filter(({ containerInstanceArn }) =>
      containerArns.includes(containerInstanceArn)
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

  const result = {
    [id]: connections,
  }
  return result
}
