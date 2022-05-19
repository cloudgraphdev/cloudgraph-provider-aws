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
import { isEmpty } from 'lodash'
import regions, { globalRegionName } from '../../enums/regions'
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
import { RawAwsApiGatewayHttpApi } from '../apiGatewayHttpApi/data'
import { RawAwsApiGatewayDomainName } from '../apiGatewayDomainName/data'
import { RawAwsAnalyzerSummary } from '../iamAccessAnalyzer/data'
import { RawAwsManagedPrefixList } from '../managedPrefixList/data'

const findServiceInstancesWithTag = (tag: any, service: any): any => {
  const { id } = tag
  return service.filter(({ Tags = {} }) => {
    for (const [key, value] of Object.entries(Tags)) {
      if (id === `${key}:${value}`) {
        return true
      }
    }
    return false
  })
}

export default ({
  service: tag,
  data,
}: {
  service: any
  data: Array<{ name: string; data: { [property: string]: any[] } }>
}): {
  [property: string]: ServiceConnection[]
} => {
  const connections: ServiceConnection[] = []
  for (const region of regions) {
    /**
     * Find related ALBs
     */
    const albs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.alb)
    if (albs?.data?.[region]) {
      const dataAtRegion: RawAwsAlb[] = findServiceInstancesWithTag(
        tag,
        albs.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const alb of dataAtRegion) {
          const { LoadBalancerArn: id } = alb
          connections.push({
            id,
            resourceType: services.alb,
            relation: 'child',
            field: 'alb',
          })
        }
      }
    }

    /**
     * Find related ASG
     */
    const asgQueues: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.asg)
    if (asgQueues?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        asgQueues.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const asg of dataAtRegion) {
          const { AutoScalingGroupARN: id } = asg
          connections.push({
            id,
            resourceType: services.asg,
            relation: 'child',
            field: 'asg',
          })
        }
      }
    }

    /**
     * Find related CloudTrails
     */
    const cloudtrails: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.cloudtrail)
    if (cloudtrails?.data?.[region]) {
      const dataAtRegion: RawAwsCloudTrail[] = findServiceInstancesWithTag(
        tag,
        cloudtrails.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const cloudtrail of dataAtRegion) {
          const { id } = cloudtrail
          connections.push({
            id,
            resourceType: services.cloudtrail,
            relation: 'child',
            field: 'cloudtrail',
          })
        }
      }
    }

    /**
     * Find related Cloudwatch
     */
    const cws: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.cloudwatch)
    if (cws?.data?.[region]) {
      const dataAtRegion: any = findServiceInstancesWithTag(
        tag,
        cws.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const cw of dataAtRegion) {
          const { AlarmArn: id }: MetricAlarm = cw
          connections.push({
            id,
            resourceType: services.cloudwatch,
            relation: 'child',
            field: 'cloudwatch',
          })
        }
      }
    }

    /**
     * Find related Codebuild
     */
    const codebuild: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.codebuild)
    if (codebuild?.data?.[region]) {
      const dataAtRegion: any = findServiceInstancesWithTag(
        tag,
        codebuild.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const cb of dataAtRegion) {
          const { arn: id }: RawAwsCodeBuild = cb
          connections.push({
            id,
            resourceType: services.codebuild,
            relation: 'child',
            field: 'codebuilds',
          })
        }
      }
    }

    /**
     * Find related CognitoIdentityPools
     */
    const pools: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.cognitoIdentityPool)
    if (pools?.data?.[region]) {
      const dataAtRegion: any = findServiceInstancesWithTag(
        tag,
        pools.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const pool of dataAtRegion) {
          const { IdentityPoolId: id }: RawAwsCognitoIdentityPool = pool
          connections.push({
            id,
            resourceType: services.cognitoIdentityPool,
            relation: 'child',
            field: 'cognitoIdentityPool',
          })
        }
      }
    }

    /**
     * Find related CognitoUserPools
     */
    const userPools: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.cognitoUserPool)
    if (userPools?.data?.[region]) {
      const dataAtRegion: RawAwsCognitoUserPool[] = findServiceInstancesWithTag(
        tag,
        userPools.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const pool of dataAtRegion) {
          const { Id: id } = pool
          connections.push({
            id,
            resourceType: services.cognitoUserPool,
            relation: 'child',
            field: 'cognitoUserPool',
          })
        }
      }
    }

    /**
     * Find related KMS keys
     */
    const kmsKeys: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.kms)
    if (kmsKeys?.data?.[region]) {
      const dataAtRegion: any = findServiceInstancesWithTag(
        tag,
        kmsKeys.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const key of dataAtRegion) {
          const { KeyId: id } = key
          connections.push({
            id,
            resourceType: services.kms,
            relation: 'child',
            field: 'kms',
          })
        }
      }
    }

    /**
     * Find related ec2 instances
     */
    const ec2s: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.ec2Instance)
    if (ec2s?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, ec2s.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { InstanceId: id } = instance

          connections.push({
            id,
            resourceType: services.ec2Instance,
            relation: 'child',
            field: 'ec2Instance',
          })
        }
      }
    }

    /**
     * Find related lambdas
     */
    const lambdas: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.lambda)
    if (lambdas?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        lambdas.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { FunctionArn: id } = instance

          connections.push({
            id,
            resourceType: services.lambda,
            relation: 'child',
            field: 'lambda',
          })
        }
      }
    }

    /**
     * Find related managedAirflows
     */
    const airflows: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.managedAirflow)
    if (airflows?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        airflows.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { Arn: id } = instance

          connections.push({
            id,
            resourceType: services.managedAirflow,
            relation: 'child',
            field: 'managedAirflows',
          })
        }
      }
    }

    /**
     * Find related guardDutyDetectors
     */
    const detectors: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.guardDutyDetector)
    if (detectors?.data?.[region]) {
      const dataAtRegion: RawAwsGuardDutyDetector[] =
        findServiceInstancesWithTag(tag, detectors.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { id } = instance

          connections.push({
            id,
            resourceType: services.guardDutyDetector,
            relation: 'child',
            field: 'guardDutyDetectors',
          })
        }
      }
    }

    /**
     * Find related SecurityGroups
     */
    const securityGroups: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.sg)
    if (securityGroups?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        securityGroups.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { GroupId: id } = instance

          connections.push({
            id,
            resourceType: services.sg,
            relation: 'child',
            field: 'securityGroups',
          })
        }
      }
    }

    /**
     * Find related SQS
     */
    const sqsQueues: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.sqs)
    if (sqsQueues?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        sqsQueues.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
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
      }
    }

    /**
     * Find related EIP
     */
    const eips: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.eip)
    if (eips?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, eips.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { AllocationId: id } = instance

          connections.push({
            id,
            resourceType: services.eip,
            relation: 'child',
            field: 'eip',
          })
        }
      }
    }

    /**
     * Find related EBS
     */
    const ebs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.ebs)
    if (ebs?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, ebs.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { VolumeId: id } = instance

          connections.push({
            id,
            resourceType: services.ebs,
            relation: 'child',
            field: 'ebs',
          })
        }
      }
    }

    /**
     * Find related dmsReplicationInstances
     */
    const replications: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.dmsReplicationInstance)
    if (replications?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        replications.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { ReplicationInstanceArn: id } = instance

          connections.push({
            id,
            resourceType: services.dmsReplicationInstance,
            relation: 'child',
            field: 'dmsReplicationInstances',
          })
        }
      }
    }

    /**
     * Find related elasticSearchDomain
     */
    const domains: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.elasticSearchDomain)
    if (domains?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        domains.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { DomainId: id }: RawAwsElasticSearchDomain = instance

          connections.push({
            id,
            resourceType: services.elasticSearchDomain,
            relation: 'child',
            field: 'elasticSearchDomains',
          })
        }
      }
    }

    /**
     * Find related IGW
     */
    const igws: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.igw)
    if (igws?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, igws.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { InternetGatewayId: id } = instance

          connections.push({
            id,
            resourceType: services.igw,
            relation: 'child',
            field: 'igw',
          })
        }
      }
    }

    /**
     * Find related Network Interface
     */
    const networkInterfaces: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.networkInterface)
    if (networkInterfaces?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        networkInterfaces.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { NetworkInterfaceId: id } = instance

          connections.push({
            id,
            resourceType: services.networkInterface,
            relation: 'child',
            field: 'networkInterface',
          })
        }
      }
    }

    /**
     * Find related VPCs
     */
    const vpcs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.vpc)
    if (vpcs?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, vpcs.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { VpcId: id }: Vpc = instance

          connections.push({
            id,
            resourceType: services.vpc,
            relation: 'child',
            field: 'vpc',
          })
        }
      }
    }
    /**

     * Find related ELB
     */
    const elbs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.elb)
    if (elbs?.data?.[region]) {
      const dataAtRegion: RawAwsElb[] = findServiceInstancesWithTag(
        tag,
        elbs.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const {
            LoadBalancerName: loadBalancerName,
            region: elbRegion,
            account,
          } = instance

          connections.push({
            id: elbArn({ region: elbRegion, account, name: loadBalancerName }),
            resourceType: services.elb,
            relation: 'child',
            field: 'elb',
          })
        }
      }
    }
    /**
     * Find related NAT GWs
     */
    const natgws: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.nat)
    if (natgws?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(tag, natgws.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { NatGatewayId: id }: NatGateway = instance

          connections.push({
            id,
            resourceType: services.nat,
            relation: 'child',
            field: 'natGateway',
          })
        }
      }
    }

    /**
     * Find related Route Tables
     */
    const routeTables: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.routeTable)
    if (routeTables?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        routeTables.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { RouteTableId: id } = instance

          connections.push({
            id,
            resourceType: services.routeTable,
            relation: 'child',
            field: 'routeTable',
          })
        }
      }
    }

    /**
     * Find related S3 buckets
     */
    const buckets: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.s3)
    if (buckets?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        buckets.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { Id: id } = instance

          connections.push({
            id,
            resourceType: services.s3,
            relation: 'child',
            field: 's3',
          })
        }
      }
    }

    /**
     * Find related Cloudfront distros
     */
    const distros: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.cloudfront)
    if (distros?.data?.[globalRegionName]) {
      const dataAtRegion: RawAwsCloudfront[] = findServiceInstancesWithTag(
        tag,
        distros.data[globalRegionName]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const {
            summary: { Id: id },
          } = instance

          connections.push({
            id,
            resourceType: services.cloudfront,
            relation: 'child',
            field: 'cloudfront',
          })
        }
      }
    }

    /**
     * Find related Kinesis Firehose streams
     */
    const KFStreams: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.kinesisFirehose)
    if (KFStreams?.data?.[region]) {
      const dataAtRegion: RawAwsKinesisFirehose[] = findServiceInstancesWithTag(
        tag,
        KFStreams.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { DeliveryStreamARN: id } = instance

          connections.push({
            id,
            resourceType: services.kinesisFirehose,
            relation: 'child',
            field: 'kinesisFirehose',
          })
        }
      }
    }

    /**
     * Find related App sync
     */
    const appSyncs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.appSync)

    if (appSyncs?.data?.[region]) {
      const dataAtRegion: RawAwsAppSync[] = findServiceInstancesWithTag(
        tag,
        appSyncs.data[region]
      )

      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { apiId: id } = instance

          connections.push({
            id,
            resourceType: services.appSync,
            relation: 'child',
            field: 'appSync',
          })
        }
      }
    }

    /**
     * Find related Cloudformation stacks
     */
    const CFStacks: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.cloudFormationStack)
    if (CFStacks?.data?.[region]) {
      const dataAtRegion: RawAwsCloudFormationStack[] =
        findServiceInstancesWithTag(tag, CFStacks.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { StackId: id } = instance

          connections.push({
            id,
            resourceType: services.cloudFormationStack,
            relation: 'child',
            field: 'cloudFormationStack',
          })
        }
      }
    }

    /**
     * Find related Cloudformation stack sets
     */
    const CFStacksSets: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.cloudFormationStackSet)
    if (CFStacksSets?.data?.[region]) {
      const dataAtRegion: RawAwsCloudFormationStackSet[] =
        findServiceInstancesWithTag(tag, CFStacksSets.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { StackSetId: id } = instance

          connections.push({
            id,
            resourceType: services.cloudFormationStackSet,
            relation: 'child',
            field: 'cloudFormationStackSet',
          })
        }
      }
    }

    /**
     * Find related DynamoDb databases
     */
    const dynamoDbs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.dynamodb)
    if (dynamoDbs?.data?.[region]) {
      const dataAtRegion: RawAwsDynamoDbTable[] = findServiceInstancesWithTag(
        tag,
        dynamoDbs.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { TableId: id } = instance

          connections.push({
            id,
            resourceType: services.dynamodb,
            relation: 'child',
            field: 'dynamodb',
          })
        }
      }
    }

    /**
     * Find related Network ACLs
     */
    const nacls: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.nacl)
    if (nacls?.data?.[region]) {
      const dataAtRegion: RawAwsNetworkAcl[] = findServiceInstancesWithTag(
        tag,
        nacls.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { NetworkAclId: id } = instance

          connections.push({
            id,
            resourceType: services.nacl,
            relation: 'child',
            field: 'nacl',
          })
        }
      }
    }

    /**
     * Find related ECRs
     */
    const ecrs: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.ecr)
    if (ecrs?.data?.[region]) {
      const dataAtRegion: RawAwsEcr[] = findServiceInstancesWithTag(
        tag,
        ecrs.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { repositoryArn: id } = instance

          connections.push({
            id,
            resourceType: services.ecr,
            relation: 'child',
            field: 'ecr',
          })
        }
      }
    }

    /**
     * Find related Subnets
     */
    const subnets: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.subnet)
    if (subnets?.data?.[region]) {
      const dataAtRegion: RawAwsSubnet[] = findServiceInstancesWithTag(
        tag,
        subnets.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { SubnetId: id } = instance

          connections.push({
            id,
            relation: 'child',
            resourceType: services.subnet,
            field: 'subnet',
          })
        }
      }
    }

    /**
     * Find related SecretsManagers
     */
    const secretsManagers: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.secretsManager)
    if (secretsManagers?.data?.[region]) {
      const dataAtRegion: RawAwsSecretsManager[] = findServiceInstancesWithTag(
        tag,
        secretsManagers.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { ARN: id } = instance

          connections.push({
            id,
            resourceType: services.secretsManager,
            relation: 'child',
            field: 'secretsManager',
          })
        }
      }
    }

    /**
     * Find related IAM Users
     */
    const users: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.iamUser)
    if (users?.data?.[globalRegionName]) {
      const dataAtRegion: RawAwsIamUser[] = findServiceInstancesWithTag(
        tag,
        users.data[globalRegionName]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { Arn: id } = instance

          connections.push({
            id,
            resourceType: services.iamUser,
            relation: 'child',
            field: 'iamUsers',
          })
        }
      }
    }

    /**
     * Find related IAM Roles
     */
    const roles: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.iamRole)
    if (roles?.data?.[globalRegionName]) {
      const dataAtRegion: RawAwsIamRole[] = findServiceInstancesWithTag(
        tag,
        roles.data[globalRegionName]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { Arn: roleId } = instance

          connections.push({
            id: roleId,
            resourceType: services.iamRole,
            relation: 'child',
            field: 'iamRoles',
          })
        }
      }
    }

    /**
     * Find related IAM Policies
     */
    const policies: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.iamPolicy)
    if (policies?.data?.[globalRegionName]) {
      const dataAtRegion: RawAwsIamPolicy[] = findServiceInstancesWithTag(
        tag,
        policies.data[globalRegionName]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { Arn: policyId } = instance

          connections.push({
            id: policyId,
            resourceType: services.iamPolicy,
            relation: 'child',
            field: 'iamPolicies',
          })
        }
      }
    }

    /**
     * Find related RDS clusters
     */
    const rdsClusters: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.rdsCluster)
    if (rdsClusters?.data?.[region]) {
      const dataAtRegion: RawAwsRdsCluster[] = findServiceInstancesWithTag(
        tag,
        rdsClusters.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { DBClusterArn: id } = instance

          connections.push({
            id,
            resourceType: services.rdsCluster,
            relation: 'child',
            field: 'rdsCluster',
          })
        }
      }
    }

    /**
     * Find related RDS cluster Snapshots
     */
    const snapshots: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.rdsClusterSnapshot)
    if (snapshots?.data?.[region]) {
      const dataAtRegion: RawAwsRdsClusterSnapshot[] =
        findServiceInstancesWithTag(tag, snapshots.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { DBClusterSnapshotIdentifier } = instance

          connections.push({
            id: DBClusterSnapshotIdentifier,
            resourceType: services.rdsClusterSnapshot,
            relation: 'child',
            field: 'rdsClusterSnapshot',
          })
        }
      }
    }

    /**
     * Find related RDS instances
     */
    const rdsDbInstances: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.rdsDbInstance)
    if (rdsDbInstances?.data?.[region]) {
      const dataAtRegion: RawAwsRdsDbInstance[] = findServiceInstancesWithTag(
        tag,
        rdsDbInstances.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { DBInstanceArn: id } = instance

          connections.push({
            id,
            resourceType: services.rdsDbInstance,
            relation: 'child',
            field: 'rdsDbInstance',
          })
        }
      }
    }

    /**
     * Find related ElasticBeanstalk Apps
     */
    const elasticBeanstalkApps: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.elasticBeanstalkApp)
    if (elasticBeanstalkApps?.data?.[region]) {
      const dataAtRegion: RawAwsElasticBeanstalkApp[] =
        findServiceInstancesWithTag(tag, elasticBeanstalkApps.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { ApplicationArn: id } = instance

          connections.push({
            id,
            resourceType: services.elasticBeanstalkApp,
            relation: 'child',
            field: 'elasticBeanstalkApp',
          })
        }
      }
    }

    /**
     * Find related ElasticBeanstalk Envs
     */
    const elasticBeanstalkEnvs: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.elasticBeanstalkEnv)
    if (elasticBeanstalkEnvs?.data?.[region]) {
      const dataAtRegion: RawAwsElasticBeanstalkEnv[] =
        findServiceInstancesWithTag(tag, elasticBeanstalkEnvs.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { EnvironmentId: id } = instance

          connections.push({
            id,
            resourceType: services.elasticBeanstalkEnv,
            relation: 'child',
            field: 'elasticBeanstalkEnv',
          })
        }
      }
    }

    /**
     * Find related Flow Logs
     */
    const flowLogs: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.flowLog)
    if (flowLogs?.data?.[region]) {
      const dataAtRegion: RawFlowLog[] = findServiceInstancesWithTag(
        tag,
        flowLogs.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { FlowLogId: id } = instance

          connections.push({
            id,
            resourceType: services.flowLog,
            relation: 'child',
            field: 'flowLogs',
          })
        }
      }
    }

    /**
     * Find related SNS
     */
    const sns: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.sns)
    if (sns?.data?.[region]) {
      const dataAtRegion: RawAwsSns[] = findServiceInstancesWithTag(
        tag,
        sns.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { TopicArn: id } = instance

          connections.push({
            id,
            relation: 'child',
            resourceType: services.sns,
            field: 'sns',
          })
        }
      }
    }

    /**
     * Find related Redshift clusters
     */
    const redshift: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.redshiftCluster)
    if (redshift?.data?.[region]) {
      const dataAtRegion: RawAwsRedshiftCluster[] = findServiceInstancesWithTag(
        tag,
        redshift.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { ClusterIdentifier: id, ClusterNamespaceArn } = instance
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
      }
    }

    /**
     * Find related EKS clusters
     */
    const eksClusters: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.eksCluster)
    if (eksClusters?.data?.[region]) {
      const dataAtRegion: RawAwsEksCluster[] = findServiceInstancesWithTag(
        tag,
        eksClusters.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { arn: id } = instance

          connections.push({
            id,
            relation: 'child',
            resourceType: services.eksCluster,
            field: 'eksCluster',
          })
        }
      }
    }

    /**
     * Find related ECS clusters
     */
    const ecsClusters: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.ecsCluster)
    if (ecsClusters?.data?.[region]) {
      const dataAtRegion: RawAwsEcsCluster[] = findServiceInstancesWithTag(
        tag,
        ecsClusters.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { clusterArn: id } = instance

          connections.push({
            id,
            resourceType: services.ecsCluster,
            relation: 'child',
            field: 'ecsCluster',
          })
        }
      }
    }

    /**
     * Find related EMR clusters
     */
    const emrClusters: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.emrCluster)
    if (emrClusters?.data?.[region]) {
      const dataAtRegion: RawAwsEmrCluster[] = findServiceInstancesWithTag(
        tag,
        emrClusters.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { ClusterArn: arn } = instance
          connections.push({
            id: arn,
            resourceType: services.emrCluster,
            relation: 'child',
            field: 'emrCluster',
          })
        }
      }
    }

    /**
     * Find related ECS containers
     */
    const ecsContainers: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.ecsContainer)
    if (ecsContainers?.data?.[region]) {
      const dataAtRegion: RawAwsEcsContainer[] = findServiceInstancesWithTag(
        tag,
        ecsContainers.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { containerInstanceArn: id } = instance

          connections.push({
            id,
            resourceType: services.ecsContainer,
            relation: 'child',
            field: 'ecsContainer',
          })
        }
      }
    }

    /**
     * Find related ECS services
     */
    const ecsServices: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.ecsService)
    if (ecsServices?.data?.[region]) {
      const dataAtRegion: RawAwsEcsService[] = findServiceInstancesWithTag(
        tag,
        ecsServices.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { serviceArn: id } = instance

          connections.push({
            id,
            resourceType: services.ecsService,
            relation: 'child',
            field: 'ecsService',
          })
        }
      }
    }

    /**
     * Find related ECS tasks
     */
    const ecsTasks: { name: string; data: { [property: string]: any[] } } =
      data.find(({ name }) => name === services.ecsTask)
    if (ecsTasks?.data?.[region]) {
      const dataAtRegion: RawAwsEcsTask[] = findServiceInstancesWithTag(
        tag,
        ecsTasks.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { taskArn: id } = instance

          connections.push({
            id,
            resourceType: services.ecsTask,
            relation: 'child',
            field: 'ecsTask',
          })
        }
      }
    }

    /**
     * Find related API Gateway RestApi
     */
    const apiGatewayRestApi: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.apiGatewayRestApi)
    if (apiGatewayRestApi?.data?.[region]) {
      const dataAtRegion: RawAwsApiGatewayRestApi[] =
        findServiceInstancesWithTag(tag, apiGatewayRestApi.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { id } = instance

          connections.push({
            id,
            resourceType: services.apiGatewayRestApi,
            relation: 'child',
            field: 'apiGatewayRestApi',
          })
        }
      }
    }

    /**
     * Find related EFS file systems
     */
    const efsFileSystems: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.efs)
    if (efsFileSystems?.data?.[region]) {
      const dataAtRegion: RawAwsEfs[] = findServiceInstancesWithTag(
        tag,
        efsFileSystems.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { FileSystemArn: id } = instance

          connections.push({
            id,
            resourceType: services.efs,
            relation: 'child',
            field: 'efs',
          })
        }
      }
    }

    /**
     * Find related API Gateway Stage
     */
    const apiGatewayStage: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.apiGatewayStage)
    if (apiGatewayStage?.data?.[region]) {
      const dataAtRegion: RawAwsApiGatewayStage[] = findServiceInstancesWithTag(
        tag,
        apiGatewayStage.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { stageName: name, restApiId } = instance

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
      }
    }

    /**
     * Find related ElastiCache clusters
     */
    const elastiCacheCluster: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.elastiCacheCluster)
    if (elastiCacheCluster?.data?.[region]) {
      const dataAtRegion: RawAwsElastiCacheCluster[] =
        findServiceInstancesWithTag(tag, elastiCacheCluster.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { ARN: arn } = instance
          connections.push({
            id: arn,
            resourceType: services.elastiCacheCluster,
            relation: 'child',
            field: 'elastiCacheCluster',
          })
        }
      }
    }

    /**
     * Find related ElastiCache replication groups
     */
    const elastiCacheReplicationGroup: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.elastiCacheReplicationGroup)
    if (elastiCacheReplicationGroup?.data?.[region]) {
      const dataAtRegion: RawAwsElastiCacheReplicationGroup[] =
        findServiceInstancesWithTag(
          tag,
          elastiCacheReplicationGroup.data[region]
        )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { ARN: arn } = instance
          connections.push({
            id: arn,
            resourceType: services.elastiCacheReplicationGroup,
            relation: 'child',
            field: 'elastiCacheReplicationGroup',
          })
        }
      }
    }

    /**
     * Find related Cloud9 environments
     */
    const cloud9Environment: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.cloud9)
    if (cloud9Environment?.data?.[region]) {
      const dataAtRegion: RawAwsCloud9Environment[] =
        findServiceInstancesWithTag(tag, cloud9Environment.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { arn } = instance
          connections.push({
            id: arn,
            resourceType: services.cloud9,
            relation: 'child',
            field: 'cloud9Environment',
          })
        }
      }
    }

    /**
     * Find related systemsManagerDocuments
     */
    const ssmDocuments: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.systemsManagerDocument)
    if (ssmDocuments?.data?.[region]) {
      const dataAtRegion: RawAwsSystemsManagerDocument[] =
        findServiceInstancesWithTag(tag, ssmDocuments.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { Name, region, accountId } = instance
          const arn = ssmDocumentArn({ region, name: Name, account: accountId })
          connections.push({
            id: arn,
            resourceType: services.systemsManagerDocument,
            relation: 'child',
            field: 'systemsManagerDocuments',
          })
        }
      }
    }

    /**
     * Find related Customer Gateways
     */
    const customerGateways: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.customerGateway)
    if (customerGateways?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        customerGateways.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { CustomerGatewayId: id }: CustomerGateway = instance

          connections.push({
            id,
            resourceType: services.customerGateway,
            relation: 'child',
            field: 'customerGateway',
          })
        }
      }
    }

    /**
     * Find related Transit Gateways
     */
    const transitGateways: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.transitGateway)
    if (transitGateways?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        transitGateways.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { TransitGatewayId: id }: TransitGateway = instance

          connections.push({
            id,
            resourceType: services.transitGateway,
            relation: 'child',
            field: 'transitGateway',
          })
        }
      }
    }

    /**
     * Find related Vpn Gateways
     */
    const vpnGateways: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.vpnGateway)
    if (vpnGateways?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        vpnGateways.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { VpnGatewayId: id }: VpnGateway = instance

          connections.push({
            id,
            resourceType: services.vpnGateway,
            relation: 'child',
            field: 'vpnGateway',
          })
        }
      }
    }

    /**
     * Find related Client vpn endpoints
     */
    const clientVpnEndpoints: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.clientVpnEndpoint)
    if (clientVpnEndpoints?.data?.[region]) {
      const dataAtRegion: RawAwsClientVpnEndpoint[] =
        findServiceInstancesWithTag(tag, clientVpnEndpoints.data[region])
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { ClientVpnEndpointId } = instance
          connections.push({
            id: ClientVpnEndpointId,
            resourceType: services.clientVpnEndpoint,
            relation: 'child',
            field: 'clientVpnEndpoint',
          })
        }
      }
    }

    /**
     * Find related Vpn Connection
     */
    const vpnConnections: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.vpnConnection)
    if (vpnConnections?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        vpnConnections.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { VpnConnectionId: id }: VpnConnection = instance

          connections.push({
            id,
            resourceType: services.vpnConnection,
            relation: 'child',
            field: 'vpnConnection',
          })
        }
      }
    }

    /**
     * Find related Transit Gateway Attachments
     */
    const transitGatewayAttachments: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.transitGatewayAttachment)
    if (transitGatewayAttachments?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        transitGatewayAttachments.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { TransitGatewayAttachmentId: id }: TransitGatewayAttachment =
            instance

          connections.push({
            id,
            resourceType: services.transitGatewayAttachment,
            relation: 'child',
            field: 'transitGatewayAttachment',
          })
        }
      }
    }

    /**
     * Find related IAM Instance Profiles
     */
    const iamInstanceProfiles: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.iamInstanceProfile)
    if (iamInstanceProfiles?.data?.[globalRegionName]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        iamInstanceProfiles.data[globalRegionName]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { InstanceProfileId: id }: RawAwsInstanceProfile = instance

          connections.push({
            id,
            resourceType: services.iamInstanceProfile,
            relation: 'child',
            field: 'iamInstanceProfiles',
          })
        }
      }
    }

    /**
     * Find related IAM Analyzers
     */
    const iamAnalyzers: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.iamAccessAnalyzer)
    if (iamAnalyzers?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        iamAnalyzers.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { arn: id }: RawAwsAnalyzerSummary = instance

          connections.push({
            id,
            resourceType: services.iamAccessAnalyzer,
            relation: 'child',
            field: 'iamAccessAnalyzers',
          })
        }
      }
    }

    /**
     * Find related API Gateway Http Apis
     */
    const httpApis: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.apiGatewayHttpApi)
    if (httpApis?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        httpApis.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { ApiId: id }: RawAwsApiGatewayHttpApi = instance

          connections.push({
            id,
            resourceType: services.apiGatewayHttpApi,
            relation: 'child',
            field: 'apiGatewayHttpApi',
          })
        }
      }
    }

    /**
     * Find related API Gateway Domain Names
     */
    const domainNames: {
      name: string
      data: { [property: string]: any[] }
    } = data.find(({ name }) => name === services.apiGatewayDomainName)
    if (domainNames?.data?.[region]) {
      const dataAtRegion = findServiceInstancesWithTag(
        tag,
        domainNames.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
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
      }
    }

    /**
     * Find related Managed Prefix Lists
     */
     const managedPrefixLists: {
      name: string
      data: { [property: string]: RawAwsManagedPrefixList[] }
    } = data.find(({ name }) => name === services.managedPrefixList)
    if (managedPrefixLists?.data?.[region]) {
      const dataAtRegion: RawAwsManagedPrefixList[] = findServiceInstancesWithTag(
        tag,
        managedPrefixLists.data[region]
      )
      if (!isEmpty(dataAtRegion)) {
        for (const instance of dataAtRegion) {
          const { PrefixListId: id }: RawAwsManagedPrefixList = instance

          connections.push({
            id,
            resourceType: services.managedPrefixList,
            relation: 'child',
            field: 'managedPrefixLists',
          })
        }
      }
    }
  }

  const tagResult = {
    [tag.id]: connections,
  }
  return tagResult
}
