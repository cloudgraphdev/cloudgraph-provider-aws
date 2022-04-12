import isEmpty from 'lodash/isEmpty'
import { ServiceConnection } from '@cloudgraph/sdk';
import { StackSet } from 'aws-sdk/clients/cloudformation';
import { TagMap } from '../../types'
import services from '../../enums/services'
import { RawAwsIamRole } from '../iamRole/data'
import { globalRegionName } from '../../enums/regions'

/**
 * Cloud Formation StackSet
 */

export default ({
  service: cfStackSet,
  data,
  region,
}: {
  data: { name: string; data: { [property: string]: any[] } }[]
  service: StackSet & {
    region: string
    Tags: TagMap,
  },
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const {
    StackSetId: id,
    AdministrationRoleARN: administrationRoleARN,
    ExecutionRoleName: executionRoleName,
  } = cfStackSet

  /**
   * Find related IAM Roles
   */
  const roles: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.iamRole)
  if (roles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      role => role.Arn === administrationRoleARN || role.RoleName === executionRoleName
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { Arn: arn }: RawAwsIamRole = instance

        connections.push({
          id: arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRoles',
        })
      }
    }
  }

  const cfStackSetResult = {
    [id]: connections,
  }
  return cfStackSetResult
}