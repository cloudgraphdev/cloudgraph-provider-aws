import { generateId } from '@cloudgraph/sdk'
import { AwsEcsCluster } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEcsCluster } from './data'

export default ({
  service,
  account,
}: {
  service: RawAwsEcsCluster
  account: string
}): AwsEcsCluster => {
  const {
    clusterArn: arn,
    clusterName,
    configuration,
    status,
    registeredContainerInstancesCount,
    runningTasksCount,
    pendingTasksCount,
    activeServicesCount,
    capacityProviders,
    attachmentsStatus,
    Tags = {},
  } = service

  const statistics = service.statistics?.map(stat => ({
    id: generateId(stat as Record<string, unknown>),
    ...stat,
  }))

  const settings = service.settings?.map(setting => ({
    id: generateId(setting as Record<string, unknown>),
    ...setting,
  }))

  const defaultCapacityProviderStrategy = service.defaultCapacityProviderStrategy?.map(strat => ({
    id: generateId(strat as unknown as Record<string, unknown>),
    ...strat,
  }))

  const attachments = service.attachments?.map(attachment => ({
    id: generateId(attachment as Record<string, unknown>),
    ...attachment,
    details: attachment?.details?.map(detail => ({
      id: generateId(detail as Record<string, unknown>),
      ...detail,
    })), 
  }))

  return {
    id: arn,
    arn,
    accountId: account,
    clusterName,
    configuration: {
      executeCommandConfiguration: {
        logConfiguration: {
          ...configuration?.executeCommandConfiguration?.logConfiguration
        },
      },
    },
    status,
    registeredContainerInstancesCount,
    runningTasksCount,
    pendingTasksCount,
    activeServicesCount,
    statistics,
    settings,
    capacityProviders,
    defaultCapacityProviderStrategy,
    attachments,
    attachmentsStatus,
    tags: formatTagsFromMap(Tags),
  }
}
