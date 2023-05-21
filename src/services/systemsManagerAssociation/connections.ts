import { ServiceConnection } from '@cloudgraph/sdk'
import services from '../../enums/services'
import { RawAwsSystemManagerAssociation } from './data';
import { RawAwsSystemsManagerInstance } from '../systemsManagerInstance/data';

export default ({
  service: systemsManagerAssociation,
  data,
  region,
}: {
  service: RawAwsSystemManagerAssociation
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { AssociationId, InstanceId } = systemsManagerAssociation
  const connections: ServiceConnection[] = []

  /**
   * Find SystemManagerInstances used in SystemsManagerAssociation
   */
  const instances: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.systemsManagerInstance)
  if (instances?.data?.[region]) {
    const systemsManagerInstanceInRegion: RawAwsSystemsManagerInstance[] = instances.data[region].find(
      ({ InstanceId: iId }: RawAwsSystemsManagerInstance) => iId === InstanceId
    )
    if (systemsManagerInstanceInRegion) {
        connections.push({
          id: InstanceId,
          resourceType: services.systemsManagerInstance,
          relation: 'child',
          field: 'systemsManagerInstances',
        })
      }
  }

  const result = {
    [AssociationId]: connections,
  }
  return result 
}
