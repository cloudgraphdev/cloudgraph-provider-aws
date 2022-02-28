// import { formatTagsFromMap } from '../../utils/format' // TODO: Build this
import cuid from 'cuid'
import { AwsSystemsManagerInstance } from '../../types/generated'
import { RawAwsSystemsManagerInstance } from './data'

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

  const mappedComplianceItems = complianceItems.map(
    ({
      ComplianceType: complianceType,
      ResourceType: complianceResourceType,
      ResourceId: resourceId,
      Id: id,
      Title: title,
      Status: status,
      Severity: severity,
      ExecutionSummary: executionSummary,
      Details: details,
    }) => ({
      id,
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
        id: cuid(),
        key,
        value: details[key],
      })),
    })
  )

  const mappedInstanceAssociationStatusAggregatedCount = Object.keys(
    instanceAssociationStatusAggregatedCount ?? {}
  ).map(key => ({
    id: cuid(),
    key,
    value: instanceAssociationStatusAggregatedCount[key],
  }))

  return {
    id: instanceId,
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
    sourceType
  }
}
