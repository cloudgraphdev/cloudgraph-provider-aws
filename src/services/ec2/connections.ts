import isEmpty from 'lodash/isEmpty'

import {
  Address,
  IamInstanceProfile,
  Instance,
  SecurityGroup,
  TagList,
  Volume,
} from 'aws-sdk/clients/ec2'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsEcsContainer } from '../ecsContainer/data'

/**
 * EC2
 */

export default ({
  service: instance,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: Instance & {
    region: string
    DisableApiTermination?: boolean
    KeyPairName?: string
    Tags?: TagList
    IamInstanceProfile: IamInstanceProfile
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    InstanceId: id,
    SecurityGroups: instanceSecurityGroups = [],
    NetworkInterfaces: instanceNetworkInterfaces = [],
    SubnetId: subnetId,
  } = instance
  console.log('subnet id is:')
  console.log(subnetId)
  /**
   * Find Security Groups VPC Security Groups
   * related to this EC2 instance
   */
  const securityGroups: {
    name: string
    data: { [property: string]: SecurityGroup[] }
  } = data.find(({ name }) => name === services.sg)
  const sgIds = instanceSecurityGroups.map(({ GroupId }) => GroupId)

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
   * Find EBS volumes
   * related to this EC2 instance
   */
  const ebsVolumes: {
    name: string
    data: { [property: string]: (Volume & { region: string })[] }
  } = data.find(({ name }) => name === services.ebs)

  if (ebsVolumes?.data?.[region]) {
    const volumesInRegion = ebsVolumes.data[region].filter(
      ({ Attachments: attachments }) =>
        attachments.find(({ InstanceId }) => InstanceId === id)
    )

    if (!isEmpty(volumesInRegion)) {
      for (const v of volumesInRegion) {
        connections.push({
          id: v.VolumeId,
          resourceType: services.ebs,
          relation: 'child',
          field: 'ebs',
        })
      }
    }
  }

  /**
   * Find Elastic IPs
   * related to this EC2 instance
   */
  const eips: {
    name: string
    data: {
      [property: string]: (Address & { region: string })[]
    }
  } = data.find(({ name }) => name === services.eip)

  if (eips?.data?.[region]) {
    const eipsInRegion = eips.data[region].filter(
      ({ InstanceId }) => InstanceId === id
    )

    if (!isEmpty(eipsInRegion)) {
      for (const eip of eipsInRegion) {
        connections.push({
          id: eip.AllocationId,
          resourceType: services.eip,
          relation: 'child',
          field: 'eip',
        })
      }
    }
  }

  /**
   * Find Network interfaces
   * related to this EC2 instance
   */
  const networkInterfaces: {
    name: string
    data: {
      [property: string]: (Address & { region: string })[]
    }
  } = data.find(({ name }) => name === services.networkInterface)
  const networkInterfacesIds = instanceNetworkInterfaces.map(
    ({ NetworkInterfaceId }) => NetworkInterfaceId
  )

  if (
    networkInterfaces?.data?.[region] ||
    instanceNetworkInterfaces.length > 0
  ) {
    // Check for matching network interfaces in existing data
    const networkInterfacesInRegion = (
      networkInterfaces?.data[region] || []
    ).filter(({ NetworkInterfaceId }) =>
      networkInterfacesIds.includes(NetworkInterfaceId)
    )

    const attachedNetworkInterfaces =
      networkInterfacesInRegion.length > 0
        ? networkInterfacesInRegion
        : instanceNetworkInterfaces

    if (!isEmpty(attachedNetworkInterfaces)) {
      for (const networkInterface of instanceNetworkInterfaces) {
        connections.push({
          id: networkInterface.NetworkInterfaceId,
          resourceType: services.networkInterface,
          relation: 'child',
          field: 'networkInterfaces',
        })
      }
    }
  }

  /**
   * Find Subnets
   * related to this EC2 load balancer
   */
  const subnets: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId }: RawAwsSubnet) => subnetId === SubnetId
    )
    console.log('subnets in region')
    console.log(subnetsInRegion)
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
   * Find EKS
   * related to this EC2 loadbalancer
   */
  // TODO: Implement when eks service is ready

  /**
   * Find ECS Container
   * related to this EC2 loadbalancer
   */
  const ecsContainers: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.ecsContainer)
  if (ecsContainers?.data?.[region]) {
    const containersInRegion: RawAwsEcsContainer[] = ecsContainers.data[region].filter(
      ({ ec2InstanceId }) => ec2InstanceId === id
    )

    if (!isEmpty(containersInRegion)) {
      for (const container of containersInRegion) {
        connections.push({
          id: container.containerInstanceArn,
          resourceType: services.ecsContainer,
          relation: 'child',
          field: 'ecsContainer',
        })
      }
    }
  }

  /**
   * Find Elastic Beanstalk
   * related to this EC2 loadbalancer
   */
  // TODO: Implement when eb service is ready

  const ec2Result = {
    [id]: connections,
  }
  return ec2Result
}
