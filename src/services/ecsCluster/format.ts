import { generateUniqueId } from '@cloudgraph/sdk'
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
    id: generateUniqueId({
      arn,
      ...stat,
    }),
    ...stat,
  }))

  const settings = service.settings?.map(setting => ({
    id: generateUniqueId({
      arn,
      ...setting,
    }),
    ...setting,
  }))

  const defaultCapacityProviderStrategy =
    service.defaultCapacityProviderStrategy?.map(strat => ({
      id: generateUniqueId({
        arn,
        ...strat,
      }),
      ...strat,
    }))

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

  return {
    id: arn,
    arn,
    accountId: account,
    clusterName,
    configuration: {
      id: generateUniqueId({
        arn,
        ...configuration,
      }),
      executeCommandConfiguration: {
        id: generateUniqueId({
          arn,
          ...configuration?.executeCommandConfiguration,
        }),
        logConfiguration: {
          id: generateUniqueId({
            arn,
            ...configuration?.executeCommandConfiguration?.logConfiguration,
          }),
          ...configuration?.executeCommandConfiguration?.logConfiguration,
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
