import { AwsRoute53Record } from '../../types/generated'
import { RawAwsRoute53Record } from './data'
import { getHostedZoneId, getRecordId } from '../../utils/ids'
import { route53RecordArn } from '../../utils/generateArns'

/**
 * Route53 Record
 */

export default ({
  service: rawData,
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
  } = rawData

  const hostedZoneId = getHostedZoneId(Id)
  const id = getRecordId({ hostedZoneId, name, type })

  // Resource records
  const resourceRecords = records.map(({ Value }) => Value)

  const record = {
    id,
    arn: route53RecordArn({ hostedZoneId, id }),
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
