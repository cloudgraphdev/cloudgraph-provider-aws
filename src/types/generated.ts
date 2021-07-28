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

export type Aws_Alb = {
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
  ec2Instance?: Maybe<Array<Maybe<Aws_Ec2>>>;
  vpc?: Maybe<Array<Maybe<Aws_Vpc>>>;
  listeners?: Maybe<Array<Maybe<Aws_Alb_Listener>>>;
};

export type Aws_Alb_Listener = {
  settings?: Maybe<Aws_Alb_Listener_Settings>;
};

export type Aws_Cloudwatch = {
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
  dimensions?: Maybe<Array<Maybe<Aws_Cloudwatch_Dimensions>>>;
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type Aws_Cloudwatch_Dimensions = {
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type BlockDevice = {
  deviceName: Scalars['String'];
  ebs?: Maybe<Ebs>;
};

export type Aws_Alb_Listener_Rule = {
  type?: Maybe<Scalars['String']>;
  order?: Maybe<Scalars['String']>;
  targetGroupArn?: Maybe<Scalars['String']>;
};

export type Aws_Alb_Listener_Settings = {
  arn: Scalars['String'];
  sslPolicy?: Maybe<Scalars['String']>;
  protocol?: Maybe<Scalars['String']>;
  rules?: Maybe<Array<Maybe<Aws_Alb_Listener_Rule>>>;
};

export type Aws_Ec2 = {
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
  metadataOptions?: Maybe<Aws_Ec2_Metadata_Options>;
  metadatasecurityGroupIdsOptions?: Maybe<Array<Maybe<Scalars['String']>>>;
  securityGroupIds?: Maybe<Array<Maybe<Scalars['String']>>>;
  ephemeralBlockDevice?: Maybe<Array<Maybe<Aws_Ec2_Blockdevice>>>;
  associatePublicIpAddress?: Maybe<Scalars['String']>;
  alb?: Maybe<Array<Maybe<Aws_Alb>>>;
};

export type Aws_Ec2_Blockdevice = {
  deviceName: Scalars['String'];
  ebs?: Maybe<Ebs>;
};

export type Aws_Ec2_Metadata = {
  cuid?: Maybe<Scalars['String']>;
};

export type Aws_Ec2_Metadata_Options = {
  state: Scalars['String'];
  httpTokens: Scalars['String'];
  httpPutResponseHopLimit?: Maybe<Scalars['Int']>;
  httpEndpoint: Scalars['String'];
};

export type Aws_Ec2_Securitygroup = {
  groupName: Scalars['String'];
  groupId: Scalars['String'];
};

export type Aws_Vpc = {
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
  alb?: Maybe<Array<Maybe<Aws_Alb>>>;
};

export type Ebs = {
  attachTime: Scalars['String'];
  deleteOnTermination: Scalars['Boolean'];
  status: Scalars['String'];
  volumeId: Scalars['String'];
};
