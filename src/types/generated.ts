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
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
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
  arn?: Maybe<Scalars['String']>;
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
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
};

export type AwsEc2Blockdevice = {
  deviceName: Scalars['String'];
  ebs?: Maybe<BlockDeviceEbs>;
};

export type AwsEc2Metadata = {
  cuid?: Maybe<Scalars['String']>;
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
  networkInterface?: Maybe<Scalars['String']>;
  ec2InstanceAssociationId?: Maybe<Scalars['String']>;
  networkInterfaceOwnerId?: Maybe<Scalars['String']>;
  networkBorderGroup?: Maybe<Scalars['String']>;
  customerOwnedIp?: Maybe<Scalars['String']>;
  customerOwnedIpv4Pool?: Maybe<Scalars['String']>;
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
  vpcId?: Maybe<Scalars['String']>;
};

export type AwsVpc = {
  id: Scalars['String'];
  arn: Scalars['String'];
  ipV4Cidr?: Maybe<Scalars['String']>;
  ipV6Cidr?: Maybe<Scalars['String']>;
  dhcpOptionsSet?: Maybe<Scalars['String']>;
  instanceTenancy?: Maybe<Array<Maybe<Scalars['String']>>>;
  enableDnsSupport?: Maybe<Scalars['String']>;
  enableDnsHostnames?: Maybe<Scalars['String']>;
  defaultVpc?: Maybe<Scalars['Boolean']>;
  state?: Maybe<Scalars['String']>;
  alb?: Maybe<Array<Maybe<AwsAlb>>>;
  igw?: Maybe<Array<Maybe<AwsIgw>>>;
};

export type BlockDeviceEbs = {
  attachTime: Scalars['String'];
  deleteOnTermination: Scalars['Boolean'];
  status: Scalars['String'];
  volumeId: Scalars['String'];
};
