import {
  AutoScalingGroup,
  LaunchConfiguration,
  TagDescriptionList,
} from 'aws-sdk/clients/autoscaling'

import { ServiceConnection } from '@cloudgraph/sdk'

import { SecurityGroup, Volume } from 'aws-sdk/clients/ec2'
import { isEmpty } from 'lodash'
import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsIamRole } from '../iamRole/data'
import { globalRegionName } from '../../enums/regions'

/**
 * ASG
 */

export default ({
  service: asg,
  data,
  region,
}: {
  data: { name: string; data: { [property: string]: any[] } }[]
  service: AutoScalingGroup & {
    region: string
    Tags?: TagDescriptionList
    LaunchConfiguration?: LaunchConfiguration
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const {
    AutoScalingGroupARN: id,
    Instances: instances = [],
    VPCZoneIdentifier: commaSeparatedSubnetIds = '',
    ServiceLinkedRoleARN: roleArn,
  } = asg

  const { SecurityGroups: sgIds = [] } = asg.LaunchConfiguration

  /**
   * Find EC2 Instances
   * related to this Auto Scaling Group
   */

  const ec2Instances = data.find(({ name }) => name === services.ec2Instance)
  const ec2InstanceIds = instances.map(({ InstanceId }) => InstanceId)
  if (ec2Instances?.data?.[region]) {
    const ec2InstanceInRegion = ec2Instances.data[region].filter(instance =>
      ec2InstanceIds.includes(instance.InstanceId)
    )

    if (!isEmpty(ec2InstanceInRegion)) {
      for (const ec2instance of ec2InstanceInRegion) {
        const ec2InstanceId = ec2instance.InstanceId

        connections.push({
          id: ec2InstanceId,
          resourceType: services.ec2Instance,
          relation: 'child',
          field: 'ec2Instance',
        })
      }
    }
  }

  /**
   * Find Security Groups VPC Security Groups
   * related to this EC2 instance
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
   * Find EBS volumes
   * related to this Auto Scaling Group
   */
  const ebsVolumes: {
    name: string
    data: { [property: string]: (Volume & { region: string })[] }
  } = data.find(({ name }) => name === services.ebs)
  if (ebsVolumes?.data?.[region]) {
    const volumesInRegion = ebsVolumes.data[region].filter(
      ({ Attachments: attachments }) =>
        attachments.find(({ InstanceId }) =>
          ec2InstanceIds.includes(InstanceId)
        )
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
   * Find Subnets
   * related to this Auto Scaling Group
   */
  const subnets = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion = subnets.data[region].filter(
      (subnet: RawAwsSubnet) =>
        commaSeparatedSubnetIds.includes(subnet.SubnetId)
    )
    if (!isEmpty(subnetsInRegion)) {
      for (const subnet of subnetsInRegion) {
        const { SubnetId } = subnet

        connections.push({
          id: SubnetId,
          resourceType: services.subnet,
          relation: 'child',
          field: 'subnet',
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
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      role => role.Arn === roleArn
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { Arn: arn }: RawAwsIamRole = instance

        connections.push({
          id: arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRole',
        })
      }
    }
  }

  const asgResult = {
    [id]: connections,
  }
  return asgResult
}
