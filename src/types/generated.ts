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
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
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
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
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
  securityGroups?: Maybe<Array<Maybe<AwsSecurityGroup>>>;
  vpc?: Maybe<Array<Maybe<AwsVpc>>>;
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
  metric?: Maybe<Scalars['String']>;
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
};

export type AwsLaunchTemplateOverrides = {
  instanceType?: Maybe<Scalars['String']>;
  weightedCapacity?: Maybe<Scalars['String']>;
  launchTemplateId?: Maybe<Scalars['String']>;
  launchTemplateName?: Maybe<Scalars['String']>;
  launchTemplateVersion?: Maybe<Scalars['String']>;
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

export type AwsSecurityGroup = {
  id: Scalars['String'];
  arn: Scalars['String'];
  name: Scalars['String'];
  vpcId?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  tags?: Maybe<Array<Maybe<Tag>>>;
  owner?: Maybe<Scalars['String']>;
  default?: Maybe<Scalars['Boolean']>;
  inboundRules?: Maybe<Array<Maybe<AwsSgRule>>>;
  outboundRules?: Maybe<Array<Maybe<AwsSgRule>>>;
  inboundRuleCount?: Maybe<Scalars['Int']>;
  outboundRuleCount?: Maybe<Scalars['Int']>;
  lambda?: Maybe<Array<Maybe<AwsLambda>>>;
  elb?: Maybe<Array<Maybe<AwsElb>>>;
  ec2Instance?: Maybe<Array<Maybe<AwsEc2>>>;
};

export type AwsSgRule = {
  id?: Maybe<Scalars['ID']>;
  description?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  portRange?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  source?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['String']>;
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

export type AwsSuspendedProcess = {
  processName?: Maybe<Scalars['String']>;
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
};

export type BlockDeviceEbs = {
  attachTime: Scalars['String'];
  deleteOnTermination: Scalars['Boolean'];
  status: Scalars['String'];
  volumeId: Scalars['String'];
};
