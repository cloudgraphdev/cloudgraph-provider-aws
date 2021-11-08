import cuid from 'cuid'
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
    id: cuid(),
    ...rr,
  }))

  const registeredResources = service.registeredResources?.map(rr => ({
    id: cuid(),
    ...rr,
  }))

  const attributes = service.attributes?.map(attribute => ({
    id: cuid(),
    ...attribute,
  }))

  const attachments = service.attachments?.map(attachment => ({
    id: cuid(),
    ...attachment,
    details: attachment.details?.map(detail => ({
      id: cuid(),
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
      id: cuid(),
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
