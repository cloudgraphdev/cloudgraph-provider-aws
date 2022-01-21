import { generateId } from '@cloudgraph/sdk'
import t from '../../properties/translations'

import { AwsCloudFormationStack } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsCloudFormationStack } from './data'

export default ({
  service: rawData,
  region,
}: {
  service: RawAwsCloudFormationStack
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
    RoleARN: roleARN,
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
      const obj = {
        parameterKey,
        parameterValue,
        usePreviousValue: usePreviousValue ? t.yes : t.no,
        resolvedValue,
      }
      return {
        id: generateId(obj),
        ...obj,
      }
    }
  )

  const rollbackConfigurationRollbackTriggerList =
    rollbackConfiguration?.RollbackTriggers?.map(({ Arn: arn, Type: type }) => {
      return {
        id: generateId({ arn, type }),
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
          id: generateId({
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
        const obj = {
          resourceType,
          status,
          timestamp: Timestamp.toISOString(),
        }
        return {
          id: generateId(obj),
          ...obj,
        }
      }
    ) || []

  return {
    id: stackId,
    arn: stackId,
    name: stackName,
    changeSetId: changeSetId || '',
    description,
    parameters: parameterList,
    creationTime: creationTime.toISOString(),
    deletionTime: deletionTime?.toISOString() || '',
    lastUpdatedTime: lastUpdatedTime?.toISOString() || '',
    rollbackConfiguration: {
      id: generateId({
        rollbackConfigurationRollbackTriggerList,
        monitoringTimeInMinutes:
          rollbackConfiguration?.MonitoringTimeInMinutes || 0,
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
    roleARN: roleARN || '', // TODO: create connection to IAM role if possible
    tags: formatTagsFromMap(tags),
    enableTerminationProtection: enableTerminationProtection ? t.yes : t.no,
    parentId: parentId || '',
    rootId: rootId || '',
    stackDriftInfo: {
      id: generateId({
        status: driftInformation?.StackDriftStatus || '',
        lastCheckTimestamp:
          driftInformation?.LastCheckTimestamp?.toISOString() || '',
      }),
      status: driftInformation?.StackDriftStatus || '',
      lastCheckTimestamp:
        driftInformation?.LastCheckTimestamp?.toISOString() || '',
    },
    stackDriftList,
    region,
  }
}
