import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsEmrCluster } from '../emrCluster/data'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsIamRole } from '../iamRole/data'
import services from '../../enums/services'
import { globalRegionName } from '../../enums/regions'

export default ({
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsEmrCluster
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const {
    ClusterArn: id,
    Ec2InstanceAttributes,
    LogEncryptionKmsKeyId,
    ServiceRole,
    AutoScalingRole,
  } = service
  const connections: ServiceConnection[] = []
  const subnetId = Ec2InstanceAttributes?.Ec2SubnetId

  /**
   * Find KMS
   */
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(
      kmsKey => kmsKey.Arn === LogEncryptionKmsKeyId
    )

    if (!isEmpty(kmsKeyInRegion)) {
      for (const kms of kmsKeyInRegion) {
        connections.push({
          id: kms.KeyId,
          resourceType: services.kms,
          relation: 'child',
          field: 'kms',
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
      ({ SubnetId }: RawAwsSubnet) => SubnetId === subnetId
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
   * Find IAM Roles
   */
  const iamRoles: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.iamRole)

  if (iamRoles?.data?.[globalRegionName]) {
    const iamRolesInRegion: RawAwsIamRole[] = iamRoles.data[
      globalRegionName
    ].filter(
      ({ RoleName }: RawAwsIamRole) =>
        RoleName === ServiceRole || RoleName === AutoScalingRole
    )

    if (!isEmpty(iamRolesInRegion)) {
      for (const role of iamRolesInRegion) {
        connections.push({
          id: role.Arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRoles',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
