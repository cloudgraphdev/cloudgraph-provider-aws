import { Entity, ServiceConnection } from '@cloudgraph/sdk'
import { flatMap } from 'lodash'
import services from '../../enums/services'
import aliases from '../../enums/serviceAliases'

export default ({
  service,
  data,
}: {
  service: { id: string; regions: string[] }
  data: Entity[]
}): {
  [property: string]: ServiceConnection[]
} => {
  const { id: accountId } = service
  const connections: ServiceConnection[] = []
  const connectTo = Object.values(services)

  for (const serviceName of connectTo) {
    const instances: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === serviceName)

    if (instances?.data) {
      const filtered = flatMap(instances.data).filter(
        i => i.accountId === accountId
      )

      for (const instance of filtered) {
        if (instance) {
          connections.push({
            id: instance.id,
            resourceType: serviceName,
            relation: 'child',
            field: aliases[serviceName] ? aliases[serviceName] : serviceName,
          })
        }
      }
    }
  }

  return {
    [accountId]: connections,
  }
}
