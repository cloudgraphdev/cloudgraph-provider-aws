import { isEmpty } from 'lodash'
import { AwsRoute53Record } from '../../types/generated'
import { getHostedZoneId, getRecordId } from '../../utils/ids'
import { RawAwsRoute53Record } from './data'

// Normalize name due special chars like '*' are replaced with '\\052'
const normalizeName = (name: string): string => {
  if (isEmpty(name)) return ''
  const normalizedName = name.replace(/\\052/g, '*')
  return normalizedName.endsWith('.')
    ? normalizedName.slice(0, -1)
    : normalizedName
}

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

  const normalizedName = normalizeName(name)
  const hostedZoneId = getHostedZoneId(Id)
  const id = getRecordId({
    hostedZoneId,
    name: normalizedName,
    type,
    identifier,
  })

  // Resource records
  const resourceRecords = records.map(({ Value }) => Value)

  const record = {
    id,
    accountId: account,
    zoneId: hostedZoneId,
    name: normalizedName,
    setIdentifier: identifier,
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
