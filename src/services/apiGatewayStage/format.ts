import { AwsApiGatewayStage } from './data'
import { 
  AwsApiGatewayStage as AwsAGStageType, 
} from '../../types/generated'
import {
  apiGatewayArn,
  apiGatewayStageArn,
} from '../../utils/generateArns'

export default ({
  service,
}: 
{
  service: AwsApiGatewayStage
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
    tags: stageTags = {},
  } = service

  const arn = apiGatewayStageArn({
    restApiArn: apiGatewayArn({ region: service.region }),
    name,
  })

  const variables = Object.entries(vars)
  .map(([k, v]) => ({key: k, value: v}))

  const tags = Object.entries(stageTags)
  .map(([k, v]: [string, string]) => ({key: k, value: v}))

  return {
    id: arn,
    arn,
    name,
    description,
    cacheCluster: cacheClusterEnabled,
    cacheClusterSize,
    accessLogSettings,
    documentationVersion,
    clientCertificateId,
    xrayTracing: tracingEnabled,
    variables,
    tags,
  }
}
