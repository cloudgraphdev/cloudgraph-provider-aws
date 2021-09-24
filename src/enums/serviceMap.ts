// import AwsSubnet from '../services/subnet'
import ALB from '../services/alb'
import AwsInternetGateway from '../services/igw'
import AwsKinesisFirehose from '../services/kinesisFirehose'
import AwsKinesisStream from '../services/kinesisStream'
import AwsKms from '../services/kms'
import AwsSecurityGroup from '../services/securityGroup'
import AwsTag from '../services/tag'
import AppSync from '../services/appSync'
import ASG from '../services/asg'
import Billing from '../services/billing'
import CognitoIdentityPool from '../services/cognitoIdentityPool'
import CognitoUserPool from '../services/cognitoUserPool'
import CloudFront from '../services/cloudfront'
import CloudWatch from '../services/cloudwatch'
import EBS from '../services/ebs'
import EC2 from '../services/ec2'
import EIP from '../services/eip'
import ELB from '../services/elb'
import Lambda from '../services/lambda'
import NATGateway from '../services/natGateway'
import NetworkInterface from '../services/networkInterface'
import VPC from '../services/vpc'
import SQS from '../services/sqs'
import APIGatewayRestApi from '../services/apiGatewayRestApi'
import APIGatewayResource from '../services/apiGatewayResource'
import APIGatewayStage from '../services/apiGatewayStage'
import Route53HostedZone from '../services/route53HostedZone'
import Route53Record from '../services/route53Record'
import RouteTable from '../services/routeTable'
import S3 from '../services/s3'
import services from './services'

/**
 * serviceMap is an object that contains all currently supported services for AWS
 * serviceMap is used by the serviceFactory to produce instances of service classes
 */
export default {
  [services.appSync]: AppSync,
  [services.alb]: ALB,
  [services.apiGatewayResource]: APIGatewayResource,
  [services.apiGatewayRestApi]: APIGatewayRestApi,
  [services.apiGatewayStage]: APIGatewayStage,
  [services.asg]: ASG,
  [services.billing]: Billing,
  [services.cognitoIdentityPool]: CognitoIdentityPool,
  [services.cognitoUserPool]: CognitoUserPool,
  [services.cloudfront]: CloudFront,
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
