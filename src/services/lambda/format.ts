import isEmpty from 'lodash/isEmpty'
import t from '../../properties/translations'
import { AwsLambda } from '../../types/generated'
import { AwsLambdaFunction } from './data'
import { toCamel } from '../../utils'
import { formatTagsFromMap } from '../../utils/format'

/**
 * Lambda
 */

export default ({
  service: rawData,
}: // allTagData,
{
  service: AwsLambdaFunction
}): AwsLambda => {
  const lambda = toCamel(rawData)
  const {
    Environment = {},
    Tags = {},
    reservedConcurrentExecutions: rawReservedConcurrentExecutions,
  } = rawData
  const {
    codeSize,
    description,
    functionArn: arn,
    handler,
    kmsKeyArn,
    lastModified,
    memorySize,
    runtime,
    timeout,
    tracingConfig: tracing = [],
    version,
  } = lambda
  const environmentVariables = []
  const secretNames = [t.pass, t.secret, t.private, t.cert]

  /**
   * Add these tags to the list of global tags so we can filter by tag on the front end
   */
  // combineElementsTagsWithExistingGlobalTags({ tags, allTagData })

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

        environmentVariables.push({key, value: desiredValue})
      })
    }
  }

  const tracingConfig = Object.entries(tracing)
    .map(([key, value]) => `${key} - ${value}`)
    .join(', ')

  return {
    arn,
    description,
    handler,
    id: arn,
    kmsKeyArn,
    lastModified,
    memorySize,
    reservedConcurrentExecutions,
    role: handler,
    runtime,
    sourceCodeSize: `${parseInt(codeSize, 10) * 0.001} Kb`,
    timeout,
    tracingConfig,
    version,
    environmentVariables,
    tags: formatTagsFromMap(Tags),
  }
}
