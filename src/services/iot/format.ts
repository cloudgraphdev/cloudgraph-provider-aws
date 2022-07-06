import { generateUniqueId } from '@cloudgraph/sdk'

import { RawAwsIotThingAttribute } from './data'
import { AwsIotThingAttribute } from '../../types/generated'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsIotThingAttribute
  account: string
  region: string
}): AwsIotThingAttribute => {
  const {
    thingArn: arn,
    thingName,
    thingTypeName,
    attributes = {},
    version,
  } = service

  return {
    accountId: account,
    arn,
    region,
    id: arn,
    thingName,
    thingTypeName,
    attributes: Object.keys(attributes).map(key => ({
      id: generateUniqueId({
        arn,
        key,
        value: attributes[key],
      }),
      key,
      value: attributes[key],
    })),
    version,
  }
}
