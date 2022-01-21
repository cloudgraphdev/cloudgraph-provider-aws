import flatMap from 'lodash/flatMap'
import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsIamRole } from './data'
import { RawAwsIamPolicy } from '../iamPolicy/data'
import { RawAwsEcsService } from '../ecsService/data'
import { RawFlowLog } from '../flowLogs/data'

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
  const { Arn: id, ManagedPolicies: managedPolicies } = role

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
      const { Arn: policyId } = instance

      connections.push({
        id: policyId,
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
    const ecsServicesInRegion: RawAwsEcsService[] = ecsServices.data[
      region
    ].filter(({ roleArn }: RawAwsEcsService) => roleArn === role.Arn)
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

  /**
   * Find any FlowLog related data
   */
  const flowLogs = data.find(({ name }) => name === services.flowLog)
  if (flowLogs?.data?.[region]) {
    const dataAtRegion: RawFlowLog[] = flowLogs.data[region].filter(
      ({ DeliverLogsPermissionArn }: RawFlowLog) =>
        DeliverLogsPermissionArn === role.Arn
    )
    for (const flowLog of dataAtRegion) {
      connections.push({
        id: flowLog.FlowLogId,
        resourceType: services.flowLog,
        relation: 'child',
        field: 'flowLogs',
      })
    }
  }

  return {
    [id]: connections,
  }
}
