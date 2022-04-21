import cuid from 'cuid'

import { RawAwsApiGatewayStage } from './data'
import { AwsApiGatewayStage as AwsAGStageType } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account: accountId,
}: {
  service: RawAwsApiGatewayStage
  account: string
}): AwsAGStageType => {
  const {
    arn,
    stageName: name,
    description,
    cacheClusterEnabled,
    cacheClusterSize,
    accessLogSettings,
    documentationVersion,
    clientCertificateId,
    tracingEnabled,
    variables: vars = {},
    tags = {},
    region,
  } = service

  const variables = Object.entries(vars).map(([k, v]) => ({
    id: cuid(),
    key: k,
    value: v,
  }))

  return {
    id: arn,
    accountId,
    arn,
    region,
    name,
    description,
    cacheCluster: cacheClusterEnabled,
    cacheClusterSize,
    accessLogSettings,
    documentationVersion,
    clientCertificateId,
    xrayTracing: tracingEnabled,
    variables,
    tags: formatTagsFromMap(tags),
  }
}
