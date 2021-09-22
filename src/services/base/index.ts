import { Logger } from '@cloudgraph/sdk'

// import AwsSubnet from './subnet'
import ALB from '../alb'
import AwsInternetGateway from '../igw'
import AwsKinesisFirehose from '../kinesisFirehose'
import AwsKinesisStream from '../kinesisStream'
import AwsKms from '../kms'
import AwsSecurityGroup from '../securityGroup'
import AwsTag from '../tag'
import ASG from '../asg'
import Billing from '../billing'
import CognitoIdentityPool from '../cognitoIdentityPool'
import CognitoUserPool from '../cognitoUserPool'
import CloudWatch from '../cloudwatch'
import EBS from '../ebs'
import EC2 from '../ec2'
import EIP from '../eip'
import ELB from '../elb'
import Lambda from '../lambda'
import NATGateway from '../natGateway'
import NetworkInterface from '../networkInterface'
import VPC from '../vpc'
import SQS from '../sqs'
import APIGatewayRestApi from '../apiGatewayRestApi'
import APIGatewayResource from '../apiGatewayResource'
import APIGatewayStage from '../apiGatewayStage'
import Route53HostedZone from '../route53HostedZone'
import Route53Record from '../route53Record'
import RouteTable from '../routeTable'
import S3 from '../s3'
import services from '../../enums/services'

/**
 * serviceMap is an object that contains all currently supported services for AWS
 * serviceMap is used by the serviceFactory to produce instances of service classes
 */
export const serviceMap = {
  [services.alb]: ALB,
  [services.apiGatewayResource]: APIGatewayResource,
  [services.apiGatewayRestApi]: APIGatewayRestApi,
  [services.apiGatewayStage]: APIGatewayStage,
  [services.asg]: ASG,
  [services.billing]: Billing,
  [services.cognitoIdentityPool]: CognitoIdentityPool,
  [services.cognitoUserPool]: CognitoUserPool,
  [services.cloudwatch]: CloudWatch,
  [services.ebs]: EBS,
  [services.ec2Instance]: EC2,
  [services.eip]: EIP,
  [services.elb]: ELB,
  [services.igw]: AwsInternetGateway,
  [services.kinesisFirehose]: AwsKinesisFirehose,
  [services.kinesisStream]: AwsKinesisStream,
  [services.kms]: AwsKms,
  [services.lambda]: Lambda,
  [services.nat]: NATGateway,
  [services.networkInterface]: NetworkInterface,
  [services.sg]: AwsSecurityGroup,
  // [services.subnet]: AwsSubnet, // TODO: Enable when going for ENG-222
  [services.vpc]: VPC,
  [services.sqs]: SQS,
  [services.route53HostedZone]: Route53HostedZone,
  [services.route53Record]: Route53Record,
  [services.routeTable]: RouteTable,
  [services.s3]: S3,
  tag: AwsTag,
}

export default class BaseService {
  constructor(config: any) {
    this.logger = config.logger
  }

  logger: Logger
}
