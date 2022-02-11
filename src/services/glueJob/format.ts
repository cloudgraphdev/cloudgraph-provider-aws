import cuid from 'cuid'
import { AwsGlueJob } from '../../types/generated'
import { glueJobArn } from '../../utils/generateArns'
import { RawAwsGlueJob } from './data'

/**
 * GlueJob
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsGlueJob
  region: string
}): AwsGlueJob => {
  const {
    Name: name,
    Description: description,
    LogUri: logUri,
    Role: role,
    CreatedOn: createdOn,
    LastModifiedOn: lastModifiedOn,
    ExecutionProperty: {
      MaxConcurrentRuns: maxConcurrentRuns
    } = {},
    Command: {
      PythonVersion: pythonVersion,
      Name: commandName,
      ScriptLocation: scriptLocation
    } = {},
    DefaultArguments: defaultArguments,
    NonOverridableArguments: nonOverrideableArguments,
    Connections: {
      Connections: connections,
    } = {},
    MaxRetries: maxRetries,
    AllocatedCapacity: allocatedCapacity,
    Timeout: timeout,
    MaxCapacity: maxCapacity,
    WorkerType: workerType,
    NumberOfWorkers: numberOfWorkers,
    SecurityConfiguration: securityConfiguration,
    NotificationProperty: {
      NotifyDelayAfter: notifyDelayAfter
    } = {},
    GlueVersion: glueVersion,
  } = rawData

  const mappedDefaultArguments = Object.keys(defaultArguments ?? {}).map(key => ({
    id: cuid(),
    key,
    value: defaultArguments[key]
  }))
  const mappedNonOverrideableArguments = Object.keys(nonOverrideableArguments ?? {}).map(key => ({
    id: cuid(),
    key,
    value: nonOverrideableArguments[key]
  }))
  const arn = glueJobArn({ region, account, name })

  return {
    id: arn,
    arn,
    region,
    accountId: account,
    name,
    description,
    logUri,
    role,
    createdOn: createdOn?.toISOString(),
    lastModifiedOn: lastModifiedOn?.toISOString(),
    executionProperty: {
      maxConcurrentRuns
    },
    command: {
      name: commandName,
      pythonVersion,
      scriptLocation
    },
    defaultArguments: mappedDefaultArguments,
    nonOverrideableArguments: mappedNonOverrideableArguments,
    connections: {
      connections
    },
    maxRetries,
    allocatedCapacity,
    timeout,
    maxCapacity,
    workerType,
    numberOfWorkers,
    securityConfiguration,
    notificationProperty: {
      notifyDelayAfter
    },
    glueVersion,
  }
}
