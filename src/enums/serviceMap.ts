import Account from '../services/account'
import ACM from '../services/acm'
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
import AthenaDataCatalog from '../services/athenaDataCatalog'
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
import EBSSnapshot from '../services/ebsSnapshot'
import EC2 from '../services/ec2'
import EcsCluster from '../services/ecsCluster'
import EcsContainer from '../services/ecsContainer'
import EcsService from '../services/ecsService'
import EcsTask from '../services/ecsTask'
import EcsTaskDefinition from '../services/ecsTaskDefinition'
import EcsTaskSet from '../services/ecsTaskSet'
import EFS from '../services/efs'
import EfsMountTarget from '../services/efsMountTarget'
import EIP from '../services/eip'
import ElasticBeanstalkApp from '../services/elasticBeanstalkApplication'
import ElasticBeanstalkEnv from '../services/elasticBeanstalkEnvironment'
import ElastiCacheCluster from '../services/elastiCacheCluster'
import ElastiCacheReplicationGroup from '../services/elastiCacheReplicationGroup'
import ELB from '../services/elb'
import FlowLog from '../services/flowLogs'
import EmrCluster from '../services/emrCluster'
import EmrInstance from '../services/emrInstance'
import EmrStep from '../services/emrStep'
import Lambda from '../services/lambda'
import NATGateway from '../services/natGateway'
import NetworkAcl from '../services/nacl'
import NetworkInterface from '../services/networkInterface'
import RDSCluster from '../services/rdsCluster'
import RDSDbInstance from '../services/rdsDbInstance'
import RedshiftCluster from '../services/redshift'
import Route53HostedZone from '../services/route53HostedZone'
import Route53Record from '../services/route53Record'
import RouteTable from '../services/routeTable'
import SecretsManager from '../services/secretsManager'
import SecurityHub from '../services/securityHub'
import S3 from '../services/s3'
import SES from '../services/ses'
import SQS from '../services/sqs'
import VPC from '../services/vpc'
import ECR from '../services/ecr'
import IamAccessAnalyzer from '../services/iamAccessAnalyzer'
import IamGroup from '../services/iamGroup'
import IamUser from '../services/iamUser'
import IamRole from '../services/iamRole'
import IamPolicy from '../services/iamPolicy'
import IamPasswordPolicy from '../services/iamPasswordPolicy'
import IamSamlProvider from '../services/iamSamlProvider'
import IamOpenIdConnectProvider from '../services/iamOpenIdConnectProvider'
import IamServerCertificate from '../services/iamServerCertificate'
import IamInstanceProfile from '../services/iamInstanceProfile'
import SNS from '../services/sns'
import EKSCluster from '../services/eksCluster'
import Cloud9Environment from '../services/cloud9'
import IotThingAttribute from '../services/iot'
import services from './services'
import TransitGateway from '../services/transitGateway'
import TransitGatewayAttachment from '../services/transitGatewayAttachment'
import CustomerGateway from '../services/customerGateway'
import VpnGateway from '../services/vpnGateway'
import ClientVpnEndpoint from '../services/clientVpnEndpoint'
import VpnConnection from '../services/vpnConnection'
import Organization from '../services/organization'
import CloudWatchLog from '../services/cloudwatchLogs'
import ConfigurationRecorder from '../services/configurationRecorder'
import CodeBuild from '../services/codeBuild'
import GlueJob from '../services/glueJob'
import GlueRegistry from '../services/glueRegistry'
import SageMakerProject from '../services/sageMakerProject'
import SageMakerExperiment from '../services/sageMakerExperiment'
import ManagedAirflow from '../services/managedAirflow'
import WafV2WebAcl from '../services/wafV2WebAcl'
import GuardDutyDetector from '../services/guardDutyDetector'
import ElasticSearchDomain from '../services/elasticSearchDomain'
import DmsReplicationInstance from '../services/dmsReplicationInstance'
import SageMakerNotebookInstance from '../services/sageMakerNotebookInstance'
import SystemsManagerInstance from '../services/systemsManagerInstance'
import SystemsManagerDocument from '../services/systemsManagerDocument'
import RdsClusterSnapshot from '../services/rdsClusterSnapshot'
import VpcEndpoint from '../services/vpcEndpoint'
import APIGatewayDomainName from '../services/apiGatewayDomainName'
import APIGatewayHttpApi from '../services/apiGatewayHttpApi'
import ManagedPrefixList from '../services/managedPrefixList'
import MskCluster from '../services/msk'
import TransitGatewayRouteTable from '../services/transitGatewayRouteTable'
import VpcPeeringConnection from '../services/vpcPeeringConnection'

/**
 * serviceMap is an object that contains all currently supported services for AWS
 * serviceMap is used by the serviceFactory to produce instances of service classes
 */
export default {
  account: Account,
  [services.appSync]: AppSync,
  [services.acm]: ACM,
  [services.alb]: ALB,
  [services.apiGatewayDomainName]: APIGatewayDomainName,
  [services.apiGatewayHttpApi]: APIGatewayHttpApi,
  [services.apiGatewayResource]: APIGatewayResource,
  [services.apiGatewayRestApi]: APIGatewayRestApi,
  [services.apiGatewayStage]: APIGatewayStage,
  [services.athenaDataCatalog]: AthenaDataCatalog,
  [services.asg]: ASG,
  [services.billing]: Billing,
  [services.clientVpnEndpoint]: ClientVpnEndpoint,
  [services.cloud9]: Cloud9Environment,
  [services.cloudfront]: CloudFront,
  [services.cloudtrail]: CloudTrail,
  [services.cloudFormationStack]: CloudFormationStack,
  [services.cloudFormationStackSet]: CloudFormationStackSet,
  [services.cloudwatch]: CloudWatch,
  [services.cloudwatchLog]: CloudWatchLog,
  [services.codebuild]: CodeBuild,
  [services.cognitoIdentityPool]: CognitoIdentityPool,
  [services.cognitoUserPool]: CognitoUserPool,
  [services.configurationRecorder]: ConfigurationRecorder,
  [services.ebs]: EBS,
  [services.ebsSnapshot]: EBSSnapshot,
  [services.ec2Instance]: EC2,
  [services.ecr]: ECR,
  [services.efs]: EFS,
  [services.efsMountTarget]: EfsMountTarget,
  [services.eip]: EIP,
  [services.eksCluster]: EKSCluster,
  [services.elasticBeanstalkApp]: ElasticBeanstalkApp,
  [services.elasticBeanstalkEnv]: ElasticBeanstalkEnv,
  [services.elastiCacheCluster]: ElastiCacheCluster,
  [services.elastiCacheReplicationGroup]: ElastiCacheReplicationGroup,
  [services.elasticSearchDomain]: ElasticSearchDomain,
  [services.elb]: ELB,
  [services.flowLog]: FlowLog,
  [services.glueJob]: GlueJob,
  [services.guardDutyDetector]: GuardDutyDetector,
  [services.glueRegistry]: GlueRegistry,
  [services.emrCluster]: EmrCluster,
  [services.emrInstance]: EmrInstance,
  [services.emrStep]: EmrStep,
  [services.dmsReplicationInstance]: DmsReplicationInstance,
  [services.dynamodb]: DynamoDB,
  [services.igw]: AwsInternetGateway,
  [services.iot]: IotThingAttribute,
  [services.kinesisFirehose]: AwsKinesisFirehose,
  [services.kinesisStream]: AwsKinesisStream,
  [services.kms]: AwsKms,
  [services.lambda]: Lambda,
  [services.managedAirflow]: ManagedAirflow,
  [services.managedPrefixList]: ManagedPrefixList,
  [services.mskCluster]: MskCluster,
  [services.nacl]: NetworkAcl,
  [services.nat]: NATGateway,
  [services.networkInterface]: NetworkInterface,
  [services.sg]: AwsSecurityGroup,
  [services.subnet]: AwsSubnet,
  [services.vpc]: VPC,
  [services.vpcEndpoint]: VpcEndpoint,
  [services.vpcPeeringConnection]: VpcPeeringConnection,
  [services.sqs]: SQS,
  [services.rdsCluster]: RDSCluster,
  [services.rdsClusterSnapshot]: RdsClusterSnapshot,
  [services.rdsDbInstance]: RDSDbInstance,
  [services.redshiftCluster]: RedshiftCluster,
  [services.route53HostedZone]: Route53HostedZone,
  [services.route53Record]: Route53Record,
  [services.routeTable]: RouteTable,
  [services.sageMakerExperiment]: SageMakerExperiment,
  [services.sageMakerNotebookInstance]: SageMakerNotebookInstance,
  [services.sageMakerProject]: SageMakerProject,
  [services.s3]: S3,
  [services.secretsManager]: SecretsManager,
  [services.securityHub]: SecurityHub,
  [services.ses]: SES,
  [services.iamAccessAnalyzer]: IamAccessAnalyzer,
  [services.iamUser]: IamUser,
  [services.iamGroup]: IamGroup,
  [services.iamRole]: IamRole,
  [services.iamPolicy]: IamPolicy,
  [services.iamPasswordPolicy]: IamPasswordPolicy,
  [services.iamSamlProvider]: IamSamlProvider,
  [services.iamOpenIdConnectProvider]: IamOpenIdConnectProvider,
  [services.iamServerCertificate]: IamServerCertificate,
  [services.iamInstanceProfile]: IamInstanceProfile,
  [services.sns]: SNS,
  [services.ecsCluster]: EcsCluster,
  [services.ecsContainer]: EcsContainer,
  [services.ecsService]: EcsService,
  [services.ecsTask]: EcsTask,
  [services.ecsTaskDefinition]: EcsTaskDefinition,
  [services.ecsTaskSet]: EcsTaskSet,
  [services.transitGateway]: TransitGateway,
  [services.transitGatewayAttachment]: TransitGatewayAttachment,
  [services.transitGatewayRouteTable]: TransitGatewayRouteTable,
  [services.customerGateway]: CustomerGateway,
  [services.vpnGateway]: VpnGateway,
  [services.vpnConnection]: VpnConnection,
  [services.organization]: Organization,
  [services.wafV2WebAcl]: WafV2WebAcl,
  [services.systemsManagerInstance]: SystemsManagerInstance,
  [services.systemsManagerDocument]: SystemsManagerDocument,
  tag: AwsTag,
}
