import Account from '../services/account'
import ACM from '../services/acm'
import ALB from '../services/alb'
import APIGatewayApiKey from '../services/apiGatewayApiKey'
import APIGatewayDomainName from '../services/apiGatewayDomainName'
import APIGatewayHttpApi from '../services/apiGatewayHttpApi'
import APIGatewayResource from '../services/apiGatewayResource'
import APIGatewayRestApi from '../services/apiGatewayRestApi'
import APIGatewayStage from '../services/apiGatewayStage'
import APIGatewayUsagePlan from '../services/apiGatewayUsagePlan'
import APIGatewayVpcLink from '../services/apiGatewayVpcLink'
import AppSync from '../services/appSync'
import ASG from '../services/asg'
import AthenaDataCatalog from '../services/athenaDataCatalog'
import Billing from '../services/billing'
import ClientVpnEndpoint from '../services/clientVpnEndpoint'
import Cloud9Environment from '../services/cloud9'
import CloudFormationStack from '../services/cloudFormationStack'
import CloudFormationStackSet from '../services/cloudFormationStackSet'
import CloudFront from '../services/cloudfront'
import CloudTrail from '../services/cloudtrail'
import CloudWatch from '../services/cloudwatch'
import CloudWatchDashboard from '../services/cloudwatchDashboards'
import CloudWatchEventRule from '../services/cloudwatchEventRules'
import CloudWatchLog from '../services/cloudwatchLogs'
import CodeBuild from '../services/codeBuild'
import CognitoIdentityPool from '../services/cognitoIdentityPool'
import CognitoUserPool from '../services/cognitoUserPool'
import ConfigurationDeliveryChannel from '../services/configurationDeliveryChannel'
import ConfigurationRecorder from '../services/configurationRecorder'
import ConfigurationRule from '../services/configurationRule'
import CustomerGateway from '../services/customerGateway'
import DmsReplicationInstance from '../services/dmsReplicationInstance'
import DynamoDB from '../services/dynamodb'
import DocDBCluster from '../services/docdbCluster'
import EBS from '../services/ebs'
import EBSSnapshot from '../services/ebsSnapshot'
import EC2 from '../services/ec2'
import ECR from '../services/ecr'
import EcsCluster from '../services/ecsCluster'
import EcsContainer from '../services/ecsContainer'
import EcsService from '../services/ecsService'
import EcsTask from '../services/ecsTask'
import EcsTaskDefinition from '../services/ecsTaskDefinition'
import EcsTaskSet from '../services/ecsTaskSet'
import EFS from '../services/efs'
import EfsAccessPoint from '../services/efsAccessPoint'
import EfsMountTarget from '../services/efsMountTarget'
import EIP from '../services/eip'
import EKSCluster from '../services/eksCluster'
import ElastiCacheCluster from '../services/elastiCacheCluster'
import ElastiCacheReplicationGroup from '../services/elastiCacheReplicationGroup'
import ElasticBeanstalkApp from '../services/elasticBeanstalkApplication'
import ElasticBeanstalkEnv from '../services/elasticBeanstalkEnvironment'
import ElasticSearchDomain from '../services/elasticSearchDomain'
import ELB from '../services/elb'
import EmrCluster from '../services/emrCluster'
import EmrInstance from '../services/emrInstance'
import EmrStep from '../services/emrStep'
import FlowLog from '../services/flowLogs'
import GlueCrawler from '../services/glueCrawler'
import GlueDatabase from '../services/glueDatabase'
import GlueJob from '../services/glueJob'
import GlueRegistry from '../services/glueRegistry'
import GlueTrigger from '../services/glueTrigger'
import GuardDutyDetector from '../services/guardDutyDetector'
import IamAccessAnalyzer from '../services/iamAccessAnalyzer'
import IamGroup from '../services/iamGroup'
import IamInstanceProfile from '../services/iamInstanceProfile'
import IamOpenIdConnectProvider from '../services/iamOpenIdConnectProvider'
import IamPasswordPolicy from '../services/iamPasswordPolicy'
import IamPolicy from '../services/iamPolicy'
import IamRole from '../services/iamRole'
import IamSamlProvider from '../services/iamSamlProvider'
import IamServerCertificate from '../services/iamServerCertificate'
import IamUser from '../services/iamUser'
import AwsInternetGateway from '../services/igw'
import IotThingAttribute from '../services/iot'
import AwsKinesisFirehose from '../services/kinesisFirehose'
import AwsKinesisStream from '../services/kinesisStream'
import AwsKms from '../services/kms'
import Lambda from '../services/lambda'
import ManagedAirflow from '../services/managedAirflow'
import ManagedPrefixList from '../services/managedPrefixList'
import MskCluster from '../services/msk'
import NetworkAcl from '../services/nacl'
import NATGateway from '../services/natGateway'
import NetworkInterface from '../services/networkInterface'
import Organization from '../services/organization'
import RDSCluster from '../services/rdsCluster'
import RdsClusterSnapshot from '../services/rdsClusterSnapshot'
import RDSDbInstance from '../services/rdsDbInstance'
import RdsDbProxies from '../services/rdsDbProxies'
import RDSEventSubscription from '../services/rdsEventSubscription'
import RDSGlobalCluster from '../services/rdsGlobalCluster '
import RedshiftCluster from '../services/redshift'
import Route53HostedZone from '../services/route53HostedZone'
import Route53Record from '../services/route53Record'
import RouteTable from '../services/routeTable'
import S3 from '../services/s3'
import SageMakerExperiment from '../services/sageMakerExperiment'
import SageMakerNotebookInstance from '../services/sageMakerNotebookInstance'
import SageMakerProject from '../services/sageMakerProject'
import SecretsManager from '../services/secretsManager'
import AwsSecurityGroup from '../services/securityGroup'
import SecurityHub from '../services/securityHub'
import SecurityHubMember from '../services/securityHubMember'
import SecurityHubStandardSubscription from '../services/securityHubStandardSubscription'
import SES from '../services/ses'
import SESReceiptRuleSet from '../services/sesReceiptRuleSet'
import SESEmail from '../services/sesEmail'
import SESDomain from '../services/sesDomain'
import SNS from '../services/sns'
import SQS from '../services/sqs'
import AwsSubnet from '../services/subnet'
import SystemsManagerDocument from '../services/systemsManagerDocument'
import SystemsManagerInstance from '../services/systemsManagerInstance'
import SystemsManagerParameter from '../services/systemsManagerParameter'
import AwsTag from '../services/tag'
import TransitGateway from '../services/transitGateway'
import TransitGatewayAttachment from '../services/transitGatewayAttachment'
import TransitGatewayRouteTable from '../services/transitGatewayRouteTable'
import VPC from '../services/vpc'
import VpcEndpoint from '../services/vpcEndpoint'
import VpcPeeringConnection from '../services/vpcPeeringConnection'
import CodeCommitRepository from '../services/codeCommitRepository'
import VpnConnection from '../services/vpnConnection'
import VpnGateway from '../services/vpnGateway'
import WafV2WebAcl from '../services/wafV2WebAcl'
import services from './services'
import CodePipeline from '../services/codePipeline'
import CodePipelineWebhook from '../services/codePipelineWebhook'

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
  [services.apiGatewayApiKey]: APIGatewayApiKey,
  [services.apiGatewayVpcLink]: APIGatewayVpcLink,
  [services.apiGatewayUsagePlan]: APIGatewayUsagePlan,
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
  [services.cloudwatchDashboard]: CloudWatchDashboard,
  [services.cloudwatchEventRule]: CloudWatchEventRule,
  [services.cloudwatchLog]: CloudWatchLog,
  [services.codebuild]: CodeBuild,
  [services.codePipeline]: CodePipeline,
  [services.codePipelineWebhook]: CodePipelineWebhook,
  [services.codeCommitRepository]: CodeCommitRepository,
  [services.cognitoIdentityPool]: CognitoIdentityPool,
  [services.cognitoUserPool]: CognitoUserPool,
  [services.configurationDeliveryChannel]: ConfigurationDeliveryChannel,
  [services.configurationRecorder]: ConfigurationRecorder,
  [services.configurationRule]: ConfigurationRule,
  [services.ebs]: EBS,
  [services.ebsSnapshot]: EBSSnapshot,
  [services.ec2Instance]: EC2,
  [services.ecr]: ECR,
  [services.efs]: EFS,
  [services.efsAccessPoint]: EfsAccessPoint,
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
  [services.glueCrawler]: GlueCrawler,
  [services.glueDatabase]: GlueDatabase,
  [services.glueJob]: GlueJob,
  [services.glueRegistry]: GlueRegistry,
  [services.glueTrigger]: GlueTrigger,
  [services.guardDutyDetector]: GuardDutyDetector,
  [services.emrCluster]: EmrCluster,
  [services.emrInstance]: EmrInstance,
  [services.emrStep]: EmrStep,
  [services.dmsReplicationInstance]: DmsReplicationInstance,
  [services.dynamodb]: DynamoDB,
  [services.docdbCluster]: DocDBCluster,
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
  [services.rdsGlobalCluster]: RDSGlobalCluster,
  [services.rdsClusterSnapshot]: RdsClusterSnapshot,
  [services.rdsDbInstance]: RDSDbInstance,
  [services.rdsEventSubscription]: RDSEventSubscription,
  [services.rdsDbProxies]: RdsDbProxies,
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
  [services.securityHubMember]: SecurityHubMember,
  [services.securityHubStandardSubscription]: SecurityHubStandardSubscription,
  [services.ses]: SES,
  [services.sesReceiptRuleSet]: SESReceiptRuleSet,
  [services.sesEmail]: SESEmail,
  [services.sesDomain]: SESDomain,
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
  [services.systemsManagerParameter]: SystemsManagerParameter,
  tag: AwsTag,
}
