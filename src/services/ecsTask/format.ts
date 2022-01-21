import { generateId } from '@cloudgraph/sdk'
import { AwsEcsTask } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEcsTask } from './data'

export default ({
  service,
  account,
}: {
  service: RawAwsEcsTask
  account: string
}): AwsEcsTask => {
  const {
    taskArn: arn,
    availabilityZone,
    capacityProviderName,
    clusterArn,
    connectivity,
    connectivityAt,
    containerInstanceArn,
    cpu,
    createdAt,
    desiredStatus,
    enableExecuteCommand,
    executionStoppedAt,
    group,
    healthStatus,
    lastStatus,
    launchType,
    memory,
    overrides,
    platformVersion,
    pullStartedAt,
    pullStoppedAt,
    startedAt,
    startedBy,
    stopCode,
    stoppedAt,
    stoppedReason,
    stoppingAt,
    version,
    ephemeralStorage,
    Tags,
  } = service

  const attachments = service.attachments?.map(attachment => ({
    id: generateId(attachment as Record<string, unknown>),
    ...attachment,
    details: attachment?.details?.map(detail => ({
      id: generateId(detail as Record<string, unknown>),
      ...detail,
    })), 
  }))

  const attributes = service.attributes?.map(attribute => ({
    id: generateId(attribute as unknown as Record<string, unknown>),
    ...attribute,
  }))

  const inferenceAccelerators = service.inferenceAccelerators?.map(ia => ({
    id: generateId(ia as unknown as Record<string, unknown>),
    ...ia,
  }))

  const containerOverrides = service?.overrides?.containerOverrides?.map(co => ({
    id: generateId(co as Record<string, unknown>),
    environment: co?.environment?.map(env => ({
      id: generateId(env as Record<string, unknown>),
      ...env,
    })),
    environmentFiles: co?.environmentFiles?.map(ef => ({
      id: generateId(ef as unknown as Record<string, unknown>),
      ...ef,
    })),
    resourceRequirements: co?.resourceRequirements?.map(rr => ({
      id: generateId(rr as unknown as Record<string, unknown>),
      ...rr,
    }))
  }))

  const inferenceAcceleratorOverrides = service?.overrides?.inferenceAcceleratorOverrides?.map(ia => ({
    id: generateId(ia as Record<string, unknown>),
    ...ia,
  }))

  return {
    id: arn,
    arn,
    accountId: account,
    attachments,
    attributes,
    availabilityZone,
    capacityProviderName,
    clusterArn,
    connectivity,
    connectivityAt: connectivityAt?.toISOString(),
    containerInstanceArn,
    cpu,
    createdAt: createdAt?.toISOString(),
    desiredStatus,
    enableExecuteCommand,
    executionStoppedAt: executionStoppedAt?.toISOString(),
    group,
    healthStatus,
    inferenceAccelerators,
    lastStatus,
    launchType,
    memory,
    overrides: {
      ...overrides,
      containerOverrides,
      inferenceAcceleratorOverrides,
      ephemeralStorage,
    },
    platformVersion,
    pullStartedAt: pullStartedAt?.toISOString(),
    pullStoppedAt: pullStoppedAt?.toISOString(),
    startedAt: startedAt?.toISOString(),
    startedBy,
    stopCode,
    stoppedAt: stoppedAt?.toISOString(),
    stoppedReason,
    stoppingAt: stoppingAt?.toISOString(),
    version,
    ephemeralStorage,
    tags: formatTagsFromMap(Tags),
  }
}
