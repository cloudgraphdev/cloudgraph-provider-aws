import { generateUniqueId } from '@cloudgraph/sdk'

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
    id: generateUniqueId({
      arn,
      ...lb,
    }),
    ...lb,
  }))

  const serviceRegistries = service.serviceRegistries?.map(sr => ({
    id: generateUniqueId({
      arn,
      ...sr,
    }),
    ...sr,
  }))

  const deployments = service.deployments?.map(
    ({
      capacityProviderStrategy,
      networkConfiguration,
      createdAt,
      updatedAt,
      ...deployment
    }) => ({
      id: generateUniqueId({
        arn,
        capacityProviderStrategy,
        networkConfiguration,
        createdAt,
        updatedAt,
        ...deployment,
      }),
      ...deployment,
      capacityProviderStrategy: capacityProviderStrategy?.map(strat => ({
        id: generateUniqueId({
          arn,
          ...strat,
        }),
        ...strat,
      })),
      networkConfiguration,
      createdAt: createdAt?.toISOString(),
      updatedAt: updatedAt?.toISOString(),
    })
  )

  const events = service.events?.map(({ createdAt, ...event }) => ({
    id: generateUniqueId({
      arn,
      createdAt,
      ...event,
    }),
    createdAt: createdAt?.toISOString(),
    ...event,
  }))

  const placementConstraints = service.placementConstraints?.map(pc => ({
    id: generateUniqueId({
      arn,
      ...pc,
    }),
    ...pc,
  }))

  const placementStrategy = service.placementStrategy?.map(ps => ({
    id: generateUniqueId({
      arn,
      ...ps,
    }),
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
      id: generateUniqueId({
        arn,
        ...strat,
      }),
      ...strat,
    })),
    platformVersion,
    deploymentConfiguration: {
      id: generateUniqueId({
        arn,
        ...deploymentConfiguration,
      }),
      ...deploymentConfiguration,
      deploymentCircuitBreaker: {
        id: generateUniqueId({
          arn,
          ...deploymentConfiguration?.deploymentCircuitBreaker,
        }),
        ...deploymentConfiguration?.deploymentCircuitBreaker,
      },
    },
    deployments: deployments?.map(deployment => ({
      id: generateUniqueId({
        arn,
        ...deployment,
      }),
      ...deployment,
      capacityProviderStrategy: deployment.capacityProviderStrategy?.map(
        strat => ({
          id: generateUniqueId({
            arn,
            ...strat,
          }),
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
    deploymentController: {
      id: generateUniqueId({
        arn,
        ...deploymentController,
      }),
      ...deploymentController,
    },
    createdBy,
    enableECSManagedTags,
    propagateTags,
    enableExecuteCommand,
    tags: formatTagsFromMap(Tags),
  }
}
