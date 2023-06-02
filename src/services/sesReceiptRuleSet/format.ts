import { RawAwsSesReceiptRuleSet } from './data'
import { AwsSesReceiptRuleSet } from '../../types/generated'
import { generateUniqueId } from '@cloudgraph/sdk'

/**
 * SES Receipt Rule Set
 */

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSesReceiptRuleSet
  account: string
  region: string
}): AwsSesReceiptRuleSet => {
  const {
    ReceiptRuleSet,
    Rules = []
  } = service

  const rules = Rules.map(r => ({
    id: generateUniqueId({
      ...r,
      account,
      region
    }),
    name: r.Name,
    enabled: r.Enabled,
    tlsPolicy: r.TlsPolicy,
    scanEnabled: r.ScanEnabled
  }))

  return {
    id: generateUniqueId({
      ...service,
      account,
      region
    }),
    accountId: account,
    region,
    name: ReceiptRuleSet?.Name,
    rules
  }
}
