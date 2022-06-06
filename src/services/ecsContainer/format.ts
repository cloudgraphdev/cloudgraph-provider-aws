import { generateUniqueId } from '@cloudgraph/sdk'

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
    id: generateUniqueId({
      arn,
      ...rr,
    }),
    ...rr,
  }))

  const registeredResources = service.registeredResources?.map(rr => ({
    id: generateUniqueId({
      arn,
      ...rr,
    }),
    ...rr,
  }))

  const attributes = service.attributes?.map(attribute => ({
    id: generateUniqueId({
      arn,
      ...attribute,
    }),
    ...attribute,
  }))

  const attachments = service.attachments?.map(attachment => ({
    id: generateUniqueId({
      arn,
      ...attachment,
    }),
    ...attachment,
    details: attachment.details?.map(detail => ({
      id: generateUniqueId({
        arn,
        ...detail,
      }),
      ...detail,
    })),
  }))

  return {
    id: arn,
    arn,
    accountId: account,
    capacityProviderName,
    version,
    versionInfo: {
      id: generateUniqueId({
        arn,
        ...versionInfo,
      }),
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
