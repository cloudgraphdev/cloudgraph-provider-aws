import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsEcsTaskDefinition } from '../ecsTaskDefinition/data'
import { RawAwsIamRole } from '../iamRole/data'
import services from '../../enums/services'
import { globalRegionName } from '../../enums/regions'

export default ({
  service,
  data,
}: {
  account: string
  service: RawAwsEcsTaskDefinition
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { taskDefinitionArn: id, executionRoleArn } = service
  const connections: ServiceConnection[] = []

  /**
   * Find related IAM Roles
   */
  const roles: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.iamRole)
  if (roles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      ({ Arn }: RawAwsIamRole) => executionRoleArn === Arn
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { Arn: roleId } = instance

        connections.push({
          id: roleId,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRole',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
