import { generateUniqueId } from '@cloudgraph/sdk'

import { formatTagsFromMap } from '../../utils/format'
import { RawAwsManagedPrefixList } from './data'
import { AwsManagedPrefixList } from '../../types/generated'

/**
 * Managed Prefix List
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsManagedPrefixList
  account: string
  region: string
}): AwsManagedPrefixList => {
  const {
    PrefixListId: id,
    PrefixListArn: arn,
    PrefixListName: name,
    AddressFamily: addressFamily,
    State: state,
    StateMessage: stateMessage,
    MaxEntries: maxEntries,
    Version: version,
    Entries: entries = [],
    Tags: tags,
  } = rawData

  const managedPrefixList = {
    id,
    accountId: account,
    arn,
    region,
    name,
    addressFamily,
    state,
    stateMessage,
    maxEntries,
    version,
    entries:
      entries?.map(e => ({
        id: generateUniqueId({
          arn,
          ...e,
        }),
        cidr: e.Cidr,
        description: e.Description,
      })) || [],
    tags: formatTagsFromMap(tags),
  }

  return managedPrefixList
}
