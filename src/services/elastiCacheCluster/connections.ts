import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { SecurityGroup } from 'aws-sdk/clients/ec2'
import { RawAwsElastiCacheCluster } from './data'

import services from '../../enums/services'

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
  const {
    ARN: id,
    SecurityGroups,
  } = service
  const sgIds = SecurityGroups.map(
    ({ SecurityGroupId }) => SecurityGroupId
  )

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

  const result = {
    [id]: connections,
  }
  return result
}
