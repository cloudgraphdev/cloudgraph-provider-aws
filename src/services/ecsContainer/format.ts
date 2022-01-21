import { generateId } from '@cloudgraph/sdk'
import { AwsEcsContainer } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEcsContainer } from './data'

export default ({
  service,
  account,
}: {
  service: RawAwsEcsContainer
  account: string
}): AwsEcsContainer => {
  const {
    containerInstanceArn: arn,
    capacityProviderName,
    version,
    versionInfo,
    status,
    statusReason,
    agentConnected,
    runningTasksCount,
    pendingTasksCount,
    agentUpdateStatus,
    registeredAt,
    Tags,
  } = service

  const remainingResources = service.remainingResources?.map(rr => ({
    id: generateId(rr as Record<string, unknown>),
    ...rr,
  }))

  const registeredResources = service.registeredResources?.map(rr => ({
    id: generateId(rr as Record<string, unknown>),
    ...rr,
  }))

  const attributes = service.attributes?.map(attribute => ({
    id: generateId(attribute as unknown as Record<string, unknown>),
    ...attribute,
  }))

  const attachments = service.attachments?.map(attachment => ({
    id: generateId(attachment as Record<string, unknown>),
    ...attachment,
    details: attachment.details?.map(detail => ({
      id: generateId(detail as Record<string, unknown>),
      ...detail,
    }))
  }))

  return {
    id: arn,
    arn,
    accountId: account,
    capacityProviderName,
    version,
    versionInfo: {
      ...versionInfo,
    },
    remainingResources,
    registeredResources,
    status,
    statusReason,
    agentConnected,
    runningTasksCount,
    pendingTasksCount,
    agentUpdateStatus,
    attributes,
    registeredAt: registeredAt?.toISOString(),
    attachments,
    tags: formatTagsFromMap(Tags),
  }
}
