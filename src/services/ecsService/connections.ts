import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { SecurityGroup } from 'aws-sdk/clients/ec2'
import { RawAwsEcsService } from '../ecsService/data'
import { RawAwsSubnet } from '../subnet/data' 
import { RawAwsVpc } from '../vpc/data'
import { RawAwsElb } from '../elb/data'
import { RawAwsEcsCluster } from '../ecsCluster/data'
import services from '../../enums/services'

export default ({
  account,
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsEcsService
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { serviceArn: id } = service
  const connections: ServiceConnection[] = []
  const sgIds = service?.networkConfiguration?.awsvpcConfiguration?.securityGroups
  const subnetIds = service?.networkConfiguration?.awsvpcConfiguration?.subnets
  const elbNames = service?.loadBalancers?.map(({loadBalancerName}) => loadBalancerName)

  /**
   * Find Security Groups 
   */
  const securityGroups: {
    name: string
    data: { [property: string]: SecurityGroup[] }
  } = data.find(({ name }) => name === services.sg)

  if (securityGroups?.data?.[region]) {
    const sgsInRegion: SecurityGroup[] = securityGroups.data[region].filter(
      ({ GroupId }: SecurityGroup) => sgIds.includes(GroupId)
    )

    if (!isEmpty(sgsInRegion)) {
      for (const sg of sgsInRegion) {
        connections.push({
          id: sg.GroupId,
          resourceType: services.sg,
          relation: 'child',
          field: 'securityGroups',
        })
      }
    }
  }

  /**
   * Find Subnets
   */
  const subnets: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId }: RawAwsSubnet) => subnetIds.includes(SubnetId)
    )

    if (!isEmpty(subnetsInRegion)) {
      for (const subnet of subnetsInRegion) {
        connections.push({
          id: subnet.SubnetId,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnet',
        })
      }
    }
  }

  /**
   * Find VPCs
   */
  const vpcs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.vpc)

  const vpcsInRegion: RawAwsVpc[] = vpcs.data[region].filter(
    ({ VpcId }: SecurityGroup) => sgIds.includes(VpcId)
  )

  if (!isEmpty(vpcsInRegion)) {
    for (const vpc of vpcsInRegion) {
      connections.push({
        id: vpc.VpcId,
        resourceType: services.vpc,
        relation: 'child',
        field: 'vpc',
      })
    }
  }

  /**
   * Find related ELB
   */
  const elbs: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.elb)
  if (elbs?.data?.[region]) {
    const dataAtRegion: RawAwsElb[] = elbs.data[region].filter(
      ({ LoadBalancerName }: RawAwsElb) => elbNames.includes(LoadBalancerName)
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { LoadBalancerName: id } = instance

        connections.push({
          id,
          resourceType: services.elb,
          relation: 'child',
          field: 'elb',
        })
      }
    }
  }

  /**
   * Find related ECS cluster
   */
  const ecsClusters: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.ecsCluster)
  if (ecsClusters?.data?.[region]) {
    const dataAtRegion: RawAwsEcsCluster[] = ecsClusters.data[region].filter(
      ({ clusterArn }: RawAwsEcsCluster) => clusterArn === service.clusterArn
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        connections.push({
          id: instance.clusterArn,
          resourceType: services.ecsCluster,
          relation: 'child',
          field: 'ecsCluster',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
