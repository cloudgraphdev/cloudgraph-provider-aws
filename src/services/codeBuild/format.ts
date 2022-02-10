import cuid from 'cuid'
import { RawAwsCodeBuild } from './data'
import { AwsCodebuild } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsCodeBuild
  account: string
  region: string
}): AwsCodebuild => {
  const {
    arn,
    name,
    description,
    source,
    secondarySources = [],
    sourceVersion,
    secondarySourceVersions = [],
    artifacts,
    secondaryArtifacts = [],
    cache,
    environment,
    serviceRole,
    timeoutInMinutes,
    queuedTimeoutInMinutes,
    encryptionKey,
    created,
    lastModified,
    Tags = {},
    webhook = {},
    fileSystemLocations = [],
    vpcConfig,
    badge,
    logsConfig = {},
    buildBatchConfig = {},
    concurrentBuildLimit,
    projectVisibility,
    publicProjectAlias,
    resourceAccessRole
  }: RawAwsCodeBuild = service

  const formattedEnv = {
    ...(environment ?? {}),
    environmentVariables: environment?.environmentVariables.map(val => ({
      id: cuid(),
      ...val
    }))
  }

  const mappedSecondaryArtifacts = secondaryArtifacts.map(val => ({
    id: cuid(),
    ...val
  }))

  const mappedSecondarySources = secondarySources.map(val => ({
    id: cuid(),
    ...val
  }))

  const mappedFileSystemLocations = fileSystemLocations.map(val => ({
    id: cuid(),
    ...val
  }))

  const mappedSecondarySourceVersions = secondarySourceVersions.map(val => ({
    id: cuid(),
    ...val
  }))

  const formattedWebhook = {
    ...(webhook ?? {}),
    filterGroups: webhook?.filterGroups?.map(val => ({
      id: cuid(),
      data: val.map(nestedVal => ({
        id: cuid(),
        ...nestedVal
      }))
    })),
    lastModifiedSecret: webhook?.lastModifiedSecret?.toISOString()
  }

  return {
    id: arn,
    name,
    accountId,
    arn,
    region,
    description,
    sourceVersion,
    serviceRole,
    timeoutInMinutes,
    queuedTimeoutInMinutes,
    encryptionKey,
    source: source ? {
      id: cuid(),
      ...source
    } : null,
    badge,
    fileSystemLocations: mappedFileSystemLocations,
    secondarySources: mappedSecondarySources,
    artifacts: artifacts ? {
      id: cuid(),
      ...(artifacts ?? {})
    } : null,
    vpcConfig,
    logsConfig,
    buildBatchConfig,
    secondaryArtifacts: mappedSecondaryArtifacts,
    secondarySourceVersions: mappedSecondarySourceVersions,
    cache,
    tags: formatTagsFromMap(Tags ?? {}),
    webhook: formattedWebhook,
    environment: formattedEnv,
    created: created?.toISOString(),
    lastModified: lastModified?.toISOString(),
    concurrentBuildLimit,
    projectVisibility,
    publicProjectAlias,
    resourceAccessRole
  }
}
