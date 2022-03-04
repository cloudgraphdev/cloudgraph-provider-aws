import { ServiceConnection } from '@cloudgraph/sdk'
import { flatMap } from 'lodash'
import services from '../../enums/services'

export default ({
  service,
  data,
}: {
  service: any
  data: Array<{
    name: string
    accountId: string
    data: { [property: string]: any[] }
  }>
}): {
  [property: string]: ServiceConnection[]
} => {
  const { id } = service
  const connections: ServiceConnection[] = []
  const connectTo = Object.values(services)

  for (const serviceName of connectTo) {
    const instances: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => {
      return name === serviceName
    })

    if (instances?.data) {
      const filtered = flatMap(instances.data).filter(i => i.accountId === id)

      for (const instance of filtered) {
        if (instance) {
          connections.push({
            id: instance.cgId,
            resourceType: serviceName,
            relation: 'child',
            field: serviceName,
          })
        }
      }
    }
  }

  return {
    [id]: connections,
  }
}
