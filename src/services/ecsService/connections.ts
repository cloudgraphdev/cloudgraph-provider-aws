import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { SecurityGroup } from 'aws-sdk/clients/ec2'
import { RawAwsEcsService } from '../ecsService/data'
import { RawAwsVpc } from '../vpc/data'
import services from '../../enums/services'

export default ({
  account,
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsEcsService
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { serviceArn: id } = service
  const connections: ServiceConnection[] = []

  /**
   * Find VPCs
   */
  const vpcs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.vpc)

  const sgIds = service?.networkConfiguration?.awsvpcConfiguration?.securityGroups
  const vpcsInRegion: RawAwsVpc[] = vpcs.data[region].filter(
    ({ VpcId }: SecurityGroup) => sgIds.includes(VpcId)
  )

  if (!isEmpty(vpcsInRegion)) {
    for (const vpc of vpcsInRegion) {
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
