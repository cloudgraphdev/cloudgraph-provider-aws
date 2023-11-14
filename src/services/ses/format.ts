import { RawAwsSes } from './data'
import { AwsSes } from '../../types/generated'
import { generateUniqueId } from '@cloudgraph/sdk'

/**
 * SES 
 */

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSes
  account: string
  region: string
}): AwsSes => {
  const {
    ConfigurationSets = [],
    EmailTemplates = [],
  } = service

  const configurationSets = ConfigurationSets.map(cs => cs.Name)
  const emailTemplates = EmailTemplates.map(e => e.Name)

  return {
    id: generateUniqueId({
      ...service,
      account,
      region
    }),
    accountId: account,
    region,
    configurationSets,
    emailTemplates,
  }
}
