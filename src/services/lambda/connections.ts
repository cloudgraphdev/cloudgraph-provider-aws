import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'

import { KeyMetadata } from 'aws-sdk/clients/kms'
import { FunctionConfiguration } from 'aws-sdk/clients/lambda'
import { SecurityGroup } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsIamRole } from '../iamRole/data'
import { globalRegionName } from '../../enums/regions'

export default ({
  service: lambda,
  data,
  region,
}: {
  service: FunctionConfiguration
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const {
    KMSKeyArn,
    FunctionArn: id,
    Role,
    VpcConfig: { SecurityGroupIds: sgIds = [], SubnetIds: subnetIds = [] } = {},
  } = lambda
  const connections: ServiceConnection[] = []
  /**
   * Find KmsKey used in lambda function
   */
  const kmsKeys: { name: string; data: { [property: string]: KeyMetadata[] } } =
    data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKey: KeyMetadata = kmsKeys.data[region].find(
      ({ Arn }: KeyMetadata) => Arn === KMSKeyArn
    )
    if (!isEmpty(kmsKey)) {
      connections.push({
        id: kmsKey.KeyId,
        resourceType: services.kms,
        relation: 'child',
        field: 'kms',
      })
    }
  }

  /**
   * Find from VPC, Security Groups
   * related to this lambda function
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
   * Find Subnets
   * related to this lambda function
   */
  const subnets: {
    name: string
    data: { [property: string]: RawAwsSubnet[] }
  } = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId }: RawAwsSubnet) => subnetIds.includes(SubnetId)
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
   * Find IAM Role
   * related to this lambda function
   */
  const iamRoles: {
    name: string
    data: { [property: string]: RawAwsIamRole[] }
  } = data.find(({ name }) => name === services.iamRole)
  if (iamRoles?.data?.[globalRegionName]) {
    const iamRolesInRegion: RawAwsIamRole[] = iamRoles.data[
      globalRegionName
    ].filter(({ Arn }: RawAwsIamRole) => Arn === Role)
    if (!isEmpty(iamRolesInRegion)) {
      for (const role of iamRolesInRegion) {
        connections.push({
          id: role.Arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRole',
        })
      }
    }
  }

  const lambdaResult = {
    [id]: connections,
  }
  return lambdaResult
}
