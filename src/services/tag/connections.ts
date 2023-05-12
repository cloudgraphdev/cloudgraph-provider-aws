import { ServiceConnection } from '@cloudgraph/sdk'
import { MetricAlarm } from 'aws-sdk/clients/cloudwatch'
import {
  NatGateway,
  Vpc,
  CustomerGateway,
  TransitGateway,
  TransitGatewayAttachment,
  VpnGateway,
  VpnConnection,
} from 'aws-sdk/clients/ec2'
import services from '../../enums/services'
import { RawAwsAppSync } from '../appSync/data'
import { RawAwsCloudFormationStack } from '../cloudFormationStack/data'
import { RawAwsCloudFormationStackSet } from '../cloudFormationStackSet/data'
import { RawAwsCloudfront } from '../cloudfront/data'
import { RawAwsCognitoIdentityPool } from '../cognitoIdentityPool/data'
import { RawAwsCognitoUserPool } from '../cognitoUserPool/data'
import { RawAwsDynamoDbTable } from '../dynamodb/data'
import { RawAwsKinesisFirehose } from '../kinesisFirehose/data'
import { RawAwsNetworkAcl } from '../nacl/data'
import { RawAwsCloudTrail } from '../cloudtrail/data'
import { RawAwsEcr } from '../ecr/data'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsSecretsManager } from '../secretsManager/data'
import { RawAwsIamUser } from '../iamUser/data'
import { RawAwsIamRole } from '../iamRole/data'
import { RawAwsIamPolicy } from '../iamPolicy/data'
import { RawAwsRdsCluster } from '../rdsCluster/data'
import { RawAwsRdsDbInstance } from '../rdsDbInstance/data'
import { RawAwsElasticBeanstalkApp } from '../elasticBeanstalkApplication/data'
import { RawAwsElasticBeanstalkEnv } from '../elasticBeanstalkEnvironment/data'
import { RawAwsElastiCacheCluster } from '../elastiCacheCluster/data'
import { RawAwsElastiCacheReplicationGroup } from '../elastiCacheReplicationGroup/data'
import { RawFlowLog } from '../flowLogs/data'
import { RawAwsSns } from '../sns/data'
import { RawAwsRedshiftCluster } from '../redshift/data'
import { RawAwsAlb } from '../alb/data'
import { RawAwsElb } from '../elb/data'
import {
  apiGatewayArn,
  apiGatewayRestApiArn,
  apiGatewayStageArn,
  redshiftArn,
  elbArn,
  ssmDocumentArn,
  domainNameArn,
} from '../../utils/generateArns'
import { RawAwsEksCluster } from '../eksCluster/data'
import { RawAwsEcsCluster } from '../ecsCluster/data'
import { RawAwsEcsContainer } from '../ecsContainer/data'
import { RawAwsEcsService } from '../ecsService/data'
import { RawAwsEcsTask } from '../ecsTask/data'
import { RawAwsApiGatewayRestApi } from '../apiGatewayRestApi/data'
import { RawAwsApiGatewayStage } from '../apiGatewayStage/data'
import { RawAwsCloud9Environment } from '../cloud9/data'
import { RawAwsEfs } from '../efs/data'
import { RawAwsEmrCluster } from '../emrCluster/data'
import { RawAwsClientVpnEndpoint } from '../clientVpnEndpoint/data'
import { RawAwsCodeBuild } from '../codeBuild/data'
import { RawAwsGuardDutyDetector } from '../guardDutyDetector/data'
import { RawAwsElasticSearchDomain } from '../elasticSearchDomain/data'
import { RawAwsSystemsManagerDocument } from '../systemsManagerDocument/data'
import { RawAwsRdsClusterSnapshot } from '../rdsClusterSnapshot/data'
import { RawAwsInstanceProfile } from '../iamInstanceProfile/data'
import { RawAwsVpcEndpoint } from '../vpcEndpoint/data'
import { RawAwsApiGatewayHttpApi } from '../apiGatewayHttpApi/data'
import { RawAwsApiGatewayDomainName } from '../apiGatewayDomainName/data'
import { RawAwsAnalyzerSummary } from '../iamAccessAnalyzer/data'
import { RawAwsManagedPrefixList } from '../managedPrefixList/data'
import { RawAwsTransitGatewayRouteTable } from '../transitGatewayRouteTable/data'
import { RawAwsVpcPeeringConnection } from '../vpcPeeringConnection/data'
import { RawAwsMskCluster } from '../msk/data'

const generateTagsMap = (
  data: Array<{ name: string; data: { [property: string]: any[] } }>
): { [tagId: string]: { [serviceName: string]: any } } => {
  const tagsMap = {}
  // create a map of entities by TagId --> map [tagId] [serviceName] => [... entities with that tag]
  for (const serv of data) {
    for (const region of Object.keys(serv.data)) {
      // globan region included
      const regionData = serv.data[region] || []
      for (const entity of regionData) {
        for (const [key, value] of Object.entries(entity.Tags || {})) {
          const tagId = `${key}:${value}`
          if (!tagsMap[tagId]) {
            tagsMap[tagId] = {}
          }
          if (!tagsMap[tagId][serv.name]) {
            tagsMap[tagId][serv.name] = []
          }
          tagsMap[tagId][serv.name].push(entity)
        }
      }
    }
  }
  return tagsMap
}

function getConnections({
  service: tag,
  data,
}: {
  service: any
  data: Array<{ name: string; data: { [property: string]: any[] } }>
}): {
  [property: string]: ServiceConnection[]
} {
  // this function is called once per tag, and we need to traverse the entire data set each time,
  // we cache this precomputed work or it'd simply take too long (minutes) to run in big accounts
  // @NOTE: `this` refers to the Tag Service

  const tagsMap: { [tagId: string]: { [serviceName: string]: any } } =
    this.tagsMap ?? generateTagsMap(data)
  if (!this.tagsMap) {
    this.tagsMap = tagsMap
  }

  const connections: ServiceConnection[] = []

  const dataForTag = tagsMap[tag.id] || {}

  // @NOTE: we now check service by service, we could use a switch statement for better performance.

  /**
   * Find related ALBs
   */
  for (const alb of dataForTag[services.alb] || []) {
    const { LoadBalancerArn: id }: RawAwsAlb = alb
    connections.push({
      id,
      resourceType: services.alb,
      relation: 'child',
      field: 'alb',
    })
  }

  /**
   * Find related ASG
   */

  for (const asg of dataForTag[services.asg] || []) {
    const { AutoScalingGroupARN: id } = asg
    connections.push({
      id,
      resourceType: services.asg,
      relation: 'child',
      field: 'asg',
    })
  }

  /**
   * Find related CloudTrails
   */

  for (const cloudtrail of dataForTag[services.cloudtrail] || []) {
    const { id }: RawAwsCloudTrail = cloudtrail
    connections.push({
      id,
      resourceType: services.cloudtrail,
      relation: 'child',
      field: 'cloudtrail',
    })
  }

  /**
   * Find related Cloudwatch
   */
  for (const cw of dataForTag[services.cloudwatch] || []) {
    const { AlarmArn: id }: MetricAlarm = cw
    connections.push({
      id,
      resourceType: services.cloudwatch,
      relation: 'child',
      field: 'cloudwatch',
    })
  }

  /**
   * Find related Codebuild
   */
  for (const cb of dataForTag[services.codebuild] || []) {
    const { arn: id }: RawAwsCodeBuild = cb
    connections.push({
      id,
      resourceType: services.codebuild,
      relation: 'child',
      field: 'codebuilds',
    })
  }

  /**
   * Find related CognitoIdentityPools
   */
  for (const pool of dataForTag[services.cognitoIdentityPool] || []) {
    const { IdentityPoolId: id }: RawAwsCognitoIdentityPool = pool
    connections.push({
      id,
      resourceType: services.cognitoIdentityPool,
      relation: 'child',
      field: 'cognitoIdentityPool',
    })
  }

  /**
   * Find related CognitoUserPools
   */
  for (const pool of dataForTag[services.cognitoUserPool] || []) {
    const { Id: id }: RawAwsCognitoUserPool = pool
    connections.push({
      id,
      resourceType: services.cognitoUserPool,
      relation: 'child',
      field: 'cognitoUserPool',
    })
  }

  /**
   * Find related KMS keys
   */
  for (const key of dataForTag[services.kms] || []) {
    const { KeyId: id } = key
    connections.push({
      id,
      resourceType: services.kms,
      relation: 'child',
      field: 'kms',
    })
  }

  /**
   * Find related ec2 instances
   */
  for (const instance of dataForTag[services.ec2Instance] || []) {
    const { InstanceId: id } = instance

    connections.push({
      id,
      resourceType: services.ec2Instance,
      relation: 'child',
      field: 'ec2Instance',
    })
  }

  /**
   * Find related lambdas
   */
  for (const instance of dataForTag[services.lambda] || []) {
    const { FunctionArn: id } = instance

    connections.push({
      id,
      resourceType: services.lambda,
      relation: 'child',
      field: 'lambda',
    })
  }

  /**
   * Find related managedAirflows
   */
  for (const instance of dataForTag[services.managedAirflow] || []) {
    const { Arn: id } = instance

    connections.push({
      id,
      resourceType: services.managedAirflow,
      relation: 'child',
      field: 'managedAirflows',
    })
  }

  /**
   * Find related guardDutyDetectors
   */
  for (const instance of dataForTag[services.guardDutyDetector] || []) {
    const { id }: RawAwsGuardDutyDetector = instance

    connections.push({
      id,
      resourceType: services.guardDutyDetector,
      relation: 'child',
      field: 'guardDutyDetectors',
    })
  }

  /**
   * Find related SecurityGroups
   */

  for (const instance of dataForTag[services.sg] || []) {
    const { GroupId: id } = instance

    connections.push({
      id,
      resourceType: services.sg,
      relation: 'child',
      field: 'securityGroups',
    })
  }

  /**
   * Find related SQS
   */

  for (const instance of dataForTag[services.sqs] || []) {
    const {
      sqsAttributes: { QueueArn: id },
    } = instance

    connections.push({
      id,
      resourceType: services.sqs,
      relation: 'child',
      field: 'sqs',
    })
  }

  /**
   * Find related EIP
   */
  for (const instance of dataForTag[services.eip] || []) {
    const { AllocationId: id } = instance

    connections.push({
      id,
      resourceType: services.eip,
      relation: 'child',
      field: 'eip',
    })
  }

  /**
   * Find related EBS
   */
  for (const instance of dataForTag[services.ebs] || []) {
    const { VolumeId: id } = instance

    connections.push({
      id,
      resourceType: services.ebs,
      relation: 'child',
      field: 'ebs',
    })
  }

  /**
   * Find related dmsReplicationInstances
   */
  for (const instance of dataForTag[services.dmsReplicationInstance] || []) {
    const { ReplicationInstanceArn: id } = instance

    connections.push({
      id,
      resourceType: services.dmsReplicationInstance,
      relation: 'child',
      field: 'dmsReplicationInstances',
    })
  }

  /**
   * Find related elasticSearchDomain
   */
  for (const instance of dataForTag[services.elasticSearchDomain] || []) {
    const { DomainId: id }: RawAwsElasticSearchDomain = instance

    connections.push({
      id,
      resourceType: services.elasticSearchDomain,
      relation: 'child',
      field: 'elasticSearchDomains',
    })
  }

  /**
   * Find related IGW
   */
  for (const instance of dataForTag[services.igw] || []) {
    const { InternetGatewayId: id } = instance

    connections.push({
      id,
      resourceType: services.igw,
      relation: 'child',
      field: 'igw',
    })
  }

  /**
   * Find related Network Interface
   */

  for (const instance of dataForTag[services.networkInterface] || []) {
    const { NetworkInterfaceId: id } = instance

    connections.push({
      id,
      resourceType: services.networkInterface,
      relation: 'child',
      field: 'networkInterface',
    })
  }

  /**
   * Find related VPCs
   */
  for (const instance of dataForTag[services.vpc] || []) {
    const { VpcId: id }: Vpc = instance

    connections.push({
      id,
      resourceType: services.vpc,
      relation: 'child',
      field: 'vpc',
    })
  }
  /**

     * Find related ELB
     */
  for (const instance of dataForTag[services.elb] || []) {
    const {
      LoadBalancerName: loadBalancerName,
      region: elbRegion,
      account,
    }: RawAwsElb = instance

    connections.push({
      id: elbArn({ region: elbRegion, account, name: loadBalancerName }),
      resourceType: services.elb,
      relation: 'child',
      field: 'elb',
    })
  }

  /**
   * Find related NAT GWs
   */
  for (const instance of dataForTag[services.nat] || []) {
    const { NatGatewayId: id }: NatGateway = instance

    connections.push({
      id,
      resourceType: services.nat,
      relation: 'child',
      field: 'natGateway',
    })
  }

  /**
   * Find related Route Tables
   */
  for (const instance of dataForTag[services.routeTable] || []) {
    const { RouteTableId: id } = instance

    connections.push({
      id,
      resourceType: services.routeTable,
      relation: 'child',
      field: 'routeTable',
    })
  }

  /**
   * Find related S3 buckets
   */
  for (const instance of dataForTag[services.s3] || []) {
    const { Id: id } = instance

    connections.push({
      id,
      resourceType: services.s3,
      relation: 'child',
      field: 's3',
    })
  }

  /**
   * Find related Cloudfront distros
   */

  for (const instance of dataForTag[services.cloudfront] || []) {
    const {
      summary: { Id: id },
    }: RawAwsCloudfront = instance

    connections.push({
      id,
      resourceType: services.cloudfront,
      relation: 'child',
      field: 'cloudfront',
    })
  }

  /**
   * Find related Kinesis Firehose streams
   */
  for (const instance of dataForTag[services.kinesisFirehose] || []) {
    const { DeliveryStreamARN: id }: RawAwsKinesisFirehose = instance

    connections.push({
      id,
      resourceType: services.kinesisFirehose,
      relation: 'child',
      field: 'kinesisFirehose',
    })
  }

  /**
   * Find related App sync
   */

  for (const instance of dataForTag[services.appSync] || []) {
    const { apiId: id }: RawAwsAppSync = instance

    connections.push({
      id,
      resourceType: services.appSync,
      relation: 'child',
      field: 'appSync',
    })
  }

  /**
   * Find related Cloudformation stacks
   */
  for (const instance of dataForTag[services.cloudFormationStack] || []) {
    const { StackId: id }: RawAwsCloudFormationStack = instance

    connections.push({
      id,
      resourceType: services.cloudFormationStack,
      relation: 'child',
      field: 'cloudFormationStack',
    })
  }

  /**
   * Find related Cloudformation stack sets
   */
  for (const instance of dataForTag[services.cloudFormationStackSet] || []) {
    const { StackSetId: id }: RawAwsCloudFormationStackSet = instance

    connections.push({
      id,
      resourceType: services.cloudFormationStackSet,
      relation: 'child',
      field: 'cloudFormationStackSet',
    })
  }

  /**
   * Find related DynamoDb databases
   */
  for (const instance of dataForTag[services.dynamodb] || []) {
    const { TableId: id }: RawAwsDynamoDbTable = instance

    connections.push({
      id,
      resourceType: services.dynamodb,
      relation: 'child',
      field: 'dynamodb',
    })
  }

  /**
   * Find related Network ACLs
   */
  for (const instance of dataForTag[services.nacl] || []) {
    const { NetworkAclId: id }: RawAwsNetworkAcl = instance

    connections.push({
      id,
      resourceType: services.nacl,
      relation: 'child',
      field: 'nacl',
    })
  }

  /**
   * Find related ECRs
   */
  for (const instance of dataForTag[services.ecr] || []) {
    const { repositoryArn: id }: RawAwsEcr = instance

    connections.push({
      id,
      resourceType: services.ecr,
      relation: 'child',
      field: 'ecr',
    })
  }

  /**
   * Find related Subnets
   */
  for (const instance of dataForTag[services.subnet] || []) {
    const { SubnetId: id }: RawAwsSubnet = instance

    connections.push({
      id,
      relation: 'child',
      resourceType: services.subnet,
      field: 'subnet',
    })
  }

  /**
   * Find related SecretsManagers
   */

  for (const instance of dataForTag[services.secretsManager] || []) {
    const { ARN: id }: RawAwsSecretsManager = instance

    connections.push({
      id,
      resourceType: services.secretsManager,
      relation: 'child',
      field: 'secretsManager',
    })
  }

  /**
   * Find related IAM Users
   */
  for (const instance of dataForTag[services.iamUser] || []) {
    const { Arn: id }: RawAwsIamUser = instance

    connections.push({
      id,
      resourceType: services.iamUser,
      relation: 'child',
      field: 'iamUsers',
    })
  }

  /**
   * Find related IAM Roles
   */
  for (const instance of dataForTag[services.iamRole] || []) {
    const { Arn: roleId }: RawAwsIamRole = instance

    connections.push({
      id: roleId,
      resourceType: services.iamRole,
      relation: 'child',
      field: 'iamRoles',
    })
  }

  /**
   * Find related IAM Policies
   */
  for (const instance of dataForTag[services.iamPolicy] || []) {
    const { Arn: policyId }: RawAwsIamPolicy = instance

    connections.push({
      id: policyId,
      resourceType: services.iamPolicy,
      relation: 'child',
      field: 'iamPolicies',
    })
  }

  /**
   * Find related RDS clusters
   */
  for (const instance of dataForTag[services.rdsCluster] || []) {
    const { DBClusterArn: id }: RawAwsRdsCluster = instance

    connections.push({
      id,
      resourceType: services.rdsCluster,
      relation: 'child',
      field: 'rdsCluster',
    })
  }

  /**
   * Find related RDS cluster Snapshots
   */
  for (const instance of dataForTag[services.rdsClusterSnapshot] || []) {
    const { DBClusterSnapshotIdentifier }: RawAwsRdsClusterSnapshot = instance

    connections.push({
      id: DBClusterSnapshotIdentifier,
      resourceType: services.rdsClusterSnapshot,
      relation: 'child',
      field: 'rdsClusterSnapshot',
    })
  }

  /**
   * Find related RDS instances
   */

  for (const instance of dataForTag[services.rdsDbInstance] || []) {
    const { DBInstanceArn: id }: RawAwsRdsDbInstance = instance

    connections.push({
      id,
      resourceType: services.rdsDbInstance,
      relation: 'child',
      field: 'rdsDbInstance',
    })
  }

  /**
   * Find related ElasticBeanstalk Apps
   */

  for (const instance of dataForTag[services.elasticBeanstalkApp] || []) {
    const { ApplicationArn: id }: RawAwsElasticBeanstalkApp = instance

    connections.push({
      id,
      resourceType: services.elasticBeanstalkApp,
      relation: 'child',
      field: 'elasticBeanstalkApp',
    })
  }

  /**
   * Find related ElasticBeanstalk Envs
   */

  for (const instance of dataForTag[services.elasticBeanstalkEnv] || []) {
    const { EnvironmentId: id }: RawAwsElasticBeanstalkEnv = instance

    connections.push({
      id,
      resourceType: services.elasticBeanstalkEnv,
      relation: 'child',
      field: 'elasticBeanstalkEnv',
    })
  }

  /**
   * Find related Flow Logs
   */

  for (const instance of dataForTag[services.flowLog] || []) {
    const { FlowLogId: id }: RawFlowLog = instance

    connections.push({
      id,
      resourceType: services.flowLog,
      relation: 'child',
      field: 'flowLogs',
    })
  }

  /**
   * Find related SNS
   */
  for (const instance of dataForTag[services.sns] || []) {
    const { TopicArn: id }: RawAwsSns = instance

    connections.push({
      id,
      relation: 'child',
      resourceType: services.sns,
      field: 'sns',
    })
  }

  /**
   * Find related Redshift clusters
   */

  for (const instance of dataForTag[services.redshiftCluster] || []) {
    const {
      ClusterIdentifier: id,
      ClusterNamespaceArn,
      region,
    }: RawAwsRedshiftCluster = instance
    // Hack to get the accountId for the cluster
    // Namespace arn structure: arn:aws:redshift:{region}:{account}:namespace:{namespaceId}
    const account = ClusterNamespaceArn.split(':')[4]
    const arn = redshiftArn({ region, account, id })
    connections.push({
      id: arn,
      resourceType: services.redshiftCluster,
      relation: 'child',
      field: 'redshiftClusters',
    })
  }
  /**
   * Find related EKS clusters
   */
  for (const instance of dataForTag[services.eksCluster] || []) {
    const { arn: id }: RawAwsEksCluster = instance

    connections.push({
      id,
      relation: 'child',
      resourceType: services.eksCluster,
      field: 'eksCluster',
    })
  }

  /**
   * Find related ECS clusters
   */
  for (const instance of dataForTag[services.ecsCluster] || []) {
    const { clusterArn: id }: RawAwsEcsCluster = instance

    connections.push({
      id,
      resourceType: services.ecsCluster,
      relation: 'child',
      field: 'ecsCluster',
    })
  }

  /**
   * Find related EMR clusters
   */

  for (const instance of dataForTag[services.emrCluster] || []) {
    const { ClusterArn: arn }: RawAwsEmrCluster = instance
    connections.push({
      id: arn,
      resourceType: services.emrCluster,
      relation: 'child',
      field: 'emrCluster',
    })
  }

  /**
   * Find related ECS containers
   */
  for (const instance of dataForTag[services.ecsContainer] || []) {
    const { containerInstanceArn: id }: RawAwsEcsContainer = instance

    connections.push({
      id,
      resourceType: services.ecsContainer,
      relation: 'child',
      field: 'ecsContainer',
    })
  }

  /**
   * Find related ECS services
   */
  for (const instance of dataForTag[services.ecsService] || []) {
    const { serviceArn: id }: RawAwsEcsService = instance

    connections.push({
      id,
      resourceType: services.ecsService,
      relation: 'child',
      field: 'ecsService',
    })
  }

  /**
   * Find related ECS tasks
   */
  for (const instance of dataForTag[services.ecsTask] || []) {
    const { taskArn: id }: RawAwsEcsTask = instance

    connections.push({
      id,
      resourceType: services.ecsTask,
      relation: 'child',
      field: 'ecsTask',
    })
  }

  /**
   * Find related API Gateway RestApi
   */

  for (const instance of dataForTag[services.apiGatewayRestApi] || []) {
    const { id }: RawAwsApiGatewayRestApi = instance

    connections.push({
      id,
      resourceType: services.apiGatewayRestApi,
      relation: 'child',
      field: 'apiGatewayRestApi',
    })
  }

  /**
   * Find related EFS file systems
   */

  for (const instance of dataForTag[services.efs] || []) {
    const { FileSystemArn: id }: RawAwsEfs = instance

    connections.push({
      id,
      resourceType: services.efs,
      relation: 'child',
      field: 'efs',
    })
  }

  /**
   * Find related API Gateway Stage
   */

  for (const instance of dataForTag[services.apiGatewayStage] || []) {
    const {
      stageName: name,
      restApiId,
      region,
    }: RawAwsApiGatewayStage = instance

    connections.push({
      id: apiGatewayStageArn({
        restApiArn: apiGatewayRestApiArn({
          restApiArn: apiGatewayArn({ region }),
          id: restApiId,
        }),
        name,
      }),
      resourceType: services.apiGatewayStage,
      relation: 'child',
      field: 'apiGatewayStage',
    })
  }

  /**
   * Find related ElastiCache clusters
   */

  for (const instance of dataForTag[services.elastiCacheCluster] || []) {
    const { ARN: arn }: RawAwsElastiCacheCluster = instance
    connections.push({
      id: arn,
      resourceType: services.elastiCacheCluster,
      relation: 'child',
      field: 'elastiCacheCluster',
    })
  }

  /**
   * Find related ElastiCache replication groups
   */

  for (const instance of dataForTag[services.elastiCacheReplicationGroup] ||
    []) {
    const { ARN: arn }: RawAwsElastiCacheReplicationGroup = instance
    connections.push({
      id: arn,
      resourceType: services.elastiCacheReplicationGroup,
      relation: 'child',
      field: 'elastiCacheReplicationGroup',
    })
  }

  /**
   * Find related Cloud9 environments
   */
  for (const instance of dataForTag[services.cloud9] || []) {
    const { arn }: RawAwsCloud9Environment = instance
    connections.push({
      id: arn,
      resourceType: services.cloud9,
      relation: 'child',
      field: 'cloud9Environment',
    })
  }

  /**
   * Find related systemsManagerDocuments
   */

  for (const instance of dataForTag[services.systemsManagerDocument] || []) {
    const { Name, region, accountId }: RawAwsSystemsManagerDocument = instance
    const arn = ssmDocumentArn({ region, name: Name, account: accountId })
    connections.push({
      id: arn,
      resourceType: services.systemsManagerDocument,
      relation: 'child',
      field: 'systemsManagerDocuments',
    })
  }

  /**
   * Find related Customer Gateways
   */

  for (const instance of dataForTag[services.customerGateway] || []) {
    const { CustomerGatewayId: id }: CustomerGateway = instance

    connections.push({
      id,
      resourceType: services.customerGateway,
      relation: 'child',
      field: 'customerGateway',
    })
  }

  /**
   * Find related Transit Gateways
   */

  for (const instance of dataForTag[services.transitGateway] || []) {
    const { TransitGatewayId: id }: TransitGateway = instance

    connections.push({
      id,
      resourceType: services.transitGateway,
      relation: 'child',
      field: 'transitGateway',
    })
  }

  /**
   * Find related Vpn Gateways
   */

  for (const instance of dataForTag[services.vpnGateway] || []) {
    const { VpnGatewayId: id }: VpnGateway = instance

    connections.push({
      id,
      resourceType: services.vpnGateway,
      relation: 'child',
      field: 'vpnGateway',
    })
  }

  /**
   * Find related Client vpn endpoints
   */

  for (const instance of dataForTag[services.clientVpnEndpoint] || []) {
    const { ClientVpnEndpointId }: RawAwsClientVpnEndpoint = instance
    connections.push({
      id: ClientVpnEndpointId,
      resourceType: services.clientVpnEndpoint,
      relation: 'child',
      field: 'clientVpnEndpoint',
    })
  }

  /**
   * Find related Vpn Connection
   */

  for (const instance of dataForTag[services.vpnConnection] || []) {
    const { VpnConnectionId: id }: VpnConnection = instance

    connections.push({
      id,
      resourceType: services.vpnConnection,
      relation: 'child',
      field: 'vpnConnection',
    })
  }

  /**
   * Find related Transit Gateway Attachments
   */

  for (const instance of dataForTag[services.transitGatewayAttachment] || []) {
    const { TransitGatewayAttachmentId: id }: TransitGatewayAttachment =
      instance

    connections.push({
      id,
      resourceType: services.transitGatewayAttachment,
      relation: 'child',
      field: 'transitGatewayAttachment',
    })
  }

  /**
   * Find related IAM Instance Profiles
   */

  for (const instance of dataForTag[services.iamInstanceProfile] || []) {
    const { InstanceProfileId: id }: RawAwsInstanceProfile = instance

    connections.push({
      id,
      resourceType: services.iamInstanceProfile,
      relation: 'child',
      field: 'iamInstanceProfiles',
    })
  }

  /**
   * Find related IAM Analyzers
   */

  for (const instance of dataForTag[services.iamAccessAnalyzer] || []) {
    const { arn: id }: RawAwsAnalyzerSummary = instance

    connections.push({
      id,
      resourceType: services.iamAccessAnalyzer,
      relation: 'child',
      field: 'iamAccessAnalyzers',
    })
  }

  /**
   * Find related API Gateway Http Apis
   */

  for (const instance of dataForTag[services.apiGatewayHttpApi] || []) {
    const { ApiId: id }: RawAwsApiGatewayHttpApi = instance

    connections.push({
      id,
      resourceType: services.apiGatewayHttpApi,
      relation: 'child',
      field: 'apiGatewayHttpApi',
    })
  }

  /**
   * Find related API Gateway Domain Names
   */

  for (const instance of dataForTag[services.apiGatewayDomainName] || []) {
    const {
      DomainName: domainName,
      region: domainRegion,
      account,
    }: RawAwsApiGatewayDomainName = instance
    const arn = domainNameArn({
      region: domainRegion,
      account,
      name: domainName,
    })
    connections.push({
      id: arn,
      resourceType: services.apiGatewayDomainName,
      relation: 'child',
      field: 'apiGatewayDomainName',
    })
  }

  /**
   * Find related Vpc Endpoints
   */
  for (const instance of dataForTag[services.vpcEndpoint] || []) {
    const { VpcEndpointId: id }: RawAwsVpcEndpoint = instance

    connections.push({
      id,
      resourceType: services.vpcEndpoint,
      relation: 'child',
      field: 'vpcEndpoints',
    })
  }

  /**
   * Find related Vpc Peering Connections
   */
  for (const instance of dataForTag[services.vpcPeeringConnection] || []) {
    const { VpcPeeringConnectionId: id }: RawAwsVpcPeeringConnection = instance

    connections.push({
      id,
      resourceType: services.vpcPeeringConnection,
      relation: 'child',
      field: 'vpcPeeringConnections',
    })
  }

  /**
   * Find related Transit Gateway Route tables
   */
  for (const instance of dataForTag[services.transitGatewayRouteTable] || []) {
    const { TransitGatewayRouteTableId: id }: RawAwsTransitGatewayRouteTable =
      instance

    connections.push({
      id,
      resourceType: services.transitGatewayRouteTable,
      relation: 'child',
      field: 'transitGatewayRouteTables',
    })
  }

  /**
   * Find related Managed Prefix Lists
   */
  for (const instance of dataForTag[services.managedPrefixList] || []) {
    const { PrefixListId: id }: RawAwsManagedPrefixList = instance

    connections.push({
      id,
      resourceType: services.managedPrefixList,
      relation: 'child',
      field: 'managedPrefixLists',
    })
  }

  /**
   * Find related Msk Clusters
   */
   for (const instance of dataForTag[services.mskCluster] || []) {
    const { ClusterArn: arn }: RawAwsMskCluster = instance

    connections.push({
      id: arn,
      resourceType: services.mskCluster,
      relation: 'child',
      field: 'mskClusters',
    })
  }

  const tagResult = {
    [tag.id]: connections,
  }
  return tagResult
}
export default getConnections
