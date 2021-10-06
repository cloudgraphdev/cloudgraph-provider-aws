import { AwsRoute53HostedZone } from '../../types/generated'
import { route53HostedZoneArn } from '../../utils/generateArns'
import { getHostedZoneId } from '../../utils/ids'
import { RawAwsRoute53HostedZone } from './data'

/**
 * Route53 Hosted Zone
 */

export default ({
  service: rawData,
  account,
}: {
  service: RawAwsRoute53HostedZone
  account: string
  region: string
}): AwsRoute53HostedZone => {
  const {
    Id,
    Name: name,
    Config: { Comment: comment = '' } = {},
    DelegationSet: {
      NameServers: nameServers = [],
      Id: delegationSetId = '',
    } = {},
  } = rawData

  const id = getHostedZoneId(Id)

  const hostedZone = {
    id,
    accountId: account,
    arn: route53HostedZoneArn({ id }),
    name,
    comment,
    delegationSetId,
    nameServers,
  }
  return hostedZone
}
