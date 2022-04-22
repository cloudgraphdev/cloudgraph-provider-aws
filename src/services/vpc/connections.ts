import { intersectStringArrays, ServiceConnection } from '@cloudgraph/sdk'

import {
  Address,
  Instance,
  InternetGateway,
  NatGateway,
  NetworkInterface,
  SecurityGroup,
  Vpc,
} from 'aws-sdk/clients/ec2'

import { DBInstance } from 'aws-sdk/clients/rds'
import { LoadBalancer } from 'aws-sdk/clients/elbv2'
import { FunctionConfiguration } from 'aws-sdk/clients/lambda'
import { LoadBalancerDescription } from 'aws-sdk/clients/elb'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawFlowLog } from '../flowLogs/data'
import { RawAwsEcsService } from '../ecsService/data'
import { RawAwsElasticSearchDomain } from '../elasticSearchDomain/data'
import { RawAwsDmsReplicationInstance } from '../dmsReplicationInstance/data'
import { RawAwsRdsClusterSnapshot } from '../rdsClusterSnapshot/data'
import { RawAwsEksCluster } from '../eksCluster/data'
import { RawAwsNetworkAcl } from '../nacl/data'
import { elbArn } from '../../utils/generateArns'

/**
 * VPCs
 */

export default ({
  account,
  service: vpc,
  data,
  region,
}: {
  account: string
  service: Vpc
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { VpcId: id }: Vpc = vpc
  const connections: ServiceConnection[] = []
  const ec2s = data.find(({ name }) => name === services.ec2Instance)
  const ec2sRunningInVpc =
    ec2s?.data?.[region]?.filter(({ VpcId }: Instance) => VpcId === id) || []
  const ec2InstancesIdsRunningInVpc =
    ec2sRunningInVpc?.map(ec2 => ec2.InstanceId) || []
  const sgs = data.find(({ name }) => name === services.sg)
  const sgIds =
    sgs?.data?.[region]?.map(({ GroupId }: SecurityGroup) => GroupId) || []
  const subnets = data.find(({ name }) => name === services.subnet)
  const subnetIds =
    subnets?.data?.[region]?.map(({ SubnetId }: RawAwsSubnet) => SubnetId) || []

  /**
   * Find any ALB Instances
   */
  const albInstances = data.find(({ name }) => name === services.alb)
  if (albInstances?.data?.[region]) {
    const dataAtRegion: LoadBalancer[] = albInstances.data[region].filter(
      ({ VpcId: vpcId }: LoadBalancer) => vpcId === id
    )
    for (const instance of dataAtRegion) {
      connections.push({
        id: instance.LoadBalancerArn,
        resourceType: services.alb,
        relation: 'child',
        field: 'albs',
      })
    }
  }

  /**
   * Find any DMS replication instance related data
   */
  const replications = data.find(
    ({ name }) => name === services.dmsReplicationInstance
  )
  if (replications?.data?.[region]) {
    const dataAtRegion: RawAwsDmsReplicationInstance[] = replications.data[
      region
    ].filter(
      ({ ReplicationSubnetGroup = {} }: RawAwsDmsReplicationInstance) => {
        const vpcId = ReplicationSubnetGroup.VpcId
        return id === vpcId
      }
    )

    for (const instance of dataAtRegion) {
      connections.push({
        id: instance.ReplicationInstanceArn,
        resourceType: services.dmsReplicationInstance,
        relation: 'child',
        field: 'dmsReplicationInstances',
      })
    }
  }

  /**
   * Find any ECS service related data
   */
  const ecsServices = data.find(({ name }) => name === services.ecsService)
  if (ecsServices?.data?.[region]) {
    const dataAtRegion: RawAwsEcsService[] = ecsServices.data[region].filter(
      ({ networkConfiguration }) => {
        const sgIds =
          networkConfiguration?.awsvpcConfiguration?.securityGroups || []
        return sgIds.includes(id)
      }
    )

    for (const instance of dataAtRegion) {
      connections.push({
        id: instance.serviceArn,
        resourceType: services.ecsService,
        relation: 'child',
        field: 'ecsServices',
      })
    }
  }
  /**
   * Find any EIP related data
   */
  const eips = data.find(({ name }) => name === services.eip)
  if (eips?.data?.[region]) {
    const dataAtRegion: Address[] = eips.data[region].filter(
      ({ Domain, InstanceId }: Address) =>
        Domain === 'vpc' && ec2InstancesIdsRunningInVpc?.includes(InstanceId)
    )
    for (const eip of dataAtRegion) {
      connections.push({
        id: eip.AllocationId,
        resourceType: services.eip,
        relation: 'child',
        field: 'eips',
      })
    }
  }

  /**
   * Find any elasticSearchDomain related data
   */
  const domains = data.find(({ name }) => name === services.elasticSearchDomain)
  if (domains?.data?.[region]) {
    const dataAtRegion: RawAwsElasticSearchDomain[] = domains.data[
      region
    ].filter(({ VPCOptions }) => VPCOptions.VPCId === id)

    for (const domain of dataAtRegion) {
      connections.push({
        id: domain.DomainId,
        resourceType: services.elasticSearchDomain,
        relation: 'child',
        field: 'elasticSearchDomains',
      })
    }
  }

  /**
   * Find any EKS cluster related data
   */
  const eksClusters = data.find(({ name }) => name === services.eksCluster)
  if (eksClusters?.data?.[region]) {
    const dataAtRegion: RawAwsEksCluster[] = eksClusters.data[region].filter(
      ({ resourcesVpcConfig: { vpcId } }: RawAwsEksCluster) => vpcId === id
    )
    for (const eksCluster of dataAtRegion) {
      connections.push({
        id: eksCluster.arn,
        resourceType: services.eksCluster,
        relation: 'child',
        field: 'eksClusters',
      })
    }
  }

  /**
   * Find any FlowLog related data
   */
  const flowLogs = data.find(({ name }) => name === services.flowLog)
  if (flowLogs?.data?.[region]) {
    const dataAtRegion: RawFlowLog[] = flowLogs.data[region].filter(
      ({ ResourceId }: RawFlowLog) => ResourceId === id
    )
    for (const flowLog of dataAtRegion) {
      connections.push({
        id: flowLog.FlowLogId,
        resourceType: services.flowLog,
        relation: 'child',
        field: 'flowLog',
      })
    }
  }

  /**
   * Find any IGW related data
   */
  const igws = data.find(({ name }) => name === services.igw)
  if (igws?.data?.[region]) {
    const dataAtRegion: InternetGateway[] = igws.data[region].filter(
      ({ Attachments }: InternetGateway) =>
        Attachments.find(({ VpcId }) => VpcId === id)
    )
    for (const igw of dataAtRegion) {
      connections.push({
        id: igw.InternetGatewayId,
        resourceType: services.igw,
        relation: 'child',
        field: 'igws',
      })
    }
  }

  /**
   * Find any Lambda related data
   */
  const lambdas = data.find(({ name }) => name === services.lambda)
  if (lambdas?.data?.[region]) {
    const dataAtRegion: FunctionConfiguration[] = lambdas.data[region].filter(
      ({
        VpcConfig: { VpcId, SecurityGroupIds, SubnetIds } = {},
      }: FunctionConfiguration) => {
        return (
          VpcId === id ||
          intersectStringArrays(sgIds, SecurityGroupIds).length > 0 ||
          intersectStringArrays(subnetIds, SubnetIds).length > 0
        )
      }
    )
    for (const lambda of dataAtRegion) {
      connections.push({
        id: lambda.FunctionArn,
        resourceType: services.lambda,
        relation: 'child',
        field: 'lambdas',
      })
    }
  }

  /**
   * Find any NAT related data
   */
  const nats = data.find(({ name }) => name === services.nat)
  if (nats?.data?.[region]) {
    const dataAtRegion: NatGateway[] = nats.data[region].filter(
      ({ VpcId, SubnetId }: NatGateway) =>
        VpcId === id || subnetIds.includes(SubnetId)
    )
    for (const nat of dataAtRegion) {
      connections.push({
        id: nat.NatGatewayId,
        resourceType: services.nat,
        relation: 'child',
        field: 'natGateways',
      })
    }
  }

  /**
   * Find any Network Interface related data
   */
  const netInterfaces = data.find(
    ({ name }) => name === services.networkInterface
  )
  if (netInterfaces?.data?.[region]) {
    const dataAtRegion: NetworkInterface[] = netInterfaces.data[region].filter(
      ({ VpcId, SubnetId }: NetworkInterface) =>
        VpcId === id || subnetIds.includes(SubnetId)
    )
    for (const net of dataAtRegion) {
      connections.push({
        id: net.NetworkInterfaceId,
        resourceType: services.networkInterface,
        relation: 'child',
        field: 'networkInterfaces',
      })
    }
  }

  /**
   * Find any RDS Instance related data
   */
  const rdsDbInstances = data.find(
    ({ name }) => name === services.rdsDbInstance
  )
  if (rdsDbInstances?.data?.[region] && sgs?.data?.[region]) {
    const dataAtRegion: DBInstance[] = rdsDbInstances.data[region].filter(
      ({ DBSubnetGroup: { VpcId } = {} }: DBInstance) => VpcId === id
    )

    for (const rds of dataAtRegion) {
      connections.push({
        id: rds.DBInstanceArn,
        resourceType: services.rdsDbInstance,
        relation: 'child',
        field: 'rdsDbInstances',
      })
    }
  }

  /**
   * Find any RDS Cluster Snapshot related data
   */
  const snapshots = data.find(
    ({ name }) => name === services.rdsClusterSnapshot
  )
  if (snapshots?.data?.[region]) {
    const dataAtRegion: RawAwsRdsClusterSnapshot[] = snapshots.data[
      region
    ].filter(({ VpcId }: RawAwsRdsClusterSnapshot) => VpcId === id)

    for (const snapshot of dataAtRegion) {
      connections.push({
        id: snapshot.DBClusterSnapshotIdentifier,
        resourceType: services.rdsClusterSnapshot,
        relation: 'child',
        field: 'rdsClusterSnapshots',
      })
    }
  }

  /**
   * Find any Subnet related data
   */
  if (subnets?.data?.[region]) {
    const dataAtRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ VpcId }: RawAwsSubnet) => VpcId === id
    )
    for (const subnet of dataAtRegion) {
      connections.push({
        id: subnet.SubnetId,
        resourceType: services.subnet,
        relation: 'child',
        field: 'subnets',
      })
    }
  }

  /**
   * Find any ELB Instances
   */
  const elbInstances = data.find(({ name }) => name === services.elb)
  if (elbInstances?.data?.[region]) {
    const dataAtRegion: LoadBalancerDescription[] = elbInstances.data[
      region
    ].filter(({ VPCId: vpcId }: LoadBalancerDescription) => vpcId === id)
    for (const instance of dataAtRegion) {
      const { LoadBalancerName: loadBalancerName }: LoadBalancerDescription =
        instance
      connections.push({
        id: elbArn({ region, account, name: loadBalancerName }),
        resourceType: services.elb,
        relation: 'child',
        field: 'elbs',
      })
    }
  }

  /**
   * Find any Network ACL
   */
  const nacls: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.nacl)
  if (nacls?.data?.[region]) {
    const dataAtRegion: RawAwsNetworkAcl[] = nacls.data[region].filter(
      ({ VpcId: vpcId }: RawAwsNetworkAcl) => vpcId === id
    )
    for (const instance of dataAtRegion) {
      connections.push({
        id: instance.NetworkAclId,
        resourceType: services.nacl,
        relation: 'child',
        field: 'nacls',
      })
    }
  }

  const VpcResult = {
    [id]: connections,
  }
  return VpcResult
}
