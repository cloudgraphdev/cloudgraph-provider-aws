export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  DateTime: string;
  Int64: number;
};

export type AwsDmsReplicationInstancePendingModifiedValues = {
  allocatedStorage?: Maybe<Scalars['Int']>;
  engineVersion?: Maybe<Scalars['String']>;
  multiAZ?: Maybe<Scalars['Boolean']>;
  replicationInstanceClass?: Maybe<Scalars['String']>;
};

export type AwsDmsReplicationInstanceReplicationSubnetGroup = {
  replicationSubnetGroupDescription?: Maybe<Scalars['String']>;
  replicationSubnetGroupIdentifier?: Maybe<Scalars['String']>;
  subnetGroupStatus?: Maybe<Scalars['String']>;
  subnets?: Maybe<Array<Maybe<AwsDmsReplicationInstanceSubnets>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsDmsReplicationInstanceSubnetAvailabilityZone = {
  name?: Maybe<Scalars['String']>;
};

export type AwsDmsReplicationInstanceSubnets = {
  id: Scalars['String'];
  subnetAvailabilityZone?: Maybe<AwsDmsReplicationInstanceSubnetAvailabilityZone>;
  subnetIdentifier?: Maybe<Scalars['String']>;
  subnetStatus?: Maybe<Scalars['String']>;
};

export type AwsDmsReplicationInstanceVpcSecurityGroups = {
  id: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  vpcSecurityGroupId?: Maybe<Scalars['String']>;
};

export type AwsEcsExecuteCommandLogConfiguration = {
  cloudWatchEncryptionEnabled?: Maybe<Scalars['Boolean']>;
  cloudWatchLogGroupName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  s3BucketName?: Maybe<Scalars['String']>;
  s3EncryptionEnabled?: Maybe<Scalars['Boolean']>;
  s3KeyPrefix?: Maybe<Scalars['String']>;
};

export type AwsEmrClusterApplication = {
  additionalInfo?: Maybe<Array<Maybe<AwsStringMap>>>;
  args?: Maybe<Array<Maybe<Scalars['String']>>>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type AwsEmrClusterConfiguration = {
  classification?: Maybe<Scalars['String']>;
  configurations?: Maybe<Array<Maybe<AwsEmrClusterConfiguration>>>;
  id: Scalars['String'];
  properties?: Maybe<Array<Maybe<AwsStringMap>>>;
};

export type AwsEmrClusterEc2InstanceAttributes = {
  additionalMasterSecurityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  additionalSlaveSecurityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  ec2AvailabilityZone?: Maybe<Scalars['String']>;
  ec2KeyName?: Maybe<Scalars['String']>;
  ec2SubnetId?: Maybe<Scalars['String']>;
  emrManagedMasterSecurityGroup?: Maybe<Scalars['String']>;
  emrManagedSlaveSecurityGroup?: Maybe<Scalars['String']>;
  iamInstanceProfile?: Maybe<Scalars['String']>;
  requestedEc2AvailabilityZones?: Maybe<Array<Maybe<Scalars['String']>>>;
  requestedEc2SubnetIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  serviceAccessSecurityGroup?: Maybe<Scalars['String']>;
};

export type AwsEmrClusterKerberosAttributes = {
  adDomainJoinPassword?: Maybe<Scalars['String']>;
  adDomainJoinUser?: Maybe<Scalars['String']>;
  crossRealmTrustPrincipalPassword?: Maybe<Scalars['String']>;
  kdcAdminPassword?: Maybe<Scalars['String']>;
  realm?: Maybe<Scalars['String']>;
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
  endDateTime?: Maybe<Scalars['String']>;
  readyDateTime?: Maybe<Scalars['String']>;
};

export type AwsRdsClusterSnapshotTagList = {
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsStringMap = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsAccessLogSettings = {
  destinationArn?: Maybe<Scalars['String']>;
  format?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
};

export type AwsAccount = AwsOptionalService & {
  albs?: Maybe<Array<Maybe<AwsAlb>>>;
  apiGatewayDomainNames?: Maybe<Array<Maybe<AwsApiGatewayDomainName>>>;
  apiGatewayHttpApis?: Maybe<Array<Maybe<AwsApiGatewayHttpApi>>>;
  apiGatewayResources?: Maybe<Array<Maybe<AwsApiGatewayResource>>>;
  apiGatewayRestApis?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
  apiGatewayStages?: Maybe<Array<Maybe<AwsApiGatewayStage>>>;
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
  asgs?: Maybe<Array<Maybe<AwsAsg>>>;
  athenaDataCatalogs?: Maybe<Array<Maybe<AwsAthenaDataCatalog>>>;
  billing?: Maybe<Array<Maybe<AwsBilling>>>;
  clientVpnEndpoint?: Maybe<Array<Maybe<AwsClientVpnEndpoint>>>;
  cloud9Environments?: Maybe<Array<Maybe<AwsCloud9Environment>>>;
  cloudFormationStackSets?: Maybe<Array<Maybe<AwsCloudFormationStackSet>>>;
  cloudFormationStacks?: Maybe<Array<Maybe<AwsCloudFormationStack>>>;
  cloudfrontDistributions?: Maybe<Array<Maybe<AwsCloudfront>>>;
  cloudtrail?: Maybe<Array<Maybe<AwsCloudtrail>>>;
  cloudwatch?: Maybe<Array<Maybe<AwsCloudwatch>>>;
  cloudwatchLogs?: Maybe<Array<Maybe<AwsCloudwatchLog>>>;
  codebuilds?: Maybe<Array<Maybe<AwsCodebuild>>>;
  cognitoIdentityPool?: Maybe<Array<Maybe<AwsCognitoIdentityPool>>>;
  cognitoUserPool?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  configurationRecorders?: Maybe<Array<Maybe<AwsConfigurationRecorder>>>;
  customerGateway?: Maybe<Array<Maybe<AwsCustomerGateway>>>;
  dmsReplicationInstances?: Maybe<Array<Maybe<AwsDmsReplicationInstance>>>;
  dynamodb?: Maybe<Array<Maybe<AwsDynamoDbTable>>>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  ec2Instances?: Maybe<Array<Maybe<AwsEc2>>>;
  ecr?: Maybe<Array<Maybe<AwsEcr>>>;
  ecsClusters?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  ecsContainers?: Maybe<Array<Maybe<AwsEcsContainer>>>;
  ecsServices?: Maybe<Array<Maybe<AwsEcsService>>>;
  ecsTaskDefinitions?: Maybe<Array<Maybe<AwsEcsTaskDefinition>>>;
  ecsTaskSets?: Maybe<Array<Maybe<AwsEcsTaskSet>>>;
  ecsTasks?: Maybe<Array<Maybe<AwsEcsTask>>>;
  efs?: Maybe<Array<Maybe<AwsEfs>>>;
  efsMountTarget?: Maybe<Array<Maybe<AwsEfsMountTarget>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
  eksClusters?: Maybe<Array<Maybe<AwsEksCluster>>>;
  elastiCacheClusters?: Maybe<Array<Maybe<AwsElastiCacheCluster>>>;
  elastiCacheReplicationGroups?: Maybe<Array<Maybe<AwsElastiCacheReplicationGroup>>>;
  elasticBeanstalkApps?: Maybe<Array<Maybe<AwsElasticBeanstalkApp>>>;
  elasticBeanstalkEnvs?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  elasticSearchDomains?: Maybe<Array<Maybe<AwsElasticSearchDomain>>>;
  elbs?: Maybe<Array<Maybe<AwsElb>>>;
  emrClusters?: Maybe<Array<Maybe<AwsEmrCluster>>>;
  emrInstances?: Maybe<Array<Maybe<AwsEmrInstance>>>;
  emrSteps?: Maybe<Array<Maybe<AwsEmrStep>>>;
  flowLogs?: Maybe<Array<Maybe<AwsFlowLog>>>;
  glueJobs?: Maybe<Array<Maybe<AwsGlueJob>>>;
  glueRegistries?: Maybe<Array<Maybe<AwsGlueRegistry>>>;
  guardDutyDetectors?: Maybe<Array<Maybe<AwsGuardDutyDetector>>>;
  iamAccessAnalyzers?: Maybe<Array<Maybe<AwsIamAccessAnalyzer>>>;
  iamGroups?: Maybe<Array<Maybe<AwsIamGroup>>>;
  iamInstanceProfiles?: Maybe<Array<Maybe<AwsIamInstanceProfile>>>;
  iamOpenIdConnectProviders?: Maybe<Array<Maybe<AwsIamOpenIdConnectProvider>>>;
  iamPasswordPolicies?: Maybe<Array<Maybe<AwsIamPasswordPolicy>>>;
  iamPolicies?: Maybe<Array<Maybe<AwsIamPolicy>>>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  iamSamlProviders?: Maybe<Array<Maybe<AwsIamSamlProvider>>>;
  iamServerCertificates?: Maybe<Array<Maybe<AwsIamServerCertificate>>>;
  iamUsers?: Maybe<Array<Maybe<AwsIamUser>>>;
  igw?: Maybe<Array<Maybe<AwsIgw>>>;
  iot?: Maybe<Array<Maybe<AwsIotThingAttribute>>>;
  kinesisFirehose?: Maybe<Array<Maybe<AwsKinesisFirehose>>>;
  kinesisStreams?: Maybe<Array<Maybe<AwsKinesisStream>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  lambdaFunctions?: Maybe<Array<Maybe<AwsLambda>>>;
  managedAirflows?: Maybe<Array<Maybe<AwsManagedAirflow>>>;
  managedPrefixLists?: Maybe<Array<Maybe<AwsManagedPrefixList>>>;
  mskClusters?: Maybe<Array<Maybe<AwsMskCluster>>>;
  nacl?: Maybe<Array<Maybe<AwsNetworkAcl>>>;
  natGateway?: Maybe<Array<Maybe<AwsNatGateway>>>;
  networkInterfaces?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  organizations?: Maybe<Array<Maybe<AwsOrganization>>>;
  rdsClusterSnapshots?: Maybe<Array<Maybe<AwsRdsClusterSnapshot>>>;
  rdsClusters?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  rdsDbInstances?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  redshiftClusters?: Maybe<Array<Maybe<AwsRedshiftCluster>>>;
  regions?: Maybe<Array<Maybe<Scalars['String']>>>;
  route53HostedZones?: Maybe<Array<Maybe<AwsRoute53HostedZone>>>;
  route53Records?: Maybe<Array<Maybe<AwsRoute53Record>>>;
  routeTables?: Maybe<Array<Maybe<AwsRouteTable>>>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  sageMakerExperiments?: Maybe<Array<Maybe<AwsSageMakerExperiment>>>;
  sageMakerNotebookInstances?: Maybe<Array<Maybe<AwsSageMakerNotebookInstance>>>;
  sageMakerProjects?: Maybe<Array<Maybe<AwsSageMakerProject>>>;
  secretsManager?: Maybe<Array<Maybe<AwsSecretsManager>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  securityHub?: Maybe<Array<Maybe<AwsSecurityHub>>>;
  ses?: Maybe<Array<Maybe<AwsSes>>>;
  sns?: Maybe<Array<Maybe<AwsSns>>>;
  sqs?: Maybe<Array<Maybe<AwsSqs>>>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  systemsManagerDocuments?: Maybe<Array<Maybe<AwsSystemsManagerDocument>>>;
  systemsManagerInstances?: Maybe<Array<Maybe<AwsSystemsManagerInstance>>>;
  transitGatewayAttachments?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
  transitGatewayRouteTables?: Maybe<Array<Maybe<AwsTransitGatewayRouteTable>>>;
  transitGateways?: Maybe<Array<Maybe<AwsTransitGateway>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcEndpoints?: Maybe<Array<Maybe<AwsVpcEndpoint>>>;
  vpcPeeringConnections?: Maybe<Array<Maybe<AwsVpcPeeringConnection>>>;
  vpnConnections?: Maybe<Array<Maybe<AwsVpnConnection>>>;
  vpnGateway?: Maybe<Array<Maybe<AwsVpnGateway>>>;
  wafV2WebAcl?: Maybe<Array<Maybe<AwsWafV2WebAcl>>>;
};

export type AwsAccountRecoverySetting = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  priority?: Maybe<Scalars['Int']>;
};

export type AwsAcm = AwsBaseService & {
  createdAt?: Maybe<Scalars['DateTime']>;
  domainName?: Maybe<Scalars['String']>;
  exported?: Maybe<Scalars['Boolean']>;
  extendedKeyUsages?: Maybe<Array<Maybe<Scalars['String']>>>;
  hasAdditionalSubjectAlternativeNames?: Maybe<Scalars['Boolean']>;
  importedAt?: Maybe<Scalars['DateTime']>;
  inUse?: Maybe<Scalars['Boolean']>;
  issuedAt?: Maybe<Scalars['DateTime']>;
  keyAlgorithm?: Maybe<Scalars['String']>;
  keyUsages?: Maybe<Array<Maybe<Scalars['String']>>>;
  notAfter?: Maybe<Scalars['DateTime']>;
  notBefore?: Maybe<Scalars['DateTime']>;
  renewalEligibility?: Maybe<Scalars['String']>;
  revokedAt?: Maybe<Scalars['DateTime']>;
  status?: Maybe<Scalars['String']>;
  subjectAlternativeNameSummaries?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsAdditionalAuthenticationProvider = {
  authenticationType?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  openIDConnectAuthTTL?: Maybe<Scalars['Int']>;
  openIDConnectClientId?: Maybe<Scalars['String']>;
  openIDConnectIatTTL?: Maybe<Scalars['Int']>;
  openIDConnectIssuer?: Maybe<Scalars['String']>;
  userPoolAppIdClientRegex?: Maybe<Scalars['String']>;
  userPoolAwsRegion?: Maybe<Scalars['String']>;
  userPoolId?: Maybe<Scalars['String']>;
};

export type AwsAlb = AwsBaseService & {
  accessLogsEnabled?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  defaultVpc?: Maybe<Scalars['String']>;
  deletionProtection?: Maybe<Scalars['String']>;
  dnsName?: Maybe<Scalars['String']>;
  dropInvalidHeaderFields?: Maybe<Scalars['String']>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  elasticBeanstalkEnvs?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  hostedZone?: Maybe<Scalars['String']>;
  http2?: Maybe<Scalars['String']>;
  idleTimeout?: Maybe<Scalars['String']>;
  ipAddressType?: Maybe<Scalars['String']>;
  listeners?: Maybe<Array<Maybe<AwsAlbListener>>>;
  name?: Maybe<Scalars['String']>;
  route53Record?: Maybe<Array<Maybe<AwsRoute53Record>>>;
  scheme?: Maybe<Scalars['String']>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  status?: Maybe<Scalars['String']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  subnets?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  type?: Maybe<Scalars['String']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  webAcl?: Maybe<Array<Maybe<AwsWafV2WebAcl>>>;
};

export type AwsAlbListener = {
  arn: Scalars['String'];
  settings?: Maybe<AwsAlbListenerSettings>;
};

export type AwsAlbListenerRule = {
  order?: Maybe<Scalars['String']>;
  redirectProtocol?: Maybe<Scalars['String']>;
  targetGroupArn?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsAlbListenerSettings = {
  protocol?: Maybe<Scalars['String']>;
  rules?: Maybe<Array<Maybe<AwsAlbListenerRule>>>;
  sslPolicy?: Maybe<Scalars['String']>;
};

export type AwsApiGatewayCors = {
  allowCredentials?: Maybe<Scalars['Boolean']>;
  allowHeaders?: Maybe<Array<Maybe<Scalars['String']>>>;
  allowMethods?: Maybe<Array<Maybe<Scalars['String']>>>;
  allowOrigins?: Maybe<Array<Maybe<Scalars['String']>>>;
  exposeHeaders?: Maybe<Array<Maybe<Scalars['String']>>>;
  maxAge?: Maybe<Scalars['Int']>;
};

export type AwsApiGatewayDomainName = AwsBaseService & {
  apiMappingSelectionExpression?: Maybe<Scalars['String']>;
  configurations?: Maybe<Array<Maybe<AwsApiGatewayDomainNameConfiguration>>>;
  domainName?: Maybe<Scalars['String']>;
  httpApis?: Maybe<Array<Maybe<AwsApiGatewayHttpApi>>>;
  restApis?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsApiGatewayDomainNameConfiguration = {
  apiGatewayDomainName?: Maybe<Scalars['String']>;
  certificateArn?: Maybe<Scalars['String']>;
  certificateName?: Maybe<Scalars['String']>;
  certificateUploadDate?: Maybe<Scalars['DateTime']>;
  domainNameStatus?: Maybe<Scalars['String']>;
  domainNameStatusMessage?: Maybe<Scalars['String']>;
  endpointType?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  ownershipVerificationCertificateArn?: Maybe<Scalars['String']>;
  securityPolicy?: Maybe<Scalars['String']>;
};

export type AwsApiGatewayEndpointConfiguration = {
  id?: Maybe<Scalars['ID']>;
  types?: Maybe<Array<Maybe<Scalars['String']>>>;
  vpcEndpointIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsApiGatewayHttpApi = AwsBaseService & {
  apiEndpoint?: Maybe<Scalars['String']>;
  apiGatewayManaged?: Maybe<Scalars['Boolean']>;
  apiKeySelectionExpression?: Maybe<Scalars['String']>;
  corsConfiguration?: Maybe<AwsApiGatewayCors>;
  createdDate?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  disableExecuteApiEndpoint?: Maybe<Scalars['Boolean']>;
  disableSchemaValidation?: Maybe<Scalars['Boolean']>;
  domainNames?: Maybe<Array<Maybe<AwsApiGatewayDomainName>>>;
  importInfo?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
  protocolType?: Maybe<Scalars['String']>;
  routeSelectionExpression?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  version?: Maybe<Scalars['String']>;
  warnings?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsApiGatewayMethod = {
  accountId: Scalars['String'];
  apiKeyRequired?: Maybe<Scalars['Boolean']>;
  arn: Scalars['String'];
  authorization?: Maybe<Scalars['String']>;
  httpMethod?: Maybe<Scalars['String']>;
};

export type AwsApiGatewayResource = AwsBaseService & {
  methods?: Maybe<Array<Maybe<AwsApiGatewayMethod>>>;
  path?: Maybe<Scalars['String']>;
  restApi?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
  restApiId?: Maybe<Scalars['String']>;
};

export type AwsApiGatewayRestApi = AwsBaseService & {
  apiKeySource?: Maybe<Scalars['String']>;
  binaryMediaTypes?: Maybe<Array<Maybe<Scalars['String']>>>;
  createdDate?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  domainNames?: Maybe<Array<Maybe<AwsApiGatewayDomainName>>>;
  endpointConfiguration?: Maybe<AwsApiGatewayEndpointConfiguration>;
  minimumCompressionSize?: Maybe<Scalars['Int']>;
  policy?: Maybe<AwsIamJsonPolicy>;
  rawPolicy?: Maybe<Scalars['String']>;
  resources?: Maybe<Array<Maybe<AwsApiGatewayResource>>>;
  route53Record?: Maybe<Array<Maybe<AwsRoute53Record>>>;
  stages?: Maybe<Array<Maybe<AwsApiGatewayStage>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsApiGatewayStage = AwsBaseService & {
  accessLogSettings?: Maybe<AwsAccessLogSettings>;
  cacheCluster?: Maybe<Scalars['Boolean']>;
  cacheClusterSize?: Maybe<Scalars['String']>;
  clientCertificateId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  documentationVersion?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  restApi?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
  restApiId?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  variables?: Maybe<Array<Maybe<AwsApiGatewayStageVariable>>>;
  webAcl?: Maybe<Array<Maybe<AwsWafV2WebAcl>>>;
  xrayTracing?: Maybe<Scalars['Boolean']>;
};

export type AwsApiGatewayStageVariable = {
  id: Scalars['String'];
  key: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type AwsAppSync = AwsBaseService & {
  additionalAuthenticationProviders?: Maybe<Array<Maybe<AwsAdditionalAuthenticationProvider>>>;
  apiKeys?: Maybe<Array<Maybe<AwsAppSyncApiKey>>>;
  authenticationType?: Maybe<Scalars['String']>;
  cognitoUserPool?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  dataSources?: Maybe<Array<Maybe<AwsAppSyncDataSource>>>;
  dynamodb?: Maybe<Array<Maybe<AwsDynamoDbTable>>>;
  functions?: Maybe<Array<Maybe<AwsAppSyncFunction>>>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  lambdaAuthorizerIdentityValidationExpression?: Maybe<Scalars['String']>;
  lambdaAuthorizerResultTtlInSeconds?: Maybe<Scalars['Int']>;
  lambdaAuthorizerUri?: Maybe<Scalars['String']>;
  logCloudWatchLogsRoleArn?: Maybe<Scalars['String']>;
  logExcludeVerboseContent?: Maybe<Scalars['String']>;
  logFieldLogLevel?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  openIDConnectAuthTTL?: Maybe<Scalars['Int']>;
  openIDConnectClientId?: Maybe<Scalars['String']>;
  openIDConnectIatTTL?: Maybe<Scalars['Int']>;
  openIDConnectIssuer?: Maybe<Scalars['String']>;
  rdsCluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  types?: Maybe<Array<Maybe<AwsAppSyncType>>>;
  uris?: Maybe<Array<Maybe<AwsAppSyncGraphqlApiUris>>>;
  userPoolAppIdClientRegex?: Maybe<Scalars['String']>;
  userPoolAwsRegion?: Maybe<Scalars['String']>;
  userPoolDefaultAction?: Maybe<Scalars['String']>;
  userPoolId?: Maybe<Scalars['String']>;
  wafWebAclArn?: Maybe<Scalars['String']>;
  webAcl?: Maybe<Array<Maybe<AwsWafV2WebAcl>>>;
  xrayEnabled?: Maybe<Scalars['String']>;
};

export type AwsAppSyncApiKey = {
  description?: Maybe<Scalars['String']>;
  expires?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

export type AwsAppSyncDataSource = {
  arn: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  dynamodbAwsRegion?: Maybe<Scalars['String']>;
  dynamodbDeltaSyncBaseTableTTL?: Maybe<Scalars['Int']>;
  dynamodbDeltaSyncTableName?: Maybe<Scalars['String']>;
  dynamodbDeltaSyncTableTTL?: Maybe<Scalars['Int']>;
  dynamodbTableName?: Maybe<Scalars['String']>;
  dynamodbUseCallerCredentials?: Maybe<Scalars['String']>;
  dynamodbVersioned?: Maybe<Scalars['String']>;
  elasticsearchAwsRegion?: Maybe<Scalars['String']>;
  elasticsearchEndpoint?: Maybe<Scalars['String']>;
  httpAuthorizationIamSigningRegion?: Maybe<Scalars['String']>;
  httpAuthorizationIamSigningServiceName?: Maybe<Scalars['String']>;
  httpAuthorizationType?: Maybe<Scalars['String']>;
  httpEndpoint?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lambdaFunctionArn?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  relationalDatabaseAwsRegion?: Maybe<Scalars['String']>;
  relationalDatabaseAwsSecretStoreArn?: Maybe<Scalars['String']>;
  relationalDatabaseClusterIdentifier?: Maybe<Scalars['String']>;
  relationalDatabaseName?: Maybe<Scalars['String']>;
  relationalDatabaseSchema?: Maybe<Scalars['String']>;
  relationalDatabaseSourceType?: Maybe<Scalars['String']>;
  serviceRoleArn?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsAppSyncFunction = {
  arn: Scalars['String'];
  dataSourceName?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  functionVersion?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  requestMappingTemplate?: Maybe<Scalars['String']>;
  resolvers?: Maybe<Array<Maybe<AwsAppSyncResolver>>>;
  responseMappingTemplate?: Maybe<Scalars['String']>;
};

export type AwsAppSyncGraphqlApiUris = {
  id: Scalars['String'];
  key: Scalars['String'];
  value: Scalars['String'];
};

export type AwsAppSyncResolver = {
  arn: Scalars['String'];
  cachingKeys?: Maybe<Array<Maybe<Scalars['String']>>>;
  cachingTTL?: Maybe<Scalars['Int']>;
  dataSourceName?: Maybe<Scalars['String']>;
  fieldName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  kind?: Maybe<Scalars['String']>;
  pipelineFunctionIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  requestMappingTemplate?: Maybe<Scalars['String']>;
  responseMappingTemplate?: Maybe<Scalars['String']>;
  syncConflictDetection?: Maybe<Scalars['String']>;
  syncConflictHandler?: Maybe<Scalars['String']>;
  syncLambdaConflictHandlerArn?: Maybe<Scalars['String']>;
  typeName?: Maybe<Scalars['String']>;
};

export type AwsAppSyncType = {
  arn: Scalars['String'];
  definition?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  format?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  resolvers?: Maybe<Array<Maybe<AwsAppSyncResolver>>>;
};

export type AwsAsg = AwsBaseService & {
  availabilityZones?: Maybe<Array<Maybe<Scalars['String']>>>;
  capacityRebalanceEnabled?: Maybe<Scalars['String']>;
  context?: Maybe<Scalars['String']>;
  cooldown?: Maybe<Scalars['Int']>;
  desiredCapacity?: Maybe<Scalars['Int']>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  ec2InstanceIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  elasticBeanstalkEnvs?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  enabledMetrics?: Maybe<Array<Maybe<AwsEnabledMetrics>>>;
  healthCheckGracePeriod?: Maybe<Scalars['Int']>;
  healthCheckType?: Maybe<Scalars['String']>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  launchConfiguration?: Maybe<AwsLaunchConfiguration>;
  launchConfigurationName?: Maybe<Scalars['String']>;
  launchTemplateId?: Maybe<Scalars['String']>;
  launchTemplateName?: Maybe<Scalars['String']>;
  launchTemplateVersion?: Maybe<Scalars['String']>;
  loadBalancerNames?: Maybe<Array<Maybe<Scalars['String']>>>;
  maxInstanceLifetime?: Maybe<Scalars['Int']>;
  maxSize?: Maybe<Scalars['Int']>;
  minSize?: Maybe<Scalars['Int']>;
  mixedInstancesPolicy?: Maybe<AwsMixedInstancesPolicy>;
  name?: Maybe<Scalars['String']>;
  newInstancesProtectedFromScaleIn?: Maybe<Scalars['String']>;
  placementGroup?: Maybe<Scalars['String']>;
  predictedCapacity?: Maybe<Scalars['Int']>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  serviceLinkedRoleARN?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  suspendedProcesses?: Maybe<Array<Maybe<AwsSuspendedProcess>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  targetGroupARNs?: Maybe<Array<Maybe<Scalars['String']>>>;
  terminationPolicies?: Maybe<Array<Maybe<Scalars['String']>>>;
  vpcZoneIdentifier?: Maybe<Scalars['String']>;
  warmPoolConfigMaxGroupPreparedCapacity?: Maybe<Scalars['Int']>;
  warmPoolConfigMinSize?: Maybe<Scalars['Int']>;
  warmPoolConfigPoolState?: Maybe<Scalars['String']>;
  warmPoolConfigStatus?: Maybe<Scalars['String']>;
  warmPoolSize?: Maybe<Scalars['Int']>;
};

export type AwsAssociatedTargetNetworks = {
  id: Scalars['String'];
  networkId?: Maybe<Scalars['String']>;
  networkType?: Maybe<Scalars['String']>;
};

export type AwsAthenaDataCatalog = AwsBaseService & {
  catalogName: Scalars['String'];
  databases?: Maybe<Array<Maybe<AwsAthenaDatabase>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsAthenaDatabase = {
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  metadata?: Maybe<AwsAthenaMetadata>;
  name?: Maybe<Scalars['String']>;
  parameters?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsAthenaMetadata = {
  columns?: Maybe<Array<Maybe<AwsAthenaMetadataColumn>>>;
  createTime?: Maybe<Scalars['DateTime']>;
  lastAccessTime?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  parameters?: Maybe<Array<Maybe<AwsRawTag>>>;
  partitionKeys?: Maybe<Array<Maybe<AwsAthenaMetadataColumn>>>;
  tableType?: Maybe<Scalars['String']>;
};

export type AwsAthenaMetadataColumn = {
  comment?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsBaseService = {
  accountId: Scalars['String'];
  arn: Scalars['String'];
  id: Scalars['String'];
  region?: Maybe<Scalars['String']>;
};

export type AwsBilling = AwsOptionalService & {
  last30Days?: Maybe<Array<Maybe<AwsServiceBillingInfo>>>;
  last30DaysDailyAverage?: Maybe<Array<Maybe<AwsServiceBillingInfo>>>;
  monthToDate?: Maybe<Array<Maybe<AwsServiceBillingInfo>>>;
  monthToDateDailyAverage?: Maybe<Array<Maybe<AwsServiceBillingInfo>>>;
  totalCostLast30Days?: Maybe<AwsTotalBillingInfo>;
  totalCostMonthToDate?: Maybe<AwsTotalBillingInfo>;
};

export type AwsBucketPolicy = {
  id: Scalars['String'];
  policy?: Maybe<AwsIamJsonPolicy>;
};

export type AwsCacheSubnetGroup = {
  cacheSubnetGroupDescription?: Maybe<Scalars['String']>;
  cacheSubnetGroupName?: Maybe<Scalars['String']>;
  vpcId?: Maybe<Scalars['String']>;
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
  activeDirectory?: Maybe<AwsDirectoryServiceAuthenticationRequest>;
  federatedAuthentication?: Maybe<AwsFederatedAuthentication>;
  id: Scalars['String'];
  mutualAuthentication?: Maybe<AwsCertificateAuthenticationRequest>;
  type?: Maybe<Scalars['String']>;
};

export type AwsClientVpnEndpoint = AwsBaseService & {
  associatedTargetNetworks?: Maybe<Array<Maybe<AwsAssociatedTargetNetworks>>>;
  authenticationOptions?: Maybe<Array<Maybe<AwsClientVpnAuthentication>>>;
  clientCidrBlock?: Maybe<Scalars['String']>;
  clientConnectOptions?: Maybe<AwsClientConnectResponseOptions>;
  connectionLogOptions?: Maybe<AwsConnectionLogResponseOptions>;
  creationTime?: Maybe<Scalars['String']>;
  deletionTime?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dnsName?: Maybe<Scalars['String']>;
  dnsServers?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  serverCertificateArn?: Maybe<Scalars['String']>;
  splitTunnel?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  transportProtocol?: Maybe<Scalars['String']>;
  vpnPort?: Maybe<Scalars['Int']>;
  vpnProtocol?: Maybe<Scalars['String']>;
};

export type AwsCloud9Environment = AwsBaseService & {
  connectionType?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  lifecycle?: Maybe<AwsCloud9EnvironmentLifecycle>;
  managedCredentialsStatus?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  ownerArn?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsCloud9EnvironmentLifecycle = {
  failureResource?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStack = AwsBaseService & {
  capabilities?: Maybe<Array<Maybe<Scalars['String']>>>;
  changeSetId?: Maybe<Scalars['String']>;
  creationTime: Scalars['String'];
  deletionTime?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  disableRollback?: Maybe<Scalars['String']>;
  enableTerminationProtection?: Maybe<Scalars['String']>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  lastUpdatedTime?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  notificationARNs?: Maybe<Array<Maybe<Scalars['String']>>>;
  outputs?: Maybe<Array<Maybe<AwsCloudFormationStackOutputList>>>;
  parameters?: Maybe<Array<Maybe<AwsCloudFormationStackParameter>>>;
  parentId?: Maybe<Scalars['String']>;
  parentStack?: Maybe<Array<Maybe<AwsCloudFormationStack>>>;
  roleArn?: Maybe<Scalars['String']>;
  rollbackConfiguration?: Maybe<AwsCloudFormationStackRollbackConfiguration>;
  rootId?: Maybe<Scalars['String']>;
  rootStack?: Maybe<Array<Maybe<AwsCloudFormationStack>>>;
  sns?: Maybe<Array<Maybe<AwsSns>>>;
  stackDriftInfo?: Maybe<AwsCloudFormationStackDriftInfo>;
  stackDriftList?: Maybe<Array<Maybe<AwsCloudFormationStackDriftList>>>;
  stackStatus: Scalars['String'];
  stackStatusReason?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  timeoutInMinutes?: Maybe<Scalars['Int']>;
};

export type AwsCloudFormationStackAutoDeploymentConfig = {
  enabled?: Maybe<Scalars['String']>;
  retainStacksOnAccountRemoval?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackDriftInfo = {
  id: Scalars['String'];
  lastCheckTimestamp?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackDriftList = {
  id: Scalars['String'];
  resourceType?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  timestamp?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackOutputList = {
  description?: Maybe<Scalars['String']>;
  exportName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  outputKey?: Maybe<Scalars['String']>;
  outputValue?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackParameter = {
  id: Scalars['String'];
  parameterKey?: Maybe<Scalars['String']>;
  parameterValue?: Maybe<Scalars['String']>;
  resolvedValue?: Maybe<Scalars['String']>;
  usePreviousValue?: Maybe<Scalars['String']>;
};

export type AwsCloudFormationStackRollbackConfiguration = {
  id: Scalars['String'];
  monitoringTimeInMinutes?: Maybe<Scalars['Int']>;
  rollbackTriggers?: Maybe<Array<Maybe<AwsRollbackConfigurationRollbackTrigger>>>;
};

export type AwsCloudFormationStackSet = AwsBaseService & {
  administrationRoleARN?: Maybe<Scalars['String']>;
  autoDeploymentConfig?: Maybe<AwsCloudFormationStackAutoDeploymentConfig>;
  capabilities?: Maybe<Array<Maybe<Scalars['String']>>>;
  description?: Maybe<Scalars['String']>;
  driftDetectionDetail?: Maybe<AwsCloudFormationStackSetDriftDetectionDetail>;
  executionRoleName?: Maybe<Scalars['String']>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  name?: Maybe<Scalars['String']>;
  organizationalUnitIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  parameters?: Maybe<Array<Maybe<AwsCloudFormationStackSetParameter>>>;
  permissionModel?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  templateBody?: Maybe<Scalars['String']>;
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
  resolvedValue?: Maybe<Scalars['String']>;
  usePreviousValue?: Maybe<Scalars['String']>;
};

export type AwsCloudfront = AwsBaseService & {
  callerReference?: Maybe<Scalars['String']>;
  cloudwatch?: Maybe<Array<Maybe<AwsCloudwatch>>>;
  customErrorResponses?: Maybe<Array<Maybe<AwsCloudfrontCustomErrorResponse>>>;
  defaultCacheBehavior?: Maybe<AwsCloudfrontCacheBehavior>;
  defaultRootObject?: Maybe<Scalars['String']>;
  domainName?: Maybe<Scalars['String']>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  enabled?: Maybe<Scalars['String']>;
  etag?: Maybe<Scalars['String']>;
  geoRestriction?: Maybe<AwsCloudfrontGeoRestriction>;
  httpVersion?: Maybe<Scalars['String']>;
  ipv6Enabled?: Maybe<Scalars['String']>;
  lastModified?: Maybe<Scalars['String']>;
  logging?: Maybe<AwsCloudfrontLoggingConfig>;
  orderedCacheBehaviors?: Maybe<Array<Maybe<AwsCloudfrontCacheBehavior>>>;
  origins?: Maybe<Array<Maybe<AwsCloudfrontOriginData>>>;
  priceClass?: Maybe<Scalars['String']>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  viewerCertificate?: Maybe<AwsCloudfrontViewerCertificate>;
  webAcl?: Maybe<Array<Maybe<AwsWafV2WebAcl>>>;
  webAclId?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontCacheBehavior = {
  allowedMethods?: Maybe<Array<Maybe<Scalars['String']>>>;
  cachedMethods?: Maybe<Array<Maybe<Scalars['String']>>>;
  compress?: Maybe<Scalars['String']>;
  defaultTtl?: Maybe<Scalars['String']>;
  forwardedValues?: Maybe<AwsCloudfrontforwardedValues>;
  id: Scalars['String'];
  maxTtl?: Maybe<Scalars['String']>;
  minTtl?: Maybe<Scalars['String']>;
  patternPath?: Maybe<Scalars['String']>;
  smoothStreaming?: Maybe<Scalars['String']>;
  targetOriginId?: Maybe<Scalars['String']>;
  viewerProtocolPolicy?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontCustomErrorResponse = {
  errorCachingMinTtl?: Maybe<Scalars['String']>;
  errorCode?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  responseCode?: Maybe<Scalars['String']>;
  responsePagePath?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontCustomOriginConfig = {
  httpPort?: Maybe<Scalars['Int']>;
  httpsPort?: Maybe<Scalars['Int']>;
  originKeepaliveTimeout?: Maybe<Scalars['Int']>;
  originProtocolPolicy?: Maybe<Scalars['String']>;
  originReadTimeout?: Maybe<Scalars['Int']>;
  originSslProtocols?: Maybe<AwsCloudfrontOriginSslProtocols>;
};

export type AwsCloudfrontGeoRestriction = {
  locations?: Maybe<Array<Maybe<Scalars['String']>>>;
  restrictionType?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontLoggingConfig = {
  bucket?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  includeCookies?: Maybe<Scalars['Boolean']>;
  prefix?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontOriginCustomHeader = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontOriginData = {
  customHeaders?: Maybe<Array<Maybe<AwsCloudfrontOriginCustomHeader>>>;
  customOriginConfig?: Maybe<AwsCloudfrontCustomOriginConfig>;
  domainName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  originId: Scalars['String'];
  originPath?: Maybe<Scalars['String']>;
};

export type AwsCloudfrontOriginSslProtocols = {
  items?: Maybe<Array<Maybe<Scalars['String']>>>;
  quantity?: Maybe<Scalars['Int']>;
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

export type AwsCloudtrail = AwsOptionalService & {
  cloudWatchLogsLogGroupArn?: Maybe<Scalars['String']>;
  cloudWatchLogsRoleArn?: Maybe<Scalars['String']>;
  cloudwatch?: Maybe<Array<Maybe<AwsCloudwatch>>>;
  cloudwatchLog?: Maybe<Array<Maybe<AwsCloudwatchLog>>>;
  eventSelectors?: Maybe<Array<Maybe<AwsCloudtrailEventSelector>>>;
  hasCustomEventSelectors?: Maybe<Scalars['String']>;
  hasInsightSelectors?: Maybe<Scalars['String']>;
  homeRegion?: Maybe<Scalars['String']>;
  includeGlobalServiceEvents?: Maybe<Scalars['String']>;
  isMultiRegionTrail?: Maybe<Scalars['String']>;
  isOrganizationTrail?: Maybe<Scalars['String']>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKeyId?: Maybe<Scalars['String']>;
  logFileValidationEnabled?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  s3BucketName?: Maybe<Scalars['String']>;
  s3KeyPrefix?: Maybe<Scalars['String']>;
  sns?: Maybe<Array<Maybe<AwsSns>>>;
  status?: Maybe<AwsCloudtrailStatus>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsCloudtrailDataResource = {
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  values?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsCloudtrailEventSelector = {
  dataResources?: Maybe<Array<Maybe<AwsCloudtrailDataResource>>>;
  id: Scalars['String'];
  includeManagementEvents?: Maybe<Scalars['Boolean']>;
  readWriteType?: Maybe<Scalars['String']>;
};

export type AwsCloudtrailStatus = {
  isLogging?: Maybe<Scalars['Boolean']>;
  latestCloudWatchLogsDeliveryTime?: Maybe<Scalars['String']>;
  latestDeliveryAttemptSucceeded?: Maybe<Scalars['String']>;
  latestDeliveryAttemptTime?: Maybe<Scalars['String']>;
  latestDeliveryTime?: Maybe<Scalars['String']>;
  latestDigestDeliveryTime?: Maybe<Scalars['String']>;
  latestNotificationAttemptSucceeded?: Maybe<Scalars['String']>;
  latestNotificationAttemptTime?: Maybe<Scalars['String']>;
  latestNotificationTime?: Maybe<Scalars['String']>;
  startLoggingTime?: Maybe<Scalars['String']>;
  timeLoggingStarted?: Maybe<Scalars['String']>;
  timeLoggingStopped?: Maybe<Scalars['String']>;
};

export type AwsCloudwatch = AwsBaseService & {
  actions?: Maybe<Array<Maybe<Scalars['String']>>>;
  actionsEnabled?: Maybe<Scalars['String']>;
  cloudfront?: Maybe<Array<Maybe<AwsCloudfront>>>;
  cloudtrail?: Maybe<Array<Maybe<AwsCloudtrail>>>;
  cloudwatchLog?: Maybe<Array<Maybe<AwsCloudwatchLog>>>;
  comparisonOperator?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dimensions?: Maybe<Array<Maybe<AwsCloudwatchDimensions>>>;
  evaluationPeriods?: Maybe<Scalars['Int']>;
  metric?: Maybe<Scalars['String']>;
  namespace?: Maybe<Scalars['String']>;
  period?: Maybe<Scalars['String']>;
  sns?: Maybe<Array<Maybe<AwsSns>>>;
  statistic?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  threshold?: Maybe<Scalars['String']>;
};

export type AwsCloudwatchDimensions = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsCloudwatchLog = {
  accountId: Scalars['String'];
  arn: Scalars['String'];
  cgId?: Maybe<Scalars['String']>;
  cloudtrail?: Maybe<Array<Maybe<AwsCloudtrail>>>;
  cloudwatch?: Maybe<Array<Maybe<AwsCloudwatch>>>;
  creationTime?: Maybe<Scalars['String']>;
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  elasticSearchDomains?: Maybe<Array<Maybe<AwsElasticSearchDomain>>>;
  id: Scalars['String'];
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKeyId?: Maybe<Scalars['String']>;
  managedAirflows?: Maybe<Array<Maybe<AwsManagedAirflow>>>;
  metricFilterCount?: Maybe<Scalars['Int']>;
  metricFilters?: Maybe<Array<Maybe<AwsMetricFilter>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  region?: Maybe<Scalars['String']>;
  retentionInDays?: Maybe<Scalars['Int']>;
  storedBytes?: Maybe<Scalars['String']>;
};

export type AwsCodeBuildFilterGroup = {
  excludeMatchedPattern?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  pattern?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsCodebuild = AwsBaseService & {
  artifacts?: Maybe<AwsCodebuildArtifacts>;
  badge?: Maybe<AwsCodebuildBadge>;
  buildBatchConfig?: Maybe<AwsCodebuildBatchConfig>;
  cache?: Maybe<AwsCodebuildCache>;
  concurrentBuildLimit?: Maybe<Scalars['Int']>;
  created?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  encryptionKey?: Maybe<Scalars['String']>;
  environment?: Maybe<AwsCodebuildEnvironment>;
  fileSystemLocations?: Maybe<Array<Maybe<AwsCodebuildFileSystemLocation>>>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  lastModified?: Maybe<Scalars['DateTime']>;
  logsConfig?: Maybe<AwsCodebuildLogsConfig>;
  name?: Maybe<Scalars['String']>;
  projectVisibility?: Maybe<Scalars['String']>;
  publicProjectAlias?: Maybe<Scalars['String']>;
  queuedTimeoutInMinutes?: Maybe<Scalars['Int']>;
  resourceAccessRole?: Maybe<Scalars['String']>;
  secondaryArtifacts?: Maybe<Array<Maybe<AwsCodebuildArtifacts>>>;
  secondarySourceVersions?: Maybe<Array<Maybe<AwsCodebuildSecondarySourceVersion>>>;
  secondarySources?: Maybe<Array<Maybe<AwsCodebuildSource>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  serviceRole?: Maybe<Scalars['String']>;
  source?: Maybe<AwsCodebuildSource>;
  sourceVersion?: Maybe<Scalars['String']>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  timeoutInMinutes?: Maybe<Scalars['Int']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcConfig?: Maybe<AwsCodebuildVpcConfig>;
  webhook?: Maybe<AwsCodebuildWebhook>;
};

export type AwsCodebuildArtifacts = {
  artifactIdentifier?: Maybe<Scalars['String']>;
  bucketOwnerAccess?: Maybe<Scalars['String']>;
  encryptionDisabled?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  location?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  namespaceType?: Maybe<Scalars['String']>;
  overrideArtifactName?: Maybe<Scalars['Boolean']>;
  packaging?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsCodebuildBadge = {
  badgeEnabled?: Maybe<Scalars['Boolean']>;
  badgeRequestUrl?: Maybe<Scalars['String']>;
};

export type AwsCodebuildBatchConfig = {
  batchReportMode?: Maybe<Scalars['String']>;
  combineArtifacts?: Maybe<Scalars['Boolean']>;
  restrictions?: Maybe<AwsCodebuildBatchConfigRestrictions>;
  serviceRole?: Maybe<Scalars['String']>;
  timeoutInMins?: Maybe<Scalars['Int']>;
};

export type AwsCodebuildBatchConfigRestrictions = {
  computeTypesAllowed?: Maybe<Array<Maybe<Scalars['String']>>>;
  maximumBuildsAllowed?: Maybe<Scalars['Int']>;
};

export type AwsCodebuildCache = {
  location?: Maybe<Scalars['String']>;
  modes?: Maybe<Array<Maybe<Scalars['String']>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsCodebuildCloudWatchLogs = {
  groupName?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  streamName?: Maybe<Scalars['String']>;
};

export type AwsCodebuildEnvRegistryCredentials = {
  credential?: Maybe<Scalars['String']>;
  credentialProvider?: Maybe<Scalars['String']>;
};

export type AwsCodebuildEnvironment = {
  certificate?: Maybe<Scalars['String']>;
  computeType?: Maybe<Scalars['String']>;
  environmentVariables?: Maybe<Array<Maybe<AwsCodebuildEnvironmentVariables>>>;
  image?: Maybe<Scalars['String']>;
  imagePullCredentialsType?: Maybe<Scalars['String']>;
  privilegedMode?: Maybe<Scalars['Boolean']>;
  registryCredential?: Maybe<AwsCodebuildEnvRegistryCredentials>;
  type?: Maybe<Scalars['String']>;
};

export type AwsCodebuildEnvironmentVariables = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsCodebuildFileSystemLocation = {
  id: Scalars['String'];
  identifier?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  mountOptions?: Maybe<Scalars['String']>;
  mountPoint?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsCodebuildFilterGroupArray = {
  data?: Maybe<Array<Maybe<AwsCodeBuildFilterGroup>>>;
  id: Scalars['String'];
};

export type AwsCodebuildGitSubmodulesConfig = {
  fetchSubmodules?: Maybe<Scalars['Boolean']>;
};

export type AwsCodebuildLogsConfig = {
  cloudWatchLogs?: Maybe<AwsCodebuildCloudWatchLogs>;
  s3Logs?: Maybe<AwsCodebuildS3Logs>;
};

export type AwsCodebuildS3Logs = {
  bucketOwnerAccess?: Maybe<Scalars['String']>;
  encryptionDisabled?: Maybe<Scalars['Boolean']>;
  location?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsCodebuildSecondarySourceVersion = {
  sourceIdentifier?: Maybe<Scalars['String']>;
  sourceVersion?: Maybe<Scalars['String']>;
};

export type AwsCodebuildSource = {
  auth?: Maybe<AwsCodebuildSourceAuth>;
  buildStatusConfig?: Maybe<AwsCodebuildSourceStatusConfig>;
  buildspec?: Maybe<Scalars['String']>;
  gitCloneDepth?: Maybe<Scalars['Int']>;
  gitSubmodulesConfig?: Maybe<AwsCodebuildGitSubmodulesConfig>;
  id: Scalars['String'];
  insecureSsl?: Maybe<Scalars['Boolean']>;
  location?: Maybe<Scalars['String']>;
  reportBuildStatus?: Maybe<Scalars['Boolean']>;
  sourceIdentifier?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsCodebuildSourceAuth = {
  resource?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsCodebuildSourceStatusConfig = {
  context?: Maybe<Scalars['String']>;
  targetUrl?: Maybe<Scalars['String']>;
};

export type AwsCodebuildVpcConfig = {
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  subnets?: Maybe<Array<Maybe<Scalars['String']>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsCodebuildWebhook = {
  branchFilter?: Maybe<Scalars['String']>;
  buildType?: Maybe<Scalars['String']>;
  filterGroups?: Maybe<Array<Maybe<AwsCodebuildFilterGroupArray>>>;
  lastModifiedSecret?: Maybe<Scalars['DateTime']>;
  payloadUrl?: Maybe<Scalars['String']>;
  secret?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type AwsCognitoIdentityPool = {
  accountId: Scalars['String'];
  allowClassicFlow?: Maybe<Scalars['String']>;
  allowUnauthenticatedIdentities?: Maybe<Scalars['String']>;
  arn: Scalars['String'];
  cognitoIdentityProviders?: Maybe<Array<Maybe<AwsCognitoIdentityProviders>>>;
  developerProviderName?: Maybe<Scalars['String']>;
  elasticSearchDomains?: Maybe<Array<Maybe<AwsElasticSearchDomain>>>;
  iamOpenIdConnectProviders?: Maybe<Array<Maybe<AwsIamOpenIdConnectProvider>>>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  iamSamlProviders?: Maybe<Array<Maybe<AwsIamSamlProvider>>>;
  id: Scalars['String'];
  identityPoolName?: Maybe<Scalars['String']>;
  openIdConnectProviderARNs?: Maybe<Array<Maybe<Scalars['String']>>>;
  region?: Maybe<Scalars['String']>;
  samlProviderARNs?: Maybe<Array<Maybe<Scalars['String']>>>;
  supportedLoginProviders?: Maybe<Array<Maybe<AwsSupportedLoginProvider>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsCognitoIdentityProviders = {
  clientId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  providerName?: Maybe<Scalars['String']>;
  serverSideTokenCheck?: Maybe<Scalars['String']>;
};

export type AwsCognitoUserPool = AwsBaseService & {
  accountRecoverySettings?: Maybe<Array<Maybe<AwsAccountRecoverySetting>>>;
  adminCreateUserConfigAllowAdminCreateUserOnly?: Maybe<Scalars['String']>;
  adminCreateUserConfigInviteMessageTemplateEmailMessage?: Maybe<Scalars['String']>;
  adminCreateUserConfigInviteMessageTemplateEmailSubject?: Maybe<Scalars['String']>;
  adminCreateUserConfigInviteMessageTemplateSMSMessage?: Maybe<Scalars['String']>;
  adminCreateUserConfigUnusedAccountValidityDays?: Maybe<Scalars['Int']>;
  aliasAttributes?: Maybe<Array<Maybe<Scalars['String']>>>;
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
  autoVerifiedAttributes?: Maybe<Array<Maybe<Scalars['String']>>>;
  creationDate?: Maybe<Scalars['String']>;
  customDomain?: Maybe<Scalars['String']>;
  deviceConfigChallengeRequiredOnNewDevice?: Maybe<Scalars['String']>;
  deviceConfigDeviceOnlyRememberedOnUserPrompt?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  elasticSearchDomains?: Maybe<Array<Maybe<AwsElasticSearchDomain>>>;
  emailConfigConfigurationSet?: Maybe<Scalars['String']>;
  emailConfigEmailSendingAccount?: Maybe<Scalars['String']>;
  emailConfigFrom?: Maybe<Scalars['String']>;
  emailConfigReplyToEmailAddress?: Maybe<Scalars['String']>;
  emailConfigSourceArn?: Maybe<Scalars['String']>;
  emailConfigurationFailure?: Maybe<Scalars['String']>;
  emailVerificationMessage?: Maybe<Scalars['String']>;
  emailVerificationSubject?: Maybe<Scalars['String']>;
  estimatedNumberOfUsers?: Maybe<Scalars['Int']>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  lambdaConfig?: Maybe<AwsCognitoUserPoolLambdaConfig>;
  lambdas?: Maybe<Array<Maybe<AwsLambda>>>;
  lastModifiedDate?: Maybe<Scalars['String']>;
  mfaConfiguration?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  policies?: Maybe<AwsCognitoUserPoolPasswordPolicy>;
  schemaAttributes?: Maybe<Array<Maybe<AwsCognitoUserPoolSchemaAttribute>>>;
  ses?: Maybe<Array<Maybe<AwsSes>>>;
  smsAuthenticationMessage?: Maybe<Scalars['String']>;
  smsConfigurationExternalId?: Maybe<Scalars['String']>;
  smsConfigurationFailure?: Maybe<Scalars['String']>;
  smsConfigurationSnsCallerArn?: Maybe<Scalars['String']>;
  smsVerificationMessage?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  userPoolAddOnsAdvancedSecurityMode?: Maybe<Scalars['String']>;
  usernameAttributes?: Maybe<Array<Maybe<Scalars['String']>>>;
  usernameConfigurationCaseSensitive?: Maybe<Scalars['String']>;
  verificationMessageTemplateDefaultEmailOption?: Maybe<Scalars['String']>;
  verificationMessageTemplateEmailMessage?: Maybe<Scalars['String']>;
  verificationMessageTemplateEmailMessageByLink?: Maybe<Scalars['String']>;
  verificationMessageTemplateEmailSubject?: Maybe<Scalars['String']>;
  verificationMessageTemplateEmailSubjectByLink?: Maybe<Scalars['String']>;
  verificationMessageTemplateSmsMessage?: Maybe<Scalars['String']>;
};

export type AwsCognitoUserPoolLambdaConfig = {
  createAuthChallenge?: Maybe<Scalars['String']>;
  customEmailSenderLambdaArn?: Maybe<Scalars['String']>;
  customEmailSenderLambdaVersion?: Maybe<Scalars['String']>;
  customMessage?: Maybe<Scalars['String']>;
  customSMSSenderLambdaArn?: Maybe<Scalars['String']>;
  customSMSSenderLambdaVersion?: Maybe<Scalars['String']>;
  defineAuthChallenge?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  kmsKeyID?: Maybe<Scalars['String']>;
  postAuthentication?: Maybe<Scalars['String']>;
  postConfirmation?: Maybe<Scalars['String']>;
  preAuthentication?: Maybe<Scalars['String']>;
  preSignUp?: Maybe<Scalars['String']>;
  preTokenGeneration?: Maybe<Scalars['String']>;
  userMigration?: Maybe<Scalars['String']>;
  verifyAuthChallengeResponse?: Maybe<Scalars['String']>;
};

export type AwsCognitoUserPoolPasswordPolicy = {
  id: Scalars['String'];
  minimumLength?: Maybe<Scalars['Int']>;
  requireLowercase?: Maybe<Scalars['String']>;
  requireNumbers?: Maybe<Scalars['String']>;
  requireSymbols?: Maybe<Scalars['String']>;
  requireUppercase?: Maybe<Scalars['String']>;
  temporaryPasswordValidityDays?: Maybe<Scalars['Int']>;
};

export type AwsCognitoUserPoolSchemaAttribute = {
  attributeDataType?: Maybe<Scalars['String']>;
  developerOnlyAttribute?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  mutable?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  numberAttributeConstraintsMaxValue?: Maybe<Scalars['String']>;
  numberAttributeConstraintsMinValue?: Maybe<Scalars['String']>;
  required?: Maybe<Scalars['String']>;
  stringAttributeConstraintsMaxValue?: Maybe<Scalars['String']>;
  stringAttributeConstraintsMinValue?: Maybe<Scalars['String']>;
};

export type AwsConfigurationRecorder = AwsBaseService & {
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  name?: Maybe<Scalars['String']>;
  recordingGroup?: Maybe<AwsRecordingGroup>;
  roleARN?: Maybe<Scalars['String']>;
  status?: Maybe<AwsRecorderStatus>;
};

export type AwsConnectionLogResponseOptions = {
  cloudwatchLogGroup?: Maybe<Scalars['String']>;
  cloudwatchLogStream?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
};

export type AwsCustomerGateway = AwsBaseService & {
  bgpAsn?: Maybe<Scalars['String']>;
  ipAddress?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  type?: Maybe<Scalars['String']>;
  vpnConnection?: Maybe<Array<Maybe<AwsVpnConnection>>>;
};

export type AwsDirectoryServiceAuthenticationRequest = {
  directoryId?: Maybe<Scalars['String']>;
};

export type AwsDmsReplicationInstance = AwsBaseService & {
  allocatedStorage?: Maybe<Scalars['Int']>;
  autoMinorVersionUpgrade?: Maybe<Scalars['Boolean']>;
  availabilityZone?: Maybe<Scalars['String']>;
  dnsNameServers?: Maybe<Scalars['String']>;
  engineVersion?: Maybe<Scalars['String']>;
  freeUntil?: Maybe<Scalars['DateTime']>;
  instanceCreateTime?: Maybe<Scalars['DateTime']>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKeyId?: Maybe<Scalars['String']>;
  multiAz?: Maybe<Scalars['Boolean']>;
  pendingModifiedValues?: Maybe<AwsDmsReplicationInstancePendingModifiedValues>;
  preferredMaintenanceWindow?: Maybe<Scalars['String']>;
  publiclyAccessible?: Maybe<Scalars['Boolean']>;
  replicationInstanceClass?: Maybe<Scalars['String']>;
  replicationInstanceIdentifier?: Maybe<Scalars['String']>;
  replicationInstancePrivateIpAddress?: Maybe<Scalars['String']>;
  replicationInstancePrivateIpAddresses?: Maybe<Array<Maybe<Scalars['String']>>>;
  replicationInstancePublicIpAddress?: Maybe<Scalars['String']>;
  replicationInstancePublicIpAddresses?: Maybe<Array<Maybe<Scalars['String']>>>;
  replicationInstanceStatus?: Maybe<Scalars['String']>;
  replicationSubnetGroup?: Maybe<AwsDmsReplicationInstanceReplicationSubnetGroup>;
  secondaryAvailabilityZone?: Maybe<Scalars['String']>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcSecurityGroups?: Maybe<Array<Maybe<AwsDmsReplicationInstanceVpcSecurityGroups>>>;
};

export type AwsDynamoDbTable = AwsBaseService & {
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
  attributes?: Maybe<Array<Maybe<AwsDynamoDbTableAttributes>>>;
  billingModeSummary?: Maybe<AwsDynamoDbTableBillingSummary>;
  creationDate: Scalars['String'];
  globalIndexes?: Maybe<Array<Maybe<AwsDynamoDbTableGlobalSecondaryIndexDescription>>>;
  globalTableVersion?: Maybe<Scalars['String']>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  itemCount?: Maybe<Scalars['Int']>;
  keySchema?: Maybe<Array<Maybe<AwsDynamoDbTableIndexKeySchema>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  latestStreamArn?: Maybe<Scalars['String']>;
  latestStreamLabel?: Maybe<Scalars['String']>;
  localIndexes?: Maybe<Array<Maybe<AwsDynamoDbTableLocalSecondaryIndexDescription>>>;
  name?: Maybe<Scalars['String']>;
  pointInTimeRecoveryEnabled?: Maybe<Scalars['Boolean']>;
  provisionedThroughput?: Maybe<AwsDynamoDbTableProvisionedThroughputDescription>;
  replicas?: Maybe<Array<Maybe<AwsDynamoDbTableReplicaDescription>>>;
  restoreSummary?: Maybe<AwsDynamoDbTableRestoreSummary>;
  sizeInBytes?: Maybe<Scalars['Int64']>;
  sseDescription?: Maybe<AwsDynamoDbTableSseDescription>;
  status?: Maybe<Scalars['String']>;
  streamSpecification?: Maybe<AwsDynamoDbTableStreamSpecification>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  ttlEnabled?: Maybe<Scalars['Boolean']>;
};

export type AwsDynamoDbTableAttributes = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableAutoScalingPolicyDescription = {
  disableScaleIn?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  policyName?: Maybe<Scalars['String']>;
  scaleInCooldown?: Maybe<Scalars['Int']>;
  scaleOutCooldown?: Maybe<Scalars['Int']>;
  targetValue?: Maybe<Scalars['Int']>;
};

export type AwsDynamoDbTableAutoScalingSettingsDescription = {
  autoScalingDisabled?: Maybe<Scalars['Boolean']>;
  autoScalingRoleArn?: Maybe<Scalars['String']>;
  maximumUnits?: Maybe<Scalars['Int']>;
  minimumUnits?: Maybe<Scalars['Int']>;
  scalingPolicies?: Maybe<Array<Maybe<AwsDynamoDbTableAutoScalingPolicyDescription>>>;
};

export type AwsDynamoDbTableBillingSummary = {
  billingMode?: Maybe<Scalars['String']>;
  lastUpdateToPayPerRequestDateTime?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableGlobalSecondaryIndexDescription = {
  arn: Scalars['String'];
  backfilling?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  itemCount?: Maybe<Scalars['Int']>;
  keySchema?: Maybe<Array<Maybe<AwsDynamoDbTableIndexKeySchema>>>;
  name: Scalars['String'];
  projection?: Maybe<AwsDynamoDbTableIndexProjection>;
  provisionedThroughput?: Maybe<AwsDynamoDbTableProvisionedThroughputDescription>;
  sizeInBytes?: Maybe<Scalars['Int64']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableIndexKeySchema = {
  attributeName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  keyType?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableIndexProjection = {
  nonKeyAttributes?: Maybe<Array<Maybe<Scalars['String']>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableLocalSecondaryIndexDescription = {
  arn: Scalars['String'];
  id: Scalars['String'];
  itemCount?: Maybe<Scalars['Int']>;
  keySchema?: Maybe<Array<Maybe<AwsDynamoDbTableIndexKeySchema>>>;
  name: Scalars['String'];
  projection?: Maybe<AwsDynamoDbTableIndexProjection>;
  sizeInBytes?: Maybe<Scalars['Int64']>;
};

export type AwsDynamoDbTableProvisionedThroughputDescription = {
  lastDecreaseDateTime?: Maybe<Scalars['String']>;
  lastIncreaseDateTime?: Maybe<Scalars['String']>;
  numberOfDecreasesToday?: Maybe<Scalars['Int']>;
  readCapacityUnits?: Maybe<Scalars['Int']>;
  writeCapacityUnits?: Maybe<Scalars['Int']>;
};

export type AwsDynamoDbTableReplicaDescription = {
  globalSecondaryIndexes?: Maybe<Array<Maybe<AwsDynamoDbTableReplicaGlobalSecondaryIndexDescription>>>;
  id: Scalars['String'];
  kmsMasterKeyId?: Maybe<Scalars['String']>;
  provisionedReadCapacityAutoScalingSettings?: Maybe<AwsDynamoDbTableAutoScalingSettingsDescription>;
  provisionedWriteCapacityAutoScalingSettings?: Maybe<AwsDynamoDbTableAutoScalingSettingsDescription>;
  readCapacityUnits?: Maybe<Scalars['Int']>;
  regionName?: Maybe<Scalars['String']>;
  replicaInaccessibleDateTime?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  statusDescription?: Maybe<Scalars['String']>;
  statusPercentProgress?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableReplicaGlobalSecondaryIndexDescription = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  readCapacityUnits?: Maybe<Scalars['Int']>;
};

export type AwsDynamoDbTableRestoreSummary = {
  restoreDateTime?: Maybe<Scalars['String']>;
  restoreInProgress?: Maybe<Scalars['String']>;
  sourceBackupArn?: Maybe<Scalars['String']>;
  sourceTableArn?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableSseDescription = {
  inaccessibleEncryptionDateTime?: Maybe<Scalars['String']>;
  kmsMasterKeyArn?: Maybe<Scalars['String']>;
  sseType?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsDynamoDbTableStreamSpecification = {
  streamViewType?: Maybe<Scalars['String']>;
  streamsEnabled?: Maybe<Scalars['Boolean']>;
};

export type AwsEbs = AwsBaseService & {
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  attachments?: Maybe<Array<Maybe<AwsEbsAttachment>>>;
  availabilityZone?: Maybe<Scalars['String']>;
  created?: Maybe<Scalars['String']>;
  ebsSnapshots?: Maybe<Array<Maybe<AwsEbsSnapshot>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  emrInstance?: Maybe<Array<Maybe<AwsEmrInstance>>>;
  encrypted?: Maybe<Scalars['Boolean']>;
  iops?: Maybe<Scalars['Int']>;
  isBootDisk?: Maybe<Scalars['Boolean']>;
  multiAttachEnabled?: Maybe<Scalars['Boolean']>;
  permissions?: Maybe<Array<Maybe<AwsEbsPermission>>>;
  size?: Maybe<Scalars['String']>;
  snapshot?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  volumeType?: Maybe<Scalars['String']>;
};

export type AwsEbsAttachment = {
  attachedTime?: Maybe<Scalars['String']>;
  attachmentInformation?: Maybe<Scalars['String']>;
  deleteOnTermination?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
};

export type AwsEbsPermission = {
  group?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  userId?: Maybe<Scalars['String']>;
};

export type AwsEbsSnapshot = AwsBaseService & {
  dataEncryptionKeyId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  encrypted?: Maybe<Scalars['Boolean']>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKeyId?: Maybe<Scalars['String']>;
  outpostArn?: Maybe<Scalars['String']>;
  ownerAlias?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['String']>;
  permissions?: Maybe<Array<Maybe<AwsEbsPermission>>>;
  progress?: Maybe<Scalars['String']>;
  restoreExpiryTime?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  stateMessage?: Maybe<Scalars['String']>;
  storageTier?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  volumeId?: Maybe<Scalars['String']>;
  volumeSize?: Maybe<Scalars['String']>;
};

export type AwsEc2 = AwsBaseService & {
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  ami?: Maybe<Scalars['String']>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  availabilityZone?: Maybe<Scalars['String']>;
  cloudWatchMetricData?: Maybe<AwsEc2CloudWatchMetricsTimePeriods>;
  cpuCoreCount?: Maybe<Scalars['Int']>;
  cpuThreadsPerCore?: Maybe<Scalars['Int']>;
  dailyCost?: Maybe<AwsTotalBillingInfo>;
  deletionProtection?: Maybe<Scalars['String']>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  ebsOptimized?: Maybe<Scalars['String']>;
  ecsContainer?: Maybe<Array<Maybe<AwsEcsContainer>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  elasticBeanstalkEnv?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  elasticIps?: Maybe<Scalars['String']>;
  emrInstance?: Maybe<Array<Maybe<AwsEmrInstance>>>;
  ephemeralBlockDevices?: Maybe<Array<Maybe<AwsEc2Blockdevice>>>;
  hibernation?: Maybe<Scalars['String']>;
  iamInstanceProfile?: Maybe<Array<Maybe<AwsIamInstanceProfile>>>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  instanceLifecycle?: Maybe<Scalars['String']>;
  instanceState?: Maybe<Scalars['String']>;
  instanceType?: Maybe<Scalars['String']>;
  ipv4PublicIp?: Maybe<Scalars['String']>;
  ipv6Addresses?: Maybe<Array<Maybe<Scalars['String']>>>;
  keyPair?: Maybe<AwsEc2KeyPair>;
  launchTime?: Maybe<Scalars['DateTime']>;
  metadataOptions?: Maybe<AwsEc2MetadataOptions>;
  metadatasecurityGroupIdsOptions?: Maybe<Array<Maybe<Scalars['String']>>>;
  monitoring?: Maybe<Scalars['String']>;
  networkInterfaces?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  placementGroup?: Maybe<Scalars['String']>;
  platformDetails?: Maybe<Scalars['String']>;
  primaryNetworkInterface?: Maybe<Scalars['String']>;
  privateDns?: Maybe<Scalars['String']>;
  privateIps?: Maybe<Scalars['String']>;
  publicDns?: Maybe<Scalars['String']>;
  publicIpAddress?: Maybe<Scalars['String']>;
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  sourceDestCheck?: Maybe<Scalars['String']>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  systemsManagerInstance?: Maybe<Array<Maybe<AwsSystemsManagerInstance>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  tenancy?: Maybe<Scalars['String']>;
};

export type AwsEc2Blockdevice = {
  deviceName: Scalars['String'];
  ebs?: Maybe<BlockDeviceEbs>;
};

export type AwsEc2CloudWatchMetrics = {
  cpuUtilizationAverage?: Maybe<Scalars['Float']>;
  diskReadBytesAverage?: Maybe<Scalars['Float']>;
  diskReadOpsAverage?: Maybe<Scalars['Float']>;
  diskWriteBytesAverage?: Maybe<Scalars['Float']>;
  diskWriteOpsAverage?: Maybe<Scalars['Float']>;
  networkInAverage?: Maybe<Scalars['Float']>;
  networkOutAverage?: Maybe<Scalars['Float']>;
  networkPacketsInAverage?: Maybe<Scalars['Float']>;
  networkPacketsOutAverage?: Maybe<Scalars['Float']>;
  statusCheckFailedInstanceSum?: Maybe<Scalars['Float']>;
  statusCheckFailedSum?: Maybe<Scalars['Float']>;
  statusCheckFailedSystemSum?: Maybe<Scalars['Float']>;
};

export type AwsEc2CloudWatchMetricsTimePeriods = {
  last6Hours?: Maybe<AwsEc2CloudWatchMetrics>;
  last24Hours?: Maybe<AwsEc2CloudWatchMetrics>;
  lastMonth?: Maybe<AwsEc2CloudWatchMetrics>;
  lastWeek?: Maybe<AwsEc2CloudWatchMetrics>;
};

export type AwsEc2KeyPair = {
  fingerprint?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsEc2MetadataOptions = {
  httpEndpoint: Scalars['String'];
  httpPutResponseHopLimit?: Maybe<Scalars['Int']>;
  httpTokens: Scalars['String'];
  state: Scalars['String'];
};

export type AwsEcr = AwsBaseService & {
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
  kmsKey?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
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
  targetId?: Maybe<Scalars['String']>;
  targetType?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsAwsVpcConfiguration = {
  assignPublicIp?: Maybe<Scalars['String']>;
  securityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  subnets?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsEcsCapacityProviderStrategyItem = {
  base?: Maybe<Scalars['Int']>;
  capacityProvider?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  weight?: Maybe<Scalars['Int']>;
};

export type AwsEcsCluster = AwsBaseService & {
  activeServicesCount?: Maybe<Scalars['Int']>;
  attachments?: Maybe<Array<Maybe<AwsEcsAttachment>>>;
  attachmentsStatus?: Maybe<Scalars['String']>;
  capacityProviders?: Maybe<Array<Maybe<Scalars['String']>>>;
  cloudwatchLog?: Maybe<Array<Maybe<AwsCloudwatchLog>>>;
  clusterName?: Maybe<Scalars['String']>;
  configuration?: Maybe<AwsEcsClusterConfiguration>;
  defaultCapacityProviderStrategy?: Maybe<Array<Maybe<AwsEcsCapacityProviderStrategyItem>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  ecsTask?: Maybe<Array<Maybe<AwsEcsTask>>>;
  ecsTaskSet?: Maybe<Array<Maybe<AwsEcsTaskSet>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  pendingTasksCount?: Maybe<Scalars['Int']>;
  registeredContainerInstancesCount?: Maybe<Scalars['Int']>;
  runningTasksCount?: Maybe<Scalars['Int']>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  settings?: Maybe<Array<Maybe<AwsEcsClusterSettings>>>;
  statistics?: Maybe<Array<Maybe<AwsEcsStatistics>>>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsEcsClusterConfiguration = {
  executeCommandConfiguration?: Maybe<AwsEcsExecuteCommandConfiguration>;
  id: Scalars['String'];
};

export type AwsEcsClusterSettings = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsContainer = AwsBaseService & {
  agentConnected?: Maybe<Scalars['Boolean']>;
  agentUpdateStatus?: Maybe<Scalars['String']>;
  attachments?: Maybe<Array<Maybe<AwsEcsAttachment>>>;
  attributes?: Maybe<Array<Maybe<AwsEcsAttribute>>>;
  capacityProviderName?: Maybe<Scalars['String']>;
  ec2InstanceId?: Maybe<Scalars['String']>;
  ec2Instances?: Maybe<Array<Maybe<AwsEc2>>>;
  ecsTask?: Maybe<Array<Maybe<AwsEcsTask>>>;
  pendingTasksCount?: Maybe<Scalars['Int']>;
  registeredAt?: Maybe<Scalars['String']>;
  registeredResources?: Maybe<Array<Maybe<AwsEcsResource>>>;
  remainingResources?: Maybe<Array<Maybe<AwsEcsResource>>>;
  runningTasksCount?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  statusReason?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  version?: Maybe<Scalars['Int']>;
  versionInfo?: Maybe<AwsEcsversionInfo>;
};

export type AwsEcsContainerDefinition = {
  command?: Maybe<Array<Maybe<Scalars['String']>>>;
  cpu?: Maybe<Scalars['Int']>;
  dependsOn?: Maybe<Array<Maybe<AwsEcsContainerDependency>>>;
  disableNetworking?: Maybe<Scalars['Boolean']>;
  dnsSearchDomains?: Maybe<Array<Maybe<Scalars['String']>>>;
  dnsServers?: Maybe<Array<Maybe<Scalars['String']>>>;
  dockerLabels?: Maybe<Array<Maybe<AwsEcsDockerLabel>>>;
  dockerSecurityOptions?: Maybe<Array<Maybe<Scalars['String']>>>;
  entryPoint?: Maybe<Array<Maybe<Scalars['String']>>>;
  environment?: Maybe<Array<Maybe<AwsEcsEnvironmentVariables>>>;
  environmentFiles?: Maybe<Array<Maybe<AwsEcsEnvironmentFile>>>;
  essential?: Maybe<Scalars['Boolean']>;
  extraHosts?: Maybe<Array<Maybe<AwsEcsHostEntry>>>;
  firelensConfiguration?: Maybe<AwsEcsFirelensConfiguration>;
  healthCheck?: Maybe<AwsEcsHealthCheck>;
  hostname?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  interactive?: Maybe<Scalars['Boolean']>;
  links?: Maybe<Array<Maybe<Scalars['String']>>>;
  linuxParameters?: Maybe<AwsEcsLinuxParameters>;
  logConfiguration?: Maybe<AwsEcsLogConfiguration>;
  memory?: Maybe<Scalars['Int']>;
  memoryReservation?: Maybe<Scalars['Int']>;
  mountPoints?: Maybe<Array<Maybe<AwsEcsMountPoint>>>;
  name?: Maybe<Scalars['String']>;
  portMappings?: Maybe<Array<Maybe<AwsEcsPortMapping>>>;
  privileged?: Maybe<Scalars['Boolean']>;
  pseudoTerminal?: Maybe<Scalars['Boolean']>;
  readonlyRootFilesystem?: Maybe<Scalars['Boolean']>;
  repositoryCredentials?: Maybe<AwsEcsRepositoryCredentials>;
  resourceRequirements?: Maybe<Array<Maybe<AwsEcsResourceRequirement>>>;
  secrets?: Maybe<Array<Maybe<AwsEcsSecret>>>;
  startTimeout?: Maybe<Scalars['Int']>;
  stopTimeout?: Maybe<Scalars['Int']>;
  systemControls?: Maybe<Array<Maybe<AwsEcsSystemControl>>>;
  ulimits?: Maybe<Array<Maybe<AwsEcsUlimit>>>;
  user?: Maybe<Scalars['String']>;
  volumesFrom?: Maybe<Array<Maybe<AwsEcsVolumeFrom>>>;
  workingDirectory?: Maybe<Scalars['String']>;
};

export type AwsEcsContainerDependency = {
  condition?: Maybe<Scalars['String']>;
  containerName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

export type AwsEcsContainerOverride = {
  command?: Maybe<Array<Maybe<Scalars['String']>>>;
  cpu?: Maybe<Scalars['String']>;
  environment?: Maybe<Array<Maybe<AwsEcsEnvironmentVariables>>>;
  environmentFiles?: Maybe<Array<Maybe<AwsEcsEnvironmentFile>>>;
  id: Scalars['String'];
  memory?: Maybe<Scalars['Int']>;
  memoryReservation?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  resourceRequirements?: Maybe<Array<Maybe<AwsEcsResourceRequirement>>>;
};

export type AwsEcsDeployment = {
  capacityProviderStrategy?: Maybe<Array<Maybe<AwsEcsCapacityProviderStrategyItem>>>;
  createdAt?: Maybe<Scalars['String']>;
  desiredCount?: Maybe<Scalars['Int']>;
  failedTasks?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  launchType?: Maybe<Scalars['String']>;
  networkConfiguration?: Maybe<AwsEcsNetworkConfiguration>;
  pendingCount?: Maybe<Scalars['Int']>;
  platformVersion?: Maybe<Scalars['String']>;
  rolloutState?: Maybe<Scalars['String']>;
  rolloutStateReason?: Maybe<Scalars['String']>;
  runningCount?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  taskDefinition?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type AwsEcsDeploymentCircuitBreaker = {
  enable?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  rollback?: Maybe<Scalars['Boolean']>;
};

export type AwsEcsDeploymentConfiguration = {
  deploymentCircuitBreaker?: Maybe<AwsEcsDeploymentCircuitBreaker>;
  id: Scalars['String'];
  maximumPercent?: Maybe<Scalars['Int']>;
  minimumHealthyPercent?: Maybe<Scalars['Int']>;
};

export type AwsEcsDeploymentController = {
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type AwsEcsDevice = {
  containerPath?: Maybe<Scalars['String']>;
  hostPath?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  permissions?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsEcsDockerLabel = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsDockerVolumeConfiguration = {
  autoprovision?: Maybe<Scalars['Boolean']>;
  driver?: Maybe<Scalars['String']>;
  driverOpts?: Maybe<Array<Maybe<AwsEcsStringMap>>>;
  labels?: Maybe<Array<Maybe<AwsEcsStringMap>>>;
  scope?: Maybe<Scalars['String']>;
};

export type AwsEcsEfsVolumeConfiguration = {
  authorizationConfig?: Maybe<AwsEfsEfsAuthorizationConfig>;
  fileSystemId?: Maybe<Scalars['String']>;
  rootDirectory?: Maybe<Scalars['String']>;
  transitEncryption?: Maybe<Scalars['String']>;
  transitEncryptionPort?: Maybe<Scalars['Int']>;
};

export type AwsEcsEnvironmentFile = {
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
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
  logConfiguration?: Maybe<AwsEcsExecuteCommandLogConfiguration>;
  logging?: Maybe<Scalars['String']>;
};

export type AwsEcsFSxWindowsFileServerAuthorizationConfig = {
  credentialsParameter?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
};

export type AwsEcsFSxWindowsFileServerVolumeConfiguration = {
  authorizationConfig?: Maybe<AwsEcsFSxWindowsFileServerAuthorizationConfig>;
  fileSystemId?: Maybe<Scalars['String']>;
  rootDirectory?: Maybe<Scalars['String']>;
};

export type AwsEcsFirelensConfiguration = {
  options?: Maybe<Array<Maybe<AwsEcsFirelensConfigurationOption>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsEcsFirelensConfigurationOption = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsHealthCheck = {
  command?: Maybe<Array<Maybe<Scalars['String']>>>;
  interval?: Maybe<Scalars['Int']>;
  retries?: Maybe<Scalars['Int']>;
  startPeriod?: Maybe<Scalars['Int']>;
  timeout?: Maybe<Scalars['Int']>;
};

export type AwsEcsHostEntry = {
  hostname?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  ipAddress?: Maybe<Scalars['String']>;
};

export type AwsEcsHostVolumeProperty = {
  sourcePath?: Maybe<Scalars['String']>;
};

export type AwsEcsInferenceAccelerator = {
  deviceName?: Maybe<Scalars['String']>;
  deviceType?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

export type AwsEcsInferenceAcceleratorOverride = {
  deviceName?: Maybe<Scalars['String']>;
  deviceType?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

export type AwsEcsKernelCapabilities = {
  add?: Maybe<Array<Maybe<Scalars['String']>>>;
  drop?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsEcsLinuxParameters = {
  capabilities?: Maybe<AwsEcsKernelCapabilities>;
  devices?: Maybe<Array<Maybe<AwsEcsDevice>>>;
  initProcessEnabled?: Maybe<Scalars['Boolean']>;
  maxSwap?: Maybe<Scalars['Int']>;
  sharedMemorySize?: Maybe<Scalars['Int']>;
  swappiness?: Maybe<Scalars['Int']>;
  tmpfs?: Maybe<Array<Maybe<AwsEcsTmpfs>>>;
};

export type AwsEcsLoadBalancer = {
  containerName?: Maybe<Scalars['String']>;
  containerPort?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  loadBalancerName?: Maybe<Scalars['String']>;
  targetGroupArn?: Maybe<Scalars['String']>;
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
  containerPath?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  readOnly?: Maybe<Scalars['Boolean']>;
  sourceVolume?: Maybe<Scalars['String']>;
};

export type AwsEcsNetworkConfiguration = {
  awsvpcConfiguration?: Maybe<AwsEcsAwsVpcConfiguration>;
};

export type AwsEcsPlacementConstraint = {
  expression?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type AwsEcsPlacementStrategy = {
  field?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type AwsEcsPortMapping = {
  containerPort?: Maybe<Scalars['Int']>;
  hostPort?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  protocol?: Maybe<Scalars['String']>;
};

export type AwsEcsProxyConfiguration = {
  containerName?: Maybe<Scalars['String']>;
  properties?: Maybe<Array<Maybe<AwsEcsProxyConfigurationProperty>>>;
  type?: Maybe<Scalars['String']>;
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
  doubleValue?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  integerValue?: Maybe<Scalars['Int']>;
  longValue?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  stringSetValue?: Maybe<Array<Maybe<Scalars['String']>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsEcsResourceRequirement = {
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsEcsScale = {
  unit?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
};

export type AwsEcsSecret = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  valueFrom?: Maybe<Scalars['String']>;
};

export type AwsEcsService = AwsBaseService & {
  capacityProviderStrategy?: Maybe<Array<Maybe<AwsEcsCapacityProviderStrategyItem>>>;
  createdAt?: Maybe<Scalars['String']>;
  createdBy?: Maybe<Scalars['String']>;
  deploymentConfiguration?: Maybe<AwsEcsDeploymentConfiguration>;
  deploymentController?: Maybe<AwsEcsDeploymentController>;
  deployments?: Maybe<Array<Maybe<AwsEcsDeployment>>>;
  desiredCount?: Maybe<Scalars['Int']>;
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  ecsTaskDefinition?: Maybe<Array<Maybe<AwsEcsTaskDefinition>>>;
  ecsTaskSet?: Maybe<Array<Maybe<AwsEcsTaskSet>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  enableECSManagedTags?: Maybe<Scalars['Boolean']>;
  enableExecuteCommand?: Maybe<Scalars['Boolean']>;
  events?: Maybe<Array<Maybe<AwsEcsServiceEvent>>>;
  healthCheckGracePeriodSeconds?: Maybe<Scalars['Int']>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  launchType?: Maybe<Scalars['String']>;
  loadBalancers?: Maybe<Array<Maybe<AwsEcsLoadBalancer>>>;
  networkConfiguration?: Maybe<AwsEcsNetworkConfiguration>;
  pendingCount?: Maybe<Scalars['Int']>;
  placementConstraints?: Maybe<Array<Maybe<AwsEcsPlacementConstraint>>>;
  placementStrategy?: Maybe<Array<Maybe<AwsEcsPlacementStrategy>>>;
  platformVersion?: Maybe<Scalars['String']>;
  propagateTags?: Maybe<Scalars['String']>;
  roleArn?: Maybe<Scalars['String']>;
  runningCount?: Maybe<Scalars['Int']>;
  schedulingStrategy?: Maybe<Scalars['String']>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  serviceName?: Maybe<Scalars['String']>;
  serviceRegistries?: Maybe<Array<Maybe<AwsEcsServiceRegistry>>>;
  status?: Maybe<Scalars['String']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsEcsServiceEvent = {
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  message?: Maybe<Scalars['String']>;
};

export type AwsEcsServiceRegistry = {
  containerName?: Maybe<Scalars['String']>;
  containerPort?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  port?: Maybe<Scalars['Int']>;
  registryArn?: Maybe<Scalars['String']>;
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

export type AwsEcsTask = AwsBaseService & {
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
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  ecsContainer?: Maybe<Array<Maybe<AwsEcsContainer>>>;
  ecsTaskDefinition?: Maybe<Array<Maybe<AwsEcsTaskDefinition>>>;
  enableExecuteCommand?: Maybe<Scalars['Boolean']>;
  ephemeralStorage?: Maybe<AwsEcsEphemeralStorage>;
  executionStoppedAt?: Maybe<Scalars['String']>;
  group?: Maybe<Scalars['String']>;
  healthStatus?: Maybe<Scalars['String']>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
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
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  version?: Maybe<Scalars['Int']>;
};

export type AwsEcsTaskDefinition = AwsBaseService & {
  compatibilities?: Maybe<Array<Maybe<Scalars['String']>>>;
  containerDefinitions?: Maybe<Array<Maybe<AwsEcsContainerDefinition>>>;
  cpu?: Maybe<Scalars['String']>;
  deregisteredAt?: Maybe<Scalars['String']>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  ecsTask?: Maybe<Array<Maybe<AwsEcsTask>>>;
  ecsTaskSet?: Maybe<Array<Maybe<AwsEcsTaskSet>>>;
  ephemeralStorage?: Maybe<AwsEcsEphemeralStorage>;
  executionRoleArn?: Maybe<Scalars['String']>;
  family?: Maybe<Scalars['String']>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  inferenceAccelerators?: Maybe<Array<Maybe<AwsEcsInferenceAccelerator>>>;
  ipcMode?: Maybe<Scalars['String']>;
  memory?: Maybe<Scalars['String']>;
  networkMode?: Maybe<Scalars['String']>;
  pidMode?: Maybe<Scalars['String']>;
  placementConstraints?: Maybe<Array<Maybe<AwsEcsTaskDefinitionPlacementConstraint>>>;
  proxyConfiguration?: Maybe<AwsEcsProxyConfiguration>;
  registeredAt?: Maybe<Scalars['String']>;
  registeredBy?: Maybe<Scalars['String']>;
  requiresAttributes?: Maybe<Array<Maybe<AwsEcsAttribute>>>;
  requiresCompatibilities?: Maybe<Array<Maybe<Scalars['String']>>>;
  revision?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['String']>;
  taskRoleArn?: Maybe<Scalars['String']>;
  volumes?: Maybe<Array<Maybe<AwsEcsVolume>>>;
};

export type AwsEcsTaskDefinitionPlacementConstraint = {
  expression?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type AwsEcsTaskOverride = {
  containerOverrides?: Maybe<Array<Maybe<AwsEcsContainerOverride>>>;
  cpu?: Maybe<Scalars['String']>;
  ephemeralStorage?: Maybe<AwsEcsEphemeralStorage>;
  executionRoleArn?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  inferenceAcceleratorOverrides?: Maybe<Array<Maybe<AwsEcsInferenceAcceleratorOverride>>>;
  memory?: Maybe<Scalars['String']>;
  taskRoleArn?: Maybe<Scalars['String']>;
};

export type AwsEcsTaskSet = AwsBaseService & {
  capacityProviderStrategy?: Maybe<Array<Maybe<AwsEcsCapacityProviderStrategyItem>>>;
  computedDesiredCount?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  ecsTaskDefinition?: Maybe<Array<Maybe<AwsEcsTaskDefinition>>>;
  externalId?: Maybe<Scalars['String']>;
  launchType?: Maybe<Scalars['String']>;
  loadBalancers?: Maybe<Array<Maybe<AwsEcsLoadBalancer>>>;
  networkConfiguration?: Maybe<AwsEcsNetworkConfiguration>;
  pendingCount?: Maybe<Scalars['Int']>;
  platformVersion?: Maybe<Scalars['String']>;
  runningCount?: Maybe<Scalars['Int']>;
  scale?: Maybe<AwsEcsScale>;
  serviceRegistries?: Maybe<Array<Maybe<AwsEcsServiceRegistry>>>;
  stabilityStatus?: Maybe<Scalars['String']>;
  stabilityStatusAt?: Maybe<Scalars['String']>;
  startedBy?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type AwsEcsTmpfs = {
  containerPath?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  mountOptions?: Maybe<Array<Maybe<Scalars['String']>>>;
  size?: Maybe<Scalars['Int']>;
};

export type AwsEcsUlimit = {
  hardLimit?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  softLimit?: Maybe<Scalars['Int']>;
};

export type AwsEcsVolume = {
  dockerVolumeConfiguration?: Maybe<AwsEcsDockerVolumeConfiguration>;
  efsVolumeConfiguration?: Maybe<AwsEcsEfsVolumeConfiguration>;
  fsxWindowsFileServerVolumeConfiguration?: Maybe<AwsEcsFSxWindowsFileServerVolumeConfiguration>;
  host?: Maybe<AwsEcsHostVolumeProperty>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type AwsEcsVolumeFrom = {
  id: Scalars['String'];
  readOnly?: Maybe<Scalars['Boolean']>;
  sourceContainer?: Maybe<Scalars['String']>;
};

export type AwsEcsversionInfo = {
  agentHash?: Maybe<Scalars['String']>;
  agentVersion?: Maybe<Scalars['String']>;
  dockerVersion?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

export type AwsEfs = AwsBaseService & {
  availabilityZoneId?: Maybe<Scalars['String']>;
  availabilityZoneName?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['String']>;
  creationToken?: Maybe<Scalars['String']>;
  efsMountTarget?: Maybe<Array<Maybe<AwsEfsMountTarget>>>;
  encrypted?: Maybe<Scalars['Boolean']>;
  fileSystemId?: Maybe<Scalars['String']>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  lifeCycleState?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  numberOfMountTargets?: Maybe<Scalars['Int']>;
  ownerId?: Maybe<Scalars['String']>;
  performanceMode?: Maybe<Scalars['String']>;
  provisionedThroughputInMibps?: Maybe<Scalars['Int']>;
  sizeInBytes?: Maybe<AwsEfsFileSystemSize>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  throughputMode?: Maybe<Scalars['String']>;
};

export type AwsEfsEfsAuthorizationConfig = {
  accessPointId?: Maybe<Scalars['String']>;
  iam?: Maybe<Scalars['String']>;
};

export type AwsEfsFileSystemSize = {
  timestamp?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int64']>;
  valueInIA?: Maybe<Scalars['Int64']>;
  valueInStandard?: Maybe<Scalars['Int64']>;
};

export type AwsEfsMountTarget = AwsOptionalService & {
  availabilityZoneId?: Maybe<Scalars['String']>;
  availabilityZoneName?: Maybe<Scalars['String']>;
  efs?: Maybe<Array<Maybe<AwsEfs>>>;
  fileSystemId?: Maybe<Scalars['String']>;
  ipAddress?: Maybe<Scalars['String']>;
  lifeCycleState?: Maybe<Scalars['String']>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  ownerId?: Maybe<Scalars['String']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsEip = AwsBaseService & {
  customerOwnedIp?: Maybe<Scalars['String']>;
  customerOwnedIpv4Pool?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  ec2InstanceAssociationId?: Maybe<Scalars['String']>;
  instanceId?: Maybe<Scalars['String']>;
  isVpc?: Maybe<Scalars['String']>;
  networkBorderGroup?: Maybe<Scalars['String']>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  networkInterfaceId?: Maybe<Scalars['String']>;
  networkInterfaceOwnerId?: Maybe<Scalars['String']>;
  privateIp?: Maybe<Scalars['String']>;
  publicIp?: Maybe<Scalars['String']>;
  publicIpv4Pool?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsEksCertificate = {
  data?: Maybe<Scalars['String']>;
};

export type AwsEksCluster = AwsBaseService & {
  certificateAuthority?: Maybe<AwsEksCertificate>;
  clientRequestToken?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  ec2Instances?: Maybe<Array<Maybe<AwsEc2>>>;
  encryptionConfig?: Maybe<Array<Maybe<AwsEksEncryptionConfig>>>;
  endpoint?: Maybe<Scalars['String']>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  identity?: Maybe<AwsEksIdentity>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kubernetesNetworkConfig?: Maybe<AwsEksKubernetesNetworkConfigResponse>;
  logging?: Maybe<AwsEksLogging>;
  name?: Maybe<Scalars['String']>;
  platformVersion?: Maybe<Scalars['String']>;
  resourcesVpcConfig?: Maybe<AwsEksVpcConfigResponse>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  status?: Maybe<Scalars['String']>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  version?: Maybe<Scalars['String']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsEksEncryptionConfig = {
  id: Scalars['String'];
  provider?: Maybe<AwsEksProvider>;
  resources?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsEksIdentity = {
  oidc?: Maybe<AwsEksOidc>;
};

export type AwsEksKubernetesNetworkConfigResponse = {
  ipFamily?: Maybe<Scalars['String']>;
  serviceIpv4Cidr?: Maybe<Scalars['String']>;
  serviceIpv6Cidr?: Maybe<Scalars['String']>;
};

export type AwsEksLogSetup = {
  enabled?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  types?: Maybe<Array<Maybe<Scalars['String']>>>;
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
  clusterSecurityGroupId?: Maybe<Scalars['String']>;
  endpointPrivateAccess?: Maybe<Scalars['Boolean']>;
  endpointPublicAccess?: Maybe<Scalars['Boolean']>;
  publicAccessCidrs?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  subnetIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheCloudWatchLogsDestinationDetails = {
  logGroup?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheCluster = AwsBaseService & {
  atRestEncryptionEnabled?: Maybe<Scalars['Boolean']>;
  authTokenEnabled?: Maybe<Scalars['Boolean']>;
  authTokenLastModifiedDate?: Maybe<Scalars['String']>;
  autoMinorVersionUpgrade?: Maybe<Scalars['Boolean']>;
  cacheClusterCreateTime?: Maybe<Scalars['String']>;
  cacheClusterId?: Maybe<Scalars['String']>;
  cacheClusterStatus?: Maybe<Scalars['String']>;
  cacheNodeType?: Maybe<Scalars['String']>;
  cacheNodes?: Maybe<Array<Maybe<AwsElastiCacheNode>>>;
  cacheParameterGroup?: Maybe<AwsElastiCacheParameterGroupStatus>;
  cacheSecurityGroups?: Maybe<Array<Maybe<AwsElastiCacheSecurityGroupMembership>>>;
  cacheSubnetGroup?: Maybe<AwsCacheSubnetGroup>;
  clientDownloadLandingPage?: Maybe<Scalars['String']>;
  configurationEndpoint?: Maybe<AwsElastiCacheEndpoint>;
  engine?: Maybe<Scalars['String']>;
  engineVersion?: Maybe<Scalars['String']>;
  logDeliveryConfigurations?: Maybe<Array<Maybe<AwsElastiCacheLogDeliveryConfiguration>>>;
  notificationConfiguration?: Maybe<AwsElastiCacheNotificationConfiguration>;
  numCacheNodes?: Maybe<Scalars['Int']>;
  pendingModifiedValues?: Maybe<AwsElastiCachePendingModifiedValues>;
  preferredAvailabilityZone?: Maybe<Scalars['String']>;
  preferredMaintenanceWindow?: Maybe<Scalars['String']>;
  preferredOutpostArn?: Maybe<Scalars['String']>;
  replicationGroupId?: Maybe<Scalars['String']>;
  replicationGroupLogDeliveryEnabled?: Maybe<Scalars['Boolean']>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  snapshotRetentionLimit?: Maybe<Scalars['Int']>;
  snapshotWindow?: Maybe<Scalars['String']>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  transitEncryptionEnabled?: Maybe<Scalars['Boolean']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
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
  destinationDetails?: Maybe<AwsElastiCacheDestinationDetails>;
  destinationType?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  logFormat?: Maybe<Scalars['String']>;
  logType?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheNode = {
  cacheNodeCreateTime?: Maybe<Scalars['String']>;
  cacheNodeId?: Maybe<Scalars['String']>;
  cacheNodeStatus?: Maybe<Scalars['String']>;
  customerAvailabilityZone?: Maybe<Scalars['String']>;
  customerOutpostArn?: Maybe<Scalars['String']>;
  endpoint?: Maybe<AwsElastiCacheEndpoint>;
  id: Scalars['String'];
  parameterGroupStatus?: Maybe<Scalars['String']>;
  sourceCacheNodeId?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheNodeGroup = {
  id: Scalars['String'];
  nodeGroupId?: Maybe<Scalars['String']>;
  nodeGroupMembers?: Maybe<Array<Maybe<AwsElastiCacheNodeGroupMember>>>;
  primaryEndpoint?: Maybe<AwsElastiCacheEndpoint>;
  readerEndpoint?: Maybe<AwsElastiCacheEndpoint>;
  slots?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheNodeGroupMember = {
  cacheClusterId?: Maybe<Scalars['String']>;
  cacheNodeId?: Maybe<Scalars['String']>;
  currentRole?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  preferredAvailabilityZone?: Maybe<Scalars['String']>;
  preferredOutpostArn?: Maybe<Scalars['String']>;
  readEndpoint?: Maybe<AwsElastiCacheEndpoint>;
};

export type AwsElastiCacheNotificationConfiguration = {
  topicArn?: Maybe<Scalars['String']>;
  topicStatus?: Maybe<Scalars['String']>;
};

export type AwsElastiCacheParameterGroupStatus = {
  cacheNodeIdsToReboot?: Maybe<Array<Maybe<Scalars['String']>>>;
  cacheParameterGroupName?: Maybe<Scalars['String']>;
  parameterApplyStatus?: Maybe<Scalars['String']>;
};

export type AwsElastiCachePendingLogDeliveryConfiguration = {
  destinationDetails?: Maybe<AwsElastiCacheDestinationDetails>;
  destinationType?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  logFormat?: Maybe<Scalars['String']>;
  logType?: Maybe<Scalars['String']>;
};

export type AwsElastiCachePendingModifiedValues = {
  authTokenStatus?: Maybe<Scalars['String']>;
  cacheNodeIdsToRemove?: Maybe<Array<Maybe<Scalars['String']>>>;
  cacheNodeType?: Maybe<Scalars['String']>;
  engineVersion?: Maybe<Scalars['String']>;
  logDeliveryConfigurations?: Maybe<Array<Maybe<AwsElastiCachePendingLogDeliveryConfiguration>>>;
  numCacheNodes?: Maybe<Scalars['Int']>;
};

export type AwsElastiCacheReplicationGroup = AwsBaseService & {
  atRestEncryptionEnabled?: Maybe<Scalars['Boolean']>;
  authTokenEnabled?: Maybe<Scalars['Boolean']>;
  authTokenLastModifiedDate?: Maybe<Scalars['String']>;
  automaticFailover?: Maybe<Scalars['String']>;
  cacheNodeType?: Maybe<Scalars['String']>;
  clusterEnabled?: Maybe<Scalars['Boolean']>;
  configurationEndpoint?: Maybe<AwsElastiCacheEndpoint>;
  description?: Maybe<Scalars['String']>;
  globalReplicationGroupInfo?: Maybe<AwsElastiCacheGlobalReplicationGroupInfo>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  logDeliveryConfigurations?: Maybe<Array<Maybe<AwsElastiCacheLogDeliveryConfiguration>>>;
  memberClusters?: Maybe<Array<Maybe<Scalars['String']>>>;
  memberClustersOutpostArns?: Maybe<Array<Maybe<Scalars['String']>>>;
  multiAZ?: Maybe<Scalars['String']>;
  nodeGroups?: Maybe<Array<Maybe<AwsElastiCacheNodeGroup>>>;
  pendingModifiedValues?: Maybe<AwsElastiCacheReplicationGroupPendingModifiedValues>;
  replicationGroupCreateTime?: Maybe<Scalars['String']>;
  replicationGroupId?: Maybe<Scalars['String']>;
  snapshotRetentionLimit?: Maybe<Scalars['Int']>;
  snapshotWindow?: Maybe<Scalars['String']>;
  snapshottingClusterId?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  transitEncryptionEnabled?: Maybe<Scalars['Boolean']>;
  userGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsElastiCacheReplicationGroupPendingModifiedValues = {
  authTokenStatus?: Maybe<Scalars['String']>;
  automaticFailoverStatus?: Maybe<Scalars['String']>;
  logDeliveryConfigurations?: Maybe<Array<Maybe<AwsElastiCachePendingLogDeliveryConfiguration>>>;
  primaryClusterId?: Maybe<Scalars['String']>;
  resharding?: Maybe<AwsElastiCacheReshardingStatus>;
  userGroups?: Maybe<AwsElastiCacheUserGroupsUpdateStatus>;
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

export type AwsElasticBeanstalkApp = AwsBaseService & {
  description?: Maybe<Scalars['String']>;
  elasticBeanstalkEnvs?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  iamServiceRole?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsElasticBeanstalkEnv = AwsBaseService & {
  albs?: Maybe<Array<Maybe<AwsAlb>>>;
  applicationName?: Maybe<Scalars['String']>;
  asgs?: Maybe<Array<Maybe<AwsAsg>>>;
  cname?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  ec2Instances?: Maybe<Array<Maybe<AwsEc2>>>;
  elasticBeanstalkApp?: Maybe<Array<Maybe<AwsElasticBeanstalkApp>>>;
  elbs?: Maybe<Array<Maybe<AwsElb>>>;
  endpointUrl?: Maybe<Scalars['String']>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  name?: Maybe<Scalars['String']>;
  platformArn?: Maybe<Scalars['String']>;
  resources?: Maybe<Array<Maybe<AwsElasticBeanstalkEnvResource>>>;
  settings?: Maybe<Array<Maybe<AwsElasticBeanstalkEnvSetting>>>;
  solutionStackName?: Maybe<Scalars['String']>;
  sqsQueues?: Maybe<Array<Maybe<AwsSqs>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  tier?: Maybe<Scalars['String']>;
  versionLabel?: Maybe<Scalars['String']>;
};

export type AwsElasticBeanstalkEnvResource = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsElasticBeanstalkEnvSetting = {
  id: Scalars['String'];
  namespace?: Maybe<Scalars['String']>;
  optionName?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchAdvancedSecurityOptions = {
  anonymousAuthDisableDate?: Maybe<Scalars['DateTime']>;
  anonymousAuthEnabled?: Maybe<Scalars['Boolean']>;
  enabled?: Maybe<Scalars['Boolean']>;
  internalUserDatabaseEnabled?: Maybe<Scalars['Boolean']>;
  samlOptions?: Maybe<AwsElasticSearchAdvancedSecurityOptionsSamlOptions>;
};

export type AwsElasticSearchAdvancedSecurityOptionsSamlOptions = {
  enabled?: Maybe<Scalars['Boolean']>;
  idp?: Maybe<AwsElasticSearchAdvancedSecurityOptionsSamlOptionsIdp>;
  rolesKey?: Maybe<Scalars['String']>;
  sessionTimeoutMinutes?: Maybe<Scalars['Int']>;
  subjectKey?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchAdvancedSecurityOptionsSamlOptionsIdp = {
  entityId?: Maybe<Scalars['String']>;
  metadataContent?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchAutoTuneOptions = {
  errorMessage?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchChangeProcessDetails = {
  changeId?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchClusterConfig = {
  coldStorageOptions?: Maybe<AwsElasticSearchClusterConfigColdStorageOptions>;
  dedicatedMasterCount?: Maybe<Scalars['Int']>;
  dedicatedMasterEnabled?: Maybe<Scalars['Boolean']>;
  dedicatedMasterType?: Maybe<Scalars['String']>;
  instanceCount?: Maybe<Scalars['Int']>;
  instanceType?: Maybe<Scalars['String']>;
  warmCount?: Maybe<Scalars['Int']>;
  warmEnabled?: Maybe<Scalars['Boolean']>;
  warmType?: Maybe<Scalars['String']>;
  zoneAwarenessConfig?: Maybe<AwsElasticSearchClusterConfigZoneAwarenessConfig>;
  zoneAwarenessEnabled?: Maybe<Scalars['Boolean']>;
};

export type AwsElasticSearchClusterConfigColdStorageOptions = {
  enabled?: Maybe<Scalars['Boolean']>;
};

export type AwsElasticSearchClusterConfigZoneAwarenessConfig = {
  availabilityZoneCount?: Maybe<Scalars['Int']>;
};

export type AwsElasticSearchCognitoOptions = {
  enabled?: Maybe<Scalars['Boolean']>;
  identityPoolId?: Maybe<Scalars['String']>;
  roleArn?: Maybe<Scalars['String']>;
  userPoolId?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchDomain = AwsBaseService & {
  accessPolicies?: Maybe<AwsIamJsonPolicy>;
  advancedOptions?: Maybe<Array<Maybe<AwsRawTag>>>;
  advancedSecurityOptions?: Maybe<AwsElasticSearchAdvancedSecurityOptions>;
  autoTuneOptions?: Maybe<AwsElasticSearchAutoTuneOptions>;
  changeProcessDetails?: Maybe<AwsElasticSearchChangeProcessDetails>;
  cloudwatchLogs?: Maybe<Array<Maybe<AwsCloudwatchLog>>>;
  cognitoIdentityPool?: Maybe<Array<Maybe<AwsCognitoIdentityPool>>>;
  cognitoOptions?: Maybe<AwsElasticSearchCognitoOptions>;
  cognitoUserPool?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  created?: Maybe<Scalars['Boolean']>;
  deleted?: Maybe<Scalars['Boolean']>;
  domainEndpointOptions?: Maybe<AwsElasticSearchDomainEndpointOptions>;
  domainName?: Maybe<Scalars['String']>;
  ebsOptions?: Maybe<AwsElasticSearchEbsOptions>;
  elasticSearchClusterConfig?: Maybe<AwsElasticSearchClusterConfig>;
  elasticSearchVersion?: Maybe<Scalars['String']>;
  encryptionAtRestOptions?: Maybe<AwsElasticSearchEncryptionAtRestOptions>;
  endpoint?: Maybe<Scalars['String']>;
  endpoints?: Maybe<Array<Maybe<AwsRawTag>>>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  logPublishingOptions?: Maybe<Array<Maybe<AwsElasticSearchLogPublishingOption>>>;
  nodeToNodeEncryptionOptions?: Maybe<AwsElasticSearchNodeToNodeEncryptionOptions>;
  processing?: Maybe<Scalars['Boolean']>;
  rawPolicy?: Maybe<Scalars['String']>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  serviceSoftwareOptions?: Maybe<AwsElasticSearchServiceSoftwareOptions>;
  snapshotOptions?: Maybe<AwsElasticSearchSnapshotOptions>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  upgradeProcessing?: Maybe<Scalars['Boolean']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcOptions?: Maybe<AwsElasticSearchVpcOptions>;
};

export type AwsElasticSearchDomainEndpointOptions = {
  customEndpoint?: Maybe<Scalars['String']>;
  customEndpointCertificateArn?: Maybe<Scalars['String']>;
  customEndpointEnabled?: Maybe<Scalars['Boolean']>;
  enforceHttps?: Maybe<Scalars['Boolean']>;
  tlsSecurityPolicy?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchEbsOptions = {
  ebsEnabled?: Maybe<Scalars['Boolean']>;
  iops?: Maybe<Scalars['Int']>;
  volumeSize?: Maybe<Scalars['Int']>;
  volumeType?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchEncryptionAtRestOptions = {
  enabled?: Maybe<Scalars['Boolean']>;
  kmsKeyId?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchLogPublishingOption = {
  cloudWatchLogsLogGroupArn?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchNodeToNodeEncryptionOptions = {
  enabled?: Maybe<Scalars['Boolean']>;
};

export type AwsElasticSearchServiceSoftwareOptions = {
  automatedUpdateDate?: Maybe<Scalars['DateTime']>;
  cancellable?: Maybe<Scalars['Boolean']>;
  currentVersion?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  newVersion?: Maybe<Scalars['String']>;
  optionalDeployment?: Maybe<Scalars['Boolean']>;
  updateAvailable?: Maybe<Scalars['Boolean']>;
  updateStatus?: Maybe<Scalars['String']>;
};

export type AwsElasticSearchSnapshotOptions = {
  automatedSnapshotStartHour?: Maybe<Scalars['Int']>;
};

export type AwsElasticSearchVpcOptions = {
  availabilityZones?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  subnetIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsElb = AwsBaseService & {
  accessLogs?: Maybe<Scalars['String']>;
  cloudfrontDistribution?: Maybe<Array<Maybe<AwsCloudfront>>>;
  createdAt?: Maybe<Scalars['String']>;
  crossZoneLoadBalancing?: Maybe<Scalars['String']>;
  dnsName?: Maybe<Scalars['String']>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  elasticBeanstalkEnvs?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  healthCheck?: Maybe<AwsElbHealthCheck>;
  hostedZone?: Maybe<Scalars['String']>;
  idleTimeout?: Maybe<Scalars['String']>;
  instances?: Maybe<AwsElbInstances>;
  listeners?: Maybe<Array<Maybe<AwsElbListener>>>;
  name?: Maybe<Scalars['String']>;
  route53Record?: Maybe<Array<Maybe<AwsRoute53Record>>>;
  scheme?: Maybe<Scalars['String']>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  securityGroupsIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  sourceSecurityGroup?: Maybe<AwsElbSourceSecurityGroup>;
  status?: Maybe<Scalars['String']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  subnets?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  type?: Maybe<Scalars['String']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsElbHealthCheck = {
  healthyThreshold?: Maybe<Scalars['Int']>;
  interval?: Maybe<Scalars['String']>;
  target: Scalars['String'];
  timeout?: Maybe<Scalars['String']>;
  unhealthyThreshold?: Maybe<Scalars['Int']>;
};

export type AwsElbInstances = {
  connectionDraining?: Maybe<Scalars['String']>;
  connectionDrainingTimeout?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
};

export type AwsElbListener = {
  id: Scalars['String'];
  instancePort?: Maybe<Scalars['Int']>;
  instanceProtocol?: Maybe<Scalars['String']>;
  loadBalancerPort?: Maybe<Scalars['Int']>;
  loadBalancerProtocol?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  sslCertificateId?: Maybe<Scalars['String']>;
};

export type AwsElbSourceSecurityGroup = {
  groupName: Scalars['String'];
  ownerAlias?: Maybe<Scalars['String']>;
};

export type AwsEmrCluster = AwsBaseService & {
  applications?: Maybe<Array<Maybe<AwsEmrClusterApplication>>>;
  autoTerminate?: Maybe<Scalars['Boolean']>;
  configurations?: Maybe<Array<Maybe<AwsEmrClusterConfiguration>>>;
  customAmiId?: Maybe<Scalars['String']>;
  ebsRootVolumeSize?: Maybe<Scalars['Int']>;
  ec2InstanceAttributes?: Maybe<AwsEmrClusterEc2InstanceAttributes>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  instanceCollectionType?: Maybe<Scalars['String']>;
  kerberosAttributes?: Maybe<AwsEmrClusterKerberosAttributes>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  logEncryptionKmsKeyId?: Maybe<Scalars['String']>;
  logUri?: Maybe<Scalars['String']>;
  masterPublicDnsName?: Maybe<Scalars['String']>;
  normalizedInstanceHours?: Maybe<Scalars['Int']>;
  outpostArn?: Maybe<Scalars['String']>;
  placementGroups?: Maybe<Array<Maybe<AwsEmrClusterPlacementGroupConfig>>>;
  releaseLabel?: Maybe<Scalars['String']>;
  repoUpgradeOnBoot?: Maybe<Scalars['String']>;
  requestedAmiVersion?: Maybe<Scalars['String']>;
  runningAmiVersion?: Maybe<Scalars['String']>;
  scaleDownBehavior?: Maybe<Scalars['String']>;
  securityConfiguration?: Maybe<Scalars['String']>;
  status?: Maybe<AwsEmrClusterStatus>;
  stepConcurrencyLevel?: Maybe<Scalars['Int']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  terminationProtected?: Maybe<Scalars['Boolean']>;
  visibleToAllUsers?: Maybe<Scalars['Boolean']>;
};

export type AwsEmrFailureDetails = {
  logFile?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  reason?: Maybe<Scalars['String']>;
};

export type AwsEmrHadoopStepConfig = {
  args?: Maybe<Array<Maybe<Scalars['String']>>>;
  jar?: Maybe<Scalars['String']>;
  mainClass?: Maybe<Scalars['String']>;
  properties?: Maybe<Array<Maybe<AwsStringMap>>>;
};

export type AwsEmrInstance = AwsOptionalService & {
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  ec2InstanceId?: Maybe<Scalars['String']>;
  instanceFleetId?: Maybe<Scalars['String']>;
  instanceGroupId?: Maybe<Scalars['String']>;
  instanceType?: Maybe<Scalars['String']>;
  market?: Maybe<Scalars['String']>;
  privateDnsName?: Maybe<Scalars['String']>;
  privateIpAddress?: Maybe<Scalars['String']>;
  publicDnsName?: Maybe<Scalars['String']>;
  publicIpAddress?: Maybe<Scalars['String']>;
  status?: Maybe<AwsEmrInstanceStatus>;
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
  endDateTime?: Maybe<Scalars['String']>;
  readyDateTime?: Maybe<Scalars['String']>;
};

export type AwsEmrStep = AwsOptionalService & {
  actionOnFailure?: Maybe<Scalars['String']>;
  config?: Maybe<AwsEmrHadoopStepConfig>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<AwsEmrStepStatus>;
};

export type AwsEmrStepStateChangeReason = {
  code?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type AwsEmrStepStatus = {
  failureDetails?: Maybe<AwsEmrFailureDetails>;
  state?: Maybe<Scalars['String']>;
  stateChangeReason?: Maybe<AwsEmrStepStateChangeReason>;
  timeline?: Maybe<AwsEmrStepTimeline>;
};

export type AwsEmrStepTimeline = {
  creationDateTime?: Maybe<Scalars['String']>;
  endDateTime?: Maybe<Scalars['String']>;
  startDateTime?: Maybe<Scalars['String']>;
};

export type AwsEnabledMetrics = {
  granularity?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  metric: Scalars['String'];
};

export type AwsFederatedAuthentication = {
  samlProviderArn?: Maybe<Scalars['String']>;
  selfServiceSamlProviderArn?: Maybe<Scalars['String']>;
};

export type AwsFlowLog = AwsBaseService & {
  creationTime?: Maybe<Scalars['String']>;
  deliverLogsErrorMessage?: Maybe<Scalars['String']>;
  deliverLogsPermissionArn?: Maybe<Scalars['String']>;
  deliverLogsStatus?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  destinationType?: Maybe<Scalars['String']>;
  format?: Maybe<Scalars['String']>;
  groupName?: Maybe<Scalars['String']>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  logStatus?: Maybe<Scalars['String']>;
  maxAggregationInterval?: Maybe<Scalars['Int']>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  resourceId?: Maybe<Scalars['String']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  trafficType?: Maybe<Scalars['String']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsGlueJob = AwsBaseService & {
  allocatedCapacity?: Maybe<Scalars['Int']>;
  command?: Maybe<AwsGlueJobCommand>;
  connections?: Maybe<AwsGlueJobConnections>;
  createdOn?: Maybe<Scalars['DateTime']>;
  defaultArguments?: Maybe<Array<Maybe<AwsRawTag>>>;
  description?: Maybe<Scalars['String']>;
  executionProperty?: Maybe<AwsGlueJobExecutionProperty>;
  glueVersion?: Maybe<Scalars['String']>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  lastModifiedOn?: Maybe<Scalars['DateTime']>;
  logUri?: Maybe<Scalars['String']>;
  maxCapacity?: Maybe<Scalars['Int']>;
  maxRetries?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  nonOverrideableArguments?: Maybe<Array<Maybe<AwsRawTag>>>;
  notificationProperty?: Maybe<AwsGlueJobNotificationProperty>;
  numberOfWorkers?: Maybe<Scalars['Int']>;
  role?: Maybe<Scalars['String']>;
  securityConfiguration?: Maybe<Scalars['String']>;
  timeout?: Maybe<Scalars['Int']>;
  workerType?: Maybe<Scalars['String']>;
};

export type AwsGlueJobCommand = {
  name?: Maybe<Scalars['String']>;
  pythonVersion?: Maybe<Scalars['String']>;
  scriptLocation?: Maybe<Scalars['String']>;
};

export type AwsGlueJobConnections = {
  connections?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsGlueJobExecutionProperty = {
  maxConcurrentRuns?: Maybe<Scalars['Int']>;
};

export type AwsGlueJobNotificationProperty = {
  notifyDelayAfter?: Maybe<Scalars['Int']>;
};

export type AwsGlueRegistry = AwsBaseService & {
  createdTime?: Maybe<Scalars['String']>;
  registryArn?: Maybe<Scalars['String']>;
  registryName?: Maybe<Scalars['String']>;
  schemas?: Maybe<Array<Maybe<AwsGlueRegistrySchema>>>;
  status?: Maybe<Scalars['String']>;
  updatedTime?: Maybe<Scalars['String']>;
};

export type AwsGlueRegistrySchema = {
  arn?: Maybe<Scalars['String']>;
  createdTime?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  registryArn?: Maybe<Scalars['String']>;
  registryName?: Maybe<Scalars['String']>;
  schemaName?: Maybe<Scalars['String']>;
  schemaStatus?: Maybe<Scalars['String']>;
};

export type AwsGuardDutyDataSource = {
  status?: Maybe<Scalars['String']>;
};

export type AwsGuardDutyDataSources = {
  cloudTrail?: Maybe<AwsGuardDutyDataSource>;
  dnsLogs?: Maybe<AwsGuardDutyDataSource>;
  flowLogs?: Maybe<AwsGuardDutyDataSource>;
  s3Logs?: Maybe<AwsGuardDutyDataSource>;
};

export type AwsGuardDutyDetector = AwsOptionalService & {
  createdAt?: Maybe<Scalars['DateTime']>;
  dataSources?: Maybe<AwsGuardDutyDataSources>;
  findingPublishingFrequency?: Maybe<Scalars['String']>;
  iamRole?: Maybe<AwsIamRole>;
  members?: Maybe<Array<Maybe<AwsGuardDutyMember>>>;
  serviceRole?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type AwsGuardDutyMember = {
  accountId: Scalars['String'];
  detectorId?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  invitedAt?: Maybe<Scalars['DateTime']>;
  masterId?: Maybe<Scalars['String']>;
  relationshipStatus?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type AwsIamAccessAnalyzer = AwsBaseService & {
  createdAt?: Maybe<Scalars['DateTime']>;
  lastResourceAnalyzed?: Maybe<Scalars['String']>;
  lastResourceAnalyzedAt?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  statusReasonCode?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsIamAccessKey = {
  accessKeyId: Scalars['String'];
  createDate?: Maybe<Scalars['String']>;
  lastRotated?: Maybe<Scalars['String']>;
  lastUsedDate?: Maybe<Scalars['String']>;
  lastUsedRegion?: Maybe<Scalars['String']>;
  lastUsedService?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsIamGroup = AwsBaseService & {
  iamAttachedPolicies?: Maybe<Array<Maybe<AwsIamPolicy>>>;
  iamUsers?: Maybe<Array<Maybe<AwsIamUser>>>;
  inlinePolicies?: Maybe<Array<Maybe<Scalars['String']>>>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
};

export type AwsIamInstanceProfile = AwsBaseService & {
  createDate?: Maybe<Scalars['DateTime']>;
  ec2Instances?: Maybe<Array<Maybe<AwsEc2>>>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsIamJsonPolicy = {
  id: Scalars['String'];
  statement?: Maybe<Array<Maybe<AwsIamJsonPolicyStatement>>>;
  version?: Maybe<Scalars['String']>;
};

export type AwsIamJsonPolicyCondition = {
  id?: Maybe<Scalars['ID']>;
  key?: Maybe<Scalars['String']>;
  operator?: Maybe<Scalars['String']>;
  value?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsIamJsonPolicyPrincipal = {
  id?: Maybe<Scalars['ID']>;
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsIamJsonPolicyStatement = {
  action?: Maybe<Array<Maybe<Scalars['String']>>>;
  condition?: Maybe<Array<Maybe<AwsIamJsonPolicyCondition>>>;
  effect?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  notAction?: Maybe<Array<Maybe<Scalars['String']>>>;
  notPrincipal?: Maybe<Array<Maybe<AwsIamJsonPolicyPrincipal>>>;
  notResource?: Maybe<Array<Maybe<Scalars['String']>>>;
  principal?: Maybe<Array<Maybe<AwsIamJsonPolicyPrincipal>>>;
  resource?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsIamMfaDevice = {
  enableDate?: Maybe<Scalars['String']>;
  serialNumber: Scalars['String'];
};

export type AwsIamOpenIdConnectProvider = {
  accountId: Scalars['String'];
  arn: Scalars['String'];
  awsCognitoIdentityPool?: Maybe<Array<Maybe<AwsCognitoIdentityPool>>>;
  cgId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  region?: Maybe<Scalars['String']>;
};

export type AwsIamPasswordPolicy = {
  accountId: Scalars['String'];
  allowUsersToChangePassword?: Maybe<Scalars['Boolean']>;
  expirePasswords?: Maybe<Scalars['Boolean']>;
  hardExpiry?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  maxPasswordAge?: Maybe<Scalars['Int']>;
  minimumPasswordLength?: Maybe<Scalars['Int']>;
  passwordReusePrevention?: Maybe<Scalars['Int']>;
  requireLowercaseCharacters?: Maybe<Scalars['Boolean']>;
  requireNumbers?: Maybe<Scalars['Boolean']>;
  requireSymbols?: Maybe<Scalars['Boolean']>;
  requireUppercaseCharacters?: Maybe<Scalars['Boolean']>;
};

export type AwsIamPolicy = AwsBaseService & {
  description?: Maybe<Scalars['String']>;
  iamGroups?: Maybe<Array<Maybe<AwsIamGroup>>>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  iamUsers?: Maybe<Array<Maybe<AwsIamUser>>>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  permissionBoundaryOf?: Maybe<Array<Maybe<AwsIamRole>>>;
  policyContent?: Maybe<AwsIamJsonPolicy>;
  rawPolicy?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsIamRole = AwsBaseService & {
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  assumeRolePolicy?: Maybe<AwsIamJsonPolicy>;
  awsCognitoIdentityPool?: Maybe<Array<Maybe<AwsCognitoIdentityPool>>>;
  cloudFormationStack?: Maybe<Array<Maybe<AwsCloudFormationStack>>>;
  cloudFormationStackSet?: Maybe<Array<Maybe<AwsCloudFormationStackSet>>>;
  codebuilds?: Maybe<Array<Maybe<AwsCodebuild>>>;
  cognitoUserPools?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  configurationRecorder?: Maybe<Array<Maybe<AwsConfigurationRecorder>>>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dynamodb?: Maybe<Array<Maybe<AwsDynamoDbTable>>>;
  ec2Instances?: Maybe<Array<Maybe<AwsEc2>>>;
  ecsServices?: Maybe<Array<Maybe<AwsEcsService>>>;
  ecsTask?: Maybe<Array<Maybe<AwsEcsTask>>>;
  ecsTaskDefinition?: Maybe<Array<Maybe<AwsEcsTaskDefinition>>>;
  eksClusters?: Maybe<Array<Maybe<AwsEksCluster>>>;
  elasticBeanstalkApps?: Maybe<Array<Maybe<AwsElasticBeanstalkApp>>>;
  elasticBeanstalkEnvs?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  elasticSearchDomains?: Maybe<Array<Maybe<AwsElasticSearchDomain>>>;
  emrCluster?: Maybe<Array<Maybe<AwsEmrCluster>>>;
  flowLogs?: Maybe<Array<Maybe<AwsFlowLog>>>;
  glueJobs?: Maybe<Array<Maybe<AwsGlueJob>>>;
  guardDutyDetectors?: Maybe<Array<Maybe<AwsGuardDutyDetector>>>;
  iamAttachedPolicies?: Maybe<Array<Maybe<AwsIamPolicy>>>;
  iamInstanceProfiles?: Maybe<Array<Maybe<AwsIamInstanceProfile>>>;
  iamPermissionBoundaryPolicy?: Maybe<Array<Maybe<AwsIamPolicy>>>;
  inlinePolicies?: Maybe<Array<Maybe<AwsIamRoleInlinePolicy>>>;
  kinesisFirehose?: Maybe<Array<Maybe<AwsKinesisFirehose>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  lastUsedDate?: Maybe<Scalars['DateTime']>;
  managedAirflows?: Maybe<Array<Maybe<AwsManagedAirflow>>>;
  maxSessionDuration?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  rawPolicy?: Maybe<Scalars['String']>;
  rdsCluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  sageMakerNotebookInstances?: Maybe<Array<Maybe<AwsSageMakerNotebookInstance>>>;
  systemsManagerInstances?: Maybe<Array<Maybe<AwsSystemsManagerInstance>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsIamRoleInlinePolicy = {
  document?: Maybe<AwsIamJsonPolicy>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type AwsIamSamlProvider = AwsOptionalService & {
  awsCognitoIdentityPool?: Maybe<Array<Maybe<AwsCognitoIdentityPool>>>;
  createdDate?: Maybe<Scalars['String']>;
  validUntil?: Maybe<Scalars['String']>;
};

export type AwsIamServerCertificate = AwsOptionalService & {
  certificateId?: Maybe<Scalars['String']>;
  expiration?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  uploadDate?: Maybe<Scalars['String']>;
};

export type AwsIamUser = AwsOptionalService & {
  accessKeyData?: Maybe<Array<Maybe<AwsIamAccessKey>>>;
  accessKeysActive?: Maybe<Scalars['Boolean']>;
  creationTime?: Maybe<Scalars['String']>;
  groups?: Maybe<Array<Maybe<Scalars['String']>>>;
  iamAttachedPolicies?: Maybe<Array<Maybe<AwsIamPolicy>>>;
  iamGroups?: Maybe<Array<Maybe<AwsIamGroup>>>;
  inlinePolicies?: Maybe<Array<Maybe<Scalars['String']>>>;
  mfaActive?: Maybe<Scalars['Boolean']>;
  mfaDevices?: Maybe<Array<Maybe<AwsIamMfaDevice>>>;
  name?: Maybe<Scalars['String']>;
  passwordEnabled?: Maybe<Scalars['Boolean']>;
  passwordLastChanged?: Maybe<Scalars['String']>;
  passwordLastUsed?: Maybe<Scalars['String']>;
  passwordNextRotation?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  virtualMfaDevices?: Maybe<Array<Maybe<AwsIamMfaDevice>>>;
};

export type AwsIgw = AwsBaseService & {
  attachments?: Maybe<Array<Maybe<AwsIgwAttachment>>>;
  owner?: Maybe<Scalars['String']>;
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

export type AwsIotThingAttribute = AwsBaseService & {
  attributes?: Maybe<Array<Maybe<AwsIotAttribute>>>;
  thingName?: Maybe<Scalars['String']>;
  thingTypeName?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
};

export type AwsKinesisFirehose = AwsBaseService & {
  createTimestamp?: Maybe<Scalars['String']>;
  deliveryStreamStatus?: Maybe<Scalars['String']>;
  deliveryStreamType?: Maybe<Scalars['String']>;
  encryptionConfig?: Maybe<AwsKinesisFirehoseEncryptionConfig>;
  failureDescriptionDetails?: Maybe<Scalars['String']>;
  failureDescriptionType?: Maybe<Scalars['String']>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  kinesisStream?: Maybe<Array<Maybe<AwsKinesisStream>>>;
  lastUpdateTimestamp?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  source?: Maybe<AwsKinesisFirehoseSource>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  versionId?: Maybe<Scalars['String']>;
};

export type AwsKinesisFirehoseEncryptionConfig = {
  failureDescriptionDetails?: Maybe<Scalars['String']>;
  failureDescriptionType?: Maybe<Scalars['String']>;
  keyARN?: Maybe<Scalars['String']>;
  keyType?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsKinesisFirehoseSource = {
  deliveryStartTimestamp?: Maybe<Scalars['String']>;
  kinesisStreamARN?: Maybe<Scalars['String']>;
  roleARN?: Maybe<Scalars['String']>;
};

export type AwsKinesisStream = AwsBaseService & {
  encryptionType?: Maybe<Scalars['String']>;
  enhancedMonitoring?: Maybe<Array<Maybe<AwsShardLevelMetrics>>>;
  keyId?: Maybe<Scalars['String']>;
  kinesisFirehose?: Maybe<Array<Maybe<AwsKinesisFirehose>>>;
  retentionPeriodHours?: Maybe<Scalars['Int']>;
  shards?: Maybe<Array<Maybe<AwsShards>>>;
  streamName?: Maybe<Scalars['String']>;
  streamStatus?: Maybe<Scalars['String']>;
};

export type AwsKms = AwsBaseService & {
  aliases?: Maybe<Array<Maybe<AwsKmsAliasListEntry>>>;
  cloudtrail?: Maybe<Array<Maybe<AwsCloudtrail>>>;
  cloudwatchLog?: Maybe<Array<Maybe<AwsCloudwatchLog>>>;
  codebuilds?: Maybe<Array<Maybe<AwsCodebuild>>>;
  cognitoUserPools?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  creationDate?: Maybe<Scalars['DateTime']>;
  customerMasterKeySpec?: Maybe<Scalars['String']>;
  deletionDate?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  dmsReplicationInstances?: Maybe<Array<Maybe<AwsDmsReplicationInstance>>>;
  dynamodb?: Maybe<Array<Maybe<AwsDynamoDbTable>>>;
  ebsSnapshots?: Maybe<Array<Maybe<AwsEbsSnapshot>>>;
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  efs?: Maybe<Array<Maybe<AwsEfs>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  elastiCacheReplicationGroup?: Maybe<Array<Maybe<AwsElastiCacheReplicationGroup>>>;
  elasticSearchDomains?: Maybe<Array<Maybe<AwsElasticSearchDomain>>>;
  emrCluster?: Maybe<Array<Maybe<AwsEmrCluster>>>;
  enabled?: Maybe<Scalars['Boolean']>;
  keyManager?: Maybe<Scalars['String']>;
  keyRotationEnabled?: Maybe<Scalars['Boolean']>;
  keyState?: Maybe<Scalars['String']>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  managedAirflows?: Maybe<Array<Maybe<AwsManagedAirflow>>>;
  origin?: Maybe<Scalars['String']>;
  policy?: Maybe<AwsIamJsonPolicy>;
  rawPolicy?: Maybe<Scalars['String']>;
  rdsCluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  rdsClusterSnapshots?: Maybe<Array<Maybe<AwsRdsClusterSnapshot>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  redshiftCluster?: Maybe<Array<Maybe<AwsRedshiftCluster>>>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  sageMakerNotebookInstances?: Maybe<Array<Maybe<AwsSageMakerNotebookInstance>>>;
  secretsManager?: Maybe<Array<Maybe<AwsSecretsManager>>>;
  sns?: Maybe<Array<Maybe<AwsSns>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  usage?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['DateTime']>;
};

export type AwsKmsAliasListEntry = {
  aliasArn?: Maybe<Scalars['String']>;
  aliasName?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  lastUpdatedDate?: Maybe<Scalars['DateTime']>;
  targetKeyId?: Maybe<Scalars['String']>;
};

export type AwsLambda = AwsBaseService & {
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
  cognitoUserPools?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  description?: Maybe<Scalars['String']>;
  environmentVariables?: Maybe<Array<Maybe<AwsLambdaEnvironmentVariable>>>;
  handler?: Maybe<Scalars['String']>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKeyArn?: Maybe<Scalars['String']>;
  lastModified?: Maybe<Scalars['String']>;
  memorySize?: Maybe<Scalars['Int']>;
  policy?: Maybe<AwsIamJsonPolicy>;
  policyRevisionId?: Maybe<Scalars['String']>;
  rawPolicy?: Maybe<Scalars['String']>;
  reservedConcurrentExecutions?: Maybe<Scalars['Int']>;
  runtime?: Maybe<Scalars['String']>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  secretsManager?: Maybe<Array<Maybe<AwsSecretsManager>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  sourceCodeSize?: Maybe<Scalars['String']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  timeout?: Maybe<Scalars['Int']>;
  tracingConfig?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcConfig?: Maybe<AwsLambdaVpcConfig>;
};

export type AwsLambdaEnvironmentVariable = {
  id: Scalars['String'];
  key: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type AwsLambdaVpcConfig = {
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  subnetIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsLaunchConfiguration = {
  associatePublicIpAddress?: Maybe<Scalars['String']>;
  blockDeviceMappings?: Maybe<Array<Maybe<AwsLcBlockDeviceMapping>>>;
  classicLinkVPCId?: Maybe<Scalars['String']>;
  classicLinkVPCSecurityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  ebsOptimized?: Maybe<Scalars['String']>;
  iamInstanceProfile?: Maybe<Scalars['String']>;
  imageId?: Maybe<Scalars['String']>;
  instanceMonitoring?: Maybe<Scalars['String']>;
  instanceType?: Maybe<Scalars['String']>;
  kernelId?: Maybe<Scalars['String']>;
  keyName?: Maybe<Scalars['String']>;
  launchConfigurationARN?: Maybe<Scalars['String']>;
  launchConfigurationName?: Maybe<Scalars['String']>;
  metadataOptHttpEndpoint?: Maybe<Scalars['String']>;
  metadataOptHttpPutResponseHopLimit?: Maybe<Scalars['Int']>;
  metadataOptHttpTokens?: Maybe<Scalars['String']>;
  placementTenancy?: Maybe<Scalars['String']>;
  ramdiskId?: Maybe<Scalars['String']>;
  securityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
  spotPrice?: Maybe<Scalars['String']>;
  userData?: Maybe<Scalars['String']>;
};

export type AwsLaunchTemplateOverrides = {
  id: Scalars['String'];
  instanceType?: Maybe<Scalars['String']>;
  launchTemplateId?: Maybe<Scalars['String']>;
  launchTemplateName?: Maybe<Scalars['String']>;
  launchTemplateVersion?: Maybe<Scalars['String']>;
  weightedCapacity?: Maybe<Scalars['String']>;
};

export type AwsLcBlockDeviceMapping = {
  deviceName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  noDevice?: Maybe<Scalars['String']>;
  virtualName?: Maybe<Scalars['String']>;
};

export type AwsManagedAirflow = AwsBaseService & {
  airflowConfigurationOptions?: Maybe<Array<Maybe<AwsRawTag>>>;
  airflowVersion?: Maybe<Scalars['String']>;
  cloudwatchLogs?: Maybe<Array<Maybe<AwsCloudwatchLog>>>;
  createdAt?: Maybe<Scalars['DateTime']>;
  dagS3Path?: Maybe<Scalars['String']>;
  environmentClass?: Maybe<Scalars['String']>;
  executionRoleArn?: Maybe<Scalars['String']>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKey?: Maybe<Scalars['String']>;
  lastUpdate?: Maybe<AwsManagedAirflowLastUpdate>;
  loggingConfiguration?: Maybe<AwsManagedAirflowLoggingConfig>;
  maxWorkers?: Maybe<Scalars['Int']>;
  minWorkers?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  networkConfiguration?: Maybe<AwsManagedAirflowNetworkConfig>;
  pluginsS3Path?: Maybe<Scalars['String']>;
  requirementsS3Path?: Maybe<Scalars['String']>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  schedulers?: Maybe<Scalars['Int']>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  serviceRoleArn?: Maybe<Scalars['String']>;
  sourceBucketArn?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  webserverAccessMode?: Maybe<Scalars['String']>;
  webserverUrl?: Maybe<Scalars['String']>;
  weeklyMaintenanceWindowStart?: Maybe<Scalars['String']>;
};

export type AwsManagedAirflowLastUpdate = {
  createdAt?: Maybe<Scalars['DateTime']>;
  error?: Maybe<AwsManagedAirflowLastUpdateError>;
  status?: Maybe<Scalars['String']>;
};

export type AwsManagedAirflowLastUpdateError = {
  errorCode?: Maybe<Scalars['String']>;
  errorMessage?: Maybe<Scalars['String']>;
};

export type AwsManagedAirflowLogging = {
  cloudWatchLogGroupArn?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  logLevel?: Maybe<Scalars['String']>;
};

export type AwsManagedAirflowLoggingConfig = {
  dagProcessingLogs?: Maybe<AwsManagedAirflowLogging>;
  schedulerLogs?: Maybe<AwsManagedAirflowLogging>;
  taskLogs?: Maybe<AwsManagedAirflowLogging>;
  webserverLogs?: Maybe<AwsManagedAirflowLogging>;
  workerLogs?: Maybe<AwsManagedAirflowLogging>;
};

export type AwsManagedAirflowNetworkConfig = {
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  subnetIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsManagedPrefixList = AwsBaseService & {
  addressFamily?: Maybe<Scalars['String']>;
  entries?: Maybe<Array<Maybe<AwsManagedPrefixListEntry>>>;
  maxEntries?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  stateMessage?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  version?: Maybe<Scalars['Int']>;
};

export type AwsManagedPrefixListEntry = {
  cidr?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

export type AwsMetricFilter = {
  creationTime?: Maybe<Scalars['String']>;
  filterName?: Maybe<Scalars['String']>;
  filterPattern?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  logGroupName?: Maybe<Scalars['String']>;
  metricTransformations?: Maybe<Array<Maybe<AwsMetricTransformation>>>;
};

export type AwsMetricTransformation = {
  defaultValue?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  metricName?: Maybe<Scalars['String']>;
  metricNamespace?: Maybe<Scalars['String']>;
  metricValue?: Maybe<Scalars['String']>;
  unit?: Maybe<Scalars['String']>;
};

export type AwsMixedInstancesPolicy = {
  instDistrOnDemandAllocationStrategy?: Maybe<Scalars['String']>;
  instDistrOnDemandBaseCapacity?: Maybe<Scalars['Int']>;
  instDistrOnDemandPercentageAboveBaseCapacity?: Maybe<Scalars['Int']>;
  instDistrSpotAllocationStrategy?: Maybe<Scalars['String']>;
  instDistrSpotInstancePools?: Maybe<Scalars['Int']>;
  instDistrSpotMaxPrice?: Maybe<Scalars['String']>;
  launchTemplateId?: Maybe<Scalars['String']>;
  launchTemplateName?: Maybe<Scalars['String']>;
  launchTemplateOverrides?: Maybe<Array<Maybe<AwsLaunchTemplateOverrides>>>;
  launchTemplateVersion?: Maybe<Scalars['String']>;
};

export type AwsMskCluster = AwsBaseService & {
  activeOperationArn?: Maybe<Scalars['String']>;
  clusterName?: Maybe<Scalars['String']>;
  clusterType?: Maybe<Scalars['String']>;
  creationTime?: Maybe<Scalars['DateTime']>;
  currentVersion?: Maybe<Scalars['String']>;
  provisioned?: Maybe<AwsMskClusterProvisioned>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  serverless?: Maybe<AwsMskClusterServerless>;
  state?: Maybe<Scalars['String']>;
  stateInfo?: Maybe<AwsMskClusterStateInfo>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsMskClusterBrokerNodeGroupInfo = {
  brokerAZDistribution?: Maybe<Scalars['String']>;
  clientSubnets?: Maybe<Array<Maybe<Scalars['String']>>>;
  connectivityInfo?: Maybe<AwsMskClusterBrokerNodeGroupInfoConnectivityInfo>;
  ebsStorageInfo?: Maybe<AwsMskClusterBrokerNodeGroupInfoEbsStorageInfo>;
  instanceType?: Maybe<Scalars['String']>;
  securityGroups?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsMskClusterBrokerNodeGroupInfoConnectivityInfo = {
  publicAccessType?: Maybe<Scalars['String']>;
};

export type AwsMskClusterBrokerNodeGroupInfoEbsStorageInfo = {
  provisionedThroughputEnabled?: Maybe<Scalars['Boolean']>;
  provisionedThroughputVolumeThroughput?: Maybe<Scalars['Int']>;
  volumeSize?: Maybe<Scalars['Int']>;
};

export type AwsMskClusterClientAuthentication = {
  sasl?: Maybe<AwsMskClusterClientAuthenticationSasl>;
  tls?: Maybe<AwsMskClusterClientAuthenticationTls>;
  unauthenticatedEnabled?: Maybe<Scalars['Boolean']>;
};

export type AwsMskClusterClientAuthenticationSasl = {
  iamEnabled?: Maybe<Scalars['Boolean']>;
  scramEnabled?: Maybe<Scalars['Boolean']>;
};

export type AwsMskClusterClientAuthenticationTls = {
  certificateAuthorityArnList?: Maybe<Array<Maybe<Scalars['String']>>>;
  enabled?: Maybe<Scalars['Boolean']>;
};

export type AwsMskClusterCurrentBrokerSoftwareInfo = {
  configurationArn?: Maybe<Scalars['String']>;
  configurationRevision?: Maybe<Scalars['Int']>;
  kafkaVersion?: Maybe<Scalars['String']>;
};

export type AwsMskClusterEncryptionInfo = {
  encryptionAtRest?: Maybe<AwsMskClusterEncryptionInfoAtRest>;
  encryptionInTransit?: Maybe<AwsMskClusterEncryptionInfoInTransit>;
};

export type AwsMskClusterEncryptionInfoAtRest = {
  dataVolumeKMSKeyId?: Maybe<Scalars['String']>;
};

export type AwsMskClusterEncryptionInfoInTransit = {
  clientBroker?: Maybe<Scalars['String']>;
  inCluster?: Maybe<Scalars['Boolean']>;
};

export type AwsMskClusterLoggingInfo = {
  cloudWatchLogs?: Maybe<AwsMskClusterLoggingInfoCloudWatch>;
  firehose?: Maybe<AwsMskClusterLoggingInfoFirehose>;
  s3?: Maybe<AwsMskClusterLoggingInfoS3>;
};

export type AwsMskClusterLoggingInfoCloudWatch = {
  enabled?: Maybe<Scalars['Boolean']>;
  logGroup?: Maybe<Scalars['String']>;
};

export type AwsMskClusterLoggingInfoFirehose = {
  deliveryStream?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
};

export type AwsMskClusterLoggingInfoS3 = {
  bucket?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  prefix?: Maybe<Scalars['String']>;
};

export type AwsMskClusterOpenMonitoringPrometheus = {
  jmxExporterEnabledInBroker?: Maybe<Scalars['Boolean']>;
  nodeExporterInfoEnabledInBroker?: Maybe<Scalars['Boolean']>;
};

export type AwsMskClusterProvisioned = {
  brokerNodeGroupInfo?: Maybe<AwsMskClusterBrokerNodeGroupInfo>;
  clientAuthentication?: Maybe<AwsMskClusterClientAuthentication>;
  currentBrokerSoftwareInfo?: Maybe<AwsMskClusterCurrentBrokerSoftwareInfo>;
  encryptionInfo?: Maybe<AwsMskClusterEncryptionInfo>;
  enhancedMonitoring?: Maybe<Scalars['String']>;
  loggingInfo?: Maybe<AwsMskClusterLoggingInfo>;
  numberOfBrokerNodes?: Maybe<Scalars['Int']>;
  openMonitoringPrometheus?: Maybe<AwsMskClusterOpenMonitoringPrometheus>;
  storageMode?: Maybe<Scalars['String']>;
  zookeeperConnectString?: Maybe<Scalars['String']>;
  zookeeperConnectStringTls?: Maybe<Scalars['String']>;
};

export type AwsMskClusterServerless = {
  serverlessClientAuthentication?: Maybe<AwsMskClusterServerlessClientAuthentication>;
  vpcConfigs?: Maybe<Array<Maybe<AwsMskClusterServerlessVpcConfigs>>>;
};

export type AwsMskClusterServerlessClientAuthentication = {
  sasl?: Maybe<AwsMskClusterServerlessSasl>;
};

export type AwsMskClusterServerlessSasl = {
  iamEnabled?: Maybe<Scalars['Boolean']>;
};

export type AwsMskClusterServerlessVpcConfigs = {
  id: Scalars['String'];
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  subnetIds?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsMskClusterStateInfo = {
  code?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
};

export type AwsNatGateway = AwsBaseService & {
  createTime?: Maybe<Scalars['String']>;
  dailyCost?: Maybe<AwsTotalBillingInfo>;
  natGatewayAddresses?: Maybe<Array<Maybe<AwsNatGatewayAddress>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  state?: Maybe<Scalars['String']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsNatGatewayAddress = {
  allocationId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  networkInterfaceId?: Maybe<Scalars['String']>;
  privateIp?: Maybe<Scalars['String']>;
  publicIp?: Maybe<Scalars['String']>;
};

export type AwsNetworkAcl = AwsBaseService & {
  associatedSubnets?: Maybe<Array<Maybe<AwsNetworkAclAssociatedSubnet>>>;
  default?: Maybe<Scalars['Boolean']>;
  inboundRules?: Maybe<Array<Maybe<AwsNetworkAclRule>>>;
  outboundRules?: Maybe<Array<Maybe<AwsNetworkAclRule>>>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsNetworkAclAssociatedSubnet = {
  id: Scalars['String'];
  networkAclAssociationId?: Maybe<Scalars['String']>;
  subnetId?: Maybe<Scalars['String']>;
};

export type AwsNetworkAclRule = {
  allowOrDeny?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  fromPort?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
  portRange?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  ruleNumber?: Maybe<Scalars['Int']>;
  source?: Maybe<Scalars['String']>;
  toPort?: Maybe<Scalars['Int']>;
};

export type AwsNetworkInterface = AwsBaseService & {
  attachment?: Maybe<AwsNetworkInterfaceAttachment>;
  availabilityZone?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  efsMountTarget?: Maybe<Array<Maybe<AwsEfsMountTarget>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
  flowLogs?: Maybe<Array<Maybe<AwsFlowLog>>>;
  interfaceType?: Maybe<Scalars['String']>;
  macAddress?: Maybe<Scalars['String']>;
  natGateway?: Maybe<Array<Maybe<AwsNatGateway>>>;
  privateDnsName?: Maybe<Scalars['String']>;
  privateIps?: Maybe<Array<Maybe<Scalars['String']>>>;
  sageMakerNotebookInstances?: Maybe<Array<Maybe<AwsSageMakerNotebookInstance>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  securityGroupsIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  status?: Maybe<Scalars['String']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  subnetId?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcEndpoint?: Maybe<Array<Maybe<AwsVpcEndpoint>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsNetworkInterfaceAttachment = {
  attachmentId?: Maybe<Scalars['String']>;
  deleteOnTermination?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['ID']>;
  status?: Maybe<Scalars['String']>;
};

export type AwsOptionalService = {
  accountId?: Maybe<Scalars['String']>;
  arn?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  region?: Maybe<Scalars['String']>;
};

export type AwsOrganization = AwsBaseService & {
  availablePolicyTypes?: Maybe<Array<Maybe<AwsPolicyTypes>>>;
  featureSet?: Maybe<Scalars['String']>;
  masterAccountArn?: Maybe<Scalars['String']>;
  masterAccountEmail?: Maybe<Scalars['String']>;
  masterAccountId?: Maybe<Scalars['String']>;
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

export type AwsRdsCluster = AwsBaseService & {
  allocatedStorage?: Maybe<Scalars['Int']>;
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
  backupRetentionPeriod?: Maybe<Scalars['Int']>;
  capacity?: Maybe<Scalars['Int']>;
  characterSetName?: Maybe<Scalars['String']>;
  cloneGroupId?: Maybe<Scalars['String']>;
  copyTagsToSnapshot?: Maybe<Scalars['Boolean']>;
  createdTime?: Maybe<Scalars['String']>;
  crossAccountClone?: Maybe<Scalars['Boolean']>;
  customEndpoints?: Maybe<Array<Maybe<Scalars['String']>>>;
  databaseName?: Maybe<Scalars['String']>;
  dbClusterIdentifier?: Maybe<Scalars['String']>;
  dbClusterParameterGroup?: Maybe<Scalars['String']>;
  dbSubnetGroup?: Maybe<Scalars['String']>;
  deletionProtection?: Maybe<Scalars['Boolean']>;
  encrypted?: Maybe<Scalars['Boolean']>;
  endpoint?: Maybe<Scalars['String']>;
  engine?: Maybe<Scalars['String']>;
  engineMode?: Maybe<Scalars['String']>;
  engineVersion?: Maybe<Scalars['String']>;
  globalWriteForwardingRequested?: Maybe<Scalars['Boolean']>;
  hostedZoneId?: Maybe<Scalars['String']>;
  httpEndpointEnabled?: Maybe<Scalars['Boolean']>;
  iamDbAuthenticationEnabled?: Maybe<Scalars['Boolean']>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  instances?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKey?: Maybe<Scalars['String']>;
  multiAZ?: Maybe<Scalars['Boolean']>;
  percentProgress?: Maybe<Scalars['String']>;
  port?: Maybe<Scalars['Int']>;
  readerEndpoint?: Maybe<Scalars['String']>;
  replicationSourceIdentifier?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  route53HostedZone?: Maybe<Array<Maybe<AwsRoute53HostedZone>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  snapshots?: Maybe<Array<Maybe<AwsRdsClusterSnapshot>>>;
  status?: Maybe<Scalars['String']>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  username?: Maybe<Scalars['String']>;
};

export type AwsRdsClusterSnapshot = AwsBaseService & {
  allocatedStorage?: Maybe<Scalars['Int']>;
  attributes?: Maybe<Array<Maybe<AwsRdsClusterSnapshotAttribute>>>;
  availabilityZones?: Maybe<Array<Maybe<Scalars['String']>>>;
  cluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  clusterCreateTime?: Maybe<Scalars['DateTime']>;
  dbClusterIdentifier?: Maybe<Scalars['String']>;
  dbClusterSnapshotArn?: Maybe<Scalars['String']>;
  dbClusterSnapshotIdentifier?: Maybe<Scalars['String']>;
  engine?: Maybe<Scalars['String']>;
  engineMode?: Maybe<Scalars['String']>;
  engineVersion?: Maybe<Scalars['String']>;
  iamDatabaseAuthenticationEnabled?: Maybe<Scalars['Boolean']>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKeyId?: Maybe<Scalars['String']>;
  licenseModel?: Maybe<Scalars['String']>;
  masterUsername?: Maybe<Scalars['String']>;
  percentProgress?: Maybe<Scalars['Int']>;
  port?: Maybe<Scalars['Int']>;
  snapshotCreateTime?: Maybe<Scalars['DateTime']>;
  snapshotType?: Maybe<Scalars['String']>;
  sourceDBClusterSnapshotArn?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  storageEncrypted?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsRdsClusterSnapshotAttribute = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  values?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsRdsDbInstance = AwsBaseService & {
  address?: Maybe<Scalars['String']>;
  allocatedStorage?: Maybe<Scalars['Int']>;
  autoMinorVersionUpgrade?: Maybe<Scalars['Boolean']>;
  availabilityZone?: Maybe<Scalars['String']>;
  certificateAuthority?: Maybe<Scalars['String']>;
  cloudwatchLogs?: Maybe<Array<Maybe<AwsCloudwatchLog>>>;
  cluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  copyTagsToSnapshot?: Maybe<Scalars['Boolean']>;
  createdTime?: Maybe<Scalars['String']>;
  dBInstanceIdentifier?: Maybe<Scalars['String']>;
  deletionProtection?: Maybe<Scalars['Boolean']>;
  encrypted?: Maybe<Scalars['Boolean']>;
  engine?: Maybe<Scalars['String']>;
  engineVersion?: Maybe<Scalars['String']>;
  failoverPriority?: Maybe<Scalars['Int']>;
  hostedZoneId?: Maybe<Scalars['String']>;
  iamDbAuthenticationEnabled?: Maybe<Scalars['Boolean']>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  instanceClass?: Maybe<Scalars['String']>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKey?: Maybe<Scalars['String']>;
  licenseModel?: Maybe<Scalars['String']>;
  multiAZ?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  optionsGroups?: Maybe<Scalars['String']>;
  parameterGroup?: Maybe<Scalars['String']>;
  performanceInsightsEnabled?: Maybe<Scalars['Boolean']>;
  port?: Maybe<Scalars['Int']>;
  publiclyAccessible?: Maybe<Scalars['Boolean']>;
  resourceId?: Maybe<Scalars['String']>;
  route53HostedZone?: Maybe<Array<Maybe<AwsRoute53HostedZone>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  status?: Maybe<Scalars['String']>;
  storageType?: Maybe<Scalars['String']>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  subnetGroup?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  username?: Maybe<Scalars['String']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsRecorderStatus = {
  lastStartTime?: Maybe<Scalars['String']>;
  lastStatus?: Maybe<Scalars['String']>;
  lastStatusChangeTime?: Maybe<Scalars['String']>;
  lastStopTime?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  recording?: Maybe<Scalars['Boolean']>;
};

export type AwsRecordingGroup = {
  allSupported?: Maybe<Scalars['Boolean']>;
  includeGlobalResourceTypes?: Maybe<Scalars['Boolean']>;
  resourceTypes?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsRedshiftCluster = AwsBaseService & {
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
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  manualSnapshotRetentionPeriod?: Maybe<Scalars['Int']>;
  masterUsername?: Maybe<Scalars['String']>;
  modifyStatus?: Maybe<Scalars['String']>;
  nodeType?: Maybe<Scalars['String']>;
  numberOfNodes?: Maybe<Scalars['Int']>;
  preferredMaintenanceWindow?: Maybe<Scalars['String']>;
  publiclyAccessible?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsRollbackConfigurationRollbackTrigger = {
  arn?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type AwsRoute = {
  destination?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  target: Scalars['String'];
};

export type AwsRoute53Alias = {
  evaluateTargetHealth?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  zoneId: Scalars['String'];
};

export type AwsRoute53HostedZone = AwsBaseService & {
  comment?: Maybe<Scalars['String']>;
  delegationSetId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  nameServers?: Maybe<Array<Maybe<Scalars['String']>>>;
  rdsCluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  route53Record?: Maybe<Array<Maybe<AwsRoute53Record>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsRoute53Record = AwsOptionalService & {
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  alias?: Maybe<AwsRoute53Alias>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  name?: Maybe<Scalars['String']>;
  records?: Maybe<Array<Maybe<Scalars['String']>>>;
  restApi?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
  route53HostedZone?: Maybe<Array<Maybe<AwsRoute53HostedZone>>>;
  setIdentifier?: Maybe<Scalars['String']>;
  ttl?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  zoneId?: Maybe<Scalars['String']>;
};

export type AwsRouteTable = AwsBaseService & {
  explicitlyAssociatedWithSubnets?: Maybe<Scalars['Int']>;
  mainRouteTable?: Maybe<Scalars['Boolean']>;
  routes?: Maybe<Array<Maybe<AwsRoute>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  subnetAssociations?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcEndpoints?: Maybe<Array<Maybe<AwsVpcEndpoint>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsS3 = AwsBaseService & {
  access?: Maybe<Scalars['String']>;
  accountLevelBlockPublicAcls?: Maybe<Scalars['String']>;
  accountLevelBlockPublicPolicy?: Maybe<Scalars['String']>;
  accountLevelIgnorePublicAcls?: Maybe<Scalars['String']>;
  accountLevelRestrictPublicBuckets?: Maybe<Scalars['String']>;
  aclGrants?: Maybe<Array<Maybe<AwsS3AclGrant>>>;
  blockPublicAcls?: Maybe<Scalars['String']>;
  blockPublicPolicy?: Maybe<Scalars['String']>;
  bucketOwnerName?: Maybe<Scalars['String']>;
  cloudfrontDistributions?: Maybe<Array<Maybe<AwsCloudfront>>>;
  cloudtrails?: Maybe<Array<Maybe<AwsCloudtrail>>>;
  corsConfiguration?: Maybe<Scalars['String']>;
  crossRegionReplication?: Maybe<Scalars['String']>;
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  encrypted?: Maybe<Scalars['String']>;
  encryptionRules?: Maybe<Array<Maybe<AwsS3ServerSideEncryptionConfiguration>>>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  ignorePublicAcls?: Maybe<Scalars['String']>;
  kinesisFirehose?: Maybe<Array<Maybe<AwsKinesisFirehose>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  lambdas?: Maybe<Array<Maybe<AwsLambda>>>;
  lifecycle?: Maybe<Scalars['String']>;
  logging?: Maybe<Scalars['String']>;
  managedAirflows?: Maybe<Array<Maybe<AwsManagedAirflow>>>;
  mfa?: Maybe<Scalars['String']>;
  notificationConfiguration?: Maybe<AwsS3NotificationConfiguration>;
  policy?: Maybe<AwsIamJsonPolicy>;
  rawPolicy?: Maybe<Scalars['String']>;
  requesterPays?: Maybe<Scalars['String']>;
  restrictPublicBuckets?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
  sns?: Maybe<Array<Maybe<AwsSns>>>;
  sqs?: Maybe<Array<Maybe<AwsSqs>>>;
  staticWebsiteHosting?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  totalNumberOfObjectsInBucket?: Maybe<Scalars['String']>;
  transferAcceleration?: Maybe<Scalars['String']>;
  versioning?: Maybe<Scalars['String']>;
};

export type AwsS3AclGrant = {
  granteeType?: Maybe<Scalars['String']>;
  granteeUri?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  permission?: Maybe<Scalars['String']>;
};

export type AwsS3ConfigurationBase = {
  events?: Maybe<Array<Maybe<Scalars['String']>>>;
  filterRules?: Maybe<Array<Maybe<AwsS3FilterRule>>>;
  id: Scalars['String'];
};

export type AwsS3FilterRule = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsS3LambdaFunctionConfiguration = AwsS3ConfigurationBase & {
  lambdaFunctionArn?: Maybe<Scalars['String']>;
};

export type AwsS3NotificationConfiguration = {
  lambdaFunctionConfigurations?: Maybe<Array<Maybe<AwsS3LambdaFunctionConfiguration>>>;
  queueConfigurations?: Maybe<Array<Maybe<AwsS3QueueConfiguration>>>;
  topicConfigurations?: Maybe<Array<Maybe<AwsS3TopicConfiguration>>>;
};

export type AwsS3QueueConfiguration = AwsS3ConfigurationBase & {
  queueArn?: Maybe<Scalars['String']>;
};

export type AwsS3ServerSideEncryptionConfiguration = {
  id: Scalars['String'];
  kmsMasterKeyID?: Maybe<Scalars['String']>;
  sseAlgorithm?: Maybe<Scalars['String']>;
};

export type AwsS3TopicConfiguration = AwsS3ConfigurationBase & {
  topicArn?: Maybe<Scalars['String']>;
};

export type AwsSageMakerExperiment = AwsBaseService & {
  creationTime?: Maybe<Scalars['DateTime']>;
  displayName?: Maybe<Scalars['String']>;
  experimentArn?: Maybe<Scalars['String']>;
  experimentName?: Maybe<Scalars['String']>;
  experimentSource?: Maybe<AwsSageMakerExperimentExperimentSource>;
  lastModifiedTime?: Maybe<Scalars['DateTime']>;
};

export type AwsSageMakerExperimentExperimentSource = {
  sourceArn?: Maybe<Scalars['String']>;
  sourceType?: Maybe<Scalars['String']>;
};

export type AwsSageMakerNotebookInstance = AwsBaseService & {
  acceleratorTypes?: Maybe<Array<Maybe<Scalars['String']>>>;
  additionalCodeRepositories?: Maybe<Array<Maybe<Scalars['String']>>>;
  creationTime?: Maybe<Scalars['DateTime']>;
  defaultCodeRepository?: Maybe<Scalars['String']>;
  directInternetAccess?: Maybe<Scalars['String']>;
  failureReason?: Maybe<Scalars['String']>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  instanceType?: Maybe<Scalars['String']>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKeyId?: Maybe<Scalars['String']>;
  lastModifiedTime?: Maybe<Scalars['DateTime']>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  networkInterfaceId?: Maybe<Scalars['String']>;
  notebookInstanceLifecycleConfigName?: Maybe<Scalars['String']>;
  notebookInstanceName?: Maybe<Scalars['String']>;
  notebookInstanceStatus?: Maybe<Scalars['String']>;
  platformIdentifier?: Maybe<Scalars['String']>;
  roleArn?: Maybe<Scalars['String']>;
  rootAccess?: Maybe<Scalars['String']>;
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  subnetId?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  volumeSizeInGb?: Maybe<Scalars['Int']>;
};

export type AwsSageMakerProject = AwsBaseService & {
  creationTime?: Maybe<Scalars['DateTime']>;
  projectArn?: Maybe<Scalars['String']>;
  projectId?: Maybe<Scalars['String']>;
  projectName?: Maybe<Scalars['String']>;
  projectStatus?: Maybe<Scalars['String']>;
};

export type AwsSecretsManager = AwsBaseService & {
  createdDate?: Maybe<Scalars['DateTime']>;
  deletedDate?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  kmsKeyId?: Maybe<Scalars['String']>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  lastAccessedDate?: Maybe<Scalars['DateTime']>;
  lastChangedDate?: Maybe<Scalars['DateTime']>;
  lastRotatedDate?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  owningService?: Maybe<Scalars['String']>;
  replicationStatus?: Maybe<Array<Maybe<AwsSecretsManagerReplicationStatus>>>;
  rotationEnabled?: Maybe<Scalars['Boolean']>;
  rotationLambdaARN?: Maybe<Scalars['String']>;
  rotationRules?: Maybe<AwsSecretsManagerRotationRule>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsSecretsManagerReplicationStatus = {
  id: Scalars['String'];
  kmsKeyId?: Maybe<Scalars['String']>;
  lastAccessedDate?: Maybe<Scalars['DateTime']>;
  region?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  statusMessage?: Maybe<Scalars['String']>;
};

export type AwsSecretsManagerRotationRule = {
  automaticallyAfterDays?: Maybe<Scalars['Int']>;
  id: Scalars['String'];
};

export type AwsSecurityGroup = AwsBaseService & {
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  clientVpnEndpoint?: Maybe<Array<Maybe<AwsClientVpnEndpoint>>>;
  codebuilds?: Maybe<Array<Maybe<AwsCodebuild>>>;
  default?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  dmsReplicationInstances?: Maybe<Array<Maybe<AwsDmsReplicationInstance>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  elastiCacheCluster?: Maybe<Array<Maybe<AwsElastiCacheCluster>>>;
  elasticSearchDomains?: Maybe<Array<Maybe<AwsElasticSearchDomain>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  inboundRuleCount?: Maybe<Scalars['Int']>;
  inboundRules?: Maybe<Array<Maybe<AwsSgInboundRule>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  managedAirflows?: Maybe<Array<Maybe<AwsManagedAirflow>>>;
  mskClusters?: Maybe<Array<Maybe<AwsMskCluster>>>;
  name?: Maybe<Scalars['String']>;
  networkInterfaces?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  outboundRuleCount?: Maybe<Scalars['Int']>;
  outboundRules?: Maybe<Array<Maybe<AwsSgOutboundRule>>>;
  owner?: Maybe<Scalars['String']>;
  rdsCluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  sageMakerNotebookInstances?: Maybe<Array<Maybe<AwsSageMakerNotebookInstance>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpcEndpoints?: Maybe<Array<Maybe<AwsVpcEndpoint>>>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsSecurityHub = AwsBaseService & {
  autoEnableControls?: Maybe<Scalars['Boolean']>;
  subscribedAt?: Maybe<Scalars['String']>;
};

export type AwsServiceBillingInfo = {
  cost?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
  formattedCost?: Maybe<Scalars['String']>;
  name: Scalars['String'];
};

export type AwsSes = AwsBaseService & {
  cognitoUserPools?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  email?: Maybe<Scalars['String']>;
  verificationStatus?: Maybe<Scalars['String']>;
};

export type AwsSgInboundRule = {
  description?: Maybe<Scalars['String']>;
  fromPort?: Maybe<Scalars['Int']>;
  groupName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  peeringStatus?: Maybe<Scalars['String']>;
  portRange?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  toPort?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['String']>;
};

export type AwsSgOutboundRule = {
  description?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  fromPort?: Maybe<Scalars['Int']>;
  groupName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  peeringStatus?: Maybe<Scalars['String']>;
  portRange?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  toPort?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['String']>;
};

export type AwsShardLevelMetrics = {
  shardLevelMetrics?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type AwsShards = {
  adjacentParentShardId?: Maybe<Scalars['String']>;
  hashKeyRangeEnding: Scalars['String'];
  hashKeyRangeStarting: Scalars['String'];
  parentShardId?: Maybe<Scalars['String']>;
  sequenceNumberRangeEnding?: Maybe<Scalars['String']>;
  sequenceNumberRangeStaring: Scalars['String'];
  shardId: Scalars['String'];
};

export type AwsSns = AwsBaseService & {
  cloudFormationStack?: Maybe<Array<Maybe<AwsCloudFormationStack>>>;
  cloudtrail?: Maybe<Array<Maybe<AwsCloudtrail>>>;
  cloudwatch?: Maybe<Array<Maybe<AwsCloudwatch>>>;
  deliveryPolicy?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  policy?: Maybe<AwsIamJsonPolicy>;
  rawPolicy?: Maybe<Scalars['String']>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  subscriptions?: Maybe<Array<Maybe<AwsSnsSubscription>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
};

export type AwsSnsSubscription = {
  arn?: Maybe<Scalars['String']>;
  endpoint?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  protocol?: Maybe<Scalars['String']>;
};

export type AwsSqs = AwsBaseService & {
  approximateNumberOfMessages?: Maybe<Scalars['Int']>;
  approximateNumberOfMessagesDelayed?: Maybe<Scalars['Int']>;
  approximateNumberOfMessagesNotVisible?: Maybe<Scalars['Int']>;
  contentBasedDeduplication?: Maybe<Scalars['Boolean']>;
  deduplicationScope?: Maybe<Scalars['String']>;
  delaySeconds?: Maybe<Scalars['String']>;
  elasticBeanstalkEnvs?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  fifoQueue?: Maybe<Scalars['Boolean']>;
  fifoThroughputLimit?: Maybe<Scalars['String']>;
  kmsDataKeyReusePeriodSeconds?: Maybe<Scalars['String']>;
  kmsMasterKeyId?: Maybe<Scalars['String']>;
  maximumMessageSize?: Maybe<Scalars['Int']>;
  messageRetentionPeriod?: Maybe<Scalars['String']>;
  policy?: Maybe<AwsIamJsonPolicy>;
  queueType?: Maybe<Scalars['String']>;
  queueUrl?: Maybe<Scalars['String']>;
  rawPolicy?: Maybe<Scalars['String']>;
  receiveMessageWaitTimeSeconds?: Maybe<Scalars['String']>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  sqsManagedSseEnabled?: Maybe<Scalars['Boolean']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  visibilityTimeout?: Maybe<Scalars['String']>;
};

export type AwsSubnet = AwsBaseService & {
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  autoAssignPublicIpv4Address?: Maybe<Scalars['String']>;
  autoAssignPublicIpv6Address?: Maybe<Scalars['String']>;
  availabilityZone?: Maybe<Scalars['String']>;
  availableIpV4Addresses?: Maybe<Scalars['Int']>;
  codebuilds?: Maybe<Array<Maybe<AwsCodebuild>>>;
  defaultForAz?: Maybe<Scalars['Boolean']>;
  dmsReplicationInstances?: Maybe<Array<Maybe<AwsDmsReplicationInstance>>>;
  ec2Instances?: Maybe<Array<Maybe<AwsEc2>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  efsMountTarget?: Maybe<Array<Maybe<AwsEfsMountTarget>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  elastiCacheCluster?: Maybe<Array<Maybe<AwsElastiCacheCluster>>>;
  elasticSearchDomains?: Maybe<Array<Maybe<AwsElasticSearchDomain>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  emrCluster?: Maybe<Array<Maybe<AwsEmrCluster>>>;
  flowLogs?: Maybe<Array<Maybe<AwsFlowLog>>>;
  ipV4Cidr?: Maybe<Scalars['String']>;
  ipV6Cidr?: Maybe<Scalars['String']>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  managedAirflows?: Maybe<Array<Maybe<AwsManagedAirflow>>>;
  mskClusters?: Maybe<Array<Maybe<AwsMskCluster>>>;
  nacls?: Maybe<Array<Maybe<AwsNetworkAcl>>>;
  natGateway?: Maybe<Array<Maybe<AwsNatGateway>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  rdsCluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  routeTable?: Maybe<Array<Maybe<AwsRouteTable>>>;
  sageMakerNotebookInstances?: Maybe<Array<Maybe<AwsSageMakerNotebookInstance>>>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcEndpoints?: Maybe<Array<Maybe<AwsVpcEndpoint>>>;
};

export type AwsSupportedLoginProvider = {
  identityProvider?: Maybe<Scalars['String']>;
  identityProviderId: Scalars['String'];
};

export type AwsSuspendedProcess = {
  id: Scalars['String'];
  processName: Scalars['String'];
  suspensionReason?: Maybe<Scalars['String']>;
};

export type AwsSystemsManagerDocument = AwsBaseService & {
  createdDate?: Maybe<Scalars['DateTime']>;
  documentFormat?: Maybe<Scalars['String']>;
  documentType?: Maybe<Scalars['String']>;
  documentVersion?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  owner?: Maybe<Scalars['String']>;
  permissions?: Maybe<AwsSystemsManagerDocumentPermissions>;
  platformTypes?: Maybe<Array<Maybe<Scalars['String']>>>;
  schemaVersion?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  targetType?: Maybe<Scalars['String']>;
};

export type AwsSystemsManagerDocumentPermissions = {
  accountIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  accountSharingInfoList?: Maybe<Array<Maybe<AwsSystemsManagerDocumentPermissionsSharingList>>>;
};

export type AwsSystemsManagerDocumentPermissionsSharingList = {
  accountId?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  sharedDocumentVersion?: Maybe<Scalars['String']>;
};

export type AwsSystemsManagerInstance = AwsBaseService & {
  activationId?: Maybe<Scalars['String']>;
  agentVersion?: Maybe<Scalars['String']>;
  associationOverview?: Maybe<SystemsManagerInstanceAssociationOverview>;
  associationStatus?: Maybe<Scalars['String']>;
  complianceItems?: Maybe<Array<Maybe<SystemsManagerInstanceComplianceItem>>>;
  computerName?: Maybe<Scalars['String']>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  iamRole?: Maybe<Array<Maybe<AwsIamRole>>>;
  instanceId?: Maybe<Scalars['String']>;
  ipAddress?: Maybe<Scalars['String']>;
  isLatestVersion?: Maybe<Scalars['Boolean']>;
  lastAssociationExecutionDate?: Maybe<Scalars['DateTime']>;
  lastPingDateTime?: Maybe<Scalars['DateTime']>;
  lastSuccessfulAssociationExecutionDate?: Maybe<Scalars['DateTime']>;
  name?: Maybe<Scalars['String']>;
  pingStatus?: Maybe<Scalars['String']>;
  platformName?: Maybe<Scalars['String']>;
  platformType?: Maybe<Scalars['String']>;
  platformVersion?: Maybe<Scalars['String']>;
  registrationDate?: Maybe<Scalars['DateTime']>;
  resourceType?: Maybe<Scalars['String']>;
  sourceId?: Maybe<Scalars['String']>;
  sourceType?: Maybe<Scalars['String']>;
};

export type AwsTag = {
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  apiGatewayDomainName?: Maybe<Array<Maybe<AwsApiGatewayDomainName>>>;
  apiGatewayHttpApi?: Maybe<Array<Maybe<AwsApiGatewayHttpApi>>>;
  apiGatewayRestApi?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
  apiGatewayStage?: Maybe<Array<Maybe<AwsApiGatewayStage>>>;
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
  clientVpnEndpoint?: Maybe<Array<Maybe<AwsClientVpnEndpoint>>>;
  cloud9Environment?: Maybe<Array<Maybe<AwsCloud9Environment>>>;
  cloudFormationStack?: Maybe<Array<Maybe<AwsCloudFormationStack>>>;
  cloudFormationStackSet?: Maybe<Array<Maybe<AwsCloudFormationStackSet>>>;
  cloudfront?: Maybe<Array<Maybe<AwsCloudfront>>>;
  cloudtrail?: Maybe<Array<Maybe<AwsCloudtrail>>>;
  cloudwatch?: Maybe<Array<Maybe<AwsCloudwatch>>>;
  codebuilds?: Maybe<Array<Maybe<AwsCodebuild>>>;
  cognitoIdentityPool?: Maybe<Array<Maybe<AwsCognitoIdentityPool>>>;
  cognitoUserPool?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
  customerGateway?: Maybe<Array<Maybe<AwsCustomerGateway>>>;
  dmsReplicationInstances?: Maybe<Array<Maybe<AwsDmsReplicationInstance>>>;
  dynamodb?: Maybe<Array<Maybe<AwsDynamoDbTable>>>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  ecr?: Maybe<Array<Maybe<AwsEcr>>>;
  ecsCluster?: Maybe<Array<Maybe<AwsEcsCluster>>>;
  ecsContainer?: Maybe<Array<Maybe<AwsEcsContainer>>>;
  ecsService?: Maybe<Array<Maybe<AwsEcsService>>>;
  ecsTask?: Maybe<Array<Maybe<AwsEcsTask>>>;
  efs?: Maybe<Array<Maybe<AwsEfs>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
  eksCluster?: Maybe<Array<Maybe<AwsEksCluster>>>;
  elastiCacheCluster?: Maybe<Array<Maybe<AwsElastiCacheCluster>>>;
  elastiCacheReplicationGroup?: Maybe<Array<Maybe<AwsElastiCacheReplicationGroup>>>;
  elasticBeanstalkApp?: Maybe<Array<Maybe<AwsElasticBeanstalkApp>>>;
  elasticBeanstalkEnv?: Maybe<Array<Maybe<AwsElasticBeanstalkEnv>>>;
  elasticSearchDomains?: Maybe<Array<Maybe<AwsElasticSearchDomain>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  emrCluster?: Maybe<Array<Maybe<AwsEmrCluster>>>;
  flowLogs?: Maybe<Array<Maybe<AwsFlowLog>>>;
  guardDutyDetectors?: Maybe<Array<Maybe<AwsGuardDutyDetector>>>;
  iamAccessAnalyzers?: Maybe<Array<Maybe<AwsIamAccessAnalyzer>>>;
  iamInstanceProfiles?: Maybe<Array<Maybe<AwsIamInstanceProfile>>>;
  iamPolicies?: Maybe<Array<Maybe<AwsIamPolicy>>>;
  iamRoles?: Maybe<Array<Maybe<AwsIamRole>>>;
  iamUsers?: Maybe<Array<Maybe<AwsIamUser>>>;
  id: Scalars['String'];
  igw?: Maybe<Array<Maybe<AwsIgw>>>;
  key: Scalars['String'];
  kinesisFirehose?: Maybe<Array<Maybe<AwsKinesisFirehose>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  managedAirflows?: Maybe<Array<Maybe<AwsManagedAirflow>>>;
  managedPrefixLists?: Maybe<Array<Maybe<AwsManagedPrefixList>>>;
  nacl?: Maybe<Array<Maybe<AwsNetworkAcl>>>;
  natGateway?: Maybe<Array<Maybe<AwsNatGateway>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  rdsCluster?: Maybe<Array<Maybe<AwsRdsCluster>>>;
  rdsClusterSnapshot?: Maybe<Array<Maybe<AwsRdsClusterSnapshot>>>;
  rdsDbInstance?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  redshiftClusters?: Maybe<Array<Maybe<AwsRedshiftCluster>>>;
  routeTable?: Maybe<Array<Maybe<AwsRouteTable>>>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  secretsManager?: Maybe<Array<Maybe<AwsSecretsManager>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  sns?: Maybe<Array<Maybe<AwsSns>>>;
  sqs?: Maybe<Array<Maybe<AwsSqs>>>;
  subnet?: Maybe<Array<Maybe<AwsSubnet>>>;
  systemsManagerDocuments?: Maybe<Array<Maybe<AwsSystemsManagerDocument>>>;
  transitGateway?: Maybe<Array<Maybe<AwsTransitGateway>>>;
  transitGatewayAttachment?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
  transitGatewayRouteTables?: Maybe<Array<Maybe<AwsTransitGatewayRouteTable>>>;
  value: Scalars['String'];
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcEndpoints?: Maybe<Array<Maybe<AwsVpcEndpoint>>>;
  vpcPeeringConnections?: Maybe<Array<Maybe<AwsVpcPeeringConnection>>>;
  vpnConnection?: Maybe<Array<Maybe<AwsVpnConnection>>>;
  vpnGateway?: Maybe<Array<Maybe<AwsVpnGateway>>>;
};

export type AwsTotalBillingInfo = {
  cost?: Maybe<Scalars['Float']>;
  currency?: Maybe<Scalars['String']>;
  formattedCost?: Maybe<Scalars['String']>;
};

export type AwsTransitGateway = AwsBaseService & {
  amazonSideAsn?: Maybe<Scalars['String']>;
  associationDefaultRouteTableId?: Maybe<Scalars['String']>;
  autoAcceptSharedAttachments?: Maybe<Scalars['String']>;
  defaultRouteTableAssociation?: Maybe<Scalars['String']>;
  defaultRouteTablePropagation?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dnsSupport?: Maybe<Scalars['String']>;
  ownerId?: Maybe<Scalars['String']>;
  propagationDefaultRouteTableId?: Maybe<Scalars['String']>;
  routeTables?: Maybe<Array<Maybe<AwsTransitGatewayRouteTable>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  transitGatewayAttachments?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
  vpnConnection?: Maybe<Array<Maybe<AwsVpnConnection>>>;
  vpnEcmpSupport?: Maybe<Scalars['String']>;
};

export type AwsTransitGatewayAttachment = {
  accountId: Scalars['String'];
  arn: Scalars['String'];
  creationTime?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  region?: Maybe<Scalars['String']>;
  resourceId?: Maybe<Scalars['String']>;
  resourceOwnerId?: Maybe<Scalars['String']>;
  resourceType?: Maybe<Scalars['String']>;
  routeTable?: Maybe<Array<Maybe<AwsTransitGatewayRouteTable>>>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  transitGateway?: Maybe<Array<Maybe<AwsTransitGateway>>>;
  transitGatewayId?: Maybe<Scalars['String']>;
  transitGatewayOwnerId?: Maybe<Scalars['String']>;
  transitGatewayRouteTableId?: Maybe<Scalars['String']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpnConnection?: Maybe<Array<Maybe<AwsVpnConnection>>>;
};

export type AwsTransitGatewayRoute = {
  destinationCidrBlock?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  prefixListId?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  transitGatewayAttachments?: Maybe<Array<Maybe<AwsTransitGatewayRouteAttachment>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsTransitGatewayRouteAttachment = {
  id: Scalars['String'];
  resourceId?: Maybe<Scalars['String']>;
  resourceType?: Maybe<Scalars['String']>;
  transitGatewayAttachmentId?: Maybe<Scalars['String']>;
};

export type AwsTransitGatewayRouteTable = AwsBaseService & {
  creationTime?: Maybe<Scalars['DateTime']>;
  defaultAssociationRouteTable?: Maybe<Scalars['Boolean']>;
  defaultPropagationRouteTable?: Maybe<Scalars['Boolean']>;
  routes?: Maybe<Array<Maybe<AwsTransitGatewayRoute>>>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  transitGateway?: Maybe<Array<Maybe<AwsTransitGateway>>>;
  transitGatewayAttachments?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
  transitGatewayId?: Maybe<Scalars['String']>;
};

export type AwsTunelOptions = {
  id: Scalars['String'];
  outsideIpAddress?: Maybe<Scalars['String']>;
  preSharedKey?: Maybe<Scalars['String']>;
  tunnelInsideCidr?: Maybe<Scalars['String']>;
};

export type AwsVgwTelemetry = {
  acceptedRouteCount?: Maybe<Scalars['Int']>;
  certificateArn?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  lastStatusChange?: Maybe<Scalars['String']>;
  outsideIpAddress?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  statusMessage?: Maybe<Scalars['String']>;
};

export type AwsVpc = AwsBaseService & {
  albs?: Maybe<Array<Maybe<AwsAlb>>>;
  codebuilds?: Maybe<Array<Maybe<AwsCodebuild>>>;
  defaultVpc?: Maybe<Scalars['Boolean']>;
  dhcpOptionsSet?: Maybe<Scalars['String']>;
  dmsReplicationInstances?: Maybe<Array<Maybe<AwsDmsReplicationInstance>>>;
  ecsServices?: Maybe<Array<Maybe<AwsEcsService>>>;
  efsMountTargets?: Maybe<Array<Maybe<AwsEfsMountTarget>>>;
  eips?: Maybe<Array<Maybe<AwsEip>>>;
  eksClusters?: Maybe<Array<Maybe<AwsEksCluster>>>;
  elastiCacheCluster?: Maybe<Array<Maybe<AwsElastiCacheCluster>>>;
  elasticSearchDomains?: Maybe<Array<Maybe<AwsElasticSearchDomain>>>;
  elbs?: Maybe<Array<Maybe<AwsElb>>>;
  enableDnsHostnames?: Maybe<Scalars['Boolean']>;
  enableDnsSupport?: Maybe<Scalars['Boolean']>;
  flowLog?: Maybe<Array<Maybe<AwsFlowLog>>>;
  igws?: Maybe<Array<Maybe<AwsIgw>>>;
  instanceTenancy?: Maybe<Scalars['String']>;
  ipV4Cidr?: Maybe<Scalars['String']>;
  ipV6Cidr?: Maybe<Scalars['String']>;
  lambdas?: Maybe<Array<Maybe<AwsLambda>>>;
  nacls?: Maybe<Array<Maybe<AwsNetworkAcl>>>;
  natGateways?: Maybe<Array<Maybe<AwsNatGateway>>>;
  networkInterfaces?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  rdsClusterSnapshots?: Maybe<Array<Maybe<AwsRdsClusterSnapshot>>>;
  rdsDbInstances?: Maybe<Array<Maybe<AwsRdsDbInstance>>>;
  redshiftClusters?: Maybe<Array<Maybe<AwsRedshiftCluster>>>;
  route53HostedZones?: Maybe<Array<Maybe<AwsRoute53HostedZone>>>;
  routeTables?: Maybe<Array<Maybe<AwsRouteTable>>>;
  state?: Maybe<Scalars['String']>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  transitGatewayAttachments?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
  vpcEndpoints?: Maybe<Array<Maybe<AwsVpcEndpoint>>>;
  vpcPeeringConnection?: Maybe<Array<Maybe<AwsVpcPeeringConnection>>>;
  vpnGateways?: Maybe<Array<Maybe<AwsVpnGateway>>>;
};

export type AwsVpcEndpoint = AwsBaseService & {
  creationTimestamp?: Maybe<Scalars['DateTime']>;
  lastErrorCode?: Maybe<Scalars['String']>;
  lastErrorMessage?: Maybe<Scalars['String']>;
  networkInterfaces?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  policyDocument?: Maybe<Scalars['String']>;
  privateDnsEnabled?: Maybe<Scalars['Boolean']>;
  requesterManaged?: Maybe<Scalars['Boolean']>;
  routeTables?: Maybe<Array<Maybe<AwsRouteTable>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  serviceName?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  subnets?: Maybe<Array<Maybe<AwsSubnet>>>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  type?: Maybe<Scalars['String']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsVpcPeeringConnection = AwsBaseService & {
  accepterVpcInfo?: Maybe<AwsVpcPeeringConnectionVpcInfo>;
  expirationTime?: Maybe<Scalars['DateTime']>;
  requesterVpcInfo?: Maybe<AwsVpcPeeringConnectionVpcInfo>;
  statusCode?: Maybe<Scalars['String']>;
  statusMessage?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsVpcPeeringConnectionCidrBlock = {
  cidrBlock?: Maybe<Scalars['String']>;
  id: Scalars['String'];
};

export type AwsVpcPeeringConnectionIpv6CidrBlock = {
  id: Scalars['String'];
  ipv6CidrBlock?: Maybe<Scalars['String']>;
};

export type AwsVpcPeeringConnectionOptionsDescription = {
  allowDnsResolutionFromRemoteVpc?: Maybe<Scalars['Boolean']>;
  allowEgressFromLocalClassicLinkToRemoteVpc?: Maybe<Scalars['Boolean']>;
  allowEgressFromLocalVpcToRemoteClassicLink?: Maybe<Scalars['Boolean']>;
};

export type AwsVpcPeeringConnectionVpcInfo = {
  cidrBlock?: Maybe<Scalars['String']>;
  cidrBlockSet?: Maybe<Array<Maybe<AwsVpcPeeringConnectionCidrBlock>>>;
  ipv6CidrBlockSet?: Maybe<Array<Maybe<AwsVpcPeeringConnectionIpv6CidrBlock>>>;
  peeringOptions?: Maybe<AwsVpcPeeringConnectionOptionsDescription>;
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsVpnConnection = AwsBaseService & {
  category?: Maybe<Scalars['String']>;
  customerGateway?: Maybe<Array<Maybe<AwsCustomerGateway>>>;
  customerGatewayId?: Maybe<Scalars['String']>;
  options?: Maybe<AwsVpnConnectionOptions>;
  routes?: Maybe<Array<Maybe<AwsVpnStaticRoute>>>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  transitGateway?: Maybe<Array<Maybe<AwsTransitGateway>>>;
  transitGatewayAttachments?: Maybe<Array<Maybe<AwsTransitGatewayAttachment>>>;
  transitGatewayId?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  vgwTelemetry?: Maybe<Array<Maybe<AwsVgwTelemetry>>>;
  vpnGateway?: Maybe<Array<Maybe<AwsVpnGateway>>>;
  vpnGatewayId?: Maybe<Scalars['String']>;
};

export type AwsVpnConnectionOptions = {
  enableAcceleration?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  localIpv4NetworkCidr?: Maybe<Scalars['String']>;
  remoteIpv4NetworkCidr?: Maybe<Scalars['String']>;
  staticRoutesOnly?: Maybe<Scalars['Boolean']>;
  tunnelInsideIpVersion?: Maybe<Scalars['String']>;
  tunnelOptions?: Maybe<Array<Maybe<AwsTunelOptions>>>;
  type?: Maybe<Scalars['String']>;
};

export type AwsVpnGateway = AwsBaseService & {
  amazonSideAsn?: Maybe<Scalars['Int']>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<AwsRawTag>>>;
  type?: Maybe<Scalars['String']>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  vpcIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  vpnConnection?: Maybe<Array<Maybe<AwsVpnConnection>>>;
};

export type AwsVpnStaticRoute = {
  destinationCidrBlock?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  source?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type AwsWafV2CustomResponseBody = {
  content?: Maybe<Scalars['String']>;
  contentType?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
};

export type AwsWafV2DefaultAction = {
  allow?: Maybe<AwsWafV2RuleAllowOrCountAction>;
  block?: Maybe<AwsWafV2RuleBlockAction>;
};

export type AwsWafV2ExcludedRule = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type AwsWafV2FieldToMatch = {
  id: Scalars['String'];
  singleHeader?: Maybe<AwsWafV2SingleName>;
  singleQueryArgument?: Maybe<AwsWafV2SingleName>;
};

export type AwsWafV2FirewallManager = {
  firewallManagerStatement?: Maybe<AwsWafV2FirewallManagerStatement>;
};

export type AwsWafV2FirewallManagerRuleGroup = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  overrideAction?: Maybe<AwsWafV2RuleOverrideAction>;
  priority?: Maybe<Scalars['Int']>;
  visibilityConfig?: Maybe<AwsWafV2VisibilityConfig>;
};

export type AwsWafV2FirewallManagerStatement = {
  managedRuleGroupStatement?: Maybe<AwsWafV2StatementManagedRuleGroupStatement>;
  ruleGroupReferenceStatement?: Maybe<AwsWafV2StatementRuleGroupReferenceStatement>;
};

export type AwsWafV2ForwardedIpConfig = {
  fallbackBehavior?: Maybe<Scalars['String']>;
  headerName?: Maybe<Scalars['String']>;
};

export type AwsWafV2IpSetForwardedIpConfig = {
  fallbackBehavior?: Maybe<Scalars['String']>;
  headerName?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['Int']>;
};

export type AwsWafV2LoggingConfig = {
  logDestinationConfigs?: Maybe<Array<Maybe<Scalars['String']>>>;
  loggingFilter?: Maybe<AwsWafV2LoggingFilterConfig>;
  managedByFirewallManager?: Maybe<Scalars['Boolean']>;
  redactedFields?: Maybe<Array<Maybe<AwsWafV2FieldToMatch>>>;
  resourceArn?: Maybe<Scalars['String']>;
};

export type AwsWafV2LoggingFilter = {
  behavior?: Maybe<Scalars['String']>;
  conditions?: Maybe<Array<Maybe<AwsWafV2LoggingFilterCondition>>>;
  id: Scalars['String'];
  requirement?: Maybe<Scalars['String']>;
};

export type AwsWafV2LoggingFilterActionCondition = {
  action?: Maybe<Scalars['String']>;
};

export type AwsWafV2LoggingFilterCondition = {
  actionCondition?: Maybe<AwsWafV2LoggingFilterActionCondition>;
  id: Scalars['String'];
  labelNameCondition?: Maybe<AwsWafV2LoggingFilterLabelNameCondition>;
};

export type AwsWafV2LoggingFilterConfig = {
  defaultBehavior?: Maybe<Scalars['String']>;
  filters?: Maybe<Array<Maybe<AwsWafV2LoggingFilter>>>;
};

export type AwsWafV2LoggingFilterLabelNameCondition = {
  labelName?: Maybe<Scalars['String']>;
};

export type AwsWafV2Rule = {
  action?: Maybe<AwsWafV2RuleAction>;
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  overrideAction?: Maybe<AwsWafV2RuleOverrideAction>;
  priority?: Maybe<Scalars['Int']>;
  ruleLabels?: Maybe<Array<Maybe<AwsWafV2RuleLabel>>>;
  statement?: Maybe<AwsWafV2Statement>;
  visibilityConfig?: Maybe<AwsWafV2VisibilityConfig>;
};

export type AwsWafV2RuleAction = {
  allow?: Maybe<AwsWafV2RuleAllowOrCountAction>;
  block?: Maybe<AwsWafV2RuleBlockAction>;
  count?: Maybe<AwsWafV2RuleAllowOrCountAction>;
};

export type AwsWafV2RuleActionCustomRequestHandling = {
  insertHeaders?: Maybe<Array<Maybe<AwsWafV2RuleActionCustomRequestHandlingHeader>>>;
};

export type AwsWafV2RuleActionCustomRequestHandlingHeader = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsWafV2RuleActionCustomResponse = {
  customResponseBodyKey?: Maybe<Scalars['String']>;
  responseCode?: Maybe<Scalars['Int']>;
  responseHeaders?: Maybe<Array<Maybe<AwsWafV2RuleActionResponseHeader>>>;
};

export type AwsWafV2RuleActionResponseHeader = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsWafV2RuleAllowOrCountAction = {
  customRequestHandling?: Maybe<AwsWafV2RuleActionCustomRequestHandling>;
};

export type AwsWafV2RuleBlockAction = {
  customResponse?: Maybe<AwsWafV2RuleActionCustomResponse>;
};

export type AwsWafV2RuleLabel = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
};

export type AwsWafV2RuleOverrideAction = {
  count?: Maybe<AwsWafV2RuleAllowOrCountAction>;
  none?: Maybe<Scalars['Boolean']>;
};

export type AwsWafV2SingleName = {
  name?: Maybe<Scalars['String']>;
};

export type AwsWafV2Statement = {
  andStatement?: Maybe<AwsWafV2StatementAndStatement>;
  byteMatchStatement?: Maybe<AwsWafV2StatementByteMatchStatement>;
  geoMatchStatement?: Maybe<AwsWafV2StatementGeoMatchStatement>;
  iPSetReferenceStatement?: Maybe<AwsWafV2StatementIpSetReferenceStatement>;
  id: Scalars['String'];
  labelMatchStatement?: Maybe<AwsWafV2StatementLabelMatchStatement>;
  managedRuleGroupStatement?: Maybe<AwsWafV2StatementManagedRuleGroupStatement>;
  notStatement?: Maybe<AwsWafV2StatementNotStatement>;
  orStatement?: Maybe<AwsWafV2StatementOrStatement>;
  rateBasedStatement?: Maybe<AwsWafV2StatementRateBasedStatement>;
  regexPatternSetReferenceStatement?: Maybe<AwsWafV2StatementRegrexPatternSetReferenceStatement>;
  ruleGroupReferenceStatement?: Maybe<AwsWafV2StatementRuleGroupReferenceStatement>;
  sizeConstraintStatement?: Maybe<AwsWafV2StatementSzieConstraintStatement>;
  sqliMatchStatement?: Maybe<AwsWafV2StatementSqliMatchStatement>;
  xssMatchStatement?: Maybe<AwsWafV2StatementXssMatchStatement>;
};

export type AwsWafV2StatementAndStatement = {
  statements?: Maybe<Array<Maybe<AwsWafV2Statement>>>;
};

export type AwsWafV2StatementByteMatchStatement = {
  fieldToMatch?: Maybe<AwsWafV2FieldToMatch>;
  positionalConstraint?: Maybe<Scalars['String']>;
  searchString?: Maybe<Scalars['String']>;
  textTransformations?: Maybe<Array<Maybe<AwsWafV2TextTransformation>>>;
};

export type AwsWafV2StatementGeoMatchStatement = {
  countryCodes?: Maybe<Array<Maybe<Scalars['String']>>>;
  forwardedIpConfig?: Maybe<AwsWafV2ForwardedIpConfig>;
};

export type AwsWafV2StatementIpSetReferenceStatement = {
  arn?: Maybe<Scalars['String']>;
  iPSetForwardedIPConfig?: Maybe<AwsWafV2IpSetForwardedIpConfig>;
};

export type AwsWafV2StatementLabelMatchStatement = {
  key?: Maybe<Scalars['String']>;
  scope?: Maybe<Scalars['String']>;
};

export type AwsWafV2StatementManagedRuleGroupStatement = {
  excludedRules?: Maybe<Array<Maybe<AwsWafV2ExcludedRule>>>;
  name?: Maybe<Scalars['String']>;
  scopedDownStatement?: Maybe<Scalars['String']>;
  vendorName?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['String']>;
};

export type AwsWafV2StatementNotStatement = {
  statement?: Maybe<AwsWafV2Statement>;
};

export type AwsWafV2StatementOrStatement = {
  statements?: Maybe<Array<Maybe<AwsWafV2Statement>>>;
};

export type AwsWafV2StatementRateBasedStatement = {
  aggregateKeyType?: Maybe<Scalars['String']>;
  forwardedIpConfig?: Maybe<AwsWafV2ForwardedIpConfig>;
  limit?: Maybe<Scalars['Int']>;
  statement?: Maybe<AwsWafV2Statement>;
};

export type AwsWafV2StatementRegrexPatternSetReferenceStatement = {
  arn?: Maybe<Scalars['String']>;
  fieldToMatch?: Maybe<AwsWafV2FieldToMatch>;
  textTransformations?: Maybe<Array<Maybe<AwsWafV2TextTransformation>>>;
};

export type AwsWafV2StatementRuleGroupReferenceStatement = {
  arn?: Maybe<Scalars['String']>;
  excludedRules?: Maybe<Array<Maybe<AwsWafV2ExcludedRule>>>;
};

export type AwsWafV2StatementSqliMatchStatement = {
  fieldToMatch?: Maybe<AwsWafV2FieldToMatch>;
  textTransformations?: Maybe<Array<Maybe<AwsWafV2TextTransformation>>>;
};

export type AwsWafV2StatementSzieConstraintStatement = {
  comparisonOperator?: Maybe<Scalars['String']>;
  fieldToMatch?: Maybe<AwsWafV2FieldToMatch>;
  size?: Maybe<Scalars['Int']>;
  textTransformations?: Maybe<Array<Maybe<AwsWafV2TextTransformation>>>;
};

export type AwsWafV2StatementXssMatchStatement = {
  fieldToMatch?: Maybe<AwsWafV2FieldToMatch>;
  textTransformations?: Maybe<Array<Maybe<AwsWafV2TextTransformation>>>;
};

export type AwsWafV2TextTransformation = {
  id: Scalars['String'];
  priority?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
};

export type AwsWafV2VisibilityConfig = {
  cloudWatchMetricsEnabled?: Maybe<Scalars['Boolean']>;
  metricName?: Maybe<Scalars['String']>;
  sampledRequestsEnabled?: Maybe<Scalars['Boolean']>;
};

export type AwsWafV2WebAcl = AwsBaseService & {
  ManagedByFirewallManager?: Maybe<Scalars['Boolean']>;
  albs?: Maybe<Array<Maybe<AwsAlb>>>;
  apiGatewayStages?: Maybe<Array<Maybe<AwsApiGatewayStage>>>;
  appSync?: Maybe<Array<Maybe<AwsAppSync>>>;
  capacity?: Maybe<Scalars['Int']>;
  cloudfront?: Maybe<Array<Maybe<AwsCloudfront>>>;
  customResponseBodies?: Maybe<Array<Maybe<AwsWafV2CustomResponseBody>>>;
  defaultAction?: Maybe<AwsWafV2DefaultAction>;
  description?: Maybe<Scalars['String']>;
  labelNamespace?: Maybe<Scalars['String']>;
  loggingConfiguration?: Maybe<AwsWafV2LoggingConfig>;
  name?: Maybe<Scalars['String']>;
  postProcessFirewallManagerRuleGroups?: Maybe<Array<Maybe<AwsWafV2FirewallManagerRuleGroup>>>;
  preProcessFirewallManagerRuleGroups?: Maybe<Array<Maybe<AwsWafV2FirewallManagerRuleGroup>>>;
  rules?: Maybe<Array<Maybe<AwsWafV2Rule>>>;
  scope?: Maybe<Scalars['String']>;
  visibilityConfig?: Maybe<AwsWafV2VisibilityConfig>;
};

export type BlockDeviceEbs = {
  attachTime: Scalars['String'];
  deleteOnTermination: Scalars['Boolean'];
  status: Scalars['String'];
  volumeId: Scalars['String'];
};

export type SsmAssociationOverviewAggregatedCount = {
  id: Scalars['String'];
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
};

export type SsmComplianceItemExecutionSummary = {
  executionId?: Maybe<Scalars['String']>;
  executionTime?: Maybe<Scalars['DateTime']>;
  executionType?: Maybe<Scalars['String']>;
};

export type SystemsManagerInstanceAssociationOverview = {
  detailedStatus?: Maybe<Scalars['String']>;
  instanceAssociationStatusAggregatedCount?: Maybe<Array<Maybe<SsmAssociationOverviewAggregatedCount>>>;
};

export type SystemsManagerInstanceComplianceItem = {
  complianceItemId?: Maybe<Scalars['String']>;
  complianceType?: Maybe<Scalars['String']>;
  details?: Maybe<Array<Maybe<AwsRawTag>>>;
  executionSummary?: Maybe<SsmComplianceItemExecutionSummary>;
  id: Scalars['String'];
  resourceId?: Maybe<Scalars['String']>;
  resourceType?: Maybe<Scalars['String']>;
  severity?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};
