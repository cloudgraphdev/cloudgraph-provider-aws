import { generateUniqueId } from '@cloudgraph/sdk'
import { AwsEcsTaskSet } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEcsTaskSet } from './data'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsEcsTaskSet
  account: string
  region: string
}): AwsEcsTaskSet => {
  const {
    taskSetArn: arn,
    startedBy,
    externalId,
    status,
    computedDesiredCount,
    pendingCount,
    runningCount,
    createdAt,
    updatedAt,
    launchType,
    capacityProviderStrategy,
    platformVersion,
    networkConfiguration,
    loadBalancers,
    serviceRegistries,
    scale,
    stabilityStatus,
    stabilityStatusAt,
    Tags = {},
  } = service

  return {
    id: arn,
    arn,
    accountId: account,
    region,
    startedBy,
    externalId,
    status,
    computedDesiredCount,
    pendingCount,
    runningCount,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    launchType,
    capacityProviderStrategy: capacityProviderStrategy?.map(strat => ({
      id: generateUniqueId({
        arn,
        ...strat,
      }),
      ...strat,
    })),
    platformVersion,
    networkConfiguration,
    loadBalancers: loadBalancers?.map(lb => ({
      id: generateUniqueId({
        arn,
        ...lb,
      }),
      ...lb,
    })),
    serviceRegistries: serviceRegistries?.map(registry => ({
      id: generateUniqueId({
        arn,
        ...registry,
      }),
      ...registry,
    })),
    scale,
    stabilityStatus,
    stabilityStatusAt: stabilityStatusAt.toISOString(),
    tags: formatTagsFromMap(Tags),
  }
}
