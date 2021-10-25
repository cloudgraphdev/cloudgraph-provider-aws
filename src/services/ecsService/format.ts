import cuid from 'cuid'
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
    clusterArn,
    status,
    desiredCount,
    runningCount,
    pendingCount,
    launchType,
    capacityProviderStrategy,
    platformVersion,
    taskDefinition,
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
    id: cuid(),
    ...lb,
  }))

  const serviceRegistries = service.serviceRegistries?.map(sr => ({
    id: cuid(),
    ...sr,
  }))

  const taskSets = service.taskSets?.map(({ capacityProviderStrategy, createdAt, updatedAt, loadBalancers, serviceRegistries, scale, stabilityStatusAt, ...ts }) => ({
    id: cuid(),
    ...ts,
    capacityProviderStrategy: {
      id: cuid(),
      ...capacityProviderStrategy,
    },
    createdAt: createdAt?.toISOString(),
    updatedAt: updatedAt?.toISOString(),
    networkConfiguration: {
      id: cuid(),
      ...networkConfiguration,
      awsvpcConfiguration: {
        id: cuid(),
        ...networkConfiguration?.awsvpcConfiguration
      },
    },
    loadBalancers: loadBalancers?.map(lb => ({
      id: cuid(),
      ...loadBalancers,
    })),
    serviceRegistries: serviceRegistries?.map(sr => ({
      id: cuid(),
      ...sr,
    })),
    scale: {
      id: cuid(),
      ...scale,
    },
    stabilityStatusAt: stabilityStatusAt?.toISOString(),
  }))

  const deployments = service.deployments?.map(({ capacityProviderStrategy, networkConfiguration, createdAt, updatedAt, ...deployment}) => ({
    id: cuid(),
    capacityProviderStrategy: {
      id: cuid(),
      ...capacityProviderStrategy,
    },
    networkConfiguration: {
      id: cuid(),
      awsvpcConfiguration: {
        id: cuid(),
        ...networkConfiguration?.awsvpcConfiguration
      },
    },
    createdAt: createdAt?.toISOString(),
    updatedAt: updatedAt?.toISOString(),
    ...deployment,
  }))

  const events = service.events?.map(({ createdAt, ...event}) => ({
    id: cuid(),
    createdAt: createdAt?.toISOString(),
    ...event,
  }))

  const placementConstraints = service.placementConstraints?.map(pc => ({
    id: cuid(),
    ...pc,
  }))

  const placementStrategy = service.placementStrategy?.map(ps => ({
    id: cuid(),
    ...ps,
  }))

  return {
    id: arn,
    arn,
    accountId: account,
    serviceName,
    clusterArn,
    loadBalancers,
    serviceRegistries,
    status,
    desiredCount,
    runningCount,
    pendingCount,
    launchType,
    capacityProviderStrategy: {
      id: cuid(),
      ...capacityProviderStrategy,
    },
    platformVersion,
    taskDefinition,
    deploymentConfiguration: {
      id: cuid(),
      ...deploymentConfiguration,
      deploymentCircuitBreaker: {
        id: cuid(),
        ...deploymentConfiguration?.deploymentCircuitBreaker,
      },
    },
    taskSets,
    deployments,
    roleArn,
    events,
    createdAt: createdAt?.toISOString(),
    placementConstraints,
    placementStrategy,
    networkConfiguration: {
      id: cuid(),
      awsvpcConfiguration: {
        id: cuid(),
        ...networkConfiguration?.awsvpcConfiguration,
      },
    },
    healthCheckGracePeriodSeconds,
    schedulingStrategy,
    deploymentController: {
      id: cuid(),
      ...deploymentController,
    },
    createdBy,
    enableECSManagedTags,
    propagateTags,
    enableExecuteCommand,
    tags: formatTagsFromMap(Tags),
  }
}
