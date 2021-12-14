import { AwsRoute53Record } from '../../types/generated'
import { RawAwsRoute53Record } from './data'
import { getHostedZoneId, getRecordId } from '../../utils/ids'

/**
 * Route53 Record
 */

export default ({
  service: rawData,
  account,
}: {
  service: RawAwsRoute53Record
  account: string
  region: string
}): AwsRoute53Record => {
  const {
    HostedZoneId: Id,
    TTL: ttl,
    Name: name,
    Type: type,
    AliasTarget: alias,
    ResourceRecords: records = [],
    SetIdentifier: identifier = '',
  } = rawData

  const hostedZoneId = getHostedZoneId(Id)
  const id = getRecordId({ hostedZoneId, name, type, identifier })

  // Resource records
  const resourceRecords = records.map(({ Value }) => Value)

  const record = {
    id,
    accountId: account,
    zoneId: hostedZoneId,
    type,
    ttl,
    alias: {
      name: alias?.DNSName || '',
      zoneId: alias?.HostedZoneId || '',
      evaluateTargetHealth: !!alias?.EvaluateTargetHealth,
    },
    records: resourceRecords,
  }
  return record
}
