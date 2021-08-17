import { ServiceConnection } from '@cloudgraph/sdk'

import {
  Address,
  Instance,
  InternetGateway,
  // NatGateway,
  // NetworkAcl, // TODO: Uncomment when adding NACL
  SecurityGroup,
  // Subnet,
  Vpc,
} from 'aws-sdk/clients/ec2'
// import { Cluster } from 'aws-sdk/clients/eks' // TODO: Uncomment when adding EKS
// import { DBCluster } from 'aws-sdk/clients/rds' // TODO: Uncomment when adding RDS
import { LoadBalancer } from 'aws-sdk/clients/elbv2'
import { FunctionConfiguration } from 'aws-sdk/clients/lambda'
// import { LoadBalancerDescription } from 'aws-sdk/clients/elb' // TODO: Uncomment when adding ELB

import services from '../../enums/services'
import { intersectStringArrays } from '../../utils/index'
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
  // const subnets = data.find(({ name }) => name === services.subnet)
  // const subnetIds =
  //   subnets?.data?.[region]?.map(({ SubnetId }: Subnet) => SubnetId) || []

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
        field: 'alb',
      })
    }
  }
  /**
   * Find any ECS data
   */
  // TODO: Add this when adding the ECS
  /**
   * Find any EIP data
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
   * Find any EKS data
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
   * Find any ELB data
   */
  // TODO: Uncomment and check if LoadBalancerName is the id when adding ELB
  // const elbs = data.find(({ name }) => name === services.elb)
  // if (elbs?.data?.[region]) {
  //   const dataAtRegion: LoadBalancerDescription[] = elbs.data[region].filter(
  //     ({ VPCId }: LoadBalancerDescription) => VPCId === id
  //   )
  //   for (const elb of dataAtRegion) {
  //     connections.push({
  //       id: elb.LoadBalancerName,
  //       resourceType: services.eks,
  //       relation: 'child',
  //       field: 'elb',
  //     })
  //   }
  // }
  /**
   * Find any IGW data
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
   * Find any Lambda data
   */
  const lambdas = data.find(({ name }) => name === services.lambda)
  if (lambdas?.data?.[region]) {
    const dataAtRegion: FunctionConfiguration[] = lambdas.data[region].filter(
      ({
        // VpcConfig: { VpcId, SecurityGroupIds, SubnetIds } = {},
        VpcConfig: { VpcId, SecurityGroupIds } = {},
      }: FunctionConfiguration) => {
        // TODO: Implement when Subnet service is fully ready
        // return (
        //   VpcId === id ||
        //   intersectStringArrays(sgIds, SecurityGroupIds).length > 0 ||
        //   intersectStringArrays(subnetIds, SubnetIds).length > 0
        // )
        return (
          VpcId === id ||
          intersectStringArrays(sgIds, SecurityGroupIds).length > 0
        )
      }
    )
    for (const lambda of dataAtRegion) {
      connections.push({
        id: lambda.FunctionName,
        resourceType: services.lambda,
        relation: 'child',
        field: 'lambda',
      })
    }
  }
  /**
   * Find any NACL data
   */
  // TODO: Uncomment and check this for correctness after NACL is added
  // const nacls = data.find(({ name }) => name === services.nacl)
  // if (nacls?.data?.[region]) {
  //   const dataAtRegion: NetworkAcl[] = nacls.data[region].filter(
  //     ({ VpcId }: NetworkAcl) => VpcId === id
  //   )
  //   for (const nacl of dataAtRegion) {
  //     connections.push({
  //       id: nacl.NetworkAclId,
  //       resourceType: services.lambda,
  //       relation: 'child',
  //       field: 'nacl',
  //     })
  //   }
  // }
  /**
   * Find any NAT data // TODO: Enable when NAT is available
   */
  // const nats = data.find(({ name }) => name === services.nat)
  // if (nats?.data?.[region]) {
  //   const dataAtRegion: NatGateway[] = nats.data[region].filter(
  //     ({ VpcId, SubnetId }: NatGateway) =>
  //       VpcId === id || subnetIds.includes(SubnetId)
  //   )
  //   for (const nat of dataAtRegion) {
  //     connections.push({
  //       id: nat.NatGatewayId,
  //       resourceType: services.nat,
  //       relation: 'child',
  //       field: 'nat',
  //     })
  //   }
  // }
  /**
   * Find any RDS data
   */
  // TODO: Uncomment and check this for correctness after RDS and SG are added
  // const rdsS = data.find(({ name }) => name === services.rds)
  // const sgs = data.find(({ name }) => name === services.sg)
  // if (rdsS?.data?.[region] && sgs?.data?.[region]) {
  //   const sgIdsForVpc: string[] = rdsS.data[region]
  //     .filter(({ VpcId }: SecurityGroup) => VpcId === id)
  //     .map(({ GroupId }) => GroupId)
  //   const dataAtRegion: DBCluster[] = rdsS.data[region].filter(
  //     ({ VpcSecurityGroups }: DBCluster) =>
  //       VpcSecurityGroups.find(({ VpcSecurityGroupId }) =>
  //         sgIdsForVpc.includes(VpcSecurityGroupId)
  //       )
  //   )
  //   for (const rds of dataAtRegion) {
  //     connections.push({
  //       id: rds.DBClusterIdentifier,
  //       resourceType: services.rds,
  //       relation: 'child',
  //       field: 'rdsInstances',
  //     })
  //   }
  // }
  const VpcResult = {
    [id]: connections,
  }
  return VpcResult
}
