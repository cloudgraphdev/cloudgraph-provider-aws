import cuid from 'cuid'
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
    taskDefinitionArn,
    version,
    ephemeralStorage,
    Tags,
  } = service

  const attachments = service.attachments?.map(attachment => ({
    id: cuid(),
    ...attachment,
    details: attachment?.details?.map(detail => ({
      id: cuid(),
      ...detail,
    })), 
  }))

  const attributes = service.attributes?.map(attribute => ({
    id: cuid(),
    ...attribute,
  }))

  const inferenceAccelerators = service.inferenceAccelerators?.map(ia => ({
    id: cuid(),
    ...ia,
  }))

  const containerOverrides = service?.overrides?.containerOverrides?.map(co => ({
    id: cuid(),
    environment: co?.environment?.map(env => ({
      id: cuid(),
      ...env,
    })),
    environmentFiles: co?.environmentFiles?.map(ef => ({
      id: cuid(),
      ...ef,
    })),
    resourceRequirements: co?.resourceRequirements?.map(rr => ({
      id: cuid(),
      ...rr,
    }))
  }))

  const inferenceAcceleratorOverrides = service?.overrides?.inferenceAcceleratorOverrides?.map(ia => ({
    id: cuid(),
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
      id: cuid(),
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
