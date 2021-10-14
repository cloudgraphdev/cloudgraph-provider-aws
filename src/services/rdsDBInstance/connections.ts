import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { SecurityGroup } from 'aws-sdk/clients/ec2'
import { DBInstance } from 'aws-sdk/clients/rds'
import { RawAwsSubnet } from '../subnet/data'
import services from '../../enums/services'

export default ({
  service,
  data,
  region,
}: {
  service: DBInstance
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const connections: ServiceConnection[] = []
  const { DBInstanceIdentifier: id, VpcSecurityGroups, DBSubnetGroup } = service

  const sgIds = VpcSecurityGroups.map(
    ({ VpcSecurityGroupId }) => VpcSecurityGroupId
  )
  const subnetIds = (DBSubnetGroup?.Subnets || []).map(
    ({ SubnetIdentifier }) => SubnetIdentifier
  )

  /**
   * Find Security Groups VPC Security Groups
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
  const subnets = data.find(({ name }) => name === services.subnet)
  if (subnets?.data?.[region]) {
    const subnetsInRegion = subnets.data[region].filter(
      (subnet: RawAwsSubnet) => subnetIds.includes(subnet.SubnetId)
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

  const rdsDBInstanceResult = {
    [id]: connections,
  }
  return rdsDBInstanceResult
}