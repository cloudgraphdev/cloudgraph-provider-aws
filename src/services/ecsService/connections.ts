import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { SecurityGroup } from 'aws-sdk/clients/ec2'
import { RawAwsEcsService } from '../ecsService/data'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsElb } from '../elb/data'
import { RawAwsEcsCluster } from '../ecsCluster/data'
import { RawAwsEcsTaskSet } from '../ecsTaskSet/data'
import { RawAwsEcsTaskDefinition } from '../ecsTaskDefinition/data'
import services from '../../enums/services'
import { elbArn } from '../../utils/generateArns'

export default ({
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
  const sgIds =
    service?.networkConfiguration?.awsvpcConfiguration?.securityGroups
  const subnetIds = service?.networkConfiguration?.awsvpcConfiguration?.subnets
  const elbNames = service?.loadBalancers?.map(
    ({ loadBalancerName }) => loadBalancerName
  )
  const taskSetArns = service?.taskSets?.map(({ taskSetArn }) => taskSetArn)

  /**
   * Find Security Groups
   */
  const securityGroups: {
    name: string
    data: { [property: string]: SecurityGroup[] }
  } = data.find(({ name }) => name === services.sg)

  if (securityGroups?.data?.[region]) {
    const sgsInRegion: SecurityGroup[] = securityGroups.data[region].filter(
      ({ GroupId }: SecurityGroup) => sgIds?.includes(GroupId)
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
   * Find Subnets AND vpcs
   */
  const subnets: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId }: RawAwsSubnet) => subnetIds?.includes(SubnetId)
    )
    const vpcsFound = []
    if (!isEmpty(subnetsInRegion)) {
      for (const subnet of subnetsInRegion) {
        connections.push({
          id: subnet.SubnetId,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnet',
        })
        if (!vpcsFound.includes(subnet.VpcId)) {
          connections.push({
            id: subnet.VpcId,
            resourceType: services.vpc,
            relation: 'child',
            field: 'vpc',
          })
        }
      }
    }
  }

  /**
   * Find related ELB
   */
  const elbs: { name: string; data: { [property: string]: any[] } } = data.find(
    ({ name }) => name === services.elb
  )
  if (elbs?.data?.[region]) {
    const dataAtRegion: RawAwsElb[] = elbs.data[region].filter(
      ({ LoadBalancerName }: RawAwsElb) => elbNames?.includes(LoadBalancerName)
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const {
          LoadBalancerName: loadBalancerName,
          region: elbRegion,
          account: elbAccount,
        } = instance
        connections.push({
          id: elbArn({
            region: elbRegion,
            account: elbAccount,
            name: loadBalancerName,
          }),
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

  /**
   * Find related ECS task set
   */
  const ecsTaskSets: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.ecsTaskSet)
  if (ecsTaskSets?.data?.[region]) {
    const dataAtRegion: RawAwsEcsTaskSet[] = ecsTaskSets.data[region].filter(
      ({ taskSetArn }: RawAwsEcsTaskSet) => taskSetArns.includes(taskSetArn)
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        connections.push({
          id: instance.taskSetArn,
          resourceType: services.ecsTaskSet,
          relation: 'child',
          field: 'ecsTaskSet',
        })
      }
    }
  }

  /**
   * Find related ECS task definition
   */
  const ecsTaskDefinitions: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.ecsTaskDefinition)
  if (ecsTaskDefinitions?.data?.[region]) {
    const dataAtRegion: RawAwsEcsTaskDefinition[] = ecsTaskDefinitions.data[
      region
    ].filter(
      ({ taskDefinitionArn }: RawAwsEcsTaskDefinition) =>
        taskDefinitionArn === service.taskDefinition
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        connections.push({
          id: instance.taskDefinitionArn,
          resourceType: services.ecsTaskDefinition,
          relation: 'child',
          field: 'ecsTaskDefinition',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
