import { generateId } from '@cloudgraph/sdk'
import { RawAwsApiGatewayStage } from './data'
import { AwsApiGatewayStage as AwsAGStageType } from '../../types/generated'
import {
  apiGatewayArn,
  apiGatewayRestApiArn,
  apiGatewayStageArn,
} from '../../utils/generateArns'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account: accountId,
}: {
  service: RawAwsApiGatewayStage
  account: string
}): AwsAGStageType => {
  const {
    stageName: name,
    description,
    cacheClusterEnabled,
    cacheClusterSize,
    accessLogSettings,
    documentationVersion,
    clientCertificateId,
    tracingEnabled,
    variables: vars = {},
    restApiId,
    tags = {},
    region,
  } = service

  const arn = apiGatewayStageArn({
    restApiArn: apiGatewayRestApiArn({
      restApiArn: apiGatewayArn({ region }),
      id: restApiId,
    }),
    name,
  })

  const variables = Object.entries(vars).map(([k, v]) => ({
    id: generateId({key: k, value: v}),
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
