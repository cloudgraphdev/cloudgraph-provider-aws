import isEmpty from 'lodash/isEmpty'
import t from '../../properties/translations'
import { AwsLambda } from '../../types/generated'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'
import { RawAwsLambdaFunction } from './data'

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

  return {
    accountId: account,
    arn,
    region,
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
    policy: formatIamJsonPolicy(policy),
    tags: formatTagsFromMap(Tags),
  }
}
