// import { formatTagsFromMap } from '../../utils/format' // TODO: Build this
import { generateUniqueId } from '@cloudgraph/sdk'

import { AwsSystemsManagerInstance } from '../../types/generated'
import { RawAwsSystemsManagerInstance } from './data'
import { ssmManagedInstanceArn } from '../../utils/generateArns'

/**
 * SystemsManagerInstance
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsSystemsManagerInstance
  region: string
}): AwsSystemsManagerInstance => {
  const {
    InstanceId: instanceId,
    PingStatus: pingStatus,
    LastPingDateTime: lastPingDateTime,
    AgentVersion: agentVersion,
    IsLatestVersion: isLatestVersion,
    PlatformType: platformType,
    PlatformName: platformName,
    PlatformVersion: platformVersion,
    ActivationId: activationId,
    RegistrationDate: registrationDate,
    ResourceType: resourceType,
    Name: name,
    IPAddress: ipAddress,
    ComputerName: computerName,
    AssociationStatus: associationStatus,
    LastAssociationExecutionDate: lastAssociationExecutionDate,
    LastSuccessfulAssociationExecutionDate:
      lastSuccessfulAssociationExecutionDate,
    AssociationOverview: {
      DetailedStatus: detailedStatus,
      InstanceAssociationStatusAggregatedCount:
        instanceAssociationStatusAggregatedCount,
    } = {},
    complianceItems = [],
    SourceId: sourceId,
    SourceType: sourceType,
  } = rawData

  const arn = ssmManagedInstanceArn({ region, account, name: instanceId })

  const mappedComplianceItems = complianceItems.map(complianceItem => {
    const {
      ComplianceType: complianceType,
      ResourceType: complianceResourceType,
      ResourceId: resourceId,
      Id: complianceItemId,
      Title: title,
      Status: status,
      Severity: severity,
      ExecutionSummary: executionSummary,
      Details: details,
    } = complianceItem
    return {
      id: generateUniqueId({
        arn,
        ...complianceItem,
      }),
      complianceItemId,
      complianceType,
      resourceType: complianceResourceType,
      resourceId,
      title,
      status,
      severity,
      executionSummary: {
        executionTime: executionSummary?.ExecutionTime?.toISOString(),
        executionId: executionSummary?.ExecutionId,
        executionType: executionSummary?.ExecutionType,
      },
      details: Object.keys(details ?? {}).map(key => ({
        id: generateUniqueId({
          arn,
          key,
          value: details[key],
        }),
        key,
        value: details[key],
      })),
    }
  })

  const mappedInstanceAssociationStatusAggregatedCount = Object.keys(
    instanceAssociationStatusAggregatedCount ?? {}
  ).map(key => ({
    id: generateUniqueId({
      arn,
      key,
      value: instanceAssociationStatusAggregatedCount[key],
    }),
    key,
    value: instanceAssociationStatusAggregatedCount[key],
  }))

  return {
    id: arn,
    arn,
    instanceId,
    region,
    accountId: account,
    pingStatus,
    lastPingDateTime: lastPingDateTime?.toISOString(),
    agentVersion,
    isLatestVersion,
    platformType,
    platformName,
    platformVersion,
    activationId,
    registrationDate: registrationDate?.toISOString(),
    resourceType,
    name,
    associationStatus,
    lastAssociationExecutionDate: lastAssociationExecutionDate?.toISOString(),
    lastSuccessfulAssociationExecutionDate:
      lastSuccessfulAssociationExecutionDate?.toISOString(),
    ipAddress,
    computerName,
    associationOverview: {
      detailedStatus,
      instanceAssociationStatusAggregatedCount:
        mappedInstanceAssociationStatusAggregatedCount,
    },
    complianceItems: mappedComplianceItems,
    sourceId,
    sourceType,
  }
}
