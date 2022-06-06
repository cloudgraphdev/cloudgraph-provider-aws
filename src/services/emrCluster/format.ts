import { generateUniqueId } from '@cloudgraph/sdk'
import { Configuration } from 'aws-sdk/clients/emr'
import { AwsEmrCluster } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsEmrCluster } from './data'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsEmrCluster
  account: string
  region: string
}): AwsEmrCluster => {
  const {
    ClusterArn: arn,
    Status: status,
    Ec2InstanceAttributes: ec2InstanceAttributes,
    InstanceCollectionType: instanceCollectionType,
    LogUri: logUri,
    LogEncryptionKmsKeyId: logEncryptionKmsKeyId,
    RequestedAmiVersion: requestedAmiVersion,
    RunningAmiVersion: runningAmiVersion,
    ReleaseLabel: releaseLabel,
    AutoTerminate: autoTerminate,
    TerminationProtected: terminationProtected,
    VisibleToAllUsers: visibleToAllUsers,
    NormalizedInstanceHours: normalizedInstanceHours,
    MasterPublicDnsName: masterPublicDnsName,
    Configurations: configurations,
    SecurityConfiguration: securityConfiguration,
    ScaleDownBehavior: scaleDownBehavior,
    CustomAmiId: customAmiId,
    EbsRootVolumeSize: ebsRootVolumeSize,
    RepoUpgradeOnBoot: repoUpgradeOnBoot,
    KerberosAttributes: kerberosAttributes,
    OutpostArn: outpostArn,
    StepConcurrencyLevel: stepConcurrencyLevel,
    Tags,
  } = service

  const {
    State: state,
    StateChangeReason: stateChangeReason,
    Timeline: timeline,
  } = status ?? {}

  const {
    Ec2KeyName: ec2KeyName,
    Ec2SubnetId: ec2SubnetId,
    RequestedEc2SubnetIds: requestedEc2SubnetIds,
    Ec2AvailabilityZone: ec2AvailabilityZone,
    RequestedEc2AvailabilityZones: requestedEc2AvailabilityZones,
    IamInstanceProfile: iamInstanceProfile,
    EmrManagedMasterSecurityGroup: emrManagedMasterSecurityGroup,
    EmrManagedSlaveSecurityGroup: emrManagedSlaveSecurityGroup,
    ServiceAccessSecurityGroup: serviceAccessSecurityGroup,
    AdditionalMasterSecurityGroups: additionalMasterSecurityGroups,
    AdditionalSlaveSecurityGroups: additionalSlaveSecurityGroups,
  } = ec2InstanceAttributes ?? {}

  const applications = service?.Applications?.map(app => ({
    id: generateUniqueId({
      arn,
      ...app,
    }),
    name: app.Name,
    version: app.Version,
    args: app.Args,
    additionalInfo: Object.keys(app.AdditionalInfo || {})?.map(key => ({
      id: generateUniqueId({
        arn,
        key,
        value: app.AdditionalInfo[key],
      }),
      key,
      value: app.AdditionalInfo[key],
    })),
  }))

  const {
    Realm: realm,
    KdcAdminPassword: kdcAdminPassword,
    CrossRealmTrustPrincipalPassword: crossRealmTrustPrincipalPassword,
    ADDomainJoinUser: adDomainJoinUser,
    ADDomainJoinPassword: adDomainJoinPassword,
  } = kerberosAttributes ?? {}

  const configConverter = (config: Configuration) => ({
    id: generateUniqueId({
      arn,
      ...config,
    }),
    classification: config.Classification,
    configurations: config.Configurations?.map(child => configConverter(child)),
    properties: Object.keys(config.Properties || {})?.map(key => ({
      id: generateUniqueId({
        arn,
        key,
        value: config.Properties[key],
      }),
      key,
      value: config.Properties[key],
    })),
  })

  const placementGroups = service.PlacementGroups?.map(pg => ({
    id: generateUniqueId({
      arn,
      ...pg,
    }),
    instanceRole: pg.InstanceRole,
    placementStrategy: pg.PlacementStrategy,
  }))

  return {
    id: arn,
    arn,
    accountId: account,
    region,
    status: {
      state,
      stateChangeReason: {
        code: stateChangeReason?.Code,
        message: stateChangeReason?.Message,
      },
      timeline: {
        creationDateTime: timeline?.CreationDateTime?.toISOString(),
        readyDateTime: timeline?.ReadyDateTime?.toISOString(),
        endDateTime: timeline?.EndDateTime?.toISOString(),
      },
    },
    ec2InstanceAttributes: {
      ec2KeyName,
      ec2SubnetId,
      requestedEc2SubnetIds,
      ec2AvailabilityZone,
      requestedEc2AvailabilityZones,
      iamInstanceProfile,
      emrManagedMasterSecurityGroup,
      emrManagedSlaveSecurityGroup,
      serviceAccessSecurityGroup,
      additionalMasterSecurityGroups,
      additionalSlaveSecurityGroups,
    },
    instanceCollectionType,
    logUri,
    logEncryptionKmsKeyId,
    requestedAmiVersion,
    runningAmiVersion,
    releaseLabel,
    autoTerminate,
    terminationProtected,
    visibleToAllUsers,
    applications,
    normalizedInstanceHours,
    masterPublicDnsName,
    configurations: configurations?.map(child => configConverter(child)),
    securityConfiguration,
    scaleDownBehavior,
    customAmiId,
    ebsRootVolumeSize,
    repoUpgradeOnBoot,
    kerberosAttributes: {
      realm,
      kdcAdminPassword,
      crossRealmTrustPrincipalPassword,
      adDomainJoinUser,
      adDomainJoinPassword,
    },
    outpostArn,
    stepConcurrencyLevel,
    placementGroups,
    tags: formatTagsFromMap(Tags),
  }
}
