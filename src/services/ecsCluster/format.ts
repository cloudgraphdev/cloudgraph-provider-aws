import cuid from 'cuid'
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
    id: cuid(),
    ...stat,
  }))

  const settings = service.settings?.map(setting => ({
    id: cuid(),
    ...setting,
  }))

  const defaultCapacityProviderStrategy = service.defaultCapacityProviderStrategy?.map(strat => ({
    id: cuid(),
    ...strat,
  }))

  const attachments = service.attachments?.map(attachment => ({
    id: cuid(),
    ...attachment,
    details: attachment?.details?.map(detail => ({
      id: cuid(),
      ...detail,
    })), 
  }))

  return {
    id: arn,
    arn,
    accountId: account,
    clusterName,
    configuration: {
      id: cuid(),
      executeCommandConfiguration: {
        id: cuid(),
        logConfiguration: {
          id: cuid(),
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
