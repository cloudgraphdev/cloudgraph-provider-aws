import { generateId } from '@cloudgraph/sdk'
import t from '../../properties/translations'
import { AwsCloudFormationStackSet } from '../../types/generated'

import { formatTagsFromMap } from '../../utils/format'
import { RawAwsCloudFormationStackSet } from './data'

export default ({
  service: rawData,
  region,
}: {
  service: RawAwsCloudFormationStackSet
  region: string
}): AwsCloudFormationStackSet => {
  const {
    StackSetName: stackSetName,
    StackSetId: stackSetId,
    Description: description,
    Status: status,
    TemplateBody: templateBody,
    Parameters: parameters = [],
    Capabilities: capabilities,
    Tags: tags,
    StackSetARN: stackSetARN,
    AdministrationRoleARN: administrationRoleARN,
    ExecutionRoleName: executionRoleName,
    StackSetDriftDetectionDetails: stackSetDriftDetectionDetails,
    AutoDeployment: autoDeployment,
    PermissionModel: permissionModel,
    OrganizationalUnitIds: organizationalUnitIds,
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
  const driftDetectionDetail = {
    driftStatus: stackSetDriftDetectionDetails?.DriftStatus || '',
    driftDetectionStatus:
      stackSetDriftDetectionDetails?.DriftDetectionStatus || '',
    lastDriftCheckTimestamp:
      stackSetDriftDetectionDetails?.LastDriftCheckTimestamp?.toISOString() ||
      '',
    totalStackInstancesCount:
      stackSetDriftDetectionDetails?.TotalStackInstancesCount || 0,
    driftedStackInstancesCount:
      stackSetDriftDetectionDetails?.DriftedStackInstancesCount || 0,
    inSyncStackInstancesCount:
      stackSetDriftDetectionDetails?.InSyncStackInstancesCount || 0,
    inProgressStackInstancesCount:
      stackSetDriftDetectionDetails?.InProgressStackInstancesCount || 0,
    failedStackInstancesCount:
      stackSetDriftDetectionDetails?.FailedStackInstancesCount || 0,
  }
  return {
    id: stackSetId,
    arn: stackSetARN,
    name: stackSetName,
    description,
    status,
    templateBody,
    parameters: parameterList,
    capabilities,
    tags: formatTagsFromMap(tags),
    administrationRoleARN,
    executionRoleName,
    driftDetectionDetail: {
      id: generateId(driftDetectionDetail),
      ...driftDetectionDetail,
    },
    autoDeploymentConfig: {
      enabled: autoDeployment?.Enabled ? t.yes : t.no,
      retainStacksOnAccountRemoval: autoDeployment?.RetainStacksOnAccountRemoval
        ? t.yes
        : t.no,
    },
    permissionModel,
    organizationalUnitIds,
    region,
  }
}
