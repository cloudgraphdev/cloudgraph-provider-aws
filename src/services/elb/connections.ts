import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'
import {
  LoadBalancerAttributes,
  LoadBalancerDescription,
  TagList,
} from 'aws-sdk/clients/elb'
import { SecurityGroup } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'

/**
 * ELB
 */

export default ({
  service: loadbalancer,
  data,
  region,
  account,
}: // allTagData,
{
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: LoadBalancerDescription & {
    Tags?: TagList
    Attributes?: LoadBalancerAttributes
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { LoadBalancerName: id, SecurityGroups: loadbalancerSecurityGroups } =
    loadbalancer

  /**
   * Find Security Groups VPC Security Groups
   * related to this ELB loadbalancer
   */
  const securityGroups: {
    name: string
    data: { [property: string]: SecurityGroup[] }
  } = data.find(({ name }) => name === services.sg)
  const sgIds = loadbalancerSecurityGroups.map(sgId => sgId)

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
   * related to this ELB loadbalancer
   */
  // TODO: Implement when subnet service is ready

  const elbResult = {
    [`arn:aws:elasticloadbalancing:${region}:${account}:loadbalancer/${id}`]:
      connections,
  }
  return elbResult
}
