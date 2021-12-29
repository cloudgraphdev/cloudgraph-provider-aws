export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AwsEcsExecuteCommandLogConfiguration = {
  id: Scalars['String'];
  cloudWatchLogGroupName?: Maybe<Scalars['String']>;
  cloudWatchEncryptionEnabled?: Maybe<Scalars['Boolean']>;
  s3BucketName?: Maybe<Scalars['String']>;
  s3EncryptionEnabled?: Maybe<Scalars['Boolean']>;
  s3KeyPrefix?: Maybe<Scalars['String']>;
};

export type AwsEmrClusterApplication = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  args?: Maybe<Array<Maybe<Scalars['String']>>>;
  additionalInfo?: Maybe<Array<Maybe<AwsStringMap>>>;
};

export type AwsEmrClusterConfiguration = {
  id: Scalars['String'];
  classification?: Maybe<Scalars['String']>;
  configurations?: Maybe<Array<Maybe<AwsEmrClusterConfiguration>>>;
  properties?: Maybe<Array<Maybe<AwsStringMap>>>;
};

export type AwsEmrClusterEc2InstanceAttributes = {
  ec2KeyName?: Maybe<Scalars['String']>;
  ec2SubnetId?: Maybe<Scalars['String']>;
  requestedEc2SubnetIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  ec2AvailabilityZone?: Maybe<Scalars['String']>;
  requestedEc2AvailabilityZones?: Maybe<Array<Maybe<Scalars['String']>>>;
  iamInstanceProfile?: Maybe<Scalars['String']>;
  emrManagedMasterSecurityGroup?: Maybe<Scalars['String']>;
  emrManagedSlaveSecurityGroup?: Maybe<Scalars['String']>;
  serviceAccessSecurityGroup?: Maybe<Scalars['String']>;
  additionalMasterSecurityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  additionalSlaveSecurityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsEmrClusterKerberosAttributes = {
  realm?: Maybe<Scalars['String']>;
  kdcAdminPassword?: Maybe<Scalars['String']>;
  crossRealmTrustPrincipalPassword?: Maybe<Scalars['String']>;
  adDomainJoinUser?: Maybe<Scalars['String']>;
  adDomainJoinPassword?: Maybe<Scalars['String']>;
};

export type AwsEmrClusterPlacementGroupConfig = {
  id: Scalars['String'];
  instanceRole?: Maybe<Scalars['String']>;
  placementStrategy?: Maybe<Scalars['String']>;
};

export type AwsEmrClusterStateChangeReason = {
  code?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type AwsEmrClusterStatus = {
  state?: Maybe<Scalars['String']>;
  stateChangeReason?: Maybe<AwsEmrClusterStateChangeReason>;
  timeline?: Maybe<AwsEmrClusterTimeline>;
};

export type AwsEmrClusterTimeline = {
  creationDateTime?: Maybe<Scalars['String']>;
  readyDateTime?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
};

export type AwsStringMap = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsAccessLogSettings = {
  id?: Maybe<Scalars['ID']>;
  format?: Maybe<Scalars['String']>;
  destinationArn?: Maybe<Scalars['String']>;
};

export type AwsAccountRecoverySetting = {
  id: Scalars['String'];
  priority?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type AwsAdditionalAuthenticationProvider = {
  id: Scalars['String'];
  authenticationType?: Maybe<Scalars['String']>;
  openIDConnectIssuer?: Maybe<Scalars['String']>;
  openIDConnectClientId?: Maybe<Scalars['String']>;
  openIDConnectIatTTL?: Maybe<Scalars['Int']>;
  openIDConnectAuthTTL?: Maybe<Scalars['Int']>;
  userPoolId?: Maybe<Scalars['String']>;
  userPoolAwsRegion?: Maybe<Scalars['String']>;
  userPoolAppIdClientRegex?: Maybe<Scalars['String']>;
};

export type AwsAlb = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  dnsName?: Maybe<Scalars['String']>;
  scheme?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  subnets?: Maybe<Array<Maybe<Scalars['String']>>>;
  hostedZone?: Maybe<Scalars['String']>;
  defaultVpc?: Maybe<Scalars['String']>;
  ipAddressType?: Maybe<Scalars['String']>;
  idleTimeout?: Maybe<Scalars['String']>;
  deletionProtection?: Maybe<Scalars['String']>;
  http2?: Maybe<Scalars['String']>;
  accessLogsEnabled?: Maybe<Scalars['String']>;
  dropInvalidHeaderFields?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  route53Record?: Maybe<Array<Maybe<AwsRoute53Record>>>;
  listeners?: Maybe<Array<Maybe<AwsAlbListener>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
};

export type AwsAlbListener = {
  arn: Scalars['String'];
  settings?: Maybe<AwsAlbListenerSettings>;
};

export type AwsAlbListenerRule = {
  type?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
  targetGroupArn?: Maybe<Scalars['String']>;
};

export type AwsAlbListenerSettings = {
  sslPolicy?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  rules?: Maybe<Array<Maybe<AwsAlbListenerRule>>>;
};

export type AwsApiGatewayEndpointConfiguration = {
  id?: Maybe<Scalars['ID']>;
  types?: Maybe<Array<Maybe<Scalars['String']>>>;
  vpcEndpointIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsApiGatewayMethod = {
  accountId: Scalars['String'];
  arn: Scalars['String'];
  httpMethod?: Maybe<Scalars['String']>;
  authorization?: Maybe<Scalars['String']>;
  apiKeyRequired?: Maybe<Scalars['Boolean']>;
};

export type AwsApiGatewayResource = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  restApi?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
  path?: Maybe<Scalars['String']>;
  methods?: Maybe<Array<Maybe<AwsApiGatewayMethod>>>;
};

export type AwsApiGatewayRestApi = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  policy?: Maybe<AwsIamJsonPolicy>;
  endpointConfiguration?: Maybe<AwsApiGatewayEndpointConfiguration>;
  apiKeySource?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['String']>;
  minimumCompressionSize?: Maybe<Scalars['Int']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  binaryMediaTypes?: Maybe<Array<Maybe<Scalars['String']>>>;
  stages?: Maybe<Array<Maybe<AwsApiGatewayStage>>>;
  resources?: Maybe<Array<Maybe<AwsApiGatewayResource>>>;
  route53Record?: Maybe<Array<Maybe<AwsRoute53Record>>>;
};

export type AwsApiGatewayStage = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  cacheCluster?: Maybe<Scalars['Boolean']>;
  cacheClusterSize?: Maybe<Scalars['String']>;
  accessLogSettings?: Maybe<AwsAccessLogSettings>;
  documentationVersion?: Maybe<Scalars['String']>;
  clientCertificateId?: Maybe<Scalars['String']>;
  xrayTracing?: Maybe<Scalars['Boolean']>;
  variables?: Maybe<Array<Maybe<AwsApiGatewayStageVariable>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  restApi?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
};

export type AwsApiGatewayStageVariable = {
  key: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type AwsAppSync = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region: Scalars['String'];
  name: Scalars['String'];
  authenticationType?: Maybe<Scalars['String']>;
  logFieldLogLevel?: Maybe<Scalars['String']>;
  logCloudWatchLogsRoleArn?: Maybe<Scalars['String']>;
  logExcludeVerboseContent?: Maybe<Scalars['String']>;
  userPoolId?: Maybe<Scalars['String']>;
  userPoolAwsRegion?: Maybe<Scalars['String']>;
  userPoolDefaultAction?: Maybe<Scalars['String']>;
  userPoolAppIdClientRegex?: Maybe<Scalars['String']>;
  openIDConnectIssuer?: Maybe<Scalars['String']>;
  openIDConnectClientId?: Maybe<Scalars['String']>;
  openIDConnectIatTTL?: Maybe<Scalars['Int']>;
  openIDConnectAuthTTL?: Maybe<Scalars['Int']>;
  uris?: Maybe<Array<Maybe<AwsAppSyncGraphqlApiUris>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  additionalAuthenticationProviders?: Maybe<Array<Maybe<AwsAdditionalAuthenticationProvider>>>;
  xrayEnabled?: Maybe<Scalars['String']>;
  wafWebAclArn?: Maybe<Scalars['String']>;
  lambdaAuthorizerResultTtlInSeconds?: Maybe<Scalars['Int']>;
  lambdaAuthorizerUri?: Maybe<Scalars['String']>;
  lambdaAuthorizerIdentityValidationExpression?: Maybe<Scalars['String']>;
  apiKeys?: Maybe<Array<Maybe<AwsAppSyncApiKey>>>;
  dataSources?: Maybe<Array<Maybe<AwsAppSyncDataSource>>>;
  functions?: Maybe<Array<Maybe<AwsAppSyncFunction>>>;
  types?: Maybe<Array<Maybe<AwsAppSyncType>>>;
  cognitoUserPool?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  dynamodb?: Maybe<Array<Maybe<AwsDynamoDbTable>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  rdsCluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
};

export type AwsAppSyncApiKey = {
  id: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  expires?: Maybe<Scalars['Int']>;
};

export type AwsAppSyncDataSource = {
  id: Scalars['String'];
  arn: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  serviceRoleArn?: Maybe<Scalars['String']>;
  dynamodbTableName?: Maybe<Scalars['String']>;
  dynamodbAwsRegion?: Maybe<Scalars['String']>;
  dynamodbUseCallerCredentials?: Maybe<Scalars['String']>;
  dynamodbDeltaSyncBaseTableTTL?: Maybe<Scalars['Int']>;
  dynamodbDeltaSyncTableName?: Maybe<Scalars['String']>;
  dynamodbDeltaSyncTableTTL?: Maybe<Scalars['Int']>;
  dynamodbVersioned?: Maybe<Scalars['String']>;
  lambdaFunctionArn?: Maybe<Scalars['String']>;
  elasticsearchEndpoint?: Maybe<Scalars['String']>;
  elasticsearchAwsRegion?: Maybe<Scalars['String']>;
  httpEndpoint?: Maybe<Scalars['String']>;
  httpAuthorizationType?: Maybe<Scalars['String']>;
  httpAuthorizationIamSigningRegion?: Maybe<Scalars['String']>;
  httpAuthorizationIamSigningServiceName?: Maybe<Scalars['String']>;
  relationalDatabaseSourceType?: Maybe<Scalars['String']>;
  relationalDatabaseAwsRegion?: Maybe<Scalars['String']>;
  relationalDatabaseClusterIdentifier?: Maybe<Scalars['String']>;
  relationalDatabaseName?: Maybe<Scalars['String']>;
  relationalDatabaseSchema?: Maybe<Scalars['String']>;
  relationalDatabaseAwsSecretStoreArn?: Maybe<Scalars['String']>;
};

export type AwsAppSyncFunction = {
  id: Scalars['String'];
  arn: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dataSourceName?: Maybe<Scalars['String']>;
  requestMappingTemplate?: Maybe<Scalars['String']>;
  responseMappingTemplate?: Maybe<Scalars['String']>;
  functionVersion?: Maybe<Scalars['String']>;
  resolvers?: Maybe<Array<Maybe<AwsAppSyncResolver>>>;
};

export type AwsAppSyncGraphqlApiUris = {
  id: Scalars['String'];
  key: Scalars['String'];
  value: Scalars['String'];
};

export type AwsAppSyncResolver = {
  id: Scalars['String'];
  arn: Scalars['String'];
  typeName?: Maybe<Scalars['String']>;
  fieldName?: Maybe<Scalars['String']>;
  dataSourceName?: Maybe<Scalars['String']>;
  requestMappingTemplate?: Maybe<Scalars['String']>;
  responseMappingTemplate?: Maybe<Scalars['String']>;
  kind?: Maybe<Scalars['String']>;
  pipelineFunctionIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  syncConflictHandler?: Maybe<Scalars['String']>;
  syncConflictDetection?: Maybe<Scalars['String']>;
  syncLambdaConflictHandlerArn?: Maybe<Scalars['String']>;
  cachingTTL?: Maybe<Scalars['Int']>;
  cachingKeys?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsAppSyncType = {
  id: Scalars['String'];
  arn: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  definition?: Maybe<Scalars['String']>;
  format?: Maybe<Scalars['String']>;
  resolvers?: Maybe<Array<Maybe<AwsAppSyncResolver>>>;
};

export type AwsAsg = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  launchConfigurationName?: Maybe<Scalars['String']>;
  launchTemplateId?: Maybe<Scalars['String']>;
  launchTemplateName?: Maybe<Scalars['String']>;
  launchTemplateVersion?: Maybe<Scalars['String']>;
  mixedInstancesPolicy?: Maybe<AwsMixedInstancesPolicy>;
  minSize?: Maybe<Scalars['Int']>;
  maxSize?: Maybe<Scalars['Int']>;
  desiredCapacity?: Maybe<Scalars['Int']>;
  predictedCapacity?: Maybe<Scalars['Int']>;
  cooldown?: Maybe<Scalars['Int']>;
  availabilityZones?: Maybe<Array<Maybe<Scalars['String']>>>;
  loadBalancerNames?: Maybe<Array<Maybe<Scalars['String']>>>;
  targetGroupARNs?: Maybe<Array<Maybe<Scalars['String']>>>;
  healthCheckType?: Maybe<Scalars['String']>;
  healthCheckGracePeriod?: Maybe<Scalars['Int']>;
  ec2InstanceIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  suspendedProcesses?: Maybe<Array<Maybe<AwsSuspendedProcess>>>;
  placementGroup?: Maybe<Scalars['String']>;
  vpcZoneIdentifier?: Maybe<Scalars['String']>;
  enabledMetrics?: Maybe<Array<Maybe<AwsEnabledMetrics>>>;
  status?: Maybe<Scalars['String']>;
  terminationPolicies?: Maybe<Array<Maybe<Scalars['String']>>>;
  newInstancesProtectedFromScaleIn?: Maybe<Scalars['String']>;
  serviceLinkedRoleARN?: Maybe<Scalars['String']>;
  maxInstanceLifetime?: Maybe<Scalars['Int']>;
  capacityRebalanceEnabled?: Maybe<Scalars['String']>;
  warmPoolConfigMaxGroupPreparedCapacity?: Maybe<Scalars['Int']>;
  warmPoolConfigMinSize?: Maybe<Scalars['Int']>;
  warmPoolConfigPoolState?: Maybe<Scalars['String']>;
  warmPoolConfigStatus?: Maybe<Scalars['String']>;
  warmPoolSize?: Maybe<Scalars['Int']>;
  context?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  launchConfiguration?: Maybe<AwsLaunchConfiguration>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
};

export type AwsAssociatedTargetNetworks = {
  id: Scalars['String'];
  networkId?: Maybe<Scalars['String']>;
  networkType?: Maybe<Scalars['String']>;
};

export type AwsBilling = {
  id: Scalars['String'];
  account: Scalars['String'];
  totalCostMonthToDate?: Maybe<AwsTotalBillingInfo>;
  totalCostLast30Days?: Maybe<AwsTotalBillingInfo>;
  monthToDateDailyAverage?: Maybe<Array<Maybe<AwsServiceBillingInfo>>>;
  last30DaysDailyAverage?: Maybe<Array<Maybe<AwsServiceBillingInfo>>>;
  monthToDate?: Maybe<Array<Maybe<AwsServiceBillingInfo>>>;
  last30Days?: Maybe<Array<Maybe<AwsServiceBillingInfo>>>;
};

export type AwsBucketPolicy = {
  id: Scalars['String'];
  policy?: Maybe<AwsIamJsonPolicy>;
};

export type AwsCertificateAuthenticationRequest = {
  clientRootCertificateChain?: Maybe<Scalars['String']>;
};

export type AwsClientConnectResponseOptions = {
  enabled?: Maybe<Scalars['Boolean']>;
  lambdaFunctionArn?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsClientVpnAuthentication = {
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  activeDirectory?: Maybe<AwsDirectoryServiceAuthenticationRequest>;
  mutualAuthentication?: Maybe<AwsCertificateAuthenticationRequest>;
  federatedAuthentication?: Maybe<AwsFederatedAuthentication>;
};

export type AwsClientVpnEndpoint = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  deletionTime?: Maybe<Scalars['String']>;
  dnsName?: Maybe<Scalars['String']>;
  clientCidrBlock?: Maybe<Scalars['String']>;
  dnsServers?: Maybe<Array<Maybe<Scalars['String']>>>;
  splitTunnel?: Maybe<Scalars['Boolean']>;
  vpnProtocol?: Maybe<Scalars['String']>;
  transportProtocol?: Maybe<Scalars['String']>;
  vpnPort?: Maybe<Scalars['Int']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  associatedTargetNetworks?: Maybe<Array<Maybe<AwsAssociatedTargetNetworks>>>;
  serverCertificateArn?: Maybe<Scalars['String']>;
  authenticationOptions?: Maybe<Array<Maybe<AwsClientVpnAuthentication>>>;
  connectionLogOptions?: Maybe<AwsConnectionLogResponseOptions>;
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientConnectOptions?: Maybe<AwsClientConnectResponseOptions>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
};

export type AwsCloud9Environment = {
  id: Scalars['String'];
  arn: Scalars['String'];
  region: Scalars['String'];
  accountId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  connectionType?: Maybe<Scalars['String']>;
  ownerArn?: Maybe<Scalars['String']>;
  lifecycle?: Maybe<AwsCloud9EnvironmentLifecycle>;
  managedCredentialsStatus?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsCloud9EnvironmentLifecycle = {
  status?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  failureResource?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStack = {
  id: Scalars['String'];
  arn: Scalars['String'];
  region: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  changeSetId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  parameters?: Maybe<Array<Maybe<AwsCloudFormationStackParameter>>>;
  creationTime: Scalars['String'];
  deletionTime?: Maybe<Scalars['String']>;
  lastUpdatedTime?: Maybe<Scalars['String']>;
  rollbackConfiguration?: Maybe<AwsCloudFormationStackRollbackConfiguration>;
  stackStatus: Scalars['String'];
  stackStatusReason?: Maybe<Scalars['String']>;
  disableRollback?: Maybe<Scalars['String']>;
  notificationARNs?: Maybe<Array<Maybe<Scalars['String']>>>;
  timeoutInMinutes?: Maybe<Scalars['Int']>;
  capabilities?: Maybe<Array<Maybe<Scalars['String']>>>;
  outputs?: Maybe<Array<Maybe<AwsCloudFormationStackOutputList>>>;
  roleARN?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  enableTerminationProtection?: Maybe<Scalars['String']>;
  parentId?: Maybe<Scalars['String']>;
  rootId?: Maybe<Scalars['String']>;
  stackDriftInfo?: Maybe<AwsCloudFormationStackDriftInfo>;
  stackDriftList?: Maybe<Array<Maybe<AwsCloudFormationStackDriftList>>>;
};

export type AwsCloudFormationStackAutoDeploymentConfig = {
  enabled?: Maybe<Scalars['String']>;
  retainStacksOnAccountRemoval?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackDriftInfo = {
  id: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  lastCheckTimestamp?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackDriftList = {
  id: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  resourceType?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackOutputList = {
  id: Scalars['String'];
  outputKey?: Maybe<Scalars['String']>;
  outputValue?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  exportName?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackParameter = {
  id: Scalars['String'];
  parameterKey?: Maybe<Scalars['String']>;
  parameterValue?: Maybe<Scalars['String']>;
  usePreviousValue?: Maybe<Scalars['String']>;
  resolvedValue?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackRollbackConfiguration = {
  id: Scalars['String'];
  rollbackTriggers?: Maybe<Array<Maybe<AwsRollbackConfigurationRollbackTrigger>>>;
  monitoringTimeInMinutes?: Maybe<Scalars['Int']>;
};

export type AwsCloudFormationStackSet = {
  id: Scalars['String'];
  arn: Scalars['String'];
  region: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  templateBody?: Maybe<Scalars['String']>;
  parameters?: Maybe<Array<Maybe<AwsCloudFormationStackSetParameter>>>;
  capabilities?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  administrationRoleARN?: Maybe<Scalars['String']>;
  executionRoleName?: Maybe<Scalars['String']>;
  driftDetectionDetail?: Maybe<AwsCloudFormationStackSetDriftDetectionDetail>;
  autoDeploymentConfig?: Maybe<AwsCloudFormationStackAutoDeploymentConfig>;
  permissionModel?: Maybe<Scalars['String']>;
  organizationalUnitIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsCloudFormationStackSetDriftDetectionDetail = {
  driftDetectionStatus?: Maybe<Scalars['String']>;
  driftStatus?: Maybe<Scalars['String']>;
  driftedStackInstancesCount?: Maybe<Scalars['Int']>;
  failedStackInstancesCount?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  inProgressStackInstancesCount?: Maybe<Scalars['Int']>;
  inSyncStackInstancesCount?: Maybe<Scalars['Int']>;
  lastDriftCheckTimestamp?: Maybe<Scalars['String']>;
  parameterKey?: Maybe<Scalars['String']>;
  parameterValue?: Maybe<Scalars['String']>;
  resolvedValue?: Maybe<Scalars['String']>;
  totalStackInstancesCount?: Maybe<Scalars['Int']>;
  usePreviousValue?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackSetParameter = {
  id: Scalars['String'];
  parameterKey?: Maybe<Scalars['String']>;
  parameterValue?: Maybe<Scalars['String']>;
  usePreviousValue?: Maybe<Scalars['String']>;
  resolvedValue?: Maybe<Scalars['String']>;
};

export type AwsCloudfront = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  etag?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['String']>;
  priceClass?: Maybe<Scalars['String']>;
  domainName?: Maybe<Scalars['String']>;
  httpVersion?: Maybe<Scalars['String']>;
  lastModified?: Maybe<Scalars['String']>;
  callerReference?: Maybe<Scalars['String']>;
  ipv6Enabled?: Maybe<Scalars['String']>;
  defaultRootObject?: Maybe<Scalars['String']>;
  webAclId?: Maybe<Scalars['String']>;
  geoRestrictions?: Maybe<Scalars['String']>;
  customErrorResponses?: Maybe<Array<Maybe<AwsCloudfrontCustomErrorResponse>>>;
  defaultCacheBehavior?: Maybe<AwsCloudfrontCacheBehavior>;
  orderedCacheBehaviors?: Maybe<Array<Maybe<AwsCloudfrontCacheBehavior>>>;
  viewerCertificate?: Maybe<AwsCloudfrontViewerCertificate>;
  origins?: Maybe<Array<Maybe<AwsCloudfrontOriginData>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsCloudfrontCacheBehavior = {
  id: Scalars['String'];
  allowedMethods?: Maybe<Array<Maybe<Scalars['String']>>>;
  cachedMethods?: Maybe<Array<Maybe<Scalars['String']>>>;
  compress?: Maybe<Scalars['String']>;
  defaultTtl?: Maybe<Scalars['String']>;
  forwardedValues?: Maybe<AwsCloudfrontforwardedValues>;
  maxTtl?: Maybe<Scalars['String']>;
  minTtl?: Maybe<Scalars['String']>;
  patternPath?: Maybe<Scalars['String']>;
  smoothStreaming?: Maybe<Scalars['String']>;
  targetOriginId?: Maybe<Scalars['String']>;
  viewerProtocolPolicy?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontCustomErrorResponse = {
  id: Scalars['String'];
  errorCachingMinTtl?: Maybe<Scalars['String']>;
  errorCode?: Maybe<Scalars['Int']>;
  responseCode?: Maybe<Scalars['String']>;
  responsePagePath?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontCustomOriginConfig = {
  httpPort?: Maybe<Scalars['Int']>;
  httpsPort?: Maybe<Scalars['Int']>;
  originProtocolPolicy?: Maybe<Scalars['String']>;
  originSslProtocols?: Maybe<AwsCloudfrontOriginSslProtocols>;
  originReadTimeout?: Maybe<Scalars['Int']>;
  originKeepaliveTimeout?: Maybe<Scalars['Int']>;
};

export type AwsCloudfrontOriginCustomHeader = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontOriginData = {
  id: Scalars['String'];
  customHeaders?: Maybe<Array<Maybe<AwsCloudfrontOriginCustomHeader>>>;
  customOriginConfig?: Maybe<AwsCloudfrontCustomOriginConfig>;
  domainName?: Maybe<Scalars['String']>;
  originId: Scalars['String'];
  originPath?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontOriginSslProtocols = {
  quantity?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsCloudfrontViewerCertificate = {
  acmCertificateArn?: Maybe<Scalars['String']>;
  cloudfrontDefaultCertificate?: Maybe<Scalars['String']>;
  iamCertificateId?: Maybe<Scalars['String']>;
  minimumProtocolVersion?: Maybe<Scalars['String']>;
  sslSupportMethod?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontforwardedValues = {
  headers?: Maybe<Array<Maybe<Scalars['String']>>>;
  queryString?: Maybe<Scalars['String']>;
};

export type AwsCloudtrail = {
  id: Scalars['String'];
  cgId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  accountId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  s3BucketName?: Maybe<Scalars['String']>;
  s3KeyPrefix?: Maybe<Scalars['String']>;
  includeGlobalServiceEvents?: Maybe<Scalars['String']>;
  isMultiRegionTrail?: Maybe<Scalars['String']>;
  homeRegion?: Maybe<Scalars['String']>;
  logFileValidationEnabled?: Maybe<Scalars['String']>;
  cloudWatchLogsLogGroupArn?: Maybe<Scalars['String']>;
  cloudWatchLogsRoleArn?: Maybe<Scalars['String']>;
  kmsKeyId?: Maybe<Scalars['String']>;
  hasCustomEventSelectors?: Maybe<Scalars['String']>;
  hasInsightSelectors?: Maybe<Scalars['String']>;
  isOrganizationTrail?: Maybe<Scalars['String']>;
  status?: Maybe<AwsCloudtrailStatus>;
  eventSelectors?: Maybe<Array<Maybe<AwsCloudtrailEventSelector>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  sns?: Maybe<Array<Maybe<AwsSns>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
};

export type AwsCloudtrailEventSelector = {
  id: Scalars['String'];
  readWriteType?: Maybe<Scalars['String']>;
  includeManagementEvents?: Maybe<Scalars['Boolean']>;
};

export type AwsCloudtrailStatus = {
  isLogging?: Maybe<Scalars['Boolean']>;
  latestDeliveryTime?: Maybe<Scalars['String']>;
  latestNotificationTime?: Maybe<Scalars['String']>;
  startLoggingTime?: Maybe<Scalars['String']>;
  latestDigestDeliveryTime?: Maybe<Scalars['String']>;
  latestDeliveryAttemptTime?: Maybe<Scalars['String']>;
  latestNotificationAttemptTime?: Maybe<Scalars['String']>;
  latestNotificationAttemptSucceeded?: Maybe<Scalars['String']>;
  latestDeliveryAttemptSucceeded?: Maybe<Scalars['String']>;
  latestCloudWatchLogsDeliveryTime?: Maybe<Scalars['String']>;
  timeLoggingStarted?: Maybe<Scalars['String']>;
  timeLoggingStopped?: Maybe<Scalars['String']>;
};

export type AwsCloudwatch = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  metric?: Maybe<Scalars['String']>;
  namespace?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  actionsEnabled?: Maybe<Scalars['String']>;
  actions?: Maybe<Array<Maybe<Scalars['String']>>>;
  comparisonOperator?: Maybe<Scalars['String']>;
  statistic?: Maybe<Scalars['String']>;
  threshold?: Maybe<Scalars['String']>;
  period?: Maybe<Scalars['String']>;
  evaluationPeriods?: Maybe<Scalars['Int']>;
  dimensions?: Maybe<Array<Maybe<AwsCloudwatchDimensions>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsCloudwatchDimensions = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsCloudwatchLog = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['String']>;
  retentionInDays?: Maybe<Scalars['Int']>;
  metricFilterCount?: Maybe<Scalars['Int']>;
  storedBytes?: Maybe<Scalars['String']>;
  kmsKeyId?: Maybe<Scalars['String']>;
  metricFilters?: Maybe<Array<Maybe<AwsMetricFilter>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
};

export type AwsCognitoIdentityPool = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  identityPoolName?: Maybe<Scalars['String']>;
  allowUnauthenticatedIdentities?: Maybe<Scalars['String']>;
  allowClassicFlow?: Maybe<Scalars['String']>;
  supportedLoginProviders?: Maybe<Array<Maybe<AwsSupportedLoginProvider>>>;
  developerProviderName?: Maybe<Scalars['String']>;
  openIdConnectProviderARNs?: Maybe<Array<Maybe<Scalars['String']>>>;
  cognitoIdentityProviders?: Maybe<Array<Maybe<AwsCognitoIdentityProviders>>>;
  samlProviderARNs?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsCognitoIdentityProviders = {
  id: Scalars['String'];
  providerName?: Maybe<Scalars['String']>;
  clientId?: Maybe<Scalars['String']>;
  serverSideTokenCheck?: Maybe<Scalars['String']>;
};

export type AwsCognitoUserPool = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  policies?: Maybe<AwsCognitoUserPoolPasswordPolicy>;
  lambdaConfig?: Maybe<AwsCognitoUserPoolLambdaConfig>;
  status?: Maybe<Scalars['String']>;
  lastModifiedDate?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['String']>;
  schemaAttributes?: Maybe<Array<Maybe<AwsCognitoUserPoolSchemaAttribute>>>;
  autoVerifiedAttributes?: Maybe<Array<Maybe<Scalars['String']>>>;
  aliasAttributes?: Maybe<Array<Maybe<Scalars['String']>>>;
  usernameAttributes?: Maybe<Array<Maybe<Scalars['String']>>>;
  smsVerificationMessage?: Maybe<Scalars['String']>;
  emailVerificationMessage?: Maybe<Scalars['String']>;
  emailVerificationSubject?: Maybe<Scalars['String']>;
  verificationMessageTemplateSmsMessage?: Maybe<Scalars['String']>;
  verificationMessageTemplateEmailMessage?: Maybe<Scalars['String']>;
  verificationMessageTemplateEmailSubject?: Maybe<Scalars['String']>;
  verificationMessageTemplateEmailMessageByLink?: Maybe<Scalars['String']>;
  verificationMessageTemplateEmailSubjectByLink?: Maybe<Scalars['String']>;
  verificationMessageTemplateDefaultEmailOption?: Maybe<Scalars['String']>;
  smsAuthenticationMessage?: Maybe<Scalars['String']>;
  mfaConfiguration?: Maybe<Scalars['String']>;
  deviceConfigChallengeRequiredOnNewDevice?: Maybe<Scalars['String']>;
  deviceConfigDeviceOnlyRememberedOnUserPrompt?: Maybe<Scalars['String']>;
  estimatedNumberOfUsers?: Maybe<Scalars['Int']>;
  emailConfigSourceArn?: Maybe<Scalars['String']>;
  emailConfigReplyToEmailAddress?: Maybe<Scalars['String']>;
  emailConfigEmailSendingAccount?: Maybe<Scalars['String']>;
  emailConfigFrom?: Maybe<Scalars['String']>;
  emailConfigConfigurationSet?: Maybe<Scalars['String']>;
  smsConfigurationSnsCallerArn?: Maybe<Scalars['String']>;
  smsConfigurationExternalId?: Maybe<Scalars['String']>;
  smsConfigurationFailure?: Maybe<Scalars['String']>;
  emailConfigurationFailure?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  customDomain?: Maybe<Scalars['String']>;
  adminCreateUserConfigAllowAdminCreateUserOnly?: Maybe<Scalars['String']>;
  adminCreateUserConfigUnusedAccountValidityDays?: Maybe<Scalars['Int']>;
  adminCreateUserConfigInviteMessageTemplateSMSMessage?: Maybe<Scalars['String']>;
  adminCreateUserConfigInviteMessageTemplateEmailMessage?: Maybe<Scalars['String']>;
  adminCreateUserConfigInviteMessageTemplateEmailSubject?: Maybe<Scalars['String']>;
  userPoolAddOnsAdvancedSecurityMode?: Maybe<Scalars['String']>;
  usernameConfigurationCaseSensitive?: Maybe<Scalars['String']>;
  accountRecoverySettings?: Maybe<Array<Maybe<AwsAccountRecoverySetting>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
};

export type AwsCognitoUserPoolLambdaConfig = {
  id: Scalars['String'];
  preSignUp?: Maybe<Scalars['String']>;
  customMessage?: Maybe<Scalars['String']>;
  postConfirmation?: Maybe<Scalars['String']>;
  preAuthentication?: Maybe<Scalars['String']>;
  postAuthentication?: Maybe<Scalars['String']>;
  defineAuthChallenge?: Maybe<Scalars['String']>;
  createAuthChallenge?: Maybe<Scalars['String']>;
  verifyAuthChallengeResponse?: Maybe<Scalars['String']>;
  preTokenGeneration?: Maybe<Scalars['String']>;
  userMigration?: Maybe<Scalars['String']>;
  customSMSSenderLambdaVersion?: Maybe<Scalars['String']>;
  customSMSSenderLambdaArn?: Maybe<Scalars['String']>;
  customEmailSenderLambdaVersion?: Maybe<Scalars['String']>;
  customEmailSenderLambdaArn?: Maybe<Scalars['String']>;
  kmsKeyID?: Maybe<Scalars['String']>;
};

export type AwsCognitoUserPoolPasswordPolicy = {
  id: Scalars['String'];
  minimumLength?: Maybe<Scalars['Int']>;
  requireUppercase?: Maybe<Scalars['String']>;
  requireLowercase?: Maybe<Scalars['String']>;
  requireNumbers?: Maybe<Scalars['String']>;
  requireSymbols?: Maybe<Scalars['String']>;
  temporaryPasswordValidityDays?: Maybe<Scalars['Int']>;
};

export type AwsCognitoUserPoolSchemaAttribute = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  attributeDataType?: Maybe<Scalars['String']>;
  developerOnlyAttribute?: Maybe<Scalars['String']>;
  mutable?: Maybe<Scalars['String']>;
  required?: Maybe<Scalars['String']>;
  numberAttributeConstraintsMinValue?: Maybe<Scalars['String']>;
  numberAttributeConstraintsMaxValue?: Maybe<Scalars['String']>;
  stringAttributeConstraintsMinValue?: Maybe<Scalars['String']>;
  stringAttributeConstraintsMaxValue?: Maybe<Scalars['String']>;
};

export type AwsConnectionLogResponseOptions = {
  enabled?: Maybe<Scalars['Boolean']>;
  cloudwatchLogGroup?: Maybe<Scalars['String']>;
  cloudwatchLogStream?: Maybe<Scalars['String']>;
};

export type AwsCustomerGateway = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  bgpAsn?: Maybe<Scalars['String']>;
  ipAddress?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpnConnection?: Maybe<Array<Maybe<AwsVpnConnection>>>;
};

export type AwsDirectoryServiceAuthenticationRequest = {
  directoryId?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTable = {
  id: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  accountId: Scalars['String'];
  attributes?: Maybe<Array<Maybe<AwsDynamoDbTableAttributes>>>;
  billingModeSummary?: Maybe<AwsDynamoDbTableBillingSummary>;
  creationDate: Scalars['String'];
  globalIndexes?: Maybe<Array<Maybe<AwsDynamoDbTableGlobalSecondaryIndexDescription>>>;
  globalTableVersion?: Maybe<Scalars['String']>;
  itemCount?: Maybe<Scalars['Int']>;
  keySchema?: Maybe<Array<Maybe<AwsDynamoDbTableIndexKeySchema>>>;
  latestStreamArn?: Maybe<Scalars['String']>;
  latestStreamLabel?: Maybe<Scalars['String']>;
  localIndexes?: Maybe<Array<Maybe<AwsDynamoDbTableLocalSecondaryIndexDescription>>>;
  name: Scalars['String'];
  pointInTimeRecoveryEnabled?: Maybe<Scalars['Boolean']>;
  provisionedThroughput?: Maybe<AwsDynamoDbTableProvisionedThroughputDescription>;
  replicas?: Maybe<Array<Maybe<AwsDynamoDbTableReplicaDescription>>>;
  restoreSummary?: Maybe<AwsDynamoDbTableRestoreSummary>;
  sizeInBytes?: Maybe<Scalars['Int']>;
  sseDescription?: Maybe<AwsDynamoDbTableSseDescription>;
  status?: Maybe<Scalars['String']>;
  streamSpecification?: Maybe<AwsDynamoDbTableStreamSpecification>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  ttlEnabled?: Maybe<Scalars['Boolean']>;
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
};

export type AwsDynamoDbTableAttributes = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableBillingSummary = {
  billingMode?: Maybe<Scalars['String']>;
  lastUpdateToPayPerRequestDateTime?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableGlobalSecondaryIndexDescription = {
  id: Scalars['String'];
  name: Scalars['String'];
  arn: Scalars['String'];
  itemCount?: Maybe<Scalars['Int']>;
  keySchema?: Maybe<Array<Maybe<AwsDynamoDbTableIndexKeySchema>>>;
  projection?: Maybe<AwsDynamoDbTableIndexProjection>;
  sizeInBytes?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  backfilling?: Maybe<Scalars['Boolean']>;
  provisionedThroughput?: Maybe<AwsDynamoDbTableProvisionedThroughputDescription>;
};

export type AwsDynamoDbTableIndexKeySchema = {
  id: Scalars['String'];
  attributeName?: Maybe<Scalars['String']>;
  keyType?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableIndexProjection = {
  type?: Maybe<Scalars['String']>;
  nonKeyAttributes?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsDynamoDbTableLocalSecondaryIndexDescription = {
  name: Scalars['String'];
  arn: Scalars['String'];
  itemCount?: Maybe<Scalars['Int']>;
  keySchema?: Maybe<Array<Maybe<AwsDynamoDbTableIndexKeySchema>>>;
  projection?: Maybe<AwsDynamoDbTableIndexProjection>;
  sizeInBytes?: Maybe<Scalars['Int']>;
};

export type AwsDynamoDbTableProvisionedThroughputDescription = {
  lastIncreaseDateTime?: Maybe<Scalars['String']>;
  lastDecreaseDateTime?: Maybe<Scalars['String']>;
  numberOfDecreasesToday?: Maybe<Scalars['Int']>;
  readCapacityUnits?: Maybe<Scalars['Int']>;
  writeCapacityUnits?: Maybe<Scalars['Int']>;
};

export type AwsDynamoDbTableReplicaDescription = {
  id: Scalars['String'];
  regionName?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  statusDescription?: Maybe<Scalars['String']>;
  statusPercentProgress?: Maybe<Scalars['String']>;
  kmsMasterKeyId?: Maybe<Scalars['String']>;
  readCapacityUnits?: Maybe<Scalars['Int']>;
  globalSecondaryIndexes?: Maybe<Array<Maybe<AwsDynamoDbTableReplicaGlobalSecondaryIndexDescription>>>;
  replicaInaccessibleDateTime?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableReplicaGlobalSecondaryIndexDescription = {
  name?: Maybe<Scalars['String']>;
  readCapacityUnits?: Maybe<Scalars['Int']>;
};

export type AwsDynamoDbTableRestoreSummary = {
  sourceBackupArn?: Maybe<Scalars['String']>;
  sourceTableArn?: Maybe<Scalars['String']>;
  restoreDateTime?: Maybe<Scalars['String']>;
  restoreInProgress?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableSseDescription = {
  status?: Maybe<Scalars['String']>;
  sseType?: Maybe<Scalars['String']>;
  kmsMasterKeyArn?: Maybe<Scalars['String']>;
  inaccessibleEncryptionDateTime?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableStreamSpecification = {
  streamsEnabled?: Maybe<Scalars['Boolean']>;
  streamViewType?: Maybe<Scalars['String']>;
};

export type AwsEbs = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  attachments?: Maybe<Array<Maybe<AwsEbsAttachment>>>;
  iops?: Maybe<Scalars['Int']>;
  size?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['String']>;
  snapshot?: Maybe<Scalars['String']>;
  encrypted?: Maybe<Scalars['Boolean']>;
  isBootDisk?: Maybe<Scalars['Boolean']>;
  volumeType?: Maybe<Scalars['String']>;
  availabilityZone?: Maybe<Scalars['String']>;
  multiAttachEnabled?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  emrInstance?: Maybe<Array<Maybe<AwsEmrInstance>>>;
};

export type AwsEbsAttachment = {
  id: Scalars['String'];
  attachmentInformation?: Maybe<Scalars['String']>;
  attachedTime?: Maybe<Scalars['String']>;
  deleteOnTermination?: Maybe<Scalars['Boolean']>;
};

export type AwsEc2 = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  ami?: Maybe<Scalars['String']>;
  tenancy?: Maybe<Scalars['String']>;
  elasticIps?: Maybe<Scalars['String']>;
  publicDns?: Maybe<Scalars['String']>;
  privateDns?: Maybe<Scalars['String']>;
  monitoring?: Maybe<Scalars['String']>;
  privateIps?: Maybe<Scalars['String']>;
  keyPairName?: Maybe<Scalars['String']>;
  cpuCoreCount?: Maybe<Scalars['Int']>;
  hibernation?: Maybe<Scalars['String']>;
  ebsOptimized?: Maybe<Scalars['String']>;
  ipv4PublicIp?: Maybe<Scalars['String']>;
  instanceType?: Maybe<Scalars['String']>;
  ipv6Addresses?: Maybe<Array<Maybe<Scalars['String']>>>;
  placementGroup?: Maybe<Scalars['String']>;
  instanceState?: Maybe<Scalars['String']>;
  sourceDestCheck?: Maybe<Scalars['String']>;
  availabilityZone?: Maybe<Scalars['String']>;
  cpuThreadsPerCore?: Maybe<Scalars['Int']>;
  iamInstanceProfile?: Maybe<Scalars['String']>;
  deletionProtection?: Maybe<Scalars['String']>;
  dailyCost?: Maybe<AwsTotalBillingInfo>;
  primaryNetworkInterface?: Maybe<Scalars['String']>;
  metadataOptions?: Maybe<AwsEc2MetadataOptions>;
  metadatasecurityGroupIdsOptions?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  ephemeralBlockDevices?: Maybe<Array<Maybe<AwsEc2Blockdevice>>>;
  associatePublicIpAddress?: Maybe<Scalars['String']>;
  platformDetails?: Maybe<Scalars['String']>;
  cloudWatchMetricData?: Maybe<AwsEc2CloudWatchMetricsTimePeriods>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
  networkInterfaces?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  ecsContainer?: Maybe<Array<Maybe<AwsEcsContainer>>>;
  emrInstance?: Maybe<Array<Maybe<AwsEmrInstance>>>;
};

export type AwsEc2Blockdevice = {
  deviceName: Scalars['String'];
  ebs?: Maybe<BlockDeviceEbs>;
};

export type AwsEc2CloudWatchMetrics = {
  cpuUtilizationAverage?: Maybe<Scalars['Float']>;
  networkInAverage?: Maybe<Scalars['Float']>;
  networkOutAverage?: Maybe<Scalars['Float']>;
  networkPacketsInAverage?: Maybe<Scalars['Float']>;
  networkPacketsOutAverage?: Maybe<Scalars['Float']>;
  statusCheckFailedSum?: Maybe<Scalars['Float']>;
  statusCheckFailedInstanceSum?: Maybe<Scalars['Float']>;
  statusCheckFailedSystemSum?: Maybe<Scalars['Float']>;
  diskReadOpsAverage?: Maybe<Scalars['Float']>;
  diskWriteOpsAverage?: Maybe<Scalars['Float']>;
  diskReadBytesAverage?: Maybe<Scalars['Float']>;
  diskWriteBytesAverage?: Maybe<Scalars['Float']>;
};

export type AwsEc2CloudWatchMetricsTimePeriods = {
  last6Hours?: Maybe<AwsEc2CloudWatchMetrics>;
  last24Hours?: Maybe<AwsEc2CloudWatchMetrics>;
  lastWeek?: Maybe<AwsEc2CloudWatchMetrics>;
  lastMonth?: Maybe<AwsEc2CloudWatchMetrics>;
};

export type AwsEc2MetadataOptions = {
  state: Scalars['String'];
  httpTokens: Scalars['String'];
  httpPutResponseHopLimit?: Maybe<Scalars['Int']>;
  httpEndpoint: Scalars['String'];
};

export type AwsEcr = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  encryptionConfig?: Maybe<AwsEcrEncryptionConfiguration>;
  imageScanOnPush?: Maybe<Scalars['Boolean']>;
  imageTagMutability?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  registryAccountId?: Maybe<Scalars['String']>;
  repositoryUri?: Maybe<Scalars['String']>;
  scanOnPush?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsEcrEncryptionConfiguration = {
  type?: Maybe<Scalars['String']>;
  kmsKey?: Maybe<Scalars['String']>;
};

export type AwsEcsAttachment = {
  details?: Maybe<Array<Maybe<AwsEcsAttachmentDetail>>>;
  id: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsEcsAttachmentDetail = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsAttribute = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  targetType?: Maybe<Scalars['String']>;
  targetId?: Maybe<Scalars['String']>;
};

export type AwsEcsAwsVpcConfiguration = {
  subnets?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  assignPublicIp?: Maybe<Scalars['String']>;
};

export type AwsEcsCapacityProviderStrategyItem = {
  id: Scalars['String'];
  capacityProvider?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Int']>;
  base?: Maybe<Scalars['Int']>;
};

export type AwsEcsCluster = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  clusterName?: Maybe<Scalars['String']>;
  configuration?: Maybe<AwsEcsClusterConfiguration>;
  status?: Maybe<Scalars['String']>;
  registeredContainerInstancesCount?: Maybe<Scalars['Int']>;
  runningTasksCount?: Maybe<Scalars['Int']>;
  pendingTasksCount?: Maybe<Scalars['Int']>;
  activeServicesCount?: Maybe<Scalars['Int']>;
  statistics?: Maybe<Array<Maybe<AwsEcsStatistics>>>;
  settings?: Maybe<Array<Maybe<AwsEcsClusterSettings>>>;
  capacityProviders?: Maybe<Array<Maybe<Scalars['String']>>>;
  defaultCapacityProviderStrategy?: Maybe<Array<Maybe<AwsEcsCapacityProviderStrategyItem>>>;
  attachments?: Maybe<Array<Maybe<AwsEcsAttachment>>>;
  attachmentsStatus?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  ecsTask?: Maybe<Array<Maybe<AwsEcsTask>>>;
  ecsTaskSet?: Maybe<Array<Maybe<AwsEcsTaskSet>>>;
};

export type AwsEcsClusterConfiguration = {
  id: Scalars['String'];
  executeCommandConfiguration?: Maybe<AwsEcsExecuteCommandConfiguration>;
};

export type AwsEcsClusterSettings = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsContainer = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  ec2InstanceId?: Maybe<Scalars['String']>;
  capacityProviderName?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
  versionInfo?: Maybe<AwsEcsversionInfo>;
  remainingResources?: Maybe<Array<Maybe<AwsEcsResource>>>;
  registeredResources?: Maybe<Array<Maybe<AwsEcsResource>>>;
  status?: Maybe<Scalars['String']>;
  statusReason?: Maybe<Scalars['String']>;
  agentConnected?: Maybe<Scalars['Boolean']>;
  runningTasksCount?: Maybe<Scalars['Int']>;
  pendingTasksCount?: Maybe<Scalars['Int']>;
  agentUpdateStatus?: Maybe<Scalars['String']>;
  attributes?: Maybe<Array<Maybe<AwsEcsAttribute>>>;
  registeredAt?: Maybe<Scalars['String']>;
  attachments?: Maybe<Array<Maybe<AwsEcsAttachment>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  ecsTask?: Maybe<Array<Maybe<AwsEcsTask>>>;
};

export type AwsEcsContainerDefinition = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  repositoryCredentials?: Maybe<AwsEcsRepositoryCredentials>;
  cpu?: Maybe<Scalars['Int']>;
  memory?: Maybe<Scalars['Int']>;
  memoryReservation?: Maybe<Scalars['Int']>;
  links?: Maybe<Array<Maybe<Scalars['String']>>>;
  portMappings?: Maybe<Array<Maybe<AwsEcsPortMapping>>>;
  essential?: Maybe<Scalars['Boolean']>;
  entryPoint?: Maybe<Array<Maybe<Scalars['String']>>>;
  command?: Maybe<Array<Maybe<Scalars['String']>>>;
  environment?: Maybe<Array<Maybe<AwsEcsEnvironmentVariables>>>;
  environmentFiles?: Maybe<Array<Maybe<AwsEcsEnvironmentFile>>>;
  mountPoints?: Maybe<Array<Maybe<AwsEcsMountPoint>>>;
  volumesFrom?: Maybe<Array<Maybe<AwsEcsVolumeFrom>>>;
  linuxParameters?: Maybe<AwsEcsLinuxParameters>;
  secrets?: Maybe<Array<Maybe<AwsEcsSecret>>>;
  dependsOn?: Maybe<Array<Maybe<AwsEcsContainerDependency>>>;
  startTimeout?: Maybe<Scalars['Int']>;
  stopTimeout?: Maybe<Scalars['Int']>;
  hostname?: Maybe<Scalars['String']>;
  user?: Maybe<Scalars['String']>;
  workingDirectory?: Maybe<Scalars['String']>;
  disableNetworking?: Maybe<Scalars['Boolean']>;
  privileged?: Maybe<Scalars['Boolean']>;
  readonlyRootFilesystem?: Maybe<Scalars['Boolean']>;
  dnsServers?: Maybe<Array<Maybe<Scalars['String']>>>;
  dnsSearchDomains?: Maybe<Array<Maybe<Scalars['String']>>>;
  extraHosts?: Maybe<Array<Maybe<AwsEcsHostEntry>>>;
  dockerSecurityOptions?: Maybe<Array<Maybe<Scalars['String']>>>;
  interactive?: Maybe<Scalars['Boolean']>;
  pseudoTerminal?: Maybe<Scalars['Boolean']>;
  dockerLabels?: Maybe<Array<Maybe<AwsEcsDockerLabel>>>;
  ulimits?: Maybe<Array<Maybe<AwsEcsUlimit>>>;
  logConfiguration?: Maybe<AwsEcsLogConfiguration>;
  healthCheck?: Maybe<AwsEcsHealthCheck>;
  systemControls?: Maybe<Array<Maybe<AwsEcsSystemControl>>>;
  resourceRequirements?: Maybe<Array<Maybe<AwsEcsResourceRequirement>>>;
  firelensConfiguration?: Maybe<AwsEcsFirelensConfiguration>;
};

export type AwsEcsContainerDependency = {
  id: Scalars['String'];
  containerName?: Maybe<Scalars['String']>;
  condition?: Maybe<Scalars['String']>;
};

export type AwsEcsContainerOverride = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  command?: Maybe<Array<Maybe<Scalars['String']>>>;
  environment?: Maybe<Array<Maybe<AwsEcsEnvironmentVariables>>>;
  environmentFiles?: Maybe<Array<Maybe<AwsEcsEnvironmentFile>>>;
  cpu?: Maybe<Scalars['String']>;
  memory?: Maybe<Scalars['Int']>;
  memoryReservation?: Maybe<Scalars['Int']>;
  resourceRequirements?: Maybe<Array<Maybe<AwsEcsResourceRequirement>>>;
};

export type AwsEcsDeployment = {
  id: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  taskDefinition?: Maybe<Scalars['String']>;
  desiredCount?: Maybe<Scalars['Int']>;
  pendingCount?: Maybe<Scalars['Int']>;
  runningCount?: Maybe<Scalars['Int']>;
  failedTasks?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  capacityProviderStrategy?: Maybe<Array<Maybe<AwsEcsCapacityProviderStrategyItem>>>;
  launchType?: Maybe<Scalars['String']>;
  platformVersion?: Maybe<Scalars['String']>;
  networkConfiguration?: Maybe<AwsEcsNetworkConfiguration>;
  rolloutState?: Maybe<Scalars['String']>;
  rolloutStateReason?: Maybe<Scalars['String']>;
};

export type AwsEcsDeploymentCircuitBreaker = {
  id: Scalars['String'];
  enable?: Maybe<Scalars['Boolean']>;
  rollback?: Maybe<Scalars['Boolean']>;
};

export type AwsEcsDeploymentConfiguration = {
  id: Scalars['String'];
  deploymentCircuitBreaker?: Maybe<AwsEcsDeploymentCircuitBreaker>;
  maximumPercent?: Maybe<Scalars['Int']>;
  minimumHealthyPercent?: Maybe<Scalars['Int']>;
};

export type AwsEcsDeploymentController = {
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type AwsEcsDevice = {
  id: Scalars['String'];
  hostPath?: Maybe<Scalars['String']>;
  containerPath?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsEcsDockerLabel = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsDockerVolumeConfiguration = {
  scope?: Maybe<Scalars['String']>;
  autoprovision?: Maybe<Scalars['Boolean']>;
  driver?: Maybe<Scalars['String']>;
  driverOpts?: Maybe<Array<Maybe<AwsEcsStringMap>>>;
  labels?: Maybe<Array<Maybe<AwsEcsStringMap>>>;
};

export type AwsEcsEfsVolumeConfiguration = {
  fileSystemId?: Maybe<Scalars['String']>;
  rootDirectory?: Maybe<Scalars['String']>;
  transitEncryption?: Maybe<Scalars['String']>;
  transitEncryptionPort?: Maybe<Scalars['Int']>;
  authorizationConfig?: Maybe<AwsEfsEfsAuthorizationConfig>;
};

export type AwsEcsEnvironmentFile = {
  id: Scalars['String'];
  value?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsEcsEnvironmentVariables = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsEphemeralStorage = {
  sizeInGiB?: Maybe<Scalars['Int']>;
};

export type AwsEcsExecuteCommandConfiguration = {
  id: Scalars['String'];
  kmsKeyId?: Maybe<Scalars['String']>;
  logging?: Maybe<Scalars['String']>;
  logConfiguration?: Maybe<AwsEcsExecuteCommandLogConfiguration>;
};

export type AwsEcsFSxWindowsFileServerAuthorizationConfig = {
  credentialsParameter?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
};

export type AwsEcsFSxWindowsFileServerVolumeConfiguration = {
  fileSystemId?: Maybe<Scalars['String']>;
  rootDirectory?: Maybe<Scalars['String']>;
  authorizationConfig?: Maybe<AwsEcsFSxWindowsFileServerAuthorizationConfig>;
};

export type AwsEcsFirelensConfiguration = {
  type?: Maybe<Scalars['String']>;
  options?: Maybe<Array<Maybe<AwsEcsFirelensConfigurationOption>>>;
};

export type AwsEcsFirelensConfigurationOption = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsHealthCheck = {
  command?: Maybe<Array<Maybe<Scalars['String']>>>;
  interval?: Maybe<Scalars['Int']>;
  timeout?: Maybe<Scalars['Int']>;
  retries?: Maybe<Scalars['Int']>;
  startPeriod?: Maybe<Scalars['Int']>;
};

export type AwsEcsHostEntry = {
  id: Scalars['String'];
  hostname?: Maybe<Scalars['String']>;
  ipAddress?: Maybe<Scalars['String']>;
};

export type AwsEcsHostVolumeProperty = {
  sourcePath?: Maybe<Scalars['String']>;
};

export type AwsEcsInferenceAccelerator = {
  id: Scalars['String'];
  deviceName?: Maybe<Scalars['String']>;
  deviceType?: Maybe<Scalars['String']>;
};

export type AwsEcsInferenceAcceleratorOverride = {
  id: Scalars['String'];
  deviceName?: Maybe<Scalars['String']>;
  deviceType?: Maybe<Scalars['String']>;
};

export type AwsEcsKernelCapabilities = {
  add?: Maybe<Array<Maybe<Scalars['String']>>>;
  drop?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsEcsLinuxParameters = {
  capabilities?: Maybe<AwsEcsKernelCapabilities>;
  devices?: Maybe<Array<Maybe<AwsEcsDevice>>>;
  initProcessEnabled?: Maybe<Scalars['Boolean']>;
  sharedMemorySize?: Maybe<Scalars['Int']>;
  tmpfs?: Maybe<Array<Maybe<AwsEcsTmpfs>>>;
  maxSwap?: Maybe<Scalars['Int']>;
  swappiness?: Maybe<Scalars['Int']>;
};

export type AwsEcsLoadBalancer = {
  id: Scalars['String'];
  targetGroupArn?: Maybe<Scalars['String']>;
  loadBalancerName?: Maybe<Scalars['String']>;
  containerName?: Maybe<Scalars['String']>;
  containerPort?: Maybe<Scalars['Int']>;
};

export type AwsEcsLogConfiguration = {
  logDriver?: Maybe<Scalars['String']>;
  options?: Maybe<Array<Maybe<AwsEcsLogConfigurationOption>>>;
  secretOptions?: Maybe<Array<Maybe<AwsEcsSecret>>>;
};

export type AwsEcsLogConfigurationOption = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsMountPoint = {
  id: Scalars['String'];
  sourceVolume?: Maybe<Scalars['String']>;
  containerPath?: Maybe<Scalars['String']>;
  readOnly?: Maybe<Scalars['Boolean']>;
};

export type AwsEcsNetworkConfiguration = {
  awsvpcConfiguration?: Maybe<AwsEcsAwsVpcConfiguration>;
};

export type AwsEcsPlacementConstraint = {
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  expression?: Maybe<Scalars['String']>;
};

export type AwsEcsPlacementStrategy = {
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  field?: Maybe<Scalars['String']>;
};

export type AwsEcsPortMapping = {
  id: Scalars['String'];
  containerPort?: Maybe<Scalars['Int']>;
  hostPort?: Maybe<Scalars['Int']>;
  protocol?: Maybe<Scalars['String']>;
};

export type AwsEcsProxyConfiguration = {
  type?: Maybe<Scalars['String']>;
  containerName?: Maybe<Scalars['String']>;
  properties?: Maybe<Array<Maybe<AwsEcsProxyConfigurationProperty>>>;
};

export type AwsEcsProxyConfigurationProperty = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsRepositoryCredentials = {
  credentialsParameter?: Maybe<Scalars['String']>;
};

export type AwsEcsResource = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  doubleValue?: Maybe<Scalars['Float']>;
  longValue?: Maybe<Scalars['Int']>;
  integerValue?: Maybe<Scalars['Int']>;
  stringSetValue?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsEcsResourceRequirement = {
  id: Scalars['String'];
  value?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsEcsScale = {
  value?: Maybe<Scalars['Int']>;
  unit?: Maybe<Scalars['String']>;
};

export type AwsEcsSecret = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  valueFrom?: Maybe<Scalars['String']>;
};

export type AwsEcsService = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  serviceName?: Maybe<Scalars['String']>;
  loadBalancers?: Maybe<Array<Maybe<AwsEcsLoadBalancer>>>;
  serviceRegistries?: Maybe<Array<Maybe<AwsEcsServiceRegistry>>>;
  status?: Maybe<Scalars['String']>;
  desiredCount?: Maybe<Scalars['Int']>;
  runningCount?: Maybe<Scalars['Int']>;
  pendingCount?: Maybe<Scalars['Int']>;
  launchType?: Maybe<Scalars['String']>;
  capacityProviderStrategy?: Maybe<Array<Maybe<AwsEcsCapacityProviderStrategyItem>>>;
  platformVersion?: Maybe<Scalars['String']>;
  deploymentConfiguration?: Maybe<AwsEcsDeploymentConfiguration>;
  deployments?: Maybe<Array<Maybe<AwsEcsDeployment>>>;
  roleArn?: Maybe<Scalars['String']>;
  events?: Maybe<Array<Maybe<AwsEcsServiceEvent>>>;
  createdAt?: Maybe<Scalars['String']>;
  placementConstraints?: Maybe<Array<Maybe<AwsEcsPlacementConstraint>>>;
  placementStrategy?: Maybe<Array<Maybe<AwsEcsPlacementStrategy>>>;
  networkConfiguration?: Maybe<AwsEcsNetworkConfiguration>;
  healthCheckGracePeriodSeconds?: Maybe<Scalars['Int']>;
  schedulingStrategy?: Maybe<Scalars['String']>;
  deploymentController?: Maybe<AwsEcsDeploymentController>;
  createdBy?: Maybe<Scalars['String']>;
  enableECSManagedTags?: Maybe<Scalars['Boolean']>;
  propagateTags?: Maybe<Scalars['String']>;
  enableExecuteCommand?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  ecsTaskDefinition?: Maybe<Array<Maybe<AwsEcsTaskDefinition>>>;
  ecsTaskSet?: Maybe<Array<Maybe<AwsEcsTaskSet>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsEcsServiceEvent = {
  id: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type AwsEcsServiceRegistry = {
  id: Scalars['String'];
  registryArn?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Int']>;
  containerName?: Maybe<Scalars['String']>;
  containerPort?: Maybe<Scalars['Int']>;
};

export type AwsEcsStatistics = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsStringMap = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsSystemControl = {
  id: Scalars['String'];
  namespace?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsTask = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  attachments?: Maybe<Array<Maybe<AwsEcsAttachment>>>;
  attributes?: Maybe<Array<Maybe<AwsEcsAttribute>>>;
  availabilityZone?: Maybe<Scalars['String']>;
  capacityProviderName?: Maybe<Scalars['String']>;
  clusterArn?: Maybe<Scalars['String']>;
  connectivity?: Maybe<Scalars['String']>;
  connectivityAt?: Maybe<Scalars['String']>;
  containerInstanceArn?: Maybe<Scalars['String']>;
  cpu?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  desiredStatus?: Maybe<Scalars['String']>;
  enableExecuteCommand?: Maybe<Scalars['Boolean']>;
  executionStoppedAt?: Maybe<Scalars['String']>;
  group?: Maybe<Scalars['String']>;
  healthStatus?: Maybe<Scalars['String']>;
  inferenceAccelerators?: Maybe<Array<Maybe<AwsEcsInferenceAccelerator>>>;
  lastStatus?: Maybe<Scalars['String']>;
  launchType?: Maybe<Scalars['String']>;
  memory?: Maybe<Scalars['String']>;
  overrides?: Maybe<AwsEcsTaskOverride>;
  platformVersion?: Maybe<Scalars['String']>;
  pullStartedAt?: Maybe<Scalars['String']>;
  pullStoppedAt?: Maybe<Scalars['String']>;
  startedAt?: Maybe<Scalars['String']>;
  startedBy?: Maybe<Scalars['String']>;
  stopCode?: Maybe<Scalars['String']>;
  stoppedAt?: Maybe<Scalars['String']>;
  stoppedReason?: Maybe<Scalars['String']>;
  stoppingAt?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
  ephemeralStorage?: Maybe<AwsEcsEphemeralStorage>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  ecsContainer?: Maybe<Array<Maybe<AwsEcsContainer>>>;
  ecsTaskDefinition?: Maybe<Array<Maybe<AwsEcsTaskDefinition>>>;
};

export type AwsEcsTaskDefinition = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  containerDefinitions?: Maybe<Array<Maybe<AwsEcsContainerDefinition>>>;
  family?: Maybe<Scalars['String']>;
  taskRoleArn?: Maybe<Scalars['String']>;
  executionRoleArn?: Maybe<Scalars['String']>;
  networkMode?: Maybe<Scalars['String']>;
  revision?: Maybe<Scalars['Int']>;
  volumes?: Maybe<Array<Maybe<AwsEcsVolume>>>;
  status?: Maybe<Scalars['String']>;
  requiresAttributes?: Maybe<Array<Maybe<AwsEcsAttribute>>>;
  placementConstraints?: Maybe<Array<Maybe<AwsEcsTaskDefinitionPlacementConstraint>>>;
  compatibilities?: Maybe<Array<Maybe<Scalars['String']>>>;
  requiresCompatibilities?: Maybe<Array<Maybe<Scalars['String']>>>;
  cpu?: Maybe<Scalars['String']>;
  memory?: Maybe<Scalars['String']>;
  inferenceAccelerators?: Maybe<Array<Maybe<AwsEcsInferenceAccelerator>>>;
  pidMode?: Maybe<Scalars['String']>;
  ipcMode?: Maybe<Scalars['String']>;
  proxyConfiguration?: Maybe<AwsEcsProxyConfiguration>;
  registeredAt?: Maybe<Scalars['String']>;
  deregisteredAt?: Maybe<Scalars['String']>;
  registeredBy?: Maybe<Scalars['String']>;
  ephemeralStorage?: Maybe<AwsEcsEphemeralStorage>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  ecsTask?: Maybe<Array<Maybe<AwsEcsTask>>>;
  ecsTaskSet?: Maybe<Array<Maybe<AwsEcsTaskSet>>>;
};

export type AwsEcsTaskDefinitionPlacementConstraint = {
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  expression?: Maybe<Scalars['String']>;
};

export type AwsEcsTaskOverride = {
  id: Scalars['String'];
  containerOverrides?: Maybe<Array<Maybe<AwsEcsContainerOverride>>>;
  cpu?: Maybe<Scalars['String']>;
  inferenceAcceleratorOverrides?: Maybe<Array<Maybe<AwsEcsInferenceAcceleratorOverride>>>;
  executionRoleArn?: Maybe<Scalars['String']>;
  memory?: Maybe<Scalars['String']>;
  taskRoleArn?: Maybe<Scalars['String']>;
  ephemeralStorage?: Maybe<AwsEcsEphemeralStorage>;
};

export type AwsEcsTaskSet = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  startedBy?: Maybe<Scalars['String']>;
  externalId?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  computedDesiredCount?: Maybe<Scalars['Int']>;
  pendingCount?: Maybe<Scalars['Int']>;
  runningCount?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  launchType?: Maybe<Scalars['String']>;
  capacityProviderStrategy?: Maybe<Array<Maybe<AwsEcsCapacityProviderStrategyItem>>>;
  platformVersion?: Maybe<Scalars['String']>;
  networkConfiguration?: Maybe<AwsEcsNetworkConfiguration>;
  loadBalancers?: Maybe<Array<Maybe<AwsEcsLoadBalancer>>>;
  serviceRegistries?: Maybe<Array<Maybe<AwsEcsServiceRegistry>>>;
  scale?: Maybe<AwsEcsScale>;
  stabilityStatus?: Maybe<Scalars['String']>;
  stabilityStatusAt?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  ecsTaskDefinition?: Maybe<Array<Maybe<AwsEcsTaskDefinition>>>;
};

export type AwsEcsTmpfs = {
  id: Scalars['String'];
  containerPath?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  mountOptions?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsEcsUlimit = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  softLimit?: Maybe<Scalars['Int']>;
  hardLimit?: Maybe<Scalars['Int']>;
};

export type AwsEcsVolume = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  host?: Maybe<AwsEcsHostVolumeProperty>;
  dockerVolumeConfiguration?: Maybe<AwsEcsDockerVolumeConfiguration>;
  efsVolumeConfiguration?: Maybe<AwsEcsEfsVolumeConfiguration>;
  fsxWindowsFileServerVolumeConfiguration?: Maybe<AwsEcsFSxWindowsFileServerVolumeConfiguration>;
};

export type AwsEcsVolumeFrom = {
  id: Scalars['String'];
  sourceContainer?: Maybe<Scalars['String']>;
  readOnly?: Maybe<Scalars['Boolean']>;
};

export type AwsEcsversionInfo = {
  id: Scalars['String'];
  agentVersion?: Maybe<Scalars['String']>;
  agentHash?: Maybe<Scalars['String']>;
  dockerVersion?: Maybe<Scalars['String']>;
};

export type AwsEfs = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['String']>;
  creationToken?: Maybe<Scalars['String']>;
  fileSystemId?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['String']>;
  lifeCycleState?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  numberOfMountTargets?: Maybe<Scalars['Int']>;
  sizeInBytes?: Maybe<AwsEfsFileSystemSize>;
  performanceMode?: Maybe<Scalars['String']>;
  encrypted?: Maybe<Scalars['Boolean']>;
  throughputMode?: Maybe<Scalars['String']>;
  provisionedThroughputInMibps?: Maybe<Scalars['Int']>;
  availabilityZoneName?: Maybe<Scalars['String']>;
  availabilityZoneId?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  efsMountTarget?: Maybe<Array<Maybe<AwsEfsMountTarget>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
};

export type AwsEfsEfsAuthorizationConfig = {
  accessPointId?: Maybe<Scalars['String']>;
  iam?: Maybe<Scalars['String']>;
};

export type AwsEfsFileSystemSize = {
  value?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['String']>;
  valueInIA?: Maybe<Scalars['Int']>;
  valueInStandard?: Maybe<Scalars['Int']>;
};

export type AwsEfsMountTarget = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['String']>;
  fileSystemId?: Maybe<Scalars['String']>;
  lifeCycleState?: Maybe<Scalars['String']>;
  ipAddress?: Maybe<Scalars['String']>;
  availabilityZoneId?: Maybe<Scalars['String']>;
  availabilityZoneName?: Maybe<Scalars['String']>;
  efs?: Maybe<Array<Maybe<AwsEfs>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsEip = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  publicIp?: Maybe<Scalars['String']>;
  privateIp?: Maybe<Scalars['String']>;
  instanceId?: Maybe<Scalars['String']>;
  publicIpv4Pool?: Maybe<Scalars['String']>;
  networkInterfaceId?: Maybe<Scalars['String']>;
  ec2InstanceAssociationId?: Maybe<Scalars['String']>;
  networkInterfaceOwnerId?: Maybe<Scalars['String']>;
  networkBorderGroup?: Maybe<Scalars['String']>;
  customerOwnedIp?: Maybe<Scalars['String']>;
  customerOwnedIpv4Pool?: Maybe<Scalars['String']>;
  vpcs?: Maybe<Array<Maybe<AwsVpc>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
};

export type AwsEksCertificate = {
  data?: Maybe<Scalars['String']>;
};

export type AwsEksCluster = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  endpoint?: Maybe<Scalars['String']>;
  resourcesVpcConfig?: Maybe<AwsEksVpcConfigResponse>;
  kubernetesNetworkConfig?: Maybe<AwsEksKubernetesNetworkConfigResponse>;
  logging?: Maybe<AwsEksLogging>;
  identity?: Maybe<AwsEksIdentity>;
  status?: Maybe<Scalars['String']>;
  certificateAuthority?: Maybe<AwsEksCertificate>;
  clientRequestToken?: Maybe<Scalars['String']>;
  platformVersion?: Maybe<Scalars['String']>;
  encryptionConfig?: Maybe<Array<Maybe<AwsEksEncryptionConfig>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsEksEncryptionConfig = {
  id: Scalars['String'];
  resources?: Maybe<Array<Maybe<Scalars['String']>>>;
  provider?: Maybe<AwsEksProvider>;
};

export type AwsEksIdentity = {
  oidc?: Maybe<AwsEksOidc>;
};

export type AwsEksKubernetesNetworkConfigResponse = {
  serviceIpv4Cidr?: Maybe<Scalars['String']>;
};

export type AwsEksLogSetup = {
  id: Scalars['String'];
  types?: Maybe<Array<Maybe<Scalars['String']>>>;
  enabled?: Maybe<Scalars['Boolean']>;
};

export type AwsEksLogging = {
  clusterLogging?: Maybe<Array<Maybe<AwsEksLogSetup>>>;
};

export type AwsEksOidc = {
  issuer?: Maybe<Scalars['String']>;
};

export type AwsEksProvider = {
  keyArn?: Maybe<Scalars['String']>;
};

export type AwsEksVpcConfigResponse = {
  subnetIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  clusterSecurityGroupId?: Maybe<Scalars['String']>;
  vpcId?: Maybe<Scalars['String']>;
  endpointPublicAccess?: Maybe<Scalars['Boolean']>;
  endpointPrivateAccess?: Maybe<Scalars['Boolean']>;
  publicAccessCidrs?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsElastiCacheCloudWatchLogsDestinationDetails = {
  logGroup?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheCluster = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  cacheClusterId?: Maybe<Scalars['String']>;
  configurationEndpoint?: Maybe<AwsElastiCacheEndpoint>;
  clientDownloadLandingPage?: Maybe<Scalars['String']>;
  cacheNodeType?: Maybe<Scalars['String']>;
  engine?: Maybe<Scalars['String']>;
  engineVersion?: Maybe<Scalars['String']>;
  cacheClusterStatus?: Maybe<Scalars['String']>;
  numCacheNodes?: Maybe<Scalars['Int']>;
  preferredAvailabilityZone?: Maybe<Scalars['String']>;
  preferredOutpostArn?: Maybe<Scalars['String']>;
  cacheClusterCreateTime?: Maybe<Scalars['String']>;
  preferredMaintenanceWindow?: Maybe<Scalars['String']>;
  pendingModifiedValues?: Maybe<AwsElastiCachePendingModifiedValues>;
  notificationConfiguration?: Maybe<AwsElastiCacheNotificationConfiguration>;
  cacheSecurityGroups?: Maybe<Array<Maybe<AwsElastiCacheSecurityGroupMembership>>>;
  cacheParameterGroup?: Maybe<AwsElastiCacheParameterGroupStatus>;
  cacheSubnetGroupName?: Maybe<Scalars['String']>;
  cacheNodes?: Maybe<Array<Maybe<AwsElastiCacheNode>>>;
  autoMinorVersionUpgrade?: Maybe<Scalars['Boolean']>;
  replicationGroupId?: Maybe<Scalars['String']>;
  snapshotRetentionLimit?: Maybe<Scalars['Int']>;
  snapshotWindow?: Maybe<Scalars['String']>;
  authTokenEnabled?: Maybe<Scalars['Boolean']>;
  authTokenLastModifiedDate?: Maybe<Scalars['String']>;
  transitEncryptionEnabled?: Maybe<Scalars['Boolean']>;
  atRestEncryptionEnabled?: Maybe<Scalars['Boolean']>;
  replicationGroupLogDeliveryEnabled?: Maybe<Scalars['Boolean']>;
  logDeliveryConfigurations?: Maybe<Array<Maybe<AwsElastiCacheLogDeliveryConfiguration>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
};

export type AwsElastiCacheDestinationDetails = {
  cloudWatchLogsDetails?: Maybe<AwsElastiCacheCloudWatchLogsDestinationDetails>;
  kinesisFirehoseDetails?: Maybe<AwsElastiCacheKinesisFirehoseDestinationDetails>;
};

export type AwsElastiCacheEndpoint = {
  address?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Int']>;
};

export type AwsElastiCacheGlobalReplicationGroupInfo = {
  globalReplicationGroupId?: Maybe<Scalars['String']>;
  globalReplicationGroupMemberRole?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheKinesisFirehoseDestinationDetails = {
  deliveryStream?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheLogDeliveryConfiguration = {
  id: Scalars['String'];
  logType?: Maybe<Scalars['String']>;
  destinationType?: Maybe<Scalars['String']>;
  destinationDetails?: Maybe<AwsElastiCacheDestinationDetails>;
  logFormat?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheNode = {
  id: Scalars['String'];
  cacheNodeId?: Maybe<Scalars['String']>;
  cacheNodeStatus?: Maybe<Scalars['String']>;
  cacheNodeCreateTime?: Maybe<Scalars['String']>;
  endpoint?: Maybe<AwsElastiCacheEndpoint>;
  parameterGroupStatus?: Maybe<Scalars['String']>;
  sourceCacheNodeId?: Maybe<Scalars['String']>;
  customerAvailabilityZone?: Maybe<Scalars['String']>;
  customerOutpostArn?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheNodeGroup = {
  id: Scalars['String'];
  nodeGroupId?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  primaryEndpoint?: Maybe<AwsElastiCacheEndpoint>;
  readerEndpoint?: Maybe<AwsElastiCacheEndpoint>;
  slots?: Maybe<Scalars['String']>;
  nodeGroupMembers?: Maybe<Array<Maybe<AwsElastiCacheNodeGroupMember>>>;
};

export type AwsElastiCacheNodeGroupMember = {
  id: Scalars['String'];
  cacheClusterId?: Maybe<Scalars['String']>;
  cacheNodeId?: Maybe<Scalars['String']>;
  readEndpoint?: Maybe<AwsElastiCacheEndpoint>;
  preferredAvailabilityZone?: Maybe<Scalars['String']>;
  preferredOutpostArn?: Maybe<Scalars['String']>;
  currentRole?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheNotificationConfiguration = {
  topicArn?: Maybe<Scalars['String']>;
  topicStatus?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheParameterGroupStatus = {
  cacheParameterGroupName?: Maybe<Scalars['String']>;
  parameterApplyStatus?: Maybe<Scalars['String']>;
  cacheNodeIdsToReboot?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsElastiCachePendingLogDeliveryConfiguration = {
  id: Scalars['String'];
  logType?: Maybe<Scalars['String']>;
  destinationType?: Maybe<Scalars['String']>;
  destinationDetails?: Maybe<AwsElastiCacheDestinationDetails>;
  logFormat?: Maybe<Scalars['String']>;
};

export type AwsElastiCachePendingModifiedValues = {
  numCacheNodes?: Maybe<Scalars['Int']>;
  cacheNodeIdsToRemove?: Maybe<Array<Maybe<Scalars['String']>>>;
  engineVersion?: Maybe<Scalars['String']>;
  cacheNodeType?: Maybe<Scalars['String']>;
  authTokenStatus?: Maybe<Scalars['String']>;
  logDeliveryConfigurations?: Maybe<Array<Maybe<AwsElastiCachePendingLogDeliveryConfiguration>>>;
};

export type AwsElastiCacheReplicationGroup = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  replicationGroupId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  globalReplicationGroupInfo?: Maybe<AwsElastiCacheGlobalReplicationGroupInfo>;
  status?: Maybe<Scalars['String']>;
  pendingModifiedValues?: Maybe<AwsElastiCacheReplicationGroupPendingModifiedValues>;
  memberClusters?: Maybe<Array<Maybe<Scalars['String']>>>;
  nodeGroups?: Maybe<Array<Maybe<AwsElastiCacheNodeGroup>>>;
  snapshottingClusterId?: Maybe<Scalars['String']>;
  automaticFailover?: Maybe<Scalars['String']>;
  multiAZ?: Maybe<Scalars['String']>;
  configurationEndpoint?: Maybe<AwsElastiCacheEndpoint>;
  snapshotRetentionLimit?: Maybe<Scalars['Int']>;
  snapshotWindow?: Maybe<Scalars['String']>;
  clusterEnabled?: Maybe<Scalars['Boolean']>;
  cacheNodeType?: Maybe<Scalars['String']>;
  authTokenEnabled?: Maybe<Scalars['Boolean']>;
  authTokenLastModifiedDate?: Maybe<Scalars['String']>;
  transitEncryptionEnabled?: Maybe<Scalars['Boolean']>;
  atRestEncryptionEnabled?: Maybe<Scalars['Boolean']>;
  memberClustersOutpostArns?: Maybe<Array<Maybe<Scalars['String']>>>;
  userGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  logDeliveryConfigurations?: Maybe<Array<Maybe<AwsElastiCacheLogDeliveryConfiguration>>>;
  replicationGroupCreateTime?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
};

export type AwsElastiCacheReplicationGroupPendingModifiedValues = {
  primaryClusterId?: Maybe<Scalars['String']>;
  automaticFailoverStatus?: Maybe<Scalars['String']>;
  resharding?: Maybe<AwsElastiCacheReshardingStatus>;
  authTokenStatus?: Maybe<Scalars['String']>;
  userGroups?: Maybe<AwsElastiCacheUserGroupsUpdateStatus>;
  logDeliveryConfigurations?: Maybe<Array<Maybe<AwsElastiCachePendingLogDeliveryConfiguration>>>;
};

export type AwsElastiCacheReshardingStatus = {
  slotMigration?: Maybe<AwsElastiCacheSlotMigration>;
};

export type AwsElastiCacheSecurityGroupMembership = {
  id: Scalars['String'];
  securityGroupId?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheSlotMigration = {
  progressPercentage?: Maybe<Scalars['Float']>;
};

export type AwsElastiCacheUserGroupsUpdateStatus = {
  userGroupIdsToAdd?: Maybe<Array<Maybe<Scalars['String']>>>;
  userGroupIdsToRemove?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsElasticBeanstalkApp = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  elasticBeanstalkEnv?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsElasticBeanstalkEnv = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  applicationName?: Maybe<Scalars['String']>;
  cname?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  endpointUrl?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  platformArn?: Maybe<Scalars['String']>;
  resources?: Maybe<Array<Maybe<AwsElasticBeanstalkEnvResource>>>;
  settings?: Maybe<Array<Maybe<AwsElasticBeanstalkEnvSetting>>>;
  solutionStackName?: Maybe<Scalars['String']>;
  tier?: Maybe<Scalars['String']>;
  versionLabel?: Maybe<Scalars['String']>;
  elasticBeanstalkApp?: Maybe<Array<Maybe<AwsElasticBeanstalkApp>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsElasticBeanstalkEnvResource = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsElasticBeanstalkEnvSetting = {
  id: Scalars['String'];
  optionName?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  namespace?: Maybe<Scalars['String']>;
};

export type AwsElb = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  dnsName?: Maybe<Scalars['String']>;
  hostedZone?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  scheme?: Maybe<Scalars['String']>;
  vpcId?: Maybe<Scalars['String']>;
  sourceSecurityGroup?: Maybe<AwsElbSourceSecurityGroup>;
  securityGroupsIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  subnets?: Maybe<Array<Maybe<Scalars['String']>>>;
  accessLogs?: Maybe<Scalars['String']>;
  crossZoneLoadBalancing?: Maybe<Scalars['String']>;
  idleTimeout?: Maybe<Scalars['String']>;
  instances?: Maybe<AwsElbInstances>;
  healthCheck?: Maybe<AwsElbHealthCheck>;
  listeners?: Maybe<Array<Maybe<AwsElbListener>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  cloudfrontDistribution?: Maybe<Array<Maybe<AwsCloudfront>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  route53Record?: Maybe<Array<Maybe<AwsRoute53Record>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
};

export type AwsElbHealthCheck = {
  target: Scalars['String'];
  interval?: Maybe<Scalars['String']>;
  timeout?: Maybe<Scalars['String']>;
  healthyThreshold?: Maybe<Scalars['Int']>;
  unhealthyThreshold?: Maybe<Scalars['Int']>;
};

export type AwsElbInstances = {
  id?: Maybe<Scalars['ID']>;
  connectionDraining?: Maybe<Scalars['String']>;
  connectionDrainingTimeout?: Maybe<Scalars['String']>;
};

export type AwsElbListener = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  loadBalancerPort?: Maybe<Scalars['Int']>;
  loadBalancerProtocol?: Maybe<Scalars['String']>;
  instancePort?: Maybe<Scalars['Int']>;
  instanceProtocol?: Maybe<Scalars['String']>;
};

export type AwsElbSourceSecurityGroup = {
  groupName: Scalars['String'];
  ownerAlias?: Maybe<Scalars['String']>;
};

export type AwsEmrCluster = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  region: Scalars['String'];
  status?: Maybe<AwsEmrClusterStatus>;
  ec2InstanceAttributes?: Maybe<AwsEmrClusterEc2InstanceAttributes>;
  instanceCollectionType?: Maybe<Scalars['String']>;
  logUri?: Maybe<Scalars['String']>;
  logEncryptionKmsKeyId?: Maybe<Scalars['String']>;
  requestedAmiVersion?: Maybe<Scalars['String']>;
  runningAmiVersion?: Maybe<Scalars['String']>;
  releaseLabel?: Maybe<Scalars['String']>;
  autoTerminate?: Maybe<Scalars['Boolean']>;
  terminationProtected?: Maybe<Scalars['Boolean']>;
  visibleToAllUsers?: Maybe<Scalars['Boolean']>;
  applications?: Maybe<Array<Maybe<AwsEmrClusterApplication>>>;
  serviceRole?: Maybe<Scalars['String']>;
  normalizedInstanceHours?: Maybe<Scalars['Int']>;
  masterPublicDnsName?: Maybe<Scalars['String']>;
  configurations?: Maybe<Array<Maybe<AwsEmrClusterConfiguration>>>;
  securityConfiguration?: Maybe<Scalars['String']>;
  autoScalingRole?: Maybe<Scalars['String']>;
  scaleDownBehavior?: Maybe<Scalars['String']>;
  customAmiId?: Maybe<Scalars['String']>;
  ebsRootVolumeSize?: Maybe<Scalars['Int']>;
  repoUpgradeOnBoot?: Maybe<Scalars['String']>;
  kerberosAttributes?: Maybe<AwsEmrClusterKerberosAttributes>;
  outpostArn?: Maybe<Scalars['String']>;
  stepConcurrencyLevel?: Maybe<Scalars['Int']>;
  placementGroups?: Maybe<Array<Maybe<AwsEmrClusterPlacementGroupConfig>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
};

export type AwsEmrFailureDetails = {
  reason?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  logFile?: Maybe<Scalars['String']>;
};

export type AwsEmrHadoopStepConfig = {
  jar?: Maybe<Scalars['String']>;
  properties?: Maybe<Array<Maybe<AwsStringMap>>>;
  mainClass?: Maybe<Scalars['String']>;
  args?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsEmrInstance = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  region: Scalars['String'];
  ec2InstanceId?: Maybe<Scalars['String']>;
  publicDnsName?: Maybe<Scalars['String']>;
  publicIpAddress?: Maybe<Scalars['String']>;
  privateDnsName?: Maybe<Scalars['String']>;
  privateIpAddress?: Maybe<Scalars['String']>;
  status?: Maybe<AwsEmrInstanceStatus>;
  instanceGroupId?: Maybe<Scalars['String']>;
  instanceFleetId?: Maybe<Scalars['String']>;
  market?: Maybe<Scalars['String']>;
  instanceType?: Maybe<Scalars['String']>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
};

export type AwsEmrInstanceStateChangeReason = {
  code?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type AwsEmrInstanceStatus = {
  state?: Maybe<Scalars['String']>;
  stateChangeReason?: Maybe<AwsEmrInstanceStateChangeReason>;
  timeline?: Maybe<AwsEmrInstanceTimeline>;
};

export type AwsEmrInstanceTimeline = {
  creationDateTime?: Maybe<Scalars['String']>;
  readyDateTime?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
};

export type AwsEmrStep = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  region: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  config?: Maybe<AwsEmrHadoopStepConfig>;
  actionOnFailure?: Maybe<Scalars['String']>;
  status?: Maybe<AwsEmrStepStatus>;
};

export type AwsEmrStepStateChangeReason = {
  code?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type AwsEmrStepStatus = {
  state?: Maybe<Scalars['String']>;
  stateChangeReason?: Maybe<AwsEmrStepStateChangeReason>;
  failureDetails?: Maybe<AwsEmrFailureDetails>;
  timeline?: Maybe<AwsEmrStepTimeline>;
};

export type AwsEmrStepTimeline = {
  creationDateTime?: Maybe<Scalars['String']>;
  startDateTime?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
};

export type AwsEnabledMetrics = {
  id: Scalars['String'];
  metric: Scalars['String'];
  granularity?: Maybe<Scalars['String']>;
};

export type AwsFederatedAuthentication = {
  samlProviderArn?: Maybe<Scalars['String']>;
  selfServiceSamlProviderArn?: Maybe<Scalars['String']>;
};

export type AwsFlowLog = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  region: Scalars['String'];
  creationTime?: Maybe<Scalars['String']>;
  deliverLogsErrorMessage?: Maybe<Scalars['String']>;
  deliverLogsPermissionArn?: Maybe<Scalars['String']>;
  deliverLogsStatus?: Maybe<Scalars['String']>;
  logStatus?: Maybe<Scalars['String']>;
  groupName?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  trafficType?: Maybe<Scalars['String']>;
  destinationType?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  format?: Maybe<Scalars['String']>;
  maxAggregationInterval?: Maybe<Scalars['Int']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
};

export type AwsIamAccessKey = {
  accessKeyId: Scalars['String'];
  lastUsedDate?: Maybe<Scalars['String']>;
  lastUsedRegion?: Maybe<Scalars['String']>;
  lastUsedService?: Maybe<Scalars['String']>;
  createDate?: Maybe<Scalars['String']>;
  lastRotated?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsIamGroup = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  path?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  inlinePolicies?: Maybe<Array<Maybe<Scalars['String']>>>;
  iamAttachedPolicies?: Maybe<Array<Maybe<AwsIamPolicy>>>;
  iamUsers?: Maybe<Array<Maybe<AwsIamUser>>>;
};

export type AwsIamJsonPolicy = {
  id: Scalars['String'];
  version?: Maybe<Scalars['String']>;
  statement?: Maybe<Array<Maybe<AwsIamJsonPolicyStatement>>>;
};

export type AwsIamJsonPolicyCondition = {
  id?: Maybe<Scalars['ID']>;
  operator?: Maybe<Scalars['String']>;
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsIamJsonPolicyStatement = {
  id?: Maybe<Scalars['ID']>;
  action?: Maybe<Array<Maybe<Scalars['String']>>>;
  condition?: Maybe<Array<Maybe<AwsIamJsonPolicyCondition>>>;
  effect?: Maybe<Scalars['String']>;
  principle?: Maybe<Scalars['String']>;
  resource?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsIamMfaDevice = {
  serialNumber: Scalars['String'];
  enableDate?: Maybe<Scalars['String']>;
};

export type AwsIamOpenIdConnectProvider = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
};

export type AwsIamPasswordPolicy = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  minimumPasswordLength?: Maybe<Scalars['Int']>;
  maxPasswordAge?: Maybe<Scalars['Int']>;
  passwordReusePrevention?: Maybe<Scalars['Int']>;
  requireSymbols?: Maybe<Scalars['Boolean']>;
  requireNumbers?: Maybe<Scalars['Boolean']>;
  requireUppercaseCharacters?: Maybe<Scalars['Boolean']>;
  requireLowercaseCharacters?: Maybe<Scalars['Boolean']>;
  allowUsersToChangePassword?: Maybe<Scalars['Boolean']>;
  expirePasswords?: Maybe<Scalars['Boolean']>;
  hardExpiry?: Maybe<Scalars['Boolean']>;
};

export type AwsIamPolicy = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  policyContent?: Maybe<AwsIamJsonPolicy>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  iamGroups?: Maybe<Array<Maybe<AwsIamGroup>>>;
  iamUsers?: Maybe<Array<Maybe<AwsIamUser>>>;
};

export type AwsIamRole = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  assumeRolePolicy?: Maybe<AwsIamJsonPolicy>;
  description?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  maxSessionDuration?: Maybe<Scalars['Int']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  inlinePolicies?: Maybe<Array<Maybe<Scalars['String']>>>;
  iamAttachedPolicies?: Maybe<Array<Maybe<AwsIamPolicy>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  flowLogs?: Maybe<Array<Maybe<AwsFlowLog>>>;
};

export type AwsIamSamlProvider = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  validUntil?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['String']>;
};

export type AwsIamServerCertificate = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId?: Maybe<Scalars['String']>;
  certificateId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  uploadDate?: Maybe<Scalars['String']>;
  expiration?: Maybe<Scalars['String']>;
};

export type AwsIamUser = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  path?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['String']>;
  passwordLastUsed?: Maybe<Scalars['String']>;
  passwordLastChanged?: Maybe<Scalars['String']>;
  passwordNextRotation?: Maybe<Scalars['String']>;
  passwordEnabled?: Maybe<Scalars['Boolean']>;
  mfaActive?: Maybe<Scalars['Boolean']>;
  accessKeysActive?: Maybe<Scalars['Boolean']>;
  accessKeyData?: Maybe<Array<Maybe<AwsIamAccessKey>>>;
  mfaDevices?: Maybe<Array<Maybe<AwsIamMfaDevice>>>;
  groups?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  inlinePolicies?: Maybe<Array<Maybe<Scalars['String']>>>;
  iamAttachedPolicies?: Maybe<Array<Maybe<AwsIamPolicy>>>;
  iamGroups?: Maybe<Array<Maybe<AwsIamGroup>>>;
};

export type AwsIgw = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  attachments?: Maybe<Array<Maybe<AwsIgwAttachment>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsIgwAttachment = {
  state?: Maybe<Scalars['String']>;
  vpcId: Scalars['String'];
};

export type AwsIotAttribute = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsIotThingAttribute = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  thingName?: Maybe<Scalars['String']>;
  thingTypeName?: Maybe<Scalars['String']>;
  attributes?: Maybe<Array<Maybe<AwsIotAttribute>>>;
  version?: Maybe<Scalars['Int']>;
};

export type AwsKinesisFirehose = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  deliveryStreamStatus: Scalars['String'];
  failureDescriptionType: Scalars['String'];
  failureDescriptionDetails: Scalars['String'];
  encryptionConfig?: Maybe<AwsKinesisFirehoseEncryptionConfig>;
  deliveryStreamType: Scalars['String'];
  versionId: Scalars['String'];
  createTimestamp?: Maybe<Scalars['String']>;
  lastUpdateTimestamp?: Maybe<Scalars['String']>;
  source?: Maybe<AwsKinesisFirehoseSource>;
  kinesisStream?: Maybe<Array<Maybe<AwsKinesisStream>>>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsKinesisFirehoseEncryptionConfig = {
  keyARN?: Maybe<Scalars['String']>;
  keyType?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  failureDescriptionType?: Maybe<Scalars['String']>;
  failureDescriptionDetails?: Maybe<Scalars['String']>;
};

export type AwsKinesisFirehoseSource = {
  kinesisStreamARN?: Maybe<Scalars['String']>;
  roleARN?: Maybe<Scalars['String']>;
  deliveryStartTimestamp?: Maybe<Scalars['String']>;
};

export type AwsKinesisStream = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region: Scalars['String'];
  streamName: Scalars['String'];
  streamStatus: Scalars['String'];
  shards: Array<Maybe<AwsShards>>;
  retentionPeriodHours: Scalars['Int'];
  enhancedMonitoring: Array<AwsShardLevelMetrics>;
  encryptionType?: Maybe<Scalars['String']>;
  keyId?: Maybe<Scalars['String']>;
  kinesisFirehose?: Maybe<Array<Maybe<AwsKinesisFirehose>>>;
};

export type AwsKms = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  keyRotationEnabled?: Maybe<Scalars['String']>;
  usage?: Maybe<Scalars['String']>;
  policy?: Maybe<AwsIamJsonPolicy>;
  enabled?: Maybe<Scalars['String']>;
  keyState?: Maybe<Scalars['String']>;
  customerMasterKeySpec?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  creationDate?: Maybe<Scalars['String']>;
  keyManager?: Maybe<Scalars['String']>;
  origin?: Maybe<Scalars['String']>;
  deletionDate?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  cloudtrail?: Maybe<Array<Maybe<AwsCloudtrail>>>;
  redshiftCluster?: Maybe<Array<Maybe<AwsRedshiftCluster>>>;
  sns?: Maybe<Array<Maybe<AwsSns>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  elastiCacheReplicationGroup?: Maybe<Array<Maybe<AwsElastiCacheReplicationGroup>>>;
  efs?: Maybe<Array<Maybe<AwsEfs>>>;
  emrCluster?: Maybe<Array<Maybe<AwsEmrCluster>>>;
  cloudwatchLog?: Maybe<Array<Maybe<AwsCloudwatchLog>>>;
};

export type AwsLambda = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  handler?: Maybe<Scalars['String']>;
  kmsKeyArn?: Maybe<Scalars['String']>;
  lastModified?: Maybe<Scalars['String']>;
  memorySize?: Maybe<Scalars['Int']>;
  reservedConcurrentExecutions?: Maybe<Scalars['Int']>;
  role?: Maybe<Scalars['String']>;
  runtime?: Maybe<Scalars['String']>;
  sourceCodeSize?: Maybe<Scalars['String']>;
  timeout?: Maybe<Scalars['Int']>;
  tracingConfig?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  environmentVariables?: Maybe<Array<Maybe<AwsLambdaEnvironmentVariable>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  cognitoUserPool?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
};

export type AwsLambdaEnvironmentVariable = {
  id: Scalars['String'];
  key: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type AwsLaunchConfiguration = {
  launchConfigurationName?: Maybe<Scalars['String']>;
  launchConfigurationARN?: Maybe<Scalars['String']>;
  imageId?: Maybe<Scalars['String']>;
  keyName?: Maybe<Scalars['String']>;
  securityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  classicLinkVPCId?: Maybe<Scalars['String']>;
  classicLinkVPCSecurityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  userData?: Maybe<Scalars['String']>;
  instanceType?: Maybe<Scalars['String']>;
  kernelId?: Maybe<Scalars['String']>;
  ramdiskId?: Maybe<Scalars['String']>;
  blockDeviceMappings?: Maybe<Array<Maybe<AwsLcBlockDeviceMapping>>>;
  instanceMonitoring?: Maybe<Scalars['String']>;
  spotPrice?: Maybe<Scalars['String']>;
  iamInstanceProfile?: Maybe<Scalars['String']>;
  ebsOptimized?: Maybe<Scalars['String']>;
  associatePublicIpAddress?: Maybe<Scalars['String']>;
  placementTenancy?: Maybe<Scalars['String']>;
  metadataOptHttpTokens?: Maybe<Scalars['String']>;
  metadataOptHttpPutResponseHopLimit?: Maybe<Scalars['Int']>;
  metadataOptHttpEndpoint?: Maybe<Scalars['String']>;
};

export type AwsLaunchTemplateOverrides = {
  id: Scalars['String'];
  instanceType?: Maybe<Scalars['String']>;
  weightedCapacity?: Maybe<Scalars['String']>;
  launchTemplateId?: Maybe<Scalars['String']>;
  launchTemplateName?: Maybe<Scalars['String']>;
  launchTemplateVersion?: Maybe<Scalars['String']>;
};

export type AwsLcBlockDeviceMapping = {
  id: Scalars['String'];
  virtualName?: Maybe<Scalars['String']>;
  deviceName?: Maybe<Scalars['String']>;
  noDevice?: Maybe<Scalars['String']>;
};

export type AwsMetricFilter = {
  id: Scalars['String'];
  filterName?: Maybe<Scalars['String']>;
  filterPattern?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['String']>;
  logGroupName?: Maybe<Scalars['String']>;
  metricTransformations?: Maybe<Array<Maybe<AwsMetricTransformation>>>;
};

export type AwsMetricTransformation = {
  id: Scalars['String'];
  metricName?: Maybe<Scalars['String']>;
  metricNamespace?: Maybe<Scalars['String']>;
  metricValue?: Maybe<Scalars['String']>;
  defaultValue?: Maybe<Scalars['Int']>;
  unit?: Maybe<Scalars['String']>;
};

export type AwsMixedInstancesPolicy = {
  launchTemplateId?: Maybe<Scalars['String']>;
  launchTemplateName?: Maybe<Scalars['String']>;
  launchTemplateVersion?: Maybe<Scalars['String']>;
  launchTemplateOverrides?: Maybe<Array<Maybe<AwsLaunchTemplateOverrides>>>;
  instDistrOnDemandAllocationStrategy?: Maybe<Scalars['String']>;
  instDistrOnDemandBaseCapacity?: Maybe<Scalars['Int']>;
  instDistrOnDemandPercentageAboveBaseCapacity?: Maybe<Scalars['Int']>;
  instDistrSpotAllocationStrategy?: Maybe<Scalars['String']>;
  instDistrSpotInstancePools?: Maybe<Scalars['Int']>;
  instDistrSpotMaxPrice?: Maybe<Scalars['String']>;
};

export type AwsNatGateway = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  createTime?: Maybe<Scalars['String']>;
  dailyCost?: Maybe<AwsTotalBillingInfo>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsNetworkAcl = {
  id: Scalars['String'];
  arn: Scalars['String'];
  accountId: Scalars['String'];
  region: Scalars['String'];
  default?: Maybe<Scalars['Boolean']>;
  inboundRules?: Maybe<Array<Maybe<AwsNetworkAclRule>>>;
  outboundRules?: Maybe<Array<Maybe<AwsNetworkAclRule>>>;
  associatedSubnets?: Maybe<Array<Maybe<AwsNetworkAclAssociatedSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcId: Scalars['String'];
};

export type AwsNetworkAclAssociatedSubnet = {
  id: Scalars['String'];
  networkAclAssociationId?: Maybe<Scalars['String']>;
  subnetId?: Maybe<Scalars['String']>;
};

export type AwsNetworkAclRule = {
  id: Scalars['String'];
  ruleNumber?: Maybe<Scalars['Int']>;
  protocol?: Maybe<Scalars['String']>;
  portRange?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  allowOrDeny?: Maybe<Scalars['String']>;
};

export type AwsNetworkInterface = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  subnetId?: Maybe<Scalars['String']>;
  macAddress?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  availabilityZone?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  vpcId?: Maybe<Scalars['String']>;
  interfaceType?: Maybe<Scalars['String']>;
  securityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  privateDnsName?: Maybe<Scalars['String']>;
  privateIps?: Maybe<Array<Maybe<Scalars['String']>>>;
  attachment?: Maybe<AwsNetworkInterfaceAttachment>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
  natGateway?: Maybe<Array<Maybe<AwsNatGateway>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  efsMountTarget?: Maybe<Array<Maybe<AwsEfsMountTarget>>>;
  flowLogs?: Maybe<Array<Maybe<AwsFlowLog>>>;
};

export type AwsNetworkInterfaceAttachment = {
  id?: Maybe<Scalars['ID']>;
  attachmentId?: Maybe<Scalars['String']>;
  deleteOnTermination?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsOrganization = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  masterAccountArn?: Maybe<Scalars['String']>;
  masterAccountId?: Maybe<Scalars['String']>;
  masterAccountEmail?: Maybe<Scalars['String']>;
  featureSet?: Maybe<Scalars['String']>;
  availablePolicyTypes?: Maybe<Array<Maybe<AwsPolicyTypes>>>;
};

export type AwsPolicyTypes = {
  id: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsRawTag = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsRdsCluster = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  allocatedStorage?: Maybe<Scalars['Int']>;
  backupRetentionPeriod?: Maybe<Scalars['Int']>;
  characterSetName?: Maybe<Scalars['String']>;
  databaseName?: Maybe<Scalars['String']>;
  dbClusterIdentifier?: Maybe<Scalars['String']>;
  subnets?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  percentProgress?: Maybe<Scalars['String']>;
  readerEndpoint?: Maybe<Scalars['String']>;
  multiAZ?: Maybe<Scalars['Boolean']>;
  engine?: Maybe<Scalars['String']>;
  engineVersion?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
  replicationSourceIdentifier?: Maybe<Scalars['String']>;
  hostedZoneId?: Maybe<Scalars['String']>;
  encrypted?: Maybe<Scalars['Boolean']>;
  kmsKey?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  iamDbAuthenticationEnabled?: Maybe<Scalars['Boolean']>;
  cloneGroupId?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  capacity?: Maybe<Scalars['Int']>;
  engineMode?: Maybe<Scalars['String']>;
  deletionProtection?: Maybe<Scalars['Boolean']>;
  httpEndpointEnabled?: Maybe<Scalars['Boolean']>;
  copyTagsToSnapshot?: Maybe<Scalars['Boolean']>;
  crossAccountClone?: Maybe<Scalars['Boolean']>;
  globalWriteForwardingRequested?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  instances?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
};

export type AwsRdsDbInstance = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Int']>;
  address?: Maybe<Scalars['String']>;
  hostedZoneId?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  engine?: Maybe<Scalars['String']>;
  engineVersion?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  copyTagsToSnapshot?: Maybe<Scalars['Boolean']>;
  deletionProtection?: Maybe<Scalars['Boolean']>;
  dBInstanceIdentifier?: Maybe<Scalars['String']>;
  performanceInsightsEnabled?: Maybe<Scalars['Boolean']>;
  autoMinorVersionUpgrade?: Maybe<Scalars['Boolean']>;
  iamDbAuthenticationEnabled?: Maybe<Scalars['Boolean']>;
  optionsGroups?: Maybe<Scalars['String']>;
  parameterGroup?: Maybe<Scalars['String']>;
  storageType?: Maybe<Scalars['String']>;
  instanceClass?: Maybe<Scalars['String']>;
  allocatedStorage?: Maybe<Scalars['Int']>;
  multiAZ?: Maybe<Scalars['Boolean']>;
  subnetGroup?: Maybe<Scalars['String']>;
  availabilityZone?: Maybe<Scalars['String']>;
  publiclyAccessible?: Maybe<Scalars['Boolean']>;
  certificateAuthority?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  failoverPriority?: Maybe<Scalars['Int']>;
  kmsKey?: Maybe<Scalars['String']>;
  encrypted?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  cluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsRedshiftCluster = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region: Scalars['String'];
  allowVersionUpgrade?: Maybe<Scalars['Boolean']>;
  automatedSnapshotRetentionPeriod?: Maybe<Scalars['Int']>;
  availabilityZone?: Maybe<Scalars['String']>;
  clusterAvailabilityStatus?: Maybe<Scalars['String']>;
  clusterCreateTime?: Maybe<Scalars['String']>;
  clusterRevisionNumber?: Maybe<Scalars['String']>;
  clusterStatus?: Maybe<Scalars['String']>;
  clusterSubnetGroupName?: Maybe<Scalars['String']>;
  clusterVersion?: Maybe<Scalars['String']>;
  dBName?: Maybe<Scalars['String']>;
  encrypted?: Maybe<Scalars['Boolean']>;
  enhancedVpcRouting?: Maybe<Scalars['Boolean']>;
  manualSnapshotRetentionPeriod?: Maybe<Scalars['Int']>;
  masterUsername?: Maybe<Scalars['String']>;
  modifyStatus?: Maybe<Scalars['String']>;
  nodeType?: Maybe<Scalars['String']>;
  numberOfNodes?: Maybe<Scalars['Int']>;
  preferredMaintenanceWindow?: Maybe<Scalars['String']>;
  publiclyAccessible?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsRollbackConfigurationRollbackTrigger = {
  id: Scalars['String'];
  arn?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsRoute = {
  id?: Maybe<Scalars['ID']>;
  target: Scalars['String'];
  destination?: Maybe<Scalars['String']>;
};

export type AwsRoute53Alias = {
  zoneId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  evaluateTargetHealth?: Maybe<Scalars['Boolean']>;
};

export type AwsRoute53HostedZone = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  delegationSetId?: Maybe<Scalars['String']>;
  nameServers?: Maybe<Array<Maybe<Scalars['String']>>>;
  route53Record?: Maybe<Array<Maybe<AwsRoute53Record>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsRoute53Record = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  zoneId?: Maybe<Scalars['String']>;
  alias?: Maybe<AwsRoute53Alias>;
  type?: Maybe<Scalars['String']>;
  ttl?: Maybe<Scalars['Int']>;
  records?: Maybe<Array<Maybe<Scalars['String']>>>;
  route53HostedZone?: Maybe<Array<Maybe<AwsRoute53HostedZone>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  restApi?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
};

export type AwsRouteTable = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  vpcId?: Maybe<Scalars['String']>;
  routes?: Maybe<Array<Maybe<AwsRoute>>>;
  mainRouteTable?: Maybe<Scalars['Boolean']>;
  explicitlyAssociatedWithSubnets?: Maybe<Scalars['Int']>;
  subnetAssociations?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  transitGateway?: Maybe<Array<Maybe<AwsTransitGateway>>>;
  transitGatewayAttachment?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
};

export type AwsS3 = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  access?: Maybe<Scalars['String']>;
  bucketOwnerName?: Maybe<Scalars['String']>;
  requesterPays?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
  totalNumberOfObjectsInBucket?: Maybe<Scalars['String']>;
  transferAcceleration?: Maybe<Scalars['String']>;
  corsConfiguration?: Maybe<Scalars['String']>;
  encrypted?: Maybe<Scalars['String']>;
  lifecycle?: Maybe<Scalars['String']>;
  logging?: Maybe<Scalars['String']>;
  blockPublicAcls?: Maybe<Scalars['String']>;
  ignorePublicAcls?: Maybe<Scalars['String']>;
  blockPublicPolicy?: Maybe<Scalars['String']>;
  restrictPublicBuckets?: Maybe<Scalars['String']>;
  crossRegionReplication?: Maybe<Scalars['String']>;
  mfa?: Maybe<Scalars['String']>;
  versioning?: Maybe<Scalars['String']>;
  staticWebsiteHosting?: Maybe<Scalars['String']>;
  bucketPolicies?: Maybe<Array<Maybe<AwsBucketPolicy>>>;
  kinesisFirehose?: Maybe<Array<Maybe<AwsKinesisFirehose>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  cloudfrontDistribution?: Maybe<Array<Maybe<AwsCloudfront>>>;
  cloudtrail?: Maybe<Array<Maybe<AwsCloudtrail>>>;
};

export type AwsSecretsManager = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  kmsKeyId?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  rotationEnabled?: Maybe<Scalars['Boolean']>;
  rotationLambdaARN?: Maybe<Scalars['String']>;
  rotationRules?: Maybe<AwsSecretsManagerRotationRule>;
  lastRotatedDate?: Maybe<Scalars['String']>;
  lastChangedDate?: Maybe<Scalars['String']>;
  lastAccessedDate?: Maybe<Scalars['String']>;
  deletedDate?: Maybe<Scalars['String']>;
  owningService?: Maybe<Scalars['String']>;
};

export type AwsSecretsManagerRotationRule = {
  id?: Maybe<Scalars['ID']>;
  automaticallyAfterDays?: Maybe<Scalars['Int']>;
};

export type AwsSecurityGroup = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  vpcId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  owner?: Maybe<Scalars['String']>;
  default?: Maybe<Scalars['Boolean']>;
  inboundRules?: Maybe<Array<Maybe<AwsSgInboundRule>>>;
  outboundRules?: Maybe<Array<Maybe<AwsSgOutboundRule>>>;
  inboundRuleCount?: Maybe<Scalars['Int']>;
  outboundRuleCount?: Maybe<Scalars['Int']>;
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  rdsCluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  elastiCacheCluster?: Maybe<Array<Maybe<AwsElastiCacheCluster>>>;
  clientVpnEndpoint?: Maybe<Array<Maybe<AwsClientVpnEndpoint>>>;
};

export type AwsServiceBillingInfo = {
  name: Scalars['String'];
  cost?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
  formattedCost?: Maybe<Scalars['String']>;
};

export type AwsSes = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  verificationStatus?: Maybe<Scalars['String']>;
};

export type AwsSgInboundRule = {
  id: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  portRange?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  groupName?: Maybe<Scalars['String']>;
  peeringStatus?: Maybe<Scalars['String']>;
};

export type AwsSgOutboundRule = {
  id: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  portRange?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
  groupName?: Maybe<Scalars['String']>;
  peeringStatus?: Maybe<Scalars['String']>;
};

export type AwsShardLevelMetrics = {
  shardLevelMetrics?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsShards = {
  shardId: Scalars['String'];
  parentShardId?: Maybe<Scalars['String']>;
  adjacentParentShardId?: Maybe<Scalars['String']>;
  hashKeyRangeStarting: Scalars['String'];
  hashKeyRangeEnding: Scalars['String'];
  sequenceNumberRangeStaring: Scalars['String'];
  sequenceNumberRangeEnding?: Maybe<Scalars['String']>;
};

export type AwsSns = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region: Scalars['String'];
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  policy?: Maybe<AwsIamJsonPolicy>;
  displayName?: Maybe<Scalars['String']>;
  deliveryPolicy?: Maybe<Scalars['String']>;
  subscriptions?: Maybe<Array<Maybe<AwsSnsSubscription>>>;
  cloudtrail?: Maybe<Array<Maybe<AwsCloudtrail>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
};

export type AwsSnsSubscription = {
  id: Scalars['String'];
  arn?: Maybe<Scalars['String']>;
  endpoint?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
};

export type AwsSqs = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  queueUrl: Scalars['String'];
  queueType: Scalars['String'];
  approximateNumberOfMessages?: Maybe<Scalars['Int']>;
  approximateNumberOfMessagesNotVisible?: Maybe<Scalars['Int']>;
  approximateNumberOfMessagesDelayed?: Maybe<Scalars['Int']>;
  visibilityTimeout?: Maybe<Scalars['String']>;
  maximumMessageSize?: Maybe<Scalars['Int']>;
  messageRetentionPeriod?: Maybe<Scalars['String']>;
  delaySeconds?: Maybe<Scalars['String']>;
  policy?: Maybe<AwsIamJsonPolicy>;
  receiveMessageWaitTimeSeconds?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsSubnet = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  autoAssignPublicIpv4Address?: Maybe<Scalars['String']>;
  autoAssignPublicIpv6Address?: Maybe<Scalars['String']>;
  availabilityZone?: Maybe<Scalars['String']>;
  availableIpV4Addresses?: Maybe<Scalars['Int']>;
  defaultForAz?: Maybe<Scalars['Boolean']>;
  ipV4Cidr?: Maybe<Scalars['String']>;
  ipV6Cidr?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  natGateway?: Maybe<Array<Maybe<AwsNatGateway>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  routeTable?: Maybe<Array<Maybe<AwsRouteTable>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  efsMountTarget?: Maybe<Array<Maybe<AwsEfsMountTarget>>>;
  flowLogs?: Maybe<Array<Maybe<AwsFlowLog>>>;
  emrCluster?: Maybe<Array<Maybe<AwsEmrCluster>>>;
};

export type AwsSupportedLoginProvider = {
  identityProviderId: Scalars['String'];
  identityProvider?: Maybe<Scalars['String']>;
};

export type AwsSuspendedProcess = {
  id: Scalars['String'];
  processName: Scalars['String'];
  suspensionReason?: Maybe<Scalars['String']>;
};

export type AwsTag = {
  id: Scalars['String'];
  key: Scalars['String'];
  value: Scalars['String'];
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  cloudwatch?: Maybe<Array<Maybe<AwsCloudwatch>>>;
  cloudfront?: Maybe<Array<Maybe<AwsCloudfront>>>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  igw?: Maybe<Array<Maybe<AwsIgw>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  natGateway?: Maybe<Array<Maybe<AwsNatGateway>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  sqs?: Maybe<Array<Maybe<AwsSqs>>>;
  routeTable?: Maybe<Array<Maybe<AwsRouteTable>>>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  cognitoIdentityPool?: Maybe<Array<Maybe<AwsCognitoIdentityPool>>>;
  cognitoUserPool?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  kinesisFirehose?: Maybe<Array<Maybe<AwsKinesisFirehose>>>;
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
  cloudtrail?: Maybe<Array<Maybe<AwsCloudtrail>>>;
  cloudFormationStack?: Maybe<Array<Maybe<AwsCloudFormationStack>>>;
  cloudFormationStackSet?: Maybe<Array<Maybe<AwsCloudFormationStackSet>>>;
  dynamodb?: Maybe<Array<Maybe<AwsDynamoDbTable>>>;
  nacl?: Maybe<Array<Maybe<AwsNetworkAcl>>>;
  ecr?: Maybe<Array<Maybe<AwsEcr>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  secretsManager?: Maybe<Array<Maybe<AwsSecretsManager>>>;
  iamUsers?: Maybe<Array<Maybe<AwsIamUser>>>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  iamPolicies?: Maybe<Array<Maybe<AwsIamPolicy>>>;
  rdsCluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  elasticBeanstalkApp?: Maybe<Array<Maybe<AwsElasticBeanstalkApp>>>;
  elasticBeanstalkEnv?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  sns?: Maybe<Array<Maybe<AwsSns>>>;
  redshiftClusters?: Maybe<Array<Maybe<AwsRedshiftCluster>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  ecsContainer?: Maybe<Array<Maybe<AwsEcsContainer>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  ecsTask?: Maybe<Array<Maybe<AwsEcsTask>>>;
  apiGatewayRestApi?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
  apiGatewayStage?: Maybe<Array<Maybe<AwsApiGatewayStage>>>;
  elastiCacheCluster?: Maybe<Array<Maybe<AwsElastiCacheCluster>>>;
  elastiCacheReplicationGroup?: Maybe<Array<Maybe<AwsElastiCacheReplicationGroup>>>;
  cloud9Environment?: Maybe<Array<Maybe<AwsCloud9Environment>>>;
  efs?: Maybe<Array<Maybe<AwsEfs>>>;
  flowLogs?: Maybe<Array<Maybe<AwsFlowLog>>>;
  emrCluster?: Maybe<Array<Maybe<AwsEmrCluster>>>;
  customerGateway?: Maybe<Array<Maybe<AwsCustomerGateway>>>;
  transitGateway?: Maybe<Array<Maybe<AwsTransitGateway>>>;
  transitGatewayAttachment?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
  vpnGateway?: Maybe<Array<Maybe<AwsVpnGateway>>>;
  clientVpnEndpoint?: Maybe<Array<Maybe<AwsClientVpnEndpoint>>>;
  vpnConnection?: Maybe<Array<Maybe<AwsVpnConnection>>>;
};

export type AwsTotalBillingInfo = {
  cost?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
  formattedCost?: Maybe<Scalars['String']>;
};

export type AwsTransitGateway = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  ownerId: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dnsSupport?: Maybe<Scalars['String']>;
  vpnEcmpSupport?: Maybe<Scalars['String']>;
  amazonSideAsn?: Maybe<Scalars['String']>;
  autoAcceptSharedAttachments?: Maybe<Scalars['String']>;
  defaultRouteTableAssociation?: Maybe<Scalars['String']>;
  defaultRouteTablePropagation?: Maybe<Scalars['String']>;
  associationDefaultRouteTableId?: Maybe<Scalars['String']>;
  propagationDefaultRouteTableId?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpnConnection?: Maybe<Array<Maybe<AwsVpnConnection>>>;
  routeTable?: Maybe<Array<Maybe<AwsRouteTable>>>;
  transitGatewayAttachment?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
};

export type AwsTransitGatewayAttachment = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  transitGatewayId?: Maybe<Scalars['String']>;
  transitGatewayOwnerId?: Maybe<Scalars['String']>;
  resourceOwnerId?: Maybe<Scalars['String']>;
  resourceType?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  transitGatewayRouteTableId?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  transitGateway?: Maybe<Array<Maybe<AwsTransitGateway>>>;
  routeTable?: Maybe<Array<Maybe<AwsRouteTable>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpnConnection?: Maybe<Array<Maybe<AwsVpnConnection>>>;
};

export type AwsTunelOptions = {
  id: Scalars['String'];
  outsideIpAddress?: Maybe<Scalars['String']>;
  tunnelInsideCidr?: Maybe<Scalars['String']>;
  preSharedKey?: Maybe<Scalars['String']>;
};

export type AwsVgwTelemetry = {
  id: Scalars['String'];
  acceptedRouteCount?: Maybe<Scalars['Int']>;
  lastStatusChange?: Maybe<Scalars['String']>;
  certificateArn?: Maybe<Scalars['String']>;
  outsideIpAddress?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  statusMessage?: Maybe<Scalars['String']>;
};

export type AwsVpc = {
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  defaultVpc?: Maybe<Scalars['Boolean']>;
  dhcpOptionsSet?: Maybe<Scalars['String']>;
  enableDnsHostnames?: Maybe<Scalars['Boolean']>;
  enableDnsSupport?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  instanceTenancy?: Maybe<Scalars['String']>;
  ipV4Cidr?: Maybe<Scalars['String']>;
  ipV6Cidr?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  igw?: Maybe<Array<Maybe<AwsIgw>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  nacl?: Maybe<Array<Maybe<AwsNetworkAcl>>>;
  natGateway?: Maybe<Array<Maybe<AwsNatGateway>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  redshiftCluster?: Maybe<Array<Maybe<AwsRedshiftCluster>>>;
  route53HostedZone?: Maybe<Array<Maybe<AwsRoute53HostedZone>>>;
  routeTable?: Maybe<Array<Maybe<AwsRouteTable>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  efsMountTarget?: Maybe<Array<Maybe<AwsEfsMountTarget>>>;
  flowLogs?: Maybe<Array<Maybe<AwsFlowLog>>>;
  vpnGateway?: Maybe<Array<Maybe<AwsVpnGateway>>>;
  transitGatewayAttachment?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
};

export type AwsVpnConnection = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  category?: Maybe<Scalars['String']>;
  customerGatewayId?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  vpnGatewayId?: Maybe<Scalars['String']>;
  transitGatewayId?: Maybe<Scalars['String']>;
  options?: Maybe<AwsVpnConnectionOptions>;
  routes?: Maybe<Array<Maybe<AwsVpnStaticRoute>>>;
  vgwTelemetry?: Maybe<Array<Maybe<AwsVgwTelemetry>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  transitGateway?: Maybe<Array<Maybe<AwsTransitGateway>>>;
  customerGateway?: Maybe<Array<Maybe<AwsCustomerGateway>>>;
  vpnGateway?: Maybe<Array<Maybe<AwsVpnGateway>>>;
  transitGatewayAttachment?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
};

export type AwsVpnConnectionOptions = {
  id: Scalars['String'];
  enableAcceleration?: Maybe<Scalars['Boolean']>;
  staticRoutesOnly?: Maybe<Scalars['Boolean']>;
  localIpv4NetworkCidr?: Maybe<Scalars['String']>;
  remoteIpv4NetworkCidr?: Maybe<Scalars['String']>;
  tunnelInsideIpVersion?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  tunnelOptions?: Maybe<Array<Maybe<AwsTunelOptions>>>;
};

export type AwsVpnGateway = {
  id: Scalars['String'];
  accountId: Scalars['String'];
  arn: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  amazonSideAsn?: Maybe<Scalars['Int']>;
  vpcIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpnConnection?: Maybe<Array<Maybe<AwsVpnConnection>>>;
};

export type AwsVpnStaticRoute = {
  id: Scalars['String'];
  destinationCidrBlock?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type BlockDeviceEbs = {
  attachTime: Scalars['String'];
  deleteOnTermination: Scalars['Boolean'];
  status: Scalars['String'];
  volumeId: Scalars['String'];
};
