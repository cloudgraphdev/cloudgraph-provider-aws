import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsEksCluster } from '../eksCluster/data'
import { RawAwsIamRole } from '../iamRole/data'
import { AwsSecurityGroup } from '../securityGroup/data'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsVpc } from '../vpc/data'
import services from '../../enums/services'
import { globalRegionName } from '../../enums/regions'

export default ({
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsEksCluster
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const {
    arn: id,
    roleArn,
    encryptionConfig = [],
    resourcesVpcConfig = {},
  } = service
  const connections: ServiceConnection[] = []
  const keyArns = encryptionConfig.map(({ provider }) => provider?.keyArn) || []
  const sgIds = resourcesVpcConfig.securityGroupIds || []
  const clusterSgId = resourcesVpcConfig.clusterSecurityGroupId
  const subnetIds = resourcesVpcConfig.subnetIds || []

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
        const { Arn: roleId } = instance

        connections.push({
          id: roleId,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRoles',
        })
      }
    }
  }

  /**
   * Find KMS
   */
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(kmsKey =>
      keyArns.includes(kmsKey.Arn)
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
   * Find SecurityGroups
   */
  const securityGroups: {
    name: string
    data: { [property: string]: AwsSecurityGroup[] }
  } = data.find(({ name }) => name === services.sg)

  if (securityGroups?.data?.[region]) {
    const sgsInRegion: AwsSecurityGroup[] = securityGroups.data[region].filter(
      ({ GroupId }: AwsSecurityGroup) =>
        sgIds.includes(GroupId) || GroupId === clusterSgId
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
    const subnet = subnets.data[region].find(({ SubnetId }: RawAwsSubnet) =>
      subnetIds.includes(SubnetId)
    )

    if (subnet) {
      connections.push({
        id: subnet.SubnetId,
        resourceType: services.subnet,
        relation: 'child',
        field: 'subnets',
      })
    }
  }

  /**
   * Find VPCs
   */
  const vpcs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.vpc)

  if (vpcs?.data?.[region]) {
    const vpc = vpcs.data[region].find(
      ({ VpcId }: RawAwsVpc) => VpcId === resourcesVpcConfig.vpcId
    )

    if (vpc) {
      connections.push({
        id: vpc.VpcId,
        resourceType: services.vpc,
        relation: 'child',
        field: 'vpc',
      })
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
