// import get from 'lodash/get'
// import head from 'lodash/head'
// import last from 'lodash/last'
// import isEmpty from 'lodash/isEmpty'

// import { Volume, Address, Instance } from 'aws-sdk/clients/ec2'
import {  Instance } from 'aws-sdk/clients/ec2'


import {ServiceConnection} from 'cloud-graph-sdk'

import ec2Names from './names'

import resourceTypes from '../../enums/resources'

// import services from '../../enums/services'

import { toCamel } from '../../utils/index'

/**
 * EC2
 */

export default ({
  service: rawData,
  // data, // TODO: use aws sdk data to grab all connections (eip for sure)
  // account,
  // region
  // eips,
  // account,
  // instance: rawData,
  // regionName: region,
  // allTagData,
}: {
  account: string
  data: any
  service: Instance
  region: string
}): any => {
  const instance = toCamel(rawData)

  const id = instance[ec2Names.instanceId]

  // const securityGroupIds = (instance[ec2Names.securityGroups] || []).map(
  //   ({ groupId }) => groupId
  // )


  // const ipv4PublicIp = eips.map(({ PublicIp }) => PublicIp).join(', ')

  // const primaryNetworkInterface = get(
  //   (instance[ec2Names.networkInterfaces] || []).find(
  //     ({ attachment: { deviceIndex } }) => deviceIndex === 0
  //   ),
  //   ec2Names.networkInterfaceId
  // )

  const connections: ServiceConnection[] = []

  /**
   * Add Security Groups
   */
  connections.push(...instance[ec2Names.securityGroups].map(({ groupId }) => ({
    id: groupId,
    relation: 'child',
    resourceType: resourceTypes.securityGroup,
    field: 'securityGroups'
  })))
//   const ec2Result = generateElement({
//     id: ec2InstanceId(id),
//     name: tags[ec2Names.vpcName] || id,
//     resourceType: resourceTypes.ec2Instance,
//     displayData: {
//       arn: `arn:aws:ec2:${region}:${account}:instance/${
//         instance[ec2Names.instanceId]
//       }`,
//       id,
//       region: instance[ec2Names.region],
//       ami: instance[ec2Names.imageId],
//       tenancy: get(instance[ec2Names.placement], ec2Names.tenancy),
//       subnetId: instance[ec2Names.subnetId],
//       elasticIps: eips.map(({ AllocationId }) => AllocationId).join(', '),
//       publicDns: instance[ec2Names.publicDnsName],
//       privateDns: instance[ec2Names.privateDnsName],
//       monitoring: get(instance[ec2Names.monitoring], ec2Names.state),
//       privateIps: instance[ec2Names.privateIpAddress],
//       keyPairName: instance[ec2Names.keyPairName],
//       cpuCoreCount: get(instance[ec2Names.cpuOptions], ec2Names.coreCount),
//       hibernation: get(
//         instance[ec2Names.hibernationOptions],
//         ec2Names.configured
//       )
//         ? t.yes
//         : t.no,
//       ebsOptimized: instance[ec2Names.ebsOptimized] ? t.yes : t.no,
//       ipv4PublicIp,
//       instanceType: instance[ec2Names.instanceType],
//       ipv6Addresses: (instance[ec2Names.networkInterfaces] || []).flatMap(
//         ({ ipv6Addresses }) => ipv6Addresses
//       ),
//       securityGroups: instance[ec2Names.securityGroups],
//       placementGroup: get(instance[ec2Names.placement], ec2Names.groupName),
//       instanceState: get(instance[ec2Names.state], ec2Names.name),
//       sourceDestCheck: instance[ec2Names.sourceDestCheck] ? t.yes : t.no,
//       availabilityZone: get(
//         instance[ec2Names.placement],
//         ec2Names.availabilityZone
//       ),
//       cpuThreadsPerCore: get(
//         instance[ec2Names.cpuOptions],
//         ec2Names.threadsPerCore
//       ),
//       iamInstanceProfile: get(instance[ec2Names.iamInstanceProf], ec2Names.arn),
//       deletionProtection: instance[ec2Names.deletionProtection] ? t.yes : t.no,
//       primaryNetworkInterface,
//       metadataOptions: instance[ec2Names.metadataOptions],
//       securityGroupIds,
//       ephemeralBlockDevice: (
//         instance[ec2Names.blockDeviceMappings] || []
//       ).filter(({ ebs: { deleteOnTermination } }) => deleteOnTermination),
//       associatePublicIpAddress: !isEmpty(ipv4PublicIp) ? t.yes : t.no,
//       tags,
//     },
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
    [id]: connections
  }
  return ec2Result
}
