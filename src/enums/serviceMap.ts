import ALB from '../services/alb'
import APIGatewayResource from '../services/apiGatewayResource'
import APIGatewayRestApi from '../services/apiGatewayRestApi'
import APIGatewayStage from '../services/apiGatewayStage'
import ASG from '../services/asg'
import AppSync from '../services/appSync'
import AwsInternetGateway from '../services/igw'
import AwsKinesisFirehose from '../services/kinesisFirehose'
import AwsKinesisStream from '../services/kinesisStream'
import AwsKms from '../services/kms'
import AwsSecurityGroup from '../services/securityGroup'
import AwsSubnet from '../services/subnet'
import AwsTag from '../services/tag'
import Billing from '../services/billing'
import CloudFront from '../services/cloudfront'
import CloudTrail from '../services/cloudtrail'
import CloudFormationStack from '../services/cloudFormationStack'
import CloudFormationStackSet from '../services/cloudFormationStackSet'
import CloudWatch from '../services/cloudwatch'
import CognitoIdentityPool from '../services/cognitoIdentityPool'
import CognitoUserPool from '../services/cognitoUserPool'
import DynamoDB from '../services/dynamodb'
import EBS from '../services/ebs'
import EC2 from '../services/ec2'
import EIP from '../services/eip'
import ELB from '../services/elb'
import Lambda from '../services/lambda'
import NATGateway from '../services/natGateway'
import NetworkAcl from '../services/nacl'
import NetworkInterface from '../services/networkInterface'
import RDSDBCluster from '../services/rdsDBCluster'
import RDSDBInstance from '../services/rdsDBInstance'
import Route53HostedZone from '../services/route53HostedZone'
import Route53Record from '../services/route53Record'
import RouteTable from '../services/routeTable'
import SecretsManager from '../services/secretsManager'
import S3 from '../services/s3'
import SES from '../services/ses'
import SQS from '../services/sqs'
import VPC from '../services/vpc'
import ECR from '../services/ecr'
import IamGroup from '../services/iamGroup'
import IamUser from '../services/iamUser'
import IamRole from '../services/iamRole'
import IamPolicy from '../services/iamPolicy'
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
  [services.cloudfront]: CloudFront,
  [services.cloudtrail]: CloudTrail,
  [services.cloudFormationStack]: CloudFormationStack,
  [services.cloudFormationStackSet]: CloudFormationStackSet,
  [services.cloudwatch]: CloudWatch,
  [services.cognitoIdentityPool]: CognitoIdentityPool,
  [services.cognitoUserPool]: CognitoUserPool,
  [services.ebs]: EBS,
  [services.ec2Instance]: EC2,
  [services.ecr]: ECR,
  [services.eip]: EIP,
  [services.elb]: ELB,
  [services.dynamodb]: DynamoDB,
  [services.igw]: AwsInternetGateway,
  [services.kinesisFirehose]: AwsKinesisFirehose,
  [services.kinesisStream]: AwsKinesisStream,
  [services.kms]: AwsKms,
  [services.lambda]: Lambda,
  [services.nacl]: NetworkAcl,
  [services.nat]: NATGateway,
  [services.networkInterface]: NetworkInterface,
  [services.sg]: AwsSecurityGroup,
  [services.subnet]: AwsSubnet,
  [services.vpc]: VPC,
  [services.sqs]: SQS,
  [services.rdsDBCluster]: RDSDBCluster,
  [services.rdsDBInstance]: RDSDBInstance,
  [services.route53HostedZone]: Route53HostedZone,
  [services.route53Record]: Route53Record,
  [services.routeTable]: RouteTable,
  [services.s3]: S3,
  [services.secretsManager]: SecretsManager,
  [services.ses]: SES,
  [services.iamUser]: IamUser,
  [services.iamGroup]: IamGroup,
  [services.iamRole]: IamRole,
  [services.iamPolicy]: IamPolicy,
  tag: AwsTag,
}
