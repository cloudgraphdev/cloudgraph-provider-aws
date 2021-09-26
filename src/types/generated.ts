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

export type Tag = {
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
  arn: Scalars['String'];
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
  tags?: Maybe<Array<Maybe<Tag>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  route53Record?: Maybe<Array<Maybe<AwsRoute53Record>>>;
  listeners?: Maybe<Array<Maybe<AwsAlbListener>>>;
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
  arn: Scalars['String'];
  httpMethod?: Maybe<Scalars['String']>;
  authorization?: Maybe<Scalars['String']>;
  apiKeyRequired?: Maybe<Scalars['Boolean']>;
};

export type AwsApiGatewayResource = {
  id: Scalars['String'];
  arn: Scalars['String'];
  restApi?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
  path?: Maybe<Scalars['String']>;
  methods?: Maybe<Array<Maybe<AwsApiGatewayMethod>>>;
};

export type AwsApiGatewayRestApi = {
  id: Scalars['String'];
  arn: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  policy?: Maybe<Scalars['String']>;
  endpointConfiguration?: Maybe<AwsApiGatewayEndpointConfiguration>;
  apiKeySource?: Maybe<Scalars['String']>;
  createdDate?: Maybe<Scalars['String']>;
  minimumCompressionSize?: Maybe<Scalars['Int']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  binaryMediaTypes?: Maybe<Array<Maybe<Scalars['String']>>>;
  stages?: Maybe<Array<Maybe<AwsApiGatewayStage>>>;
  resources?: Maybe<Array<Maybe<AwsApiGatewayResource>>>;
};

export type AwsApiGatewayStage = {
  id: Scalars['String'];
  arn: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  cacheCluster?: Maybe<Scalars['Boolean']>;
  cacheClusterSize?: Maybe<Scalars['String']>;
  accessLogSettings?: Maybe<AwsAccessLogSettings>;
  documentationVersion?: Maybe<Scalars['String']>;
  clientCertificateId?: Maybe<Scalars['String']>;
  xrayTracing?: Maybe<Scalars['Boolean']>;
  variables?: Maybe<Array<Maybe<AwsApiGatewayStageVariable>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  restApi?: Maybe<Array<Maybe<AwsApiGatewayRestApi>>>;
};

export type AwsApiGatewayStageVariable = {
  key: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type AwsAppSync = {
  id: Scalars['String'];
  arn: Scalars['String'];
  name: Scalars['String'];
  region: Scalars['String'];
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
  tags?: Maybe<Array<Maybe<Tag>>>;
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
  arn: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
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
  tags?: Maybe<Array<Maybe<Tag>>>;
  launchConfiguration?: Maybe<AwsLaunchConfiguration>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
};

export type AwsBilling = {
  id: Scalars['String'];
  totalCostMonthToDate?: Maybe<Scalars['String']>;
  totalCostLast30Days?: Maybe<Scalars['String']>;
  monthToDate?: Maybe<Array<Maybe<AwsServiceBillingData>>>;
  last30Days?: Maybe<Array<Maybe<AwsServiceBillingData>>>;
};

export type AwsBucketPolicy = {
  id: Scalars['String'];
  policy?: Maybe<Scalars['String']>;
};

export type AwsCloudfront = {
  id: Scalars['String'];
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
  customErrorResponse?: Maybe<Array<Maybe<AwsCloudfrontCustomErrorResponse>>>;
  defaultCacheBehavior?: Maybe<AwsCloudfrontCacheBehavior>;
  orderedCacheBehavior?: Maybe<Array<Maybe<AwsCloudfrontCacheBehavior>>>;
  viewerCertificate?: Maybe<AwsCloudfrontViewerCertificate>;
  origin?: Maybe<Array<Maybe<AwsCloudfrontOriginData>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
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
  customHeader?: Maybe<Array<Maybe<AwsCloudfrontOriginCustomHeader>>>;
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

export type AwsCloudwatch = {
  id: Scalars['String'];
  arn: Scalars['String'];
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
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type AwsCloudwatchDimensions = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type AwsCognitoIdentityPool = {
  id: Scalars['String'];
  identityPoolName?: Maybe<Scalars['String']>;
  allowUnauthenticatedIdentities?: Maybe<Scalars['String']>;
  allowClassicFlow?: Maybe<Scalars['String']>;
  supportedLoginProviders?: Maybe<Array<Maybe<AwsSupportedLoginProvider>>>;
  developerProviderName?: Maybe<Scalars['String']>;
  openIdConnectProviderARNs?: Maybe<Array<Maybe<Scalars['String']>>>;
  cognitoIdentityProviders?: Maybe<Array<Maybe<AwsCognitoIdentityProviders>>>;
  samlProviderARNs?: Maybe<Array<Maybe<Scalars['String']>>>;
  region?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type AwsCognitoIdentityProviders = {
  providerName?: Maybe<Scalars['String']>;
  clientId?: Maybe<Scalars['String']>;
  serverSideTokenCheck?: Maybe<Scalars['String']>;
};

export type AwsCognitoUserPool = {
  id: Scalars['String'];
  arn: Scalars['String'];
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
  accountRecoverySetting?: Maybe<Array<Maybe<AwsAccountRecoverySetting>>>;
  region: Scalars['String'];
  tags?: Maybe<Array<Maybe<Tag>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
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

export type AwsEbs = {
  id: Scalars['String'];
  arn: Scalars['String'];
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
  tags?: Maybe<Array<Maybe<Tag>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
};

export type AwsEbsAttachment = {
  id: Scalars['String'];
  attachmentInformation?: Maybe<Scalars['String']>;
  attachedTime?: Maybe<Scalars['String']>;
  deleteOnTermination?: Maybe<Scalars['Boolean']>;
};

export type AwsEc2 = {
  id: Scalars['String'];
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
  dailyCost?: Maybe<Scalars['String']>;
  primaryNetworkInterface?: Maybe<Scalars['String']>;
  metadataOptions?: Maybe<AwsEc2MetadataOptions>;
  metadatasecurityGroupIdsOptions?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  ephemeralBlockDevice?: Maybe<Array<Maybe<AwsEc2Blockdevice>>>;
  associatePublicIpAddress?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  ebs?: Maybe<Array<Maybe<AwsEbs>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
  networkInterfaces?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
};

export type AwsEc2Blockdevice = {
  deviceName: Scalars['String'];
  ebs?: Maybe<BlockDeviceEbs>;
};

export type AwsEc2MetadataOptions = {
  state: Scalars['String'];
  httpTokens: Scalars['String'];
  httpPutResponseHopLimit?: Maybe<Scalars['Int']>;
  httpEndpoint: Scalars['String'];
};

export type AwsEip = {
  id: Scalars['String'];
  arn: Scalars['String'];
  tags?: Maybe<Array<Maybe<Tag>>>;
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

export type AwsElb = {
  id: Scalars['String'];
  arn: Scalars['String'];
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
  tags?: Maybe<Array<Maybe<Tag>>>;
  cloudfrontDistribution?: Maybe<Array<Maybe<AwsCloudfront>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  route53Record?: Maybe<Array<Maybe<AwsRoute53Record>>>;
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

export type AwsEnabledMetrics = {
  metric: Scalars['String'];
  granularity?: Maybe<Scalars['String']>;
};

export type AwsIgw = {
  arn: Scalars['String'];
  id: Scalars['String'];
  owner?: Maybe<Scalars['String']>;
  attachments?: Maybe<Array<Maybe<AwsIgwAttachment>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsIgwAttachment = {
  state?: Maybe<Scalars['String']>;
  vpcId: Scalars['String'];
};

export type AwsKinesisFirehose = {
  id: Scalars['String'];
  arn: Scalars['String'];
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
  region?: Maybe<Scalars['String']>;
  kinesisStream?: Maybe<Array<Maybe<AwsKinesisStream>>>;
  s3?: Maybe<Array<Maybe<AwsS3>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
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
  arn: Scalars['String'];
  streamName: Scalars['String'];
  streamStatus: Scalars['String'];
  shards: Array<Maybe<AwsShards>>;
  retentionPeriodHours: Scalars['Int'];
  enhancedMonitoring: Array<AwsShardLevelMetrics>;
  encryptionType?: Maybe<Scalars['String']>;
  keyId?: Maybe<Scalars['String']>;
  region: Scalars['String'];
  kinesisFirehose?: Maybe<Array<Maybe<AwsKinesisFirehose>>>;
};

export type AwsKms = {
  arn: Scalars['String'];
  id: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  enableKeyRotation?: Maybe<Scalars['String']>;
  usage?: Maybe<Scalars['String']>;
  policy?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['String']>;
  keyState?: Maybe<Scalars['String']>;
  customerMasterKeySpec?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  creationDate?: Maybe<Scalars['String']>;
  keyManager?: Maybe<Scalars['String']>;
  origin?: Maybe<Scalars['String']>;
  deletionDate?: Maybe<Scalars['String']>;
  validTo?: Maybe<Scalars['String']>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
};

export type AwsLambaEnvironmentVariable = {
  id?: Maybe<Scalars['ID']>;
  key: Scalars['String'];
  value?: Maybe<Scalars['String']>;
};

export type AwsLambda = {
  id: Scalars['String'];
  arn: Scalars['String'];
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
  environmentVariables?: Maybe<Array<Maybe<AwsLambaEnvironmentVariable>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  kms?: Maybe<Array<Maybe<AwsKms>>>;
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  cognitoUserPool?: Maybe<Array<Maybe<AwsCognitoUserPool>>>;
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
  virtualName?: Maybe<Scalars['String']>;
  deviceName?: Maybe<Scalars['String']>;
  noDevice?: Maybe<Scalars['String']>;
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
  arn: Scalars['String'];
  state?: Maybe<Scalars['String']>;
  createTime?: Maybe<Scalars['String']>;
  dailyCost?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsNetworkInterface = {
  id: Scalars['String'];
  arn: Scalars['String'];
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
  tags?: Maybe<Array<Maybe<Tag>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  natGateway?: Maybe<Array<Maybe<AwsNatGateway>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
};

export type AwsNetworkInterfaceAttachment = {
  id?: Maybe<Scalars['ID']>;
  attachmentId?: Maybe<Scalars['String']>;
  deleteOnTermination?: Maybe<Scalars['Boolean']>;
  status?: Maybe<Scalars['String']>;
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
  arn: Scalars['String'];
  zoneId?: Maybe<Scalars['String']>;
  alias?: Maybe<AwsRoute53Alias>;
  type?: Maybe<Scalars['String']>;
  ttl?: Maybe<Scalars['Int']>;
  records?: Maybe<Array<Maybe<Scalars['String']>>>;
  route53HostedZone?: Maybe<Array<Maybe<AwsRoute53HostedZone>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
};

export type AwsRouteTable = {
  id: Scalars['String'];
  arn: Scalars['String'];
  vpcId?: Maybe<Scalars['String']>;
  routes?: Maybe<Array<Maybe<AwsRoute>>>;
  mainRouteTable?: Maybe<Scalars['Boolean']>;
  explicitlyAssociatedWithSubnets?: Maybe<Scalars['Int']>;
  subnetAssociations?: Maybe<Array<Maybe<Scalars['String']>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
};

export type AwsS3 = {
  id: Scalars['String'];
  arn: Scalars['String'];
  access?: Maybe<Scalars['String']>;
  bucketOwnerName?: Maybe<Scalars['String']>;
  region?: Maybe<Scalars['String']>;
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
  tags?: Maybe<Array<Maybe<Tag>>>;
  cloudfrontDistribution?: Maybe<Array<Maybe<AwsCloudfront>>>;
};

export type AwsSecurityGroup = {
  id: Scalars['String'];
  arn: Scalars['String'];
  name: Scalars['String'];
  vpcId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  owner?: Maybe<Scalars['String']>;
  default?: Maybe<Scalars['Boolean']>;
  inboundRules?: Maybe<Array<Maybe<AwsSgInboundRule>>>;
  outboundRules?: Maybe<Array<Maybe<AwsSgOutboundRule>>>;
  inboundRuleCount?: Maybe<Scalars['Int']>;
  outboundRuleCount?: Maybe<Scalars['Int']>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
  asg?: Maybe<Array<Maybe<AwsAsg>>>;
};

export type AwsServiceBillingData = {
  name: Scalars['String'];
  cost?: Maybe<Scalars['String']>;
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

export type AwsSqs = {
  id: Scalars['String'];
  arn: Scalars['String'];
  queueUrl: Scalars['String'];
  queueType: Scalars['String'];
  approximateNumberOfMessages?: Maybe<Scalars['Int']>;
  approximateNumberOfMessagesNotVisible?: Maybe<Scalars['Int']>;
  approximateNumberOfMessagesDelayed?: Maybe<Scalars['Int']>;
  visibilityTimeout?: Maybe<Scalars['String']>;
  maximumMessageSize?: Maybe<Scalars['Int']>;
  messageRetentionPeriod?: Maybe<Scalars['String']>;
  delaySeconds?: Maybe<Scalars['String']>;
  policy?: Maybe<Scalars['String']>;
  receiveMessageWaitTimeSeconds?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type AwsSubnet = {
  id: Scalars['String'];
  arn: Scalars['String'];
  autoAssignPublicIpv4Address?: Maybe<Scalars['String']>;
  autoAssignPublicIpv6Address?: Maybe<Scalars['String']>;
  availabilityZone?: Maybe<Scalars['String']>;
  availableIpV4Addresses?: Maybe<Scalars['Int']>;
  defaultForAz?: Maybe<Scalars['Boolean']>;
  ipV4Cidr?: Maybe<Scalars['String']>;
  ipV6Cidr?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type AwsSupportedLoginProvider = {
  identityProvider?: Maybe<Scalars['String']>;
  identityProviderId?: Maybe<Scalars['String']>;
};

export type AwsSuspendedProcess = {
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
};

export type AwsVpc = {
  arn: Scalars['String'];
  defaultVpc?: Maybe<Scalars['Boolean']>;
  dhcpOptionsSet?: Maybe<Scalars['String']>;
  enableDnsHostnames?: Maybe<Scalars['Boolean']>;
  enableDnsSupport?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  instanceTenancy?: Maybe<Scalars['String']>;
  ipV4Cidr?: Maybe<Scalars['String']>;
  ipV6Cidr?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  eip?: Maybe<Array<Maybe<AwsEip>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  igw?: Maybe<Array<Maybe<AwsIgw>>>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  natGateway?: Maybe<Array<Maybe<AwsNatGateway>>>;
  networkInterface?: Maybe<Array<Maybe<AwsNetworkInterface>>>;
  route53HostedZone?: Maybe<Array<Maybe<AwsRoute53HostedZone>>>;
  routeTable?: Maybe<Array<Maybe<AwsRouteTable>>>;
};

export type BlockDeviceEbs = {
  attachTime: Scalars['String'];
  deleteOnTermination: Scalars['Boolean'];
  status: Scalars['String'];
  volumeId: Scalars['String'];
};
