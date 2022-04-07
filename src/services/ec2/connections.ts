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
import { RawAwsSystemsManagerInstance } from '../systemsManagerInstance/data'
import { ssmManagedInstanceArn } from '../../utils/generateArns'
import { RawAwsElasticBeanstalkEnv } from '../elasticBeanstalkEnvironment/data'
import { RawAwsEksCluster } from '../eksCluster/data'
import { getEksClusterName, getElasticBeanstalkEnvId } from './utils'
import { RawAwsInstanceProfile } from '../iamInstanceProfile/data'
import { globalRegionName } from '../../enums/regions'
import { RawAwsIamRole } from '../iamRole/data'

/**
 * EC2
 */

export default ({
  service: instance,
  data,
  region,
  account,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: Instance & {
    region: string
    DisableApiTermination?: boolean
    KeyPairName?: string
    Tags?: TagList
    IamInstanceProfile: IamInstanceProfile
    IamRolesArn?: string[]
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    InstanceId: id,
    SecurityGroups: instanceSecurityGroups = [],
    NetworkInterfaces: instanceNetworkInterfaces = [],
    SubnetId: subnetId,
    Tags: tags,
    IamInstanceProfile: iamInstanceProfile,
    IamRolesArn: rolesArn,
  } = instance

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
   * related to this EC2
   */
  const subnets: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId }: RawAwsSubnet) => subnetId === SubnetId
    )

    if (!isEmpty(subnetsInRegion)) {
      for (const subnet of subnetsInRegion) {
        connections.push({
          id: subnet.SubnetId,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnets',
        })
      }
    }
  }

  /**
   * Find EKS cluster
   * related to this EC2
   */
  const eksClusterName = getEksClusterName(tags)
  const eksClusters: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.eksCluster)
  if (eksClusters?.data?.[region]) {
    const eksClustersInRegion: RawAwsEksCluster[] = eksClusters.data[
      region
    ].filter(({ name }: RawAwsEksCluster) => name === eksClusterName)

    if (!isEmpty(eksClustersInRegion)) {
      for (const eksCluster of eksClustersInRegion) {
        connections.push({
          id: eksCluster.arn,
          resourceType: services.eksCluster,
          relation: 'child',
          field: 'eksCluster',
        })
      }
    }
  }

  /**
   * Find ECS Container
   * related to this EC2
   */
  const ecsContainers: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.ecsContainer)
  if (ecsContainers?.data?.[region]) {
    const containersInRegion: RawAwsEcsContainer[] = ecsContainers.data[
      region
    ].filter(({ ec2InstanceId }) => ec2InstanceId === id)

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
   * Find SSM managed instances
   * related to this EC2 instance
   */
  const instances: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.systemsManagerInstance)
  if (instances?.data?.[region]) {
    const dataInRegion: RawAwsSystemsManagerInstance[] = instances.data[
      region
    ].filter(
      ({ InstanceId }: RawAwsSystemsManagerInstance) => InstanceId === id
    )

    if (!isEmpty(dataInRegion)) {
      for (const ssmInstance of dataInRegion) {
        const arn = ssmManagedInstanceArn({
          region,
          account,
          name: ssmInstance.InstanceId,
        })
        connections.push({
          id: arn,
          resourceType: services.systemsManagerInstance,
          relation: 'child',
          field: 'systemsManagerInstance',
        })
      }
    }
  }

  /**
   * Find Elastic Beanstalk
   * related to this EC2 instance
   */
  const elasticBeanstalkEnvId = getElasticBeanstalkEnvId(tags)
  const elasticBeanstalkEnvs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.elasticBeanstalkEnv)
  if (elasticBeanstalkEnvs?.data?.[region]) {
    const elasticBeanstalkEnvsInRegion: RawAwsElasticBeanstalkEnv[] =
      elasticBeanstalkEnvs.data[region].filter(
        ({ EnvironmentId }: RawAwsElasticBeanstalkEnv) =>
          elasticBeanstalkEnvId === EnvironmentId
      )

    if (!isEmpty(elasticBeanstalkEnvsInRegion)) {
      for (const elasticBeanstalkEnv of elasticBeanstalkEnvsInRegion) {
        connections.push({
          id: elasticBeanstalkEnv.EnvironmentId,
          resourceType: services.elasticBeanstalkEnv,
          relation: 'child',
          field: 'elasticBeanstalkEnv',
        })
      }
    }
  }

  /**
   * Find IAM Instance Profiles
   * related to this EC2 instance
   */
  const iamInstanceProfiles: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.iamInstanceProfile)
  if (iamInstanceProfiles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsInstanceProfile[] = iamInstanceProfiles.data[
      globalRegionName
    ].filter(instanceProfile => instanceProfile.Arn === iamInstanceProfile?.Arn)
    if (!isEmpty(dataAtRegion)) {
      for (const iamInstance of dataAtRegion) {
        const { InstanceProfileId: instanceProfileId }: RawAwsInstanceProfile = iamInstance

        connections.push({
          id: instanceProfileId,
          resourceType: services.iamInstanceProfile,
          relation: 'child',
          field: 'iamInstanceProfile',
        })
      }
    }
  }

  /**
   * Find IAM Roles
   * related to this EC2 instance
   */
   const roles: { name: string; data: { [property: string]: any[] } } =
     data.find(({ name }) => name === services.iamRole)
 
   if (roles?.data?.[globalRegionName]) {
     const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
       ({ Arn }: RawAwsIamRole) => rolesArn?.includes(Arn)
     )
     if (!isEmpty(dataAtRegion)) {
       for (const iamRole of dataAtRegion) {
         const { Arn: arn } :RawAwsIamRole = iamRole
 
         connections.push({
           id: arn,
           resourceType: services.iamRole,
           relation: 'child',
           field: 'iamRole',
         })
       }
     }
   }

  const ec2Result = {
    [id]: connections,
  }
  return ec2Result
}
