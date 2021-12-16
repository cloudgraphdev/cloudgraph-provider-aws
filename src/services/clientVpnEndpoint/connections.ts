import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import { ClientVpnEndpoint, TagList } from 'aws-sdk/clients/ec2'

import services from '../../enums/services'
import { AwsSecurityGroup } from '../securityGroup/data'

/**
 * Client Vpn Endpoint
 */

export default ({
  service: clientVpnEndpoint,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: ClientVpnEndpoint & {
    Tags?: TagList
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    ClientVpnEndpointId: id,
    SecurityGroupIds: securityGroupIds,
  } = clientVpnEndpoint

  /**
   * Find Security Groups
   * related to this Client Vpn Endpoint
   */
   const securityGroups: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.sg)

  if (securityGroups?.data?.[region]) {
    const associatedSecurityGroups: AwsSecurityGroup[] = securityGroups.data[region].filter(
      ({ GroupId }: AwsSecurityGroup) => securityGroupIds.includes(GroupId)
    )

    if (!isEmpty(associatedSecurityGroups)) {
      for (const securityGroup of associatedSecurityGroups) {
        connections.push({
          id: securityGroup.GroupId,
          resourceType: services.sg,
          relation: 'child',
          field: 'securityGroups',
        })
      }
    }
  }

  const clientVpnEndpointResult = {
    [id]: connections,
  }
  return clientVpnEndpointResult
}