import { ServiceConnection } from '@cloudgraph/sdk'

import {
  Address,
  Instance,
  InternetGateway,
  NatGateway,
  NetworkInterface,
  // NetworkAcl, // TODO: Uncomment when adding NACL
  SecurityGroup,
  // Subnet,
  Vpc,
} from 'aws-sdk/clients/ec2'
// import { Cluster } from 'aws-sdk/clients/eks' // TODO: Uncomment when adding EKS
import { DBInstance } from 'aws-sdk/clients/rds'
import { LoadBalancer } from 'aws-sdk/clients/elbv2'
import { FunctionConfiguration } from 'aws-sdk/clients/lambda'
// import { LoadBalancerDescription } from 'aws-sdk/clients/elb' // TODO: Uncomment when adding ELB

import services from '../../enums/services'
import { intersectStringArrays } from '../../utils/index'
import { RawAwsSubnet } from '../subnet/data'
/**
 * ALBs
 */

export default ({
  service: vpc,
  data,
  region,
}: {
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
  // TODO: Implement when Subnet service is fully ready
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
        id: instance.LoadBalancerName,
        resourceType: services.alb,
        relation: 'child',
        field: 'alb',
      })
    }
  }
  /**
   * Find any ECS related data
   */
  // TODO: Add this when adding the ECS
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
        field: 'eip',
      })
    }
  }
  /**
   * Find any EKS related data
   */
  // TODO: Uncomment and check if arn is the correct id when adding EKS
  // const eksS = data.find(({ name }) => name === services.eks)
  // if (eksS?.data?.[region]) {
  //   const dataAtRegion: Cluster[] = eksS.data[region].filter(
  //     ({ resourcesVpcConfig: { vpcId } }: Cluster) => vpcId === id
  //   )
  //   for (const eks of dataAtRegion) {
  //     connections.push({
  //       id: eks.arn,
  //       resourceType: services.eks,
  //       relation: 'child',
  //       field: 'eks',
  //     })
  //   }
  // }
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
        field: 'igw',
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
        field: 'lambda',
      })
    }
  }
  /**
   * Find any NAT related data
   */
  const nats = data.find(({ name }) => name === services.nat)
  if (nats?.data?.[region]) {
    const dataAtRegion: NatGateway[] = nats.data[region].filter(
      // TODO: Implement when Subnet service is fully ready
      ({ VpcId /* , SubnetId */ }: NatGateway) => VpcId === id // || subnetIds.includes(SubnetId)
    )
    for (const nat of dataAtRegion) {
      connections.push({
        id: nat.NatGatewayId,
        resourceType: services.nat,
        relation: 'child',
        field: 'natGateway',
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
      // TODO: Implement when Subnet service is fully ready
      ({ VpcId /* , SubnetId */ }: NetworkInterface) => VpcId === id // || subnetIds.includes(SubnetId)
    )
    for (const net of dataAtRegion) {
      connections.push({
        id: net.NetworkInterfaceId,
        resourceType: services.networkInterface,
        relation: 'child',
        field: 'networkInterface',
      })
    }
  }
  /**
   * Find any RDS related data
   */
  const rdsDBInstances = data.find(({ name }) => name === services.rdsDBInstance)
  if (rdsDBInstances?.data?.[region] && sgs?.data?.[region]) {
    const dataAtRegion: DBInstance[] = rdsDBInstances.data[region]
      .filter(({ DBSubnetGroup }) => DBSubnetGroup.VpcId === id)

    for (const rds of dataAtRegion) {
      connections.push({
        id: rds.DBInstanceArn,
        resourceType: services.rdsDBInstance,
        relation: 'child',
        field: 'rdsDBInstance',
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
        field: 'subnet',
      })
    }
  }
  const VpcResult = {
    [id]: connections,
  }
  return VpcResult
}
