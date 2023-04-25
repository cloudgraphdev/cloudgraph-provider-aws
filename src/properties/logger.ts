export default {
  platform: 'Platform: AWS',
  requestingAccountData: 'Getting AWS Account Data',
  requestingAccountDataError:
    '❌ ERROR: There was an error getting the AWS account data using these credentials ❌ ',
  foundRoleArn: 'Found AWS Role ARN and external ID - authenticating via STS',
  foundSecurityViolation: (name: string, type: string): string =>
    `💀 Found a security violation for ${type}: ${name} 💀`,
  startGeneration: 'Generating VSD data for AWS account...',
  regionNotFound: (name: string): string =>
    `❌ The region ${name} was not found in the list of supported AWS regions ❌`,
  globalAwsRegion: 'Found Global AWS region, adding global resources',
  /**
   * ACM
   */
  fetchedAcmCertificates: (num: number): string =>
    `Fetched ${num} ACM certificates`,
  /**
   * IAM
   */
  fetchingIamPasswordPolicy:
    'Fetching IAM Password Policy for this AWS account via the AWS SDK...',
  doneFetchingIamPasswordPolicy: '✅ Done fetching IAM Password Policy ✅',
  fetchedIamUsers: (num: number): string => `Fetched ${num} IAM users`,
  lookingForIam: 'Looking for IAM resources to add',
  addingIam: 'Adding IAM resources',
  lookingForIamUsers: 'Looking for IAM Users to add',
  foundUsers: (num: number): string => `Found ${num} Users to add`,
  lookingForIamRoles: 'Looking for IAM Roles to add',
  foundRoles: (num: number): string => `Found ${num} Roles to add`,
  lookingForIamGroups: 'Looking for IAM Groups to add',
  foundGroups: (num: number): string => `Found ${num} Groups to add`,
  lookingForIamPolicies: 'Looking for IAM Policies to add',
  foundPolicies: (num: number): string => `Found ${num} Policies to add`,
  lookingForIamSamlProviders: 'Looking for IAM Saml Providers to add',
  foundSamlProviders: (num: number): string =>
    `Found ${num} Saml Providers to add`,
  lookingForIamOpenIdProviders:
    'Looking for IAM OpenId Connect Providers to add',
  foundOpenIdProviders: (num: number): string =>
    `Found ${num} OpenId Connect Providers to add`,
  lookingForIamServerCertificates: 'Looking for IAM Server Certificates to add',
  foundServerCertificates: (num: number): string =>
    `Found ${num} Server Certificates to add`,
  foundInstanceProfiles: (num: number): string =>
    `Found ${num} Instance Profiles to add`,
  /**
   * CloudFormation
   */
  fetchingCloudFormationData:
    'Fetching CloudFormation data for this AWS account via the AWS SDK...',
  doneFetchingCloudFormationData: '✅ Done fetching CloudFormation Data ✅',
  lookingForCfStacks: 'Looking for Cloudformation Stacks to add to Region...',
  fetchedCfStacks: (num: number): string => `Fetched ${num} CF Stacks`,
  addingCfStacks: (num: number): string =>
    `Created and added ${num} CloudFomation stacks to this region`,
  /**
   * CloudFront
   */
  fetchingCloudFrontData:
    'Fetching CloudFront Distros for this AWS account via the AWS SDK...',
  fetchedCloudFrontDistros: (num: number) =>
    `Fetched ${num} CloudFront Distros`,
  fetchingCloudFrontDistrosConfigAndTags:
    'Fetching CloudFront Distros Config Data and Tags...',
  doneFetchingCloudFrontDistrosConfigAndTags:
    'Done fetching CloudFront Distros Config Data and Tags...',
  /**
   * Route53
   */
  fetchedRoute53Zones: (num: number): string =>
    `Fetched ${num} Route53 Hosted Zones`,
  fetchedRoute53ZonesRecords: (num: number, zoneId: string): string =>
    `Fetched ${num} Route53 Hosted Zone records for ${zoneId}`,
  lookingForRoute53: 'Looking for Route53 Hosted Zones to add to account...',
  addingRoute53: (num: number): string =>
    `Created and added ${num} Route53 Hosted Zones to this account`,
  doneFetchingRoute53HostedZoneData:
    '✅ Done fetching Route53 Hosted Zones Data ✅',
  doneFetchingRoute53RecordsData: '✅ Done fetching Route53 Records Data ✅',
  /**
   * CloudWatch
   */
  lookingForCloudwatch: 'Looking for CloudWatch alarms to add to Region...',
  fetchingCloudwatchData:
    'Fetching CloudWatch alarms for this AWS account via the AWS SDK...',
  doneFetchingCloudwatchData: (num: number): string =>
    `🕒 Done fetching CloudWatch alarms in ${num} 🕘`,
  addingCloudwatch: (num: number): string =>
    `Created and added ${num} CloudWatch alarms to this region`,
  foundMoreCloudwatchAlarms: (num: number): string =>
    `Found another ${num} CloudWatch alarms in this region...`,
  addingCloudwatchMetricsToElement: (num: number, namespace: string): string =>
    `Found ${num} CloudWatch metric alarms to add for ${namespace}`,
  gettingCloudwatchAlarms: 'Fetching CloudWatch alarms...',
  gettingCloudwatchAlarmTags: 'Fetching tags for each CloudWatch alarm...',
  /**
   * Kinesis Data Streams
   */
  lookingForKinesisDataStreams:
    'Looking for Kinesis Data Streams to add to Region...',
  addingKinesisDataStreams: (num: number): string =>
    `Created and added ${num} Kinesis Data Streams to this region`,
  /**
   * Kinesis Data Firehose
   */
  lookingForKinesisDataFirehose:
    'Looking for Kinesis Data Firehose to add to Region...',
  addingKinesisDataFirehose: (num: number): string =>
    `Created and added ${num} Kinesis Data Firehose to this region`,
  /**
   * Iot Thing
   */
  lookingForIotThing: 'Looking for IoT Things to add to Region...',
  addingIotThing: (num: number): string =>
    `Created and added ${num} IoT Things to this region`,
  foundMoreIoTThings: (num: number) =>
    `Found another ${num} IoT things in this region...`,
  gettingIoTThings: 'Fetching IoT things...',
  /**
   * Api Gateway
   */
  lookingForApiGateway: 'Looking for Api Gateways to add to Region...',
  addingApiGateway: (num: number): string =>
    `Created and added ${num} Api Gateways to this region`,
  fetchedApiGatewayRestApis: (num: number): string =>
    `Fetched ${num} Api Gateway Rest Apis`,
  fetchedApiGatewayResources: (num: number): string =>
    `Fetched ${num} Api Gateway Resources`,
  fetchedApiGatewayStages: (num: number): string =>
    `Fetched ${num} Api Gateway Stages`,
  fetchedApiGwDomainNames: (num: number): string =>
    `Fetched ${num} API Gateway Domain Names`,
  fetchingApiGatewayData:
    'Fetching API Gateway data for this AWS account via the AWS SDK...',
  doneFetchingApiGatewayData: '✅ Done fetching API Gateway Data ✅',
  gettingApiGatewayTags: 'Fetching tags for each Api Gateway Rest Api...',
  gettingApiGatewayStageTags: 'Fetching tags for each Api Gateway Stage...',
  /**
   * Vpc
   */
  fetchingVpcData: 'Fetching VPC data for this AWS account via the AWS SDK...',
  doneFetchingVpcData: '✅ Done fetching VPC Data ✅',
  fetchedVpcs: (num: number): string => `Fetched ${num} Vpcs`,
  lookingForVpc: 'Looking for VPC data to add',
  foundVpcs: (num: number): string =>
    `Found ${num} VPCs to add to this region's data`,
  beginVpc: '✅ Begin Vpc Formatting ✅',
  foundAdditionalVpcData: (found: boolean): string =>
    found
      ? 'Found supplemental VPC data to add'
      : '❌ ERROR - Missing supplemental VPC data ❌',
  foundNacls: (num: number): string => `Found ${num} NACLs to add to VPC`,
  fetchedNatGateways: (num: number): string => `Fetched ${num} NAT Gateways`,
  foundSecurityGroups: (num: number): string =>
    `Found ${num} Security Groups to add to VPC`,
  fetchedSecurityGroups: (num: number): string =>
    `Fetched ${num} Security Groups`,
  foundVpcLambdas: (num: number): string =>
    `Found ${num} Lambdas to add to VPC`,
  gatheringRouteTableAssociations: 'Gathering route table associations',
  gatheringSubnets: 'Gathering subnets to add to VPC',
  fetchedSubnets: (num: number): string => `Fetched ${num} Subnets`,
  creatingVpc: 'Creating VPC Element',
  addingVpc: 'Adding VPC Element to the region',
  lookingforSubnets: 'Looking for Subnets to add to VPC',
  foundSubnets: (num: number): string =>
    `Found ${num} Subnets to add to this Vpc`,
  foundAdditionalSubnetData: (found: boolean): string =>
    found
      ? 'Found supplemental Subnet data to add'
      : '❌ ERROR - Missing supplemental Subnet data ❌',
  creatingSubnet: 'Creating Subnet',
  addingSubnet: 'Adding Subnet -> NACL -> AZ',
  addingRouteTablesToSubnet: (num, name): string =>
    `Adding ${num} Route Tables to subnet ${name}`,
  /**
   * Lambda
   */
  lookingForVpcLambdas:
    'Looking for Lambdas with VPC networking to add to the VPC',
  lookingForLambda: 'Looking for non-vpc Lambdas to add to region',
  fetchingLambdaData:
    'Fetching Lambdas for this AWS account via the AWS SDK...',
  doneFetchingLambdaData: (num: number): string =>
    `🕒 Done fetching Lambdas in ${num} 🕘`,
  lambdasCreated: (num: number): string =>
    `Found and created ${num} Lambdas for this region`,
  addingLambdas: 'Adding lambdas to region',
  foundMoreLambdas: (num: number): string =>
    `Found another ${num} Lambdas in this region...`,
  fetchedLambdas: (num: number): string => `Fetched ${num} Lambdas`,
  gettingLambdaTags: 'Fetching tags for each Lambda...',
  /**
   * ALBs
   */
  fetchedAlbs: (num: number): string =>
    `Fetched ${num} Application Load Balancers`,
  lookingForAlbs: 'Looking ALBs to add to VPC...',
  lookingForAlb: 'Looking for Albs...',
  doneFetchingAlbData: '✅ Done fetching ALB Data ✅',
  albsCreated: (num: number): string => `Found and created ${num} ALBs`,
  fetchedAlbTags: (num: number, albArn: string): string =>
    `Fetched ${num} Tags for ${albArn}`,
  fetchedAlbAttributes: (num: number, albArn: string): string =>
    `Fetched ${num} Attributes for ${albArn}`,
  fetchedAlbListeners: (num: number, albArn: string): string =>
    `Fetched ${num} ALB Listeners for ${albArn}`,
  fetchedAlbTargetGroups: (num: number, albArn: string): string =>
    `Fetched ${num} ALB Target Groups for ${albArn}`,
  fetchedAlbTargetIds: (num: number, albArn: string): string =>
    `Fetched ${num} ALB Target Ids for ${albArn}`,
  /**
   * IGW
   */
  fetchedIgws: (num: number): string => `Fetched ${num} IGWs`,
  foundIgw: (num: number): string =>
    `Found ${num} Internet Gateway to add to VPC`,
  fetchingIgw: 'Fetching IGW data for this AWS account via the AWS SDK...',
  doneFetchingIgwData: (num: number): string =>
    `🕒 Done fetching IGW Data in ${num} 🕘`,
  /**
   * EIPs (not attached to instances)
   */
  lookingForEips: 'Looking EIPs that are not attached to instances',
  fetchedEips: (num: number): string => `Fetched ${num} EIPs`,
  eipsCreated: (num: number): string => `Found and created ${num} EIPs`,
  fetchingEip: 'Fetching EIP data for this AWS account via the AWS SDK...',
  doneFetchingEipData: '✅ Done fetching EIP Data ✅',
  /**
   * Organization
   */
  orgFound: '✅ Org data found, adding data org✅',
  noOrgFound:
    '❎ No org found or multiple orgs found which we currently do not support. Adding data to bare bones org ❎',
  /**
   * ASG
   */
  fetchingAsgData: 'Fetching ASG data for this AWS account via the AWS SDK...',
  doneFetchingAsgData: '✅ Done fetching ASG Data ✅',
  fetchedAsgs: (num: number): string => `Fetched ${num} AutoScaling Groups`,
  addingAsgs: (num: number): string =>
    `Found ${num} AutoScaling Groups, adding them to the VPC`,
  lookingForAsgs: 'Looking for AutoScaling Groups to add...',
  /**
   * AppSync
   */
  fetchedAppSync: (num: number): string => `Fetched ${num} App Syncs`,
  doneFetchedAppSync: '✅ Done fetching AppSync Data ✅',
  /**
   * EBS
   */
  fetchingEbsData: 'Fetching EBS data for this AWS account via the AWS SDK...',
  doneFetchingEbsData: '✅ Done fetching EBS Data ✅',
  fetchedEbsVolumes: (num: number): string => `Fetched ${num} EBS Volumes`,
  lookingForEbs: 'Looking for EBS volumes for EC2 instances...',
  /**
   * EBS Snapshot
   */
    fetchingEbsSnapshotData: 'Fetching EBS Snapshot data for this AWS account via the AWS SDK...',
    doneFetchingEbsSnapshotData: '✅ Done fetching EBS Snapshot Data ✅',
    fetchedEbsSnapshots: (num: number): string => `Fetched ${num} EBS Snapshots`,
    lookingForEbsSnapshot: 'Looking for EBS Snapshots...',
  /**
   * EC2
   */
  lookingforEc2: 'Looking for EC2 instances to add...',
  fetchedEc2Instances: (num: number): string => `Fetched ${num} EC2 Instances`,
  fetchedEc2InstanceTags: (num: number): string =>
    `Fetched ${num} Tags for EC2 Instances`,
  creatingEc2Instance: (num: number): string => `Creating EC2 Instance #${num}`,
  addingEc2Instances: (num: number): string =>
    `Found ${num} EC2 Instances, adding them to the Subnet`,
  fetchedNetworkInterfaces: (num: number): string =>
    `Fetched ${num} Network Interfaces`,
  lookingForNetworkInterfaces: 'Gathering Network Interfaces to add...',
  foundKeyPair: (id: string): string =>
    `Found Key Pair ${id} for instance`,
  doneFetchingEc2Data: '✅ Done fetching EC2 Instance Data ✅',
  /**
   * RDS
   */
  fetchingRdsData: 'Fetching RDS data for this AWS account via the AWS SDK...',
  doneFetchingRdsData: '✅ Done fetching RDS Data ✅',
  lookingforRdsInstances: 'Looking for RDS Instances...',
  lookingforRdsClusters: 'Looking for RDS Clusters...',
  creatingRdsInstance: (num: number): string => `Creating RDS Instance #${num}`,
  fetchedRdsClusters: (num: number): string => `Fetched ${num} RDS Clusters`,
  fetchedRdsInstances: (num: number): string =>
    `Fetched ${num} RDS DB Instances`,
  noClusterFound: '❎ DB Instance is not part of a cluster ❎ ',
  foundCluster: 'Found the cluster the instance belongs to',
  addingRdsInstances: (num: number): string =>
    `Found ${num} RDS Instances, adding them to the Subnet`,
  addingRdsClusters: (num: number): string =>
    `Found ${num} RDS Clusters, adding them to the Vpc`,
  noClusterFoundForDbInstance: ({ name }): string =>
    `No cluster found for db_instance: ${name}`,
  /**
   * EMR
   */
  fetchingEmrData:
    'Fetching EMR cluster data for this AWS account via the AWS SDK...',
  lookingForEmr: 'Looking for EMR Clusters to add...',
  addingEmr: (num: number): string =>
    `Found ${num} EMR Clusters, adding them to the Region`,
  doneFetchingEmrData: '✅ Done fetching EMR Data ✅',
  fetchedEmrClusters: (num: number): string => `Fetched ${num} EMR Clusters`,
  fetchedEmrClusterInstances: (num: number): string =>
    `Fetched ${num} EMR Clusters Instances`,
  foundAnotherFiftyClusters: (region: string) =>
    `Found another 50 EMR clusters for the ${region} region...`,
  foundAnotherTwoThousandInstances: (cluster: string) =>
    `Found another 2000 EMR instances for the ${cluster} cluster...`,
  foundAnotherFiftySteps: (cluster: string) =>
    `Found another 50 EMR steps for the ${cluster} cluster...`,
  fetchedEmrClusterSteps: (num: number) => `Fetched ${num} EMR Cluster Steps`,
  addingEmrEc2Connection: (
    clusterName: string,
    ec2InstanceName: string
  ): string =>
    `Found ec2 instance ${ec2InstanceName} to add to emr cluster ${clusterName}`,
  noEmrClusterParentFoundForEc2Instance: ({ name }): string =>
    `❌ WARNING: No EMR Cluster found for EC2 Instance ${name} ❌ `,
  /**
   * EFS
   */
  fetchingEfsData: 'Fetching EFS data for this AWS account via the AWS SDK...',
  lookingForEfs: 'Looking for EFS data to add...',
  lookingForEfsMountTargets:
    'Looking for EFS Mount Targets to add to subnet...',
  addingEfs: (num: number): string =>
    `Found ${num} EFS, adding them to the VPC`,
  addingEfsMountTargets: (num: number): string =>
    `Found ${num} EFS Mount Targets, adding them to the subnet`,
  doneFetchingEfsData: '✅ Done fetching EFS Data ✅',
  fetchedEfs: (num: number): string => `Fetched ${num} EFS`,
  fetchedEfsMountTargets: (num: number): string =>
    `Fetched ${num} EFS Mount Targets`,
  fetchedEfsMountTargetSecurityGroups: (num: number): string =>
    `Fetched ${num} EFS Mount Target Security Groups`,
  noFileSystemFoundForEfsMountPoint: ({ name }): string =>
    `❌ WARNING: No EFS found for mount point ${name} ❌ `,
  /**
   * S3
   */
  lookingForS3: 'Looking for S3 Buckets to add',
  lookingForS3SecurityData:
    'Looking for S3 buckets with security violations...',
  foundAnotherThousand: 'Found another thousand objects in the s3 bucket...',
  fetchingS3Data: 'Fetching S3 data for this AWS account via the AWS SDK...',
  doneFetchingS3Data: (num: number): string =>
    `🕒 Done fetching S3 Data in ${num} 🕘`,
  fetchedS3Buckets: (num: number): string => `Fetched ${num} S3 Buckets`,
  creatingS3Bucket: (num: number): string => `Creating S3 Bucket #${num}`,
  addingS3Buckets: (num: number): string =>
    `Found ${num} S3 Buckets, adding them to the Region`,
  gettingBucketBasicInfo: (name: string): string =>
    `Fetching basic information for ${name} bucket...`,
  gettingBucketAdditionalInfo: (name: string): string =>
    `Fetching additional information for ${name} bucket...`,
  gettingBucketAdditionalInfoError: (name: string): string =>
    `There was an error fetching additional information for ${name} bucket...`,
  /**
   * DynamoDb
   */
  lookingForDynamoDb: 'Looking for DynamoDb Tables to add...',
  fetchingDynamoDbData:
    'Fetching DynamoDB data for this AWS account via the AWS SDK...',
  doneFetchingDynamoDbData: (num: number) =>
    `🕒 Done fetching DynamoDb Data in ${num} 🕘`,
  fetchedDynamoDbTableNames: (num: number) =>
    `Fetched ${num} DynamoDB table names`,
  addingDynamoDbTables: (num: number) =>
    `Found ${num} Dynamo DB tables, adding them to the Region`,
  gettingTableDetails: 'Fetching details for each table...',
  gettingTableTags: 'Fetching tags for each table...',
  gettingTableTtlInfo: 'Fetching TTL description for each table...',
  gettingTableBackupInfo:
    'Fetching Continuous Backup description for each table...',
  /**
   * SNS
   */
  fetchedSNSTopics: (num: number) => `Fetched ${num} SNS Topics`,
  gettingSNSTopicAttributes: `Fetching attributes for each topic...`,
  gettingSNSTopicTags: `Fetching tags for each topic...`,
  gettingSNSTopicSubscriptions: `Fetching subscriptions for each topic...`,
  lookingForSns: 'Looking for SNS topics and subscriptions to add...',
  addingSns: (num: number): string =>
    `Found ${num} SNS topics, adding them to the Region`,
  /**
   * Secrets Manager
   */
  fetchingSecretsManager:
    'Fetching Secrets Manager data for this AWS account via the AWS SDK...',
  doneFetchingSecretsManager: '✅ Done fetching Secrets Manager data ✅',
  lookingForSecretsManager: 'Looking for Secrets Manager Secrets to add...',
  addingSecretsManager: (num: number): string =>
    `Found ${num} Secrets Manager Secrets, adding them to the Region`,
  fetchedSecretsManager: (num: number): string =>
    `Fetched ${num} Secrets Manager Secrets`,
  /**
   * SQS
   */
  lookingForSqs: 'Looking for SQS queues to add...',
  addingSqs: (num: number): string =>
    `Found ${num} SQS Queues, adding them to the Region`,
  /**
   * SES
   */
  fetchingSesData: 'Fetching SES data for this AWS account via the AWS SDK...',
  doneFetchingSesData: '✅ Done fetching SES Data ✅',
  fetchedSesIdentities: (num: number): string =>
    `Fetched ${num} SES Identities`,
  lookingForSes: 'Looking for SES to add...',
  addingSes: (num: number): string =>
    `Found ${num} SES, adding them to the Region`,
  /**
   * Kinesis Data Firehose
   */
  fetchedKinesisFirehose: (num: number): string =>
    `Fetched ${num} Kinesis Firehose`,
  /**
   * Kinesis Data Stream
   */
  fetchedKinesisStream: (num: number): string =>
    `Fetched ${num} Kinesis streams`,
  /**
   * KMS
   */

  lookingForKms: 'Looking for KMS Keys to add...',
  addingKms: (num: number): string =>
    `Found ${num} KMS Keys, adding them to the Region`,
  fetchedKmsKeys: (num: number): string => `Fetched ${num} KMS Keys`,
  doneFetchingKmsData: '✅ Done fetching Kms Data ✅',
  hasMoreKmsTags: 'KMS Key has more than 50 tags, some where not fetched...',
  gettingKeyDetails: 'Fetching details for each key...',
  gettingRotationStatus: 'Checking rotation status for each key...',
  gettingPolicies: 'Fetching default Policy for each key...',
  gettingTags: 'Fetching Tags for each key...',
  gettingAliases: 'Fetching Aliases for each key...',

  /**
   * EKS
   */
  lookingForEks: 'Looking for EKS Clusters to add...',
  addingEks: (num: number): string =>
    `Found ${num} EKS Clusters, adding them to the VPC`,
  canNotFindClusterForAsg:
    'ERROR: Can not find ECS/EKS cluster for ASG - it should have been added already',
  foundMoreEKSClusters: (num: number) =>
    `Found another ${num} EKS clusters in this region...`,
  /**
   * Elastic Beanstalk
   */
  fetchedElasticBeanstalkApps: (num: number): string =>
    `Fetched ${num} Elastic Beanstalk Applications`,
  fetchedElasticBeanstalkEnvs: (num: number): string =>
    `Fetched ${num} Elastic Beanstalk Environments`,
  /**
   * ElastiCache
   */
  lookingForElastiCache: 'Looking for ElastiCache Clusters to add...',
  addingElastiCache: (num: number): string =>
    `Found ${num} ElastiCache Clusters, adding them to the VPC`,
  missingReplicationGroup: (is: string): string =>
    `Missing replication group for ${is} ElastiCache Cluster! Not adding ElastiCache Data`,
  fetchedElasticacheClusters: (num: number) =>
    `Fetched ${num} Elasticache clusters...`,
  /**
   * ECR
   */
  fetchedECRRepos: (num: number): string => `Found ${num} ECR repos...`,
  foundMoreECRRepos: (num: number) =>
    `Found another ${num} ECR repos in this region...`,
  gettingECRRepos: 'Fetching ECR repos...',
  gettingECRRepoTags: 'Fetching tags for each ECR repo...',
  /**
   * Transit Gateway
   */
  lookingForTransitGateway: 'Looking for Transit Gateways to add...',
  addingTransitGateways: (num: number): string =>
    `Found ${num} Transit Gateways, adding them to the VPC`,
  addingTransitGatewayToVpc: ({ name }): string =>
    `Adding Transit Gateway ${name} to the VPC`,
  addingTransitGatewayToRegion: ({ name }): string =>
    `Transit Gateway not attached to a VPC, adding Transit Gateway ${name} to the region level`,
  fetchedTransitGateways: (num: number): string => `Found ${num} Transit Gateways`,
  /**
   * Transit Gateway Attachment
   */
   fetchedTransitGatewayAttachments: (num: number): string => `Found ${num} Transit Gateway Attachments`,
   /**
   * Transit Gateway Route Tables
   */
    fetchedTransitGatewayRouteTables: (num: number): string => `Found ${num} Transit Gateway Route Tables`,
  /**
   * VPN Gateway
   */
  lookingForVpnGateway: 'Looking for Vpn Gateways to add...',
  addingVpnGatewayToVpc: (num: number): string =>
    `Adding ${num} Vpn Gateways to the VPC`,
  fetchedVpnGateways: (num: number): string =>
    `Fetched ${num} Vpn Gateways`,
  /**
   * Customer Gateway
   */
  lookingForCustomerGateways: 'Looking for Customer Gateways to add...',
  addingCustomerGatewaysToVpc: ({ name }): string =>
    `Adding the ${name} Customer Gateways to the VPC`,
  addingCustomerGatewayToRegion: ({ name }): string =>
    `Customer Gateway not attached to a VPC, adding Customer Gateway ${name} to the region level`,
  /**
   * Redshift
   */
  lookingForRedshift: 'Looking for Redshift Clusters to add...',
  addingRedshift: (num: number): string =>
    `Found ${num} Redshift Clusters, adding them to the Region`,
  doneFetchingRedshiftData: '✅ Done fetching Redshift Cluster Data ✅',
  fetchedRedshiftClusters: (num: number): string =>
    `Found ${num} Redshift Clusters`,
  /**
   * ECS
   */
  lookingForEcs: 'Looking for Ecs Clusters to add...',
  addingEcs: (num: number): string =>
    `Found ${num} Ecs Clusters, adding them to the Region`,
  doneFetchingEcsData: '✅ Done fetching Ecs Cluster Data ✅',
  fetchedEcsClusters: (num: number): string => `Found ${num} Ecs Clusters`,
  fetchedEcsServices: (num: number): string => `Found ${num} Ecs Services`,
  fetchedEcsTaskDefinitions: (num: number): string =>
    `Found ${num} Ecs Task Definitions`,
  fetchedEcsTasks: (num: number): string => `Found ${num} Ecs Tasks`,
  fetchedEcsContainers: (num: number): string => `Found ${num} Ecs Containers`,
  ecsVpcNotFound: 'ERROR: Vpc for ECS Cluster was not found',
  addingEcsClusters: (num: number): string =>
    `Found ${num} ECS Clusters, adding them to the the VPC`,
  addingEcsTasksToSubnet: (num: number, subnetId): string =>
    `Found ${num} ECS Tasks, adding them to the the ${subnetId} Subnet`,
  /**
   * Cognito
   */
  lookingForCognito: 'Looking for Cognito to add...',
  addingIdentityPools: (num: number): string =>
    `Found ${num} Cognito Identity Pools, adding them to the Region`,
  addingUserPools: (num: number): string =>
    `Found ${num} Cognito User Pools, adding them to the Region`,
  doneFetchingCognitoData: '✅ Done fetching Cognito Data ✅',
  fetchedCognitoUserPools: (num: number): string =>
    `Found ${num} Cognito User Pools`,
  fetchedCognitoIdentityPools: (num: number): string =>
    `Found ${num} Cognito Identity Pools`,
  fetchedCognitoUserPool: (id: string): string =>
    `Fetched Cognito User Pool data for ${id}`,
  fetchedCognitoIdentityPool: (id: string): string =>
    `Fetched Cognito Identity Pool data for ${id}`,
  lookingForIdentityPools:
    'Looking for Cognito Identity Pools to add to region',
  lookingForUserPools: 'Looking for Cognito User Pools to add to region',
  /**
   * Client Vpn Endpoints
   */
  fetchingClientVpnEndpointsData:
    'Fetching Client Vpn Endpoints data for this AWS account via the AWS SDK...',
  doneFetchingClientVpnEndpointsData:
    '✅ Done fetching Client Vpn Endpoints Data ✅',
  fetchedClientVpnEndpoints: (num: number): string =>
    `Fetched ${num} Client Vpn Endpoints`,
  addingClientVpnEndpoints: (num: number): string =>
    `Found ${num} Client Vpc Endpoints adding them to the vpc`,
  /**
   * Vpn Connection
   */
  fetchingVpnConnectionsData:
    'Fetching Vpn Connections data for this AWS account via the AWS SDK...',
  doneFetchingVpnConnectionsData: '✅ Done fetching Vpn Connections Data ✅',
  fetchedVpnConnections: (num: number): string =>
    `Fetched ${num} Vpn Connections`,
  addingVpnConnections: (num: number): string =>
    `Found ${num} Client Vpn Endpoints adding them to the region`,
  lookingForVpnConnections: 'Looking for VPN Connections to add...',
  /**
   * Classic ELB
   */
  fetchingElbData:
    'Fetching Classic ELB data for this AWS account via the AWS SDK...',
  doneFetchingElbData: '✅ Done fetching Classic ELB Data ✅',
  lookingForElbs: 'Looking for Classic Elbs to add...',
  addingElbs: (num: number): string =>
    `Found ${num} Classic Elbs, adding them to the vpc`,

  fetchedElbs: (num: number): string => `Found ${num} Classic Elbs`,
  /**
   * 2D UI Creation
   */
  beginHostingFromVpc:
    'Looking for resources to hoist from VPCs and Subnets to the top level...',
  foundItemsToHoist: (num, type): string =>
    `Found ${num} items to hoist up to the top level for ${type}`,
  removingOldChildren: 'Removing old children from this subnet...',
  combiningAndAddingNacls: (name): string =>
    `Deduping NACLS and adding them and their children directly to VPC: ${name}`,
  /**
   * Kubernetes
   */
  fetchingKubernetesData:
    'Kubernetes Data for AWS requested - fetching all clusters... This will take a while...',
  doneFetchingKubernetesData: '✅ Done fetching Kubernetes Data ✅',
  /**
   * Cloud9
   */
  lookingForCloud9: 'Looking for Cloud9 to add to Region...',
  addingCloud9: (num: number): string =>
    `Created and added ${num} Cloud9 to this region`,
  foundMoreCloud9Environments: (num: number) =>
    `Found another ${num} Cloud9 environments in this region...`,
  gettingCloud9Environments: 'Fetching Cloud9 environments...',
  gettingCloud9EnvironmentTags: 'Fetching tags for each Cloud9 environment...',
  /**
   * VPC
   */
  fetchingVpcDnsSupportData: 'Fetching Enable DNS Support config for VPCs...',
  fetchingVpcDnsHostnamesData:
    'Fetching Enable DNS Hostnames config for VPCs...',
  /**
   * Route Tables
   */
  fetchedRouteTables: (num: number): string => `Fetched ${num} Route Tables`,
  foundRouteTables: (num: number): string =>
    `Found ${num} Route Tables to add to VPC`,
  fetchingRouteTable:
    'Fetching Route Table data for this AWS account via the AWS SDK...',
  doneFetchingRouteTableData: (num: number): string =>
    `🕒 Done fetching Route Table Data in ${num} 🕘`,
  addingMainRouteTableToVpc: (vpcId: string): string =>
    `Adding Main Toute Table to VPC ${vpcId}`,
  /**
   * Billing
   */
  fetchingAggregateFinOpsData:
    'Fetching aggregate FinOps data for this AWS account via the AWS SDK...',
  unableToFindFinOpsAggregateData:
    '❌ Unable to getCostAndUsage data for this AWS account, ResultsByTime was missing. ❌',
  unableToFindFinOpsIndividualData:
    '❌ Unable to getCostAndUsageWithResources data for this AWS account, ResultsByTime was missing. ❌',
  queryingAggregateFinOpsDataForRegion: (
    region: string,
    type: string
  ): string =>
    `Querying aggregate FinOps data for the ${region} region using the ${type} method...`,
  queryingIndividualFinOpsDataForRegion: (region: string): string =>
    `Querying individual FinOps data for the ${region} region...`,
  doneFetchingAggregateFinOpsData: (num: number): string =>
    `🕒 Done fetching aggregate FinOps data in ${num} 🕘`,
  unableToFindFinOpsServiceData:
    '❌ Unable to listAvailabeServices data for this AWS account, DimensionValues was missing. ❌',
  /**
   * NACL
   */
  fetchedNacls: (num: number): string => `Fetched ${num} NACLs`,
   /**
   * Customer Gateway
   */
  fetchedCustomerGateways: (num: number): string => `Fetched ${num} Customer Gateways`,
  /**
   * CloudWatch Logs
   */
   lookingForCloudwatchLogGroups: 'Looking for CloudWatch Log groups to add to Region...',
   fetchingCloudwatchLogGroupsData:
     'Fetching CloudWatch Log groups for this AWS account via the AWS SDK...',
   doneFetchingCloudwatchLogGroupsData: (num: number): string =>
     `🕒 Done fetching CloudWatch Log groups in ${num} 🕘`,
   foundMoreCloudwatchLogGroups: (num: number): string =>
     `Found another ${num} CloudWatch Log groups in this region...`,
   gettingCloudwatchLogGroups: 'Fetching CloudWatch Log groups...',
   foundMoreCloudwatchMetricFilters: (num: number): string =>
   `Found another ${num} CloudWatch Metric filters in this region...`,
  /**
   * Configuration Recorders
   */
  fetchedConfigurationRecorders: (num: number): string => `Fetched ${num} Configuration Recorders`,
  /**
   * Configuration Recorder Status
   */
   fetchedConfigurationRecorderStatus: (num: number): string => `Fetched ${num} Configuration Recorder Status`,
   /**
   * Vpc Endpoints
   */
   fetchedVpcEndpoints: (num: number): string => `Fetched ${num} Vpc Endpoints`,
  /**
   * Access Analyzers
   */
  fetchedaccessAnalyzers: (num: number): string => `Found ${num} Access Analyzers`,
  /**
   * Managed Prefix Lists
   */
  fetchedManagedPrefixLists: (num: number): string => `Found ${num} Managed Prefix Lists`,
  fetchedManagedPrefixListEntries: (num: number): string => `Found ${num} Managed Prefix List Entries`,
  /**
   * Vpc Peering Connections
   */
  fetchedVpcPeeringConnections: (num: number): string => `Found ${num} Vpc Peering Connections`,
  /**
   * Security Hub
   */
  securityHubNotFound: (region: string): string => `Security Hub not found/disabled for region: ${region}`,
  fetchedSecurityHub: (region: string): string => `Security Hub found/enabled for region: ${region}`,
  fetchingSecurityHub: 'Fetching Security Hub data for this AWS account via the AWS SDK...',
  /**
   * Msk
   */
  fetchedMskClusters: (num: number): string =>
    `Fetched ${num} Msk clusters`,
}
