import { ServiceConnection } from '@cloudgraph/sdk'

import { isEmpty } from 'lodash'
import services from '../../enums/services'
import { RawAwsOpsWorksInstance } from './data'
import { RawAwsOpsWorksApp } from '../opsworksApp/data'


export default ({
  service: opsworksInstance,
  data,
  region,
}: {
  service: RawAwsOpsWorksInstance
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const {
    InstanceId,
    SubnetId,
    SecurityGroupIds: securityGroupIds = [],
    Ec2InstanceId,
  } = opsworksInstance
  const connections: ServiceConnection[] = []

    /**
   * Find EC2 Instances
   * related to this Auto Scaling Group
   */
  const ec2Instances = data.find(({ name }) => name === services.ec2Instance)
  if (ec2Instances?.data?.[region]) {
    const ec2InstanceInRegion = ec2Instances.data[region].find(instance =>
      instance.InstanceId === Ec2InstanceId
    )

    if (ec2InstanceInRegion) {
      connections.push({
        id: Ec2InstanceId,
        resourceType: services.ec2Instance,
        relation: 'child',
        field: 'ec2Instance',
      })
    }
  }

  /**
   * Add subnets
   */
  connections.push({
    id: SubnetId,
    resourceType: services.subnet,
    relation: 'child',
    field: 'subnet',
  })

  /**
   * Add Security Groups
   */
  connections.push(
    ...securityGroupIds.map(sg => ({
      id: sg,
      resourceType: services.sg,
      relation: 'child',
      field: 'securityGroups',
    }))
  )

  const natResult = {
    [InstanceId]: connections,
  }
  return natResult
}
