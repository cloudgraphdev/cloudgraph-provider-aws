import { kebabCase, last } from 'lodash'

import { AwsRoute53Record } from '../../types/generated'
import resources from '../../enums/resources'
import { RawAwsRoute53Record } from './data'

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

  // i.e. "Id": "/hostedzone/Z0340076V9U7PUPIWZTE"
  const hostedZoneId = last(Id.split('/'))

  const id = `${hostedZoneId}_${name}-${type}-${kebabCase(
    resources.route53ZRecord
  )}`

  // Resource records
  const resourceRecords = records.map(({ Value }) => Value)

  const record = {
    id,
    arn: `arn:aws:route53:::hostedzone/${hostedZoneId}/recordset/${id}`,
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
