import flatMap from 'lodash/flatMap'
import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsIamUser } from './data'
import { RawAwsIamPolicy } from '../iamPolicy/data'
import resources from '../../enums/resources'
import { getIamId } from '../../utils/ids'

/**
 * IAM User
 */

export default ({
  service: user,
  data,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsIamUser
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    UserId: id,
    UserName: name,
    ManagedPolicies: managedPolicies = [],
  } = user

  /**
   * Find Managed Policies
   * related to this IAM User
   */

  const policies: RawAwsIamPolicy[] =
    flatMap(
      data.find(({ name: serviceName }) => serviceName === services.iamPolicy)
        ?.data
    ) || []

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

  return {
    [getIamId({
      resourceId: id,
      resourceName: name,
      resourceType: resources.iamUser,
    })]: connections,
  }
}
