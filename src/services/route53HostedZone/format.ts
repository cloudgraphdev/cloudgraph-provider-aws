import last from 'lodash/last'

import { AwsRoute53HostedZone } from '../../types/generated'
import { RawAwsRoute53HostedZone } from './data'

/**
 * Route53 Hosted Zone
 */

export default ({
  service: rawData,
}: {
  service: RawAwsRoute53HostedZone
  account: string
  region: string
}): AwsRoute53HostedZone => {
  const {
    Id,
    Name: name,
    VPCs: vpcs = [],
    Config: { Comment: comment = '' } = {},
    DelegationSet: {
      NameServers: nameServers = [],
      Id: delegationSetId = '',
    } = {},
  } = rawData

  // i.e. "Id": "/hostedzone/Z0340076V9U7PUPIWZTE"
  const id = last(Id.split('/'))

  // Associated VPCs
  const associatedVPCs = vpcs.map(({ VPCId: vpcId, VPCRegion: vpcRegion }) => ({
    vpcId,
    vpcRegion,
  }))

  const hostedZone = {
    id,
    arn: `arn:aws:route53:::hostedzone/${id}`,
    zoneId: id,
    name,
    comment,
    delegationSetId,
    vpcs: associatedVPCs,
    nameServers,
  }
  return hostedZone
}
