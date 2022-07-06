import { generateUniqueId } from '@cloudgraph/sdk'

import { AwsElasticSearchDomain } from '../../types/generated'
import { RawAwsElasticSearchDomain } from './data'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'

/**
 * ElasticSearchDomain
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsElasticSearchDomain
  region: string
}): AwsElasticSearchDomain => {
  const {
    DomainName: domainName,
    ARN: arn,
    DomainId: id,
    Created: created,
    Deleted: deleted,
    Endpoint: endpoint,
    Endpoints: endpoints,
    Processing: processing,
    UpgradeProcessing: upgradeProcessing,
    ElasticsearchVersion: elasticSearchVersion,
    ElasticsearchClusterConfig: elasticSearchClusterconfig,
    EBSOptions: ebsOptions,
    AccessPolicies: accessPolicies,
    SnapshotOptions: snapshotOptions,
    VPCOptions: vpcOptions,
    CognitoOptions: cognitoOptions,
    EncryptionAtRestOptions: encryptionAtRestOptions,
    NodeToNodeEncryptionOptions: nodeToNodeEncryptionOptions,
    AdvancedOptions: advancedOptions,
    LogPublishingOptions: logPublishingOptions,
    ServiceSoftwareOptions: serviceSoftwareOptions,
    DomainEndpointOptions: domainEndpointOptions,
    AdvancedSecurityOptions: advancedSecurityOptions,
    AutoTuneOptions: autoTuneOptions,
    ChangeProgressDetails: changeProcessDetails,
    Tags: tags,
  } = rawData

  const mappedEndpoints = Object.keys(endpoints ?? {}).map(key => ({
    id: generateUniqueId({
      arn,
      key,
      value: endpoints[key],
    }),
    key,
    value: endpoints[key],
  }))

  const formattedElasticSearchClusterConfig = {
    instanceType: elasticSearchClusterconfig?.InstanceType,
    instanceCount: elasticSearchClusterconfig?.InstanceCount,
    dedicatedMasterEnabled: elasticSearchClusterconfig?.DedicatedMasterEnabled,
    dedicatedMasterCount: elasticSearchClusterconfig?.DedicatedMasterCount,
    zoneAwarenessEnabled: elasticSearchClusterconfig?.ZoneAwarenessEnabled,
    zoneAwarenessConfig: {
      availabilityZoneCount:
        elasticSearchClusterconfig?.ZoneAwarenessConfig?.AvailabilityZoneCount,
    },
    dedicatedMasterType: elasticSearchClusterconfig?.DedicatedMasterType,
    warmEnabled: elasticSearchClusterconfig?.WarmEnabled,
    warmType: elasticSearchClusterconfig?.WarmType,
    warmCount: elasticSearchClusterconfig?.WarmCount,
    coldStorageOptions: {
      enabled: elasticSearchClusterconfig?.ColdStorageOptions?.Enabled,
    },
  }

  const formattedEbsOptions = {
    ebsEnabled: ebsOptions?.EBSEnabled,
    volumeType: ebsOptions?.VolumeType,
    volumeSize: ebsOptions?.VolumeSize,
    iops: ebsOptions?.Iops,
  }

  const formattedSnapshotOptions = {
    automatedSnapshotStartHour: snapshotOptions?.AutomatedSnapshotStartHour,
  }

  const formattedVpcOptions = {
    vpcId: vpcOptions?.VPCId,
    subnetIds: vpcOptions?.SubnetIds,
    availabilityZones: vpcOptions?.AvailabilityZones,
    securityGroupIds: vpcOptions?.SecurityGroupIds,
  }

  const formattedCognioOptions = {
    enabled: cognitoOptions?.Enabled,
    userPoolId: cognitoOptions?.UserPoolId,
    identityPoolId: cognitoOptions?.IdentityPoolId,
    roleArn: cognitoOptions?.RoleArn,
  }

  const formattedEncryptionAtRestOptions = {
    enabled: encryptionAtRestOptions?.Enabled,
    kmsKeyId: encryptionAtRestOptions?.KmsKeyId,
  }

  const formattedNodeToNodeEncryptionOptions = {
    enabled: nodeToNodeEncryptionOptions?.Enabled,
  }

  const mappedAdvancedOptions = Object.keys(advancedOptions ?? {}).map(key => ({
    id: generateUniqueId({
      arn,
      key,
      value: advancedOptions[key],
    }),
    key,
    value: advancedOptions[key],
  }))

  const mappedLogPublishingOptions = Object.keys(
    logPublishingOptions ?? {}
  ).map(key => ({
    id: generateUniqueId({
      arn,
      key,
      ...logPublishingOptions[key],
    }),
    key,
    enabled: logPublishingOptions[key]?.Enabled,
    cloudWatchLogsLogGroupArn:
      logPublishingOptions[key]?.CloudWatchLogsLogGroupArn,
  }))

  const formattedServiceSoftwareOptions = {
    currentVersion: serviceSoftwareOptions?.CurrentVersion,
    newVersion: serviceSoftwareOptions?.NewVersion,
    updateAvailable: serviceSoftwareOptions?.UpdateAvailable,
    cancellable: serviceSoftwareOptions?.Cancellable,
    updateStatus: serviceSoftwareOptions?.UpdateStatus,
    description: serviceSoftwareOptions?.Description,
    automatedUpdateDate:
      serviceSoftwareOptions?.AutomatedUpdateDate?.toISOString(),
    optionalDeployment: serviceSoftwareOptions?.OptionalDeployment,
  }

  const formattedDomainEndpointOptions = {
    enforceHttps: domainEndpointOptions?.EnforceHTTPS,
    tlsSecurityPolicy: domainEndpointOptions?.TLSSecurityPolicy,
    customEndpointEnabled: domainEndpointOptions?.CustomEndpointEnabled,
    customEndpoint: domainEndpointOptions?.CustomEndpoint,
    customEndpointCertificateArn:
      domainEndpointOptions?.CustomEndpointCertificateArn,
  }

  const formattedAdvancedSecurityOptions = {
    enabled: advancedSecurityOptions?.Enabled,
    internalUserDatabaseEnabled:
      advancedSecurityOptions?.InternalUserDatabaseEnabled,
    samlOptions: {
      enabled: advancedSecurityOptions?.SAMLOptions?.Enabled,
      idp: {
        metadataContent:
          advancedSecurityOptions?.SAMLOptions?.Idp?.MetadataContent,
        entityId: advancedSecurityOptions?.SAMLOptions?.Idp?.EntityId,
      },
      subjectKey: advancedSecurityOptions?.SAMLOptions?.SubjectKey,
      rolesKey: advancedSecurityOptions?.SAMLOptions?.RolesKey,
      sessionTimeoutMinutes:
        advancedSecurityOptions?.SAMLOptions?.SessionTimeoutMinutes,
    },
    anonymousAuthDisableDate:
      advancedSecurityOptions?.AnonymousAuthDisableDate?.toISOString(),
    anonymousAuthEnabled: advancedSecurityOptions?.AnonymousAuthEnabled,
  }

  const formattedAutoTuneOptions = {
    state: autoTuneOptions?.State,
    errorMessage: autoTuneOptions?.ErrorMessage,
  }

  const formattedChangeProgressDetails = {
    changeId: changeProcessDetails?.ChangeId,
    message: changeProcessDetails?.Message,
  }

  return {
    id,
    arn,
    region,
    accountId: account,
    created,
    deleted,
    endpoint,
    processing,
    upgradeProcessing,
    elasticSearchVersion,
    rawPolicy: accessPolicies,
    accessPolicies: formatIamJsonPolicy(accessPolicies),
    domainName,
    endpoints: mappedEndpoints,
    elasticSearchClusterConfig: formattedElasticSearchClusterConfig,
    ebsOptions: formattedEbsOptions,
    snapshotOptions: formattedSnapshotOptions,
    vpcOptions: formattedVpcOptions,
    cognitoOptions: formattedCognioOptions,
    encryptionAtRestOptions: formattedEncryptionAtRestOptions,
    nodeToNodeEncryptionOptions: formattedNodeToNodeEncryptionOptions,
    advancedOptions: mappedAdvancedOptions,
    logPublishingOptions: mappedLogPublishingOptions,
    serviceSoftwareOptions: formattedServiceSoftwareOptions,
    domainEndpointOptions: formattedDomainEndpointOptions,
    advancedSecurityOptions: formattedAdvancedSecurityOptions,
    autoTuneOptions: formattedAutoTuneOptions,
    changeProcessDetails: formattedChangeProgressDetails,
    tags: formatTagsFromMap(tags ?? {}),
  }
}
