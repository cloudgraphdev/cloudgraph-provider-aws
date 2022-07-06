import { generateUniqueId } from '@cloudgraph/sdk'
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
    id: generateUniqueId({
      arn,
      ...attachment,
    }),
    ...attachment,
    details: attachment?.details?.map(detail => ({
      id: generateUniqueId({
        arn,
        ...detail,
      }),
      ...detail,
    })),
  }))

  const attributes = service.attributes?.map(attribute => ({
    id: generateUniqueId({
      arn,
      ...attribute,
    }),
    ...attribute,
  }))

  const inferenceAccelerators = service.inferenceAccelerators?.map(ia => ({
    id: generateUniqueId({
      arn,
      ...ia,
    }),
    ...ia,
  }))

  const containerOverrides = service?.overrides?.containerOverrides?.map(
    co => ({
      id: generateUniqueId({
        arn,
        ...co,
      }),
      environment: co?.environment?.map(env => ({
        id: generateUniqueId({
          arn,
          ...env,
        }),
        ...env,
      })),
      environmentFiles: co?.environmentFiles?.map(ef => ({
        id: generateUniqueId({
          arn,
          ...ef,
        }),
        ...ef,
      })),
      resourceRequirements: co?.resourceRequirements?.map(rr => ({
        id: generateUniqueId({
          arn,
          ...rr,
        }),
        ...rr,
      })),
    })
  )

  const inferenceAcceleratorOverrides =
    service?.overrides?.inferenceAcceleratorOverrides?.map(ia => ({
      id: generateUniqueId({
        arn,
        ...ia,
      }),
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
      id: generateUniqueId({
        arn,
        ...overrides,
        containerOverrides,
        inferenceAcceleratorOverrides,
        ephemeralStorage,
      }),
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
