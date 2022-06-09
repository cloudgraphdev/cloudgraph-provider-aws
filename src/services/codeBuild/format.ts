import { generateUniqueId } from '@cloudgraph/sdk'

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
    resourceAccessRole,
  }: RawAwsCodeBuild = service

  const formattedEnv = {
    ...(environment ?? {}),
    environmentVariables: environment?.environmentVariables.map(val => ({
      id: generateUniqueId({
        arn,
        ...val,
      }),
      ...val,
    })),
  }

  const mappedSecondaryArtifacts = secondaryArtifacts.map(val => ({
    id: generateUniqueId({
      arn,
      ...val,
    }),
    ...val,
  }))

  const mappedSecondarySources = secondarySources.map(val => ({
    id: generateUniqueId({
      arn,
      ...val,
    }),
    ...val,
  }))

  const mappedFileSystemLocations = fileSystemLocations.map(val => ({
    id: generateUniqueId({
      arn,
      ...val,
    }),
    ...val,
  }))

  const mappedSecondarySourceVersions = secondarySourceVersions.map(val => ({
    id: generateUniqueId({
      arn,
      ...val,
    }),
    ...val,
  }))

  const formattedWebhook = {
    ...(webhook ?? {}),
    filterGroups: webhook?.filterGroups?.map(val => ({
      id: generateUniqueId({
        arn,
        ...val,
      }),
      data: val.map(nestedVal => ({
        id: generateUniqueId({
          arn,
          ...nestedVal,
        }),
        ...nestedVal,
      })),
    })),
    lastModifiedSecret: webhook?.lastModifiedSecret?.toISOString(),
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
    source: source
      ? {
          id: generateUniqueId({
            arn,
            ...source,
          }),
          ...source,
        }
      : null,
    badge,
    fileSystemLocations: mappedFileSystemLocations,
    secondarySources: mappedSecondarySources,
    artifacts: artifacts
      ? {
          id: generateUniqueId({
            arn,
            artifacts,
          }),
          ...(artifacts ?? {}),
        }
      : null,
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
    resourceAccessRole,
  }
}
