import { generateId } from '@cloudgraph/sdk'
import { AwsEcsService } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEcsService } from './data'

export default ({
  service,
  account,
}: {
  service: RawAwsEcsService
  account: string
}): AwsEcsService => {
  const {
    serviceArn: arn,
    serviceName,
    status,
    desiredCount,
    runningCount,
    pendingCount,
    launchType,
    capacityProviderStrategy,
    platformVersion,
    deploymentConfiguration,
    roleArn,
    createdAt,
    networkConfiguration,
    healthCheckGracePeriodSeconds,
    schedulingStrategy,
    deploymentController,
    createdBy,
    enableECSManagedTags,
    propagateTags,
    enableExecuteCommand,
    Tags,
  } = service

  const loadBalancers = service.loadBalancers?.map(lb => ({
    id: generateId(lb as Record<string, unknown>),
    ...lb,
  }))

  const serviceRegistries = service.serviceRegistries?.map(sr => ({
    id: generateId(sr as Record<string, unknown>),
    ...sr,
  }))

  const deployments = service.deployments?.map(
    ({
      capacityProviderStrategy: deploymentCapacityProviderStrategy,
      networkConfiguration: deploymentNetworkConfiguration,
      createdAt: deploymentCreatedAt,
      updatedAt,
      ...deployment
    }) => {
      const obj = {
        ...deployment,
        capacityProviderStrategy: deploymentCapacityProviderStrategy?.map(strat => ({
          id: generateId(strat as unknown as Record<string, unknown>),
          ...strat,
        })),
        networkConfiguration: deploymentNetworkConfiguration,
        createdAt: deploymentCreatedAt?.toISOString(),
        updatedAt: updatedAt?.toISOString(),
      }
      return {
        id: generateId(obj),
        ...obj
      }
    }
  )

  const events = service.events?.map(({ createdAt: eventCreatedAt, ...event }) => ({
    id: generateId(event as Record<string, unknown>),
    createdAt: eventCreatedAt?.toISOString(),
    ...event,
  }))

  const placementConstraints = service.placementConstraints?.map(pc => ({
    id: generateId(pc as Record<string, unknown>),
    ...pc,
  }))

  const placementStrategy = service.placementStrategy?.map(ps => ({
    id: generateId(ps as Record<string, unknown>),
    ...ps,
  }))

  return {
    id: arn,
    arn,
    accountId: account,
    serviceName,
    loadBalancers,
    serviceRegistries,
    status,
    desiredCount,
    runningCount,
    pendingCount,
    launchType,
    capacityProviderStrategy: capacityProviderStrategy?.map(strat => ({
      id: generateId(strat as unknown as Record<string, unknown>),
      ...strat,
    })),
    platformVersion,
    deploymentConfiguration,
    deployments: deployments?.map(deployment => ({
      id: generateId(deployment as unknown as Record<string, unknown>),
      ...deployment,
      capacityProviderStrategy: deployment.capacityProviderStrategy?.map(
        strat => ({
          id: generateId(strat as unknown as Record<string, unknown>),
          ...strat,
        })
      ),
    })),
    roleArn,
    events,
    createdAt: createdAt?.toISOString(),
    placementConstraints,
    placementStrategy,
    networkConfiguration,
    healthCheckGracePeriodSeconds,
    schedulingStrategy,
    deploymentController,
    createdBy,
    enableECSManagedTags,
    propagateTags,
    enableExecuteCommand,
    tags: formatTagsFromMap(Tags),
  }
}
