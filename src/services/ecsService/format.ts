import CloudGraph from '@cloudgraph/sdk'
const { logger } = CloudGraph

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
    id: cuid(),
    ...lb,
  }))

  const serviceRegistries = service.serviceRegistries?.map(sr => ({
    id: cuid(),
    ...sr,
  }))

  const deployments = service.deployments?.map(({ capacityProviderStrategy, networkConfiguration, createdAt, updatedAt, ...deployment}) => ({
    id: cuid(),
    ...deployment,
    capacityProviderStrategy: capacityProviderStrategy?.map(strat => ({
      id: cuid(),
      ...strat,
    })),
    networkConfiguration,
    createdAt: createdAt?.toISOString(),
    updatedAt: updatedAt?.toISOString(),
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
    loadBalancers,
    serviceRegistries,
    status,
    desiredCount,
    runningCount,
    pendingCount,
    launchType,
    capacityProviderStrategy: capacityProviderStrategy?.map(strat => ({
      id: cuid(),
      ...strat,
    })),
    platformVersion,
    deploymentConfiguration: {
      id: cuid(),
      ...deploymentConfiguration,
      deploymentCircuitBreaker: {
        id: cuid(),
        ...deploymentConfiguration?.deploymentCircuitBreaker,
      },
    },
    deployments: deployments?.map(deployment => ({
      id: cuid(),
      ...deployment,
      capacityProviderStrategy: deployment.capacityProviderStrategy?.map(strat => ({
        id: cuid(),
        ...strat,
      })),
    })),
    roleArn,
    events,
    createdAt: createdAt?.toISOString(),
    placementConstraints,
    placementStrategy,
    networkConfiguration,
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
