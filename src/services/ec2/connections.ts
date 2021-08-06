// import get from 'lodash/get'
// import head from 'lodash/head'
// import last from 'lodash/last'
import isEmpty from 'lodash/isEmpty'

// import { Volume, Address, Instance } from 'aws-sdk/clients/ec2'
import {
  IamInstanceProfile,
  Instance,
  SecurityGroup,
  TagList,
  Volume,
} from 'aws-sdk/clients/ec2'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'

/**
 * EC2
 */

export default ({
  service: instance,
  data,
  region,
  account,
}: // allTagData,
{
  account: string
  data: any
  service: Instance & {
    region: string
    DisableApiTermination?: boolean
    KeyPairName?: string
    Tags?: TagList
    IamInstanceProfile: IamInstanceProfile
  }
  region: string
}): any => {
  const connections: ServiceConnection[] = []
  const { InstanceId: id, SecurityGroups: instanceSecurityGroups } = instance

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
    const volumesInRegion = ebsVolumes.data[region].filter(volume =>
      volume.Attachments.find(({ InstanceId }) => InstanceId === id)
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

  // const ipv4PublicIp = eips.map(({ PublicIp }) => PublicIp).join(', ')

  // const primaryNetworkInterface = get(
  //   (instance[ec2Names.networkInterfaces] || []).find(
  //     ({ attachment: { deviceIndex } }) => deviceIndex === 0
  //   ),
  //   ec2Names.networkInterfaceId
  // )

  //     children: [
  //       ...(!isEmpty(nodes) ? nodes : []),
  //       ...eips.map(eip => awsEipConverter({ eip, allTagData })),
  //       ...networkInterfaces.map(networkInterface =>
  //         awsNetworkInterfaceConverter({
  //           allTagData,
  //           networkInterface,
  //           securityGroupsInVpc,
  //         })
  //       ),
  //       ...ebsVolumes.map(volume =>
  //         awsEbsVolumeConverter({
  //           volume,
  //           bootId: instance[ec2Names.rootDeviceName],
  //           allTagData,
  //         })
  //       ),
  //     ],
  //   })

  /**
   * Check to see if this instance is part of an EKS cluster and if so
   * Add the cluster ID to the metaData
   */
  //   let eksClusterName = ''

  //   const eksCluster = Object.keys(get(ec2Result, `displayData.tags`, {})).some(
  //     key => {
  //       const isMatch = key.includes(ec2Names.clusterTag)

  //       if (isMatch) {
  //         // i.e. "kubernetes.io/cluster/eks-infra".split("/") -> [ 'kubernetes.io', 'cluster', 'eks-infra' ] -> 'eks-infra'
  //         eksClusterName = last(key.split('/'))
  //       }
  //       return isMatch
  //     }
  //   )
  //   if (eksCrawled && eksCluster) {
  //     ec2Result.metaData = {
  //       ...ec2Result.metaData,
  //       vpcLevelParent: eksClusterId(eksClusterName),
  //       vpcLevelParentType: resourceTypes.eksCluster,
  //     }
  //   }

  /**
   * Check to see if this instance is part of an elastic beanstalk env and if so add the beanstalk ID to the metaData
   */

  //   const beanstalkEnv = get(
  //     ec2Result,
  //     `displayData.tags.${ec2Names.environmentIdTag}`
  //   )

  //   if (beanstalkCrawled && beanstalkEnv) {
  //     ec2Result.metaData = {
  //       ...ec2Result.metaData,
  //       vpcLevelParent: beanstalkEnvId(beanstalkEnv),
  //       vpcLevelParentType: resourceTypes.elasticBeanstalkEnvironment,
  //     }
  //   }

  /**
   * Check to see if this instance is part of an ECS cluster and if so
   * Add the cluster ID to the metaData
   */
  //   const isEcsClusterInstance = get(
  //     ec2Result,
  //     `displayData.tags.Name`,
  //     ''
  //   ).includes(ec2Names.ecsClusterIdentifier)

  //   if (ecsCrawled && isEcsClusterInstance) {
  //     ec2Result.metaData = {
  //       ...ec2Result.metaData,
  //       vpcLevelParent: ecsClusterId(
  //         head(
  //           get(ec2Result, `displayData.tags.Name`, '')
  //             .split(ec2Names.ecsClusterIdentifier)
  //             .filter(e => e)
  //         )
  //       ),
  //       vpcLevelParentType: resourceTypes.ecsCluster,
  //     }
  //   }

  /**
   * Add the ec2 instance to the list of members of whatever security groups it uses
   */

  //   checkForAndAddEntityToSecurityGroupMembers({
  //     entityToAdd: ec2Result,
  //     resourceType: resourceTypes.ec2Instance,
  //     securityGroupsInVpc,
  //     entitySecurityGroups: securityGroupIds,
  //   })
  // const arn = `arn:aws:ec2:${region}:${account}:instance/${
  //   instance[ec2Names.instanceId]
  // }`
  const ec2Result = {
    [`arn:aws:ec2:${region}:${account}:instance/${id}`]: connections,
  }
  return ec2Result
}
