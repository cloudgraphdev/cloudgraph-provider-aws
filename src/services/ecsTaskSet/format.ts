import cuid from 'cuid'
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
      id: cuid(),
      ...strat,
    })),
    platformVersion,
    networkConfiguration,
    loadBalancers: loadBalancers?.map(lb => ({
      id: cuid(),
      ...lb,
    })),
    serviceRegistries: serviceRegistries?.map(registry => ({
      id: cuid(),
      ...registry,
    })),
    scale,
    stabilityStatus,
    stabilityStatusAt: stabilityStatusAt.toISOString(),
    tags: formatTagsFromMap(Tags),
  }
}