import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { SecurityGroup } from 'aws-sdk/clients/ec2'
import { RawAwsElastiCacheCluster } from './data'
import services from '../../enums/services'
import { RawAwsSubnet } from '../subnet/data'
import { RawAwsVpc } from '../vpc/data'

export default ({
  service,
  data,
  region,
}: {
  service: RawAwsElastiCacheCluster
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const connections: ServiceConnection[] = []
  const { ARN: id, SecurityGroups, CacheSubnetGroup } = service
  const sgIds = SecurityGroups.map(({ SecurityGroupId }) => SecurityGroupId)

  /**
   * Find SecurityGroups
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
   */
  const subnets: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.subnet)

  const subnetIds = CacheSubnetGroup?.Subnets?.map(
    ({ SubnetIdentifier }) => SubnetIdentifier
  )

  if (subnets?.data?.[region] && subnetIds?.length > 0) {
    const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
      ({ SubnetId }: RawAwsSubnet) => subnetIds.includes(SubnetId)
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
   * Find related Vpc
   */
  const vpcs: { name: string; data: { [property: string]: RawAwsVpc[] } } =
    data.find(({ name }) => name === services.vpc)
  if (vpcs?.data?.[region]) {
    const vpc: RawAwsVpc = vpcs.data[region].find(
      ({ VpcId }: RawAwsVpc) => VpcId === CacheSubnetGroup?.VpcId
    )
    if (!isEmpty(vpc)) {
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
