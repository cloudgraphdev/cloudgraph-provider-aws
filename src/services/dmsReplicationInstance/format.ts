import { generateUniqueId } from '@cloudgraph/sdk'

import { formatTagsFromMap } from '../../utils/format' // TODO: Build this
import { AwsDmsReplicationInstance } from '../../types/generated'
import { RawAwsDmsReplicationInstance } from './data'

/**
 * DmsReplicationInstance
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsDmsReplicationInstance
  region: string
}): AwsDmsReplicationInstance => {
  const {
    ReplicationInstanceIdentifier: replicationInstanceIdentifier,
    ReplicationInstanceArn: arn,
    ReplicationInstanceClass: replicationInstanceClass,
    ReplicationInstanceStatus: replicationInstanceStatus,
    AllocatedStorage: allocatedStorage,
    InstanceCreateTime: instanceCreateTime,
    VpcSecurityGroups: vpcSecurityGroups,
    AvailabilityZone: availabilityZone,
    ReplicationSubnetGroup: replicationSubnetGroup,
    PreferredMaintenanceWindow: preferredMaintenanceWindow,
    PendingModifiedValues: pendingModifiedValues,
    MultiAZ: multiAz,
    EngineVersion: engineVersion,
    AutoMinorVersionUpgrade: autoMinorVersionUpgrade,
    KmsKeyId: kmsKeyId,
    ReplicationInstancePrivateIpAddress: replicationInstancePrivateIpAddress,
    ReplicationInstancePublicIpAddress: replicationInstancePublicIpAddress,
    ReplicationInstancePrivateIpAddresses:
      replicationInstancePrivateIpAddresses,
    ReplicationInstancePublicIpAddresses: replicationInstancePublicIpAddresses,
    PubliclyAccessible: publiclyAccessible,
    SecondaryAvailabilityZone: secondaryAvailabilityZone,
    FreeUntil: freeUntil,
    DnsNameServers: dnsNameServers,
    Tags: tags,
  } = rawData

  const mappedVpcSecurityGroups = vpcSecurityGroups?.map(
    ({ VpcSecurityGroupId, Status }) => ({
      id: generateUniqueId({
        arn,
        Status,
        VpcSecurityGroupId,
      }),
      status: Status,
      vpcSecurityGroupId: VpcSecurityGroupId,
    })
  )

  const formattedReplicationSubnetGroup = {
    replicationSubnetGroupIdentifier:
      replicationSubnetGroup?.ReplicationSubnetGroupIdentifier,
    replicationSubnetGroupDescription:
      replicationSubnetGroup?.ReplicationSubnetGroupDescription,
    vpcId: replicationSubnetGroup?.VpcId,
    subnetGroupStatus: replicationSubnetGroup?.SubnetGroupStatus,
    subnets: replicationSubnetGroup?.Subnets?.map(
      ({ SubnetAvailabilityZone, SubnetIdentifier, SubnetStatus }) => ({
        id: generateUniqueId({
          arn,
          SubnetAvailabilityZone,
          SubnetIdentifier,
          SubnetStatus,
        }),
        subnetAvailabilityZone: {
          name: SubnetAvailabilityZone?.Name,
        },
        subnetIdentifier: SubnetIdentifier,
        subnetStatus: SubnetStatus,
      })
    ),
  }

  const formattedPendingModifiedValues = {
    replicationInstanceClass: pendingModifiedValues?.ReplicationInstanceClass,
    allocatedStorage: pendingModifiedValues?.AllocatedStorage,
    multiAZ: pendingModifiedValues?.MultiAZ,
    engineVersion: pendingModifiedValues?.EngineVersion,
  }

  return {
    id: arn,
    arn,
    region,
    accountId: account,
    replicationInstanceIdentifier,
    replicationInstanceClass,
    replicationInstanceStatus,
    allocatedStorage,
    instanceCreateTime: instanceCreateTime?.toISOString(),
    vpcSecurityGroups: mappedVpcSecurityGroups,
    availabilityZone,
    replicationSubnetGroup: formattedReplicationSubnetGroup,
    preferredMaintenanceWindow,
    pendingModifiedValues: formattedPendingModifiedValues,
    replicationInstancePrivateIpAddress,
    replicationInstancePublicIpAddress,
    replicationInstancePrivateIpAddresses,
    replicationInstancePublicIpAddresses,
    multiAz,
    engineVersion,
    autoMinorVersionUpgrade,
    kmsKeyId,
    publiclyAccessible,
    freeUntil: freeUntil?.toISOString(),
    secondaryAvailabilityZone,
    dnsNameServers,
    tags: formatTagsFromMap(tags ?? {}),
  }
}
