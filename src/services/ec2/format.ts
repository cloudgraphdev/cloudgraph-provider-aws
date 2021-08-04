// import head from 'lodash/head'
// import last from 'lodash/last'
// import isEmpty from 'lodash/isEmpty'

// import { Volume, Address, Instance } from 'aws-sdk/clients/ec2'
import { Instance } from 'aws-sdk/clients/ec2'

import t from '../../properties/translations'
import { AwsEc2 } from '../../types/generated'

/**
 * EC2
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: Instance & {
    region: string
    keyPairName: string
    DisableApiTermination: boolean
  }
  region: string
}): AwsEc2 => {
  const {
    InstanceId: id,
    ImageId: ami,
    Placement: { Tenancy: tenancy },
    PublicDnsName: publicDns,
    PrivateDnsName: privateDns,
    Monitoring: { State: monitoring },
    PrivateIpAddress: privateIps,
    NetworkInterfaces: networkInterfaces = [],
    CpuOptions: { CoreCount: cpuCoreCount, ThreadsPerCore: cpuThreadsPerCore },
    HibernationOptions: { Configured: hibernation },
    EbsOptimized: ebsOptimized,
    InstanceType: instanceType,
    State: { Name: instanceState },
    SourceDestCheck: sourceDestCheck,
    Placement: {
      AvailabilityZone: availabilityZone,
      GroupName: placementGroup,
    },
    MetadataOptions: {
      State: state,
      HttpTokens: httpTokens,
      HttpEndpoint: httpEndpoint,
      HttpPutResponseHopLimit: httpPutResponseHopLimit,
    },
    SecurityGroups: securityGroups,
    BlockDeviceMappings: blockDeviceMappings,
    DisableApiTermination: deletionProtection,
    // Tags: tags
  } = rawData

  const securityGroupIds = (securityGroups || []).map(({ GroupId }) => GroupId)

  /**
   * Add these tags to the list of global tags so we can filter by tag on the front end
   */

  // combineElementsTagsWithExistingGlobalTags({ tags, allTagData })

  // const ipv4PublicIp = eips.map(({ PublicIp }) => PublicIp).join(', ')

  const { NetworkInterfaceId: networkInterfaceId = '' } =
    networkInterfaces.find(
      ({ Attachment: { DeviceIndex } }) => DeviceIndex === 0
    )

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

  // const ipv6Addresses = networkInterfaces.map(
  //   ({ Ipv6Addresses }) => Ipv6Addresses
  // )

  const ephemeralBlockDevice = blockDeviceMappings
    .filter(({ Ebs: { DeleteOnTermination } }) => DeleteOnTermination)
    .map(({ DeviceName }) => ({ deviceName: DeviceName }))

  const ec2 = {
    arn: `arn:aws:ec2:${region}:${account}:instance/${id}`,
    id,
    region,
    ami,
    tenancy,
    // elasticIps: eips.map(({ AllocationId }) => AllocationId).join(', '),
    publicDns,
    privateDns,
    monitoring,
    privateIps,
    // keyPairName,
    cpuCoreCount,
    hibernation: hibernation ? t.yes : t.no,
    ebsOptimized: ebsOptimized ? t.yes : t.no,
    // ipv4PublicIp,
    instanceType,
    ipv6Addresses: [],
    placementGroup,
    instanceState,
    sourceDestCheck: sourceDestCheck ? t.yes : t.no,
    availabilityZone,
    cpuThreadsPerCore,
    // iamInstanceProfile: get(instance[ec2Names.iamInstanceProf], ec2Names.arn),
    deletionProtection: deletionProtection ? t.yes : t.no,
    primaryNetworkInterface: networkInterfaceId,
    metadataOptions: {
      state,
      httpTokens,
      httpPutResponseHopLimit,
      httpEndpoint,
    },
    securityGroupIds,
    ephemeralBlockDevice,
    // associatePublicIpAddress: !isEmpty(ipv4PublicIp) ? t.yes : t.no,
  }
  return ec2
}
