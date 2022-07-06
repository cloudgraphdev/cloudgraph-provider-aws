import { generateUniqueId } from '@cloudgraph/sdk'
import t from '../../properties/translations'

import { AwsCloudFormationStack } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsCloudFormationStack } from './data'

export default ({
  service: rawData,
  account: accountId,
  region,
}: {
  service: RawAwsCloudFormationStack
  account: string
  region: string
}): AwsCloudFormationStack => {
  const {
    StackId: stackId,
    StackName: stackName,
    ChangeSetId: changeSetId,
    Description: description,
    Parameters: parameters,
    CreationTime: creationTime,
    DeletionTime: deletionTime,
    LastUpdatedTime: lastUpdatedTime,
    RollbackConfiguration: rollbackConfiguration,
    StackStatus: stackStatus,
    StackStatusReason: stackStatusReason,
    DisableRollback: disableRollback,
    NotificationARNs: notificationARNs,
    TimeoutInMinutes: timeoutInMinutes,
    Capabilities: capabilities,
    Outputs: outputs,
    RoleARN: roleArn,
    Tags: tags,
    EnableTerminationProtection: enableTerminationProtection,
    ParentId: parentId,
    RootId: rootId,
    DriftInformation: driftInformation,
    stackDrifts,
  } = rawData

  const parameterList = parameters.map(
    ({
      ParameterKey: parameterKey,
      ParameterValue: parameterValue,
      UsePreviousValue: usePreviousValue,
      ResolvedValue: resolvedValue,
    }) => {
      return {
        id: generateUniqueId({
          stackId,
          parameterKey,
          parameterValue,
          usePreviousValue,
          resolvedValue,
        }),
        parameterKey,
        parameterValue,
        usePreviousValue: usePreviousValue ? t.yes : t.no,
        resolvedValue,
      }
    }
  )

  const rollbackConfigurationRollbackTriggerList =
    rollbackConfiguration?.RollbackTriggers?.map(({ Arn: arn, Type: type }) => {
      return {
        id: generateUniqueId({
          stackId,
          arn,
          type,
        }),
        arn,
        type,
      }
    }) || []

  const outputsList =
    outputs?.map(
      ({
        OutputKey: outputKey,
        OutputValue: outputValue,
        Description: outputDescription,
        ExportName: exportName,
      }) => {
        return {
          id: generateUniqueId({
            stackId,
            outputKey,
            outputValue,
            outputDescription,
            exportName,
          }),
          outputKey,
          outputValue,
          description: outputDescription,
          exportName,
        }
      }
    ) || []

  const stackDriftList =
    stackDrifts?.map(
      ({
        ResourceType: resourceType,
        StackResourceDriftStatus: status,
        Timestamp,
      }) => {
        return {
          id: generateUniqueId({
            stackId,
            resourceType,
            status,
            Timestamp,
          }),
          resourceType,
          status,
          timestamp: Timestamp.toISOString(),
        }
      }
    ) || []

  return {
    id: stackId,
    arn: stackId,
    name: stackName,
    accountId,
    changeSetId: changeSetId || '',
    description,
    parameters: parameterList,
    creationTime: creationTime.toISOString(),
    deletionTime: deletionTime?.toISOString() || '',
    lastUpdatedTime: lastUpdatedTime?.toISOString() || '',
    rollbackConfiguration: {
      id: generateUniqueId({
        stackId,
        rollbackConfigurationRollbackTriggerList,
        rollbackConfiguration,
      }),
      rollbackTriggers: rollbackConfigurationRollbackTriggerList,
      monitoringTimeInMinutes:
        rollbackConfiguration?.MonitoringTimeInMinutes || 0,
    },
    stackStatus,
    stackStatusReason,
    disableRollback: disableRollback ? t.yes : t.no,
    notificationARNs,
    timeoutInMinutes,
    capabilities,
    outputs: outputsList,
    roleArn: roleArn || '',
    tags: formatTagsFromMap(tags),
    enableTerminationProtection: enableTerminationProtection ? t.yes : t.no,
    parentId: parentId || '',
    rootId: rootId || '',
    stackDriftInfo: {
      id: generateUniqueId({
        stackId,
        driftInformation,
      }),
      status: driftInformation?.StackDriftStatus || '',
      lastCheckTimestamp:
        driftInformation?.LastCheckTimestamp?.toISOString() || '',
    },
    stackDriftList,
    region,
  }
}
