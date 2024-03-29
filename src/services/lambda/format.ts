import { generateUniqueId } from '@cloudgraph/sdk'
import isEmpty from 'lodash/isEmpty'
import t from '../../properties/translations'
import { AwsLambda, AwsLambdaEventInvokeConfig, AwsLambdaEventSourceMappings, AwsLambdaLayerVersion } from '../../types/generated'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'
import { RawAwsLambdaFunction } from './data'
import { EventSourceMappingConfiguration, FunctionEventInvokeConfig, Layer } from 'aws-sdk/clients/lambda'

/**
 * Lambda
 */
export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsLambdaFunction
  account: string
  region: string
}): AwsLambda => {
  const {
    CodeSize: codeSize,
    Description: description,
    Environment = {},
    FunctionArn: arn,
    Handler: handler,
    KMSKeyArn: kmsKeyArn,
    LastModified: lastModified,
    MemorySize: memorySize,
    Runtime: runtime,
    Tags = {},
    Timeout: timeout,
    TracingConfig: tracing = [],
    Version: version,
    reservedConcurrentExecutions: rawReservedConcurrentExecutions,
    VpcConfig: vpcConfig,
    PolicyData: { Policy: policy = '', RevisionId: policyRevisionId = '' },
    EventSourceMappings: eventSourceMappings = [],
    EventInvokeConfigs: eventInvokeConfigs = [],
    Layers: layers = []
  } = rawData
  const environmentVariables = []
  const secretNames = [t.pass, t.secret, t.private, t.cert]

  const reservedConcurrentExecutions: any = rawReservedConcurrentExecutions

  if (!isEmpty(Environment)) {
    if (Environment.Variables) {
      Object.entries(Environment.Variables).map(([key, value]) => {
        let desiredValue: string = value
        secretNames.map(secret => {
          if (key.toLowerCase().includes(secret.toLowerCase())) {
            desiredValue = t.secretPlaceholder
          }
        })

        environmentVariables.push({
          id: `${key}:${desiredValue}`,
          key,
          value: desiredValue,
        })
      })
    }
  }

  const tracingConfig = Object.entries(tracing)
    .map(([key, value]) => `${key} - ${value}`)
    .join(', ')

  const formattedVpcConfig = {
    vpcId: vpcConfig?.VpcId,
    subnetIds: vpcConfig?.SubnetIds,
    securityGroupIds: vpcConfig?.SecurityGroupIds,
  }

  const formatEventSourceMappings = (
    eventSourceMappings?: EventSourceMappingConfiguration[]
  ): AwsLambdaEventSourceMappings[] => {
    return (
      eventSourceMappings?.map(e => ({
        id: generateUniqueId({
          arn,
          ...e,
        }),
        uuid: e.UUID,
        startingPosition: e.StartingPosition,
        batchSize: e.BatchSize,
        maximumBatchingWindowInSeconds: e.MaximumBatchingWindowInSeconds,
        parallelizationFactor: e.ParallelizationFactor,
        eventSourceArn: e.EventSourceArn,
        filterCriteria: e.FilterCriteria?.Filters?.map(f => f.Pattern) || [],
        functionArn: e.FunctionArn,
        lastModified: e.LastModified?.toISOString(),
        lastProcessingResult: e.LastProcessingResult,
        state: e.State,
        stateTransitionReason: e.StateTransitionReason,
        destinationConfig: {
          id: generateUniqueId({
            arn,
            ...e.DestinationConfig,

          }),
          OnSuccess: e.DestinationConfig?.OnSuccess?.Destination,
          OnFailure: e.DestinationConfig?.OnFailure?.Destination

        },
        topics: e.Topics,
        queues: e.Queues,
        maximumRecordAgeInSeconds: e.MaximumRecordAgeInSeconds,
        bisectBatchOnFunctionError: e.BisectBatchOnFunctionError,
        maximumRetryAttempts: e.MaximumRetryAttempts,
        tumblingWindowInSeconds: e.TumblingWindowInSeconds,
        functionResponseTypes: e.FunctionResponseTypes,
        amazonManagedKafkaEventSourceConfig: {
          id: generateUniqueId({
            arn,
            ...e.AmazonManagedKafkaEventSourceConfig
          }),
          consumerGroupId: e.AmazonManagedKafkaEventSourceConfig?.ConsumerGroupId
        },
        selfManagedKafkaEventSourceConfig: {
          id: generateUniqueId({
            arn,
            ...e.SelfManagedKafkaEventSourceConfig
          }),
          consumerGroupId: e.SelfManagedKafkaEventSourceConfig?.ConsumerGroupId
        }
      })) || []
    )
  }

  const formatEventInvokeConfigs = (
    eventInvokeConfigs?: FunctionEventInvokeConfig[]
  ): AwsLambdaEventInvokeConfig[] => {
    return (
      eventInvokeConfigs?.map(e => ({
        id: generateUniqueId({
          arn,
          ...e,
        }),
        lastModified: e.LastModified?.toISOString(),
        functionArn: e.FunctionArn,
        maximumRetryAttempts: e.MaximumRetryAttempts,
        maximumEventAgeInSeconds: e.MaximumEventAgeInSeconds,
        destinationConfig: {
          id: generateUniqueId({
            arn,
            ...e.DestinationConfig,

          }),
          OnSuccess: e.DestinationConfig?.OnSuccess?.Destination,
          OnFailure: e.DestinationConfig?.OnFailure?.Destination
        }
      })) || []
    )
  }

  const formatLayers = (
    layers?: Layer[]
  ): AwsLambdaLayerVersion[] => {
    return (
      layers?.map(l => {
        const arnParts = l.Arn?.split(':')
        // get layer name from arn:aws:lambda:_REGION_:_ACCOUNT_ID_:layer:_LAYER_NAME_:_LAYER_VERSION_
        const layerName = arnParts[arnParts.length - 2]
        return ({
          id: generateUniqueId({
            arn,
            ...l,
          }),
          arn: l.Arn,
          name: layerName,
          codeSize: l.CodeSize,
          signingProfileVersionArn: l.SigningProfileVersionArn,
          signingJobArn: l.SigningJobArn,
        })
      }) || []
    )
  }

  const functionName = arn.split(':').pop()
  const functionPolicy = formatIamJsonPolicy(policy)
  const policyStatementIds = functionPolicy?.statement?.map(s => s.sid) ?? []

  return {
    accountId: account,
    arn,
    region,
    name: functionName,
    description,
    handler,
    id: arn,
    kmsKeyArn,
    lastModified,
    memorySize,
    reservedConcurrentExecutions,
    runtime,
    sourceCodeSize: `${codeSize * 0.001} Kb`,
    timeout,
    tracingConfig,
    version,
    environmentVariables,
    vpcConfig: formattedVpcConfig,
    policyRevisionId,
    rawPolicy: policy,
    policy: functionPolicy,
    policyStatementIds,
    tags: formatTagsFromMap(Tags),
    eventSourceMappings: formatEventSourceMappings(eventSourceMappings),
    eventInvokeConfigs: formatEventInvokeConfigs(eventInvokeConfigs),
    layers: formatLayers(layers)
  }
}
