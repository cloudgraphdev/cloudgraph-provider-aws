import { ServiceConnection } from '@cloudgraph/sdk'
import { Stack } from 'aws-sdk/clients/cloudformation'
import isEmpty from 'lodash/isEmpty'
import services from '../../enums/services'
import { RawAwsCloudFormationStack } from './data'
import { RawAwsIamRole } from '../iamRole/data'
import { TagMap } from '../../types'
import { globalRegionName } from '../../enums/regions'

/**
 * Cloud Formation Stack
 */

export default ({
  service: cfStack,
  data,
  region,
}: {
  data: { name: string; data: { [property: string]: any[] } }[]
  service: Stack & {
    region: string
    Tags: TagMap
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const {
    StackId: id,
    RoleARN: roleArn,
    NotificationARNs: notificationARNs,
    ParentId: parentId,
    RootId: rootId,
  } = cfStack

  /**
   * Find related Cloudformation stacks
   */
  const CFStacks: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.cloudFormationStack)
  if (CFStacks?.data?.[region]) {
    // Find root stack
    if (rootId) {
      const rootStack: RawAwsCloudFormationStack = CFStacks.data[region].find(
        ({ StackId }) => StackId === rootId
      )
      if (rootStack) {
        connections.push({
          id: rootStack.StackId,
          resourceType: services.cloudFormationStack,
          relation: 'child',
          field: 'rootStack',
          insertAfterNodeInsertion: true,
        })
      }
    }
    // Find parent stack
    if (parentId) {
      const parentStack: RawAwsCloudFormationStack = CFStacks.data[region].find(
        ({ StackId }) => StackId === parentId
      )
      if (parentStack) {
        connections.push({
          id: parentStack.StackId,
          resourceType: services.cloudFormationStack,
          relation: 'child',
          field: 'parentStack',
          insertAfterNodeInsertion: true,
        })
      }
    }
  }

  /**
   * Find related IAM Roles
   */
  const roles: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.iamRole)
  if (roles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      role => role.Arn === roleArn
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { Arn: arn }: RawAwsIamRole = instance

        connections.push({
          id: arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRole',
        })
      }
    }
  }

  /**
   * Find related SNS topic
   */
  const snsTopics = data.find(({ name }) => name === services.sns)
  if (snsTopics?.data?.[region]) {
    const snsTopicsInRegion = snsTopics.data[region].filter(
      topic => topic.TopicArn === notificationARNs
    )

    if (!isEmpty(snsTopicsInRegion)) {
      for (const topic of snsTopicsInRegion) {
        connections.push({
          id: topic.TopicArn,
          resourceType: services.sns,
          relation: 'child',
          field: 'sns',
        })
      }
    }
  }

  const cfStackResult = {
    [id]: connections,
  }
  return cfStackResult
}
