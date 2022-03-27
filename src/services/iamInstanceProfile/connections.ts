import { ServiceConnection } from '@cloudgraph/sdk'
import isEmpty from 'lodash/isEmpty'
import services from '../../enums/services'
import { RawAwsInstanceProfile } from './data'
import { RawAwsIamRole } from '../iamRole/data'
import { globalRegionName } from '../../enums/regions'

/**
 * IAM Instance Profiles
 */

export default ({
  service: instanceProfile,
  data,
}: {
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsInstanceProfile
  account: string
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const { InstanceProfileId: id, Roles: instanceProfileRoles } = instanceProfile

  /**
   * Find related IAM Roles
   */

  const rolesArn = instanceProfileRoles?.map(({ Arn }) => Arn)

  const roles: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.iamRole)

  if (roles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      ({ Arn }: RawAwsIamRole) => rolesArn.includes(Arn)
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { Arn: arn  } = instance

        connections.push({
          id: arn,
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
