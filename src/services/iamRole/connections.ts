import flatMap from 'lodash/flatMap'
import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsIamRole } from './data'
import { RawAwsIamPolicy } from '../iamPolicy/data'
import { RawAwsEcsService } from '../ecsService/data'
import resources from '../../enums/resources'
import { getIamId } from '../../utils/ids'

/**
 * IAM Role
 */

export default ({
  service: role,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsIamRole
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { RoleId: id, RoleName: name, ManagedPolicies: managedPolicies } = role

  const policies: RawAwsIamPolicy[] =
    flatMap(
      data.find(({ name: serviceName }) => serviceName === services.iamPolicy)
        ?.data
    ) || []

  /**
   * Find Managed Policies
   * related to this IAM Role
   */

  const attachedPolicies = policies.filter(({ Arn: arn }: RawAwsIamPolicy) =>
    managedPolicies.find(p => p.PolicyArn === arn)
  )

  if (!isEmpty(attachedPolicies)) {
    for (const instance of attachedPolicies) {
      const { PolicyId: policyId, PolicyName: policyName } = instance

      connections.push({
        id: `${policyName}-${policyId}-${kebabCase(resources.iamPolicy)}`,
        resourceType: services.iamPolicy,
        relation: 'child',
        field: 'iamAttachedPolicies',
      })
    }
  }

  /**
   * Find related ECS service
   */
  const ecsServices: {
    name: string
    data: { [property: string]: RawAwsEcsService[] }
  } = data.find(({ name }) => name === services.ecsService)
  if (ecsServices?.data?.[region]) {
    const ecsServicesInRegion: RawAwsEcsService[] = ecsServices.data[region].filter(
      ({ roleArn }: RawAwsEcsService) => roleArn === role.Arn
    )
    if (!isEmpty(ecsServicesInRegion)) {
      for (const service of ecsServicesInRegion) {
        const { serviceArn } = service

        connections.push({
          id: serviceArn,
          resourceType: services.ecsService,
          relation: 'child',
          field: 'ecsService',
        })
      }
    }
  }

  return {
    [getIamId({
      resourceId: id,
      resourceName: name,
      resourceType: resources.iamRole,
    })]: connections,
  }
}
