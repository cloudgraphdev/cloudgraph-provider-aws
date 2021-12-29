import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { LogGroup } from 'aws-sdk/clients/cloudwatchlogs'
import services from '../../enums/services'

export default ({
  service: logGroup,
  data,
  region,
}: {
  account: string
  service: LogGroup
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { logGroupName: id, kmsKeyId } = logGroup
  const connections: ServiceConnection[] = []

  /**
   * Find KMS
   */
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(
      kmsKey => kmsKey.Arn === kmsKeyId
    )
    if (!isEmpty(kmsKeyInRegion)) {
      for (const kms of kmsKeyInRegion) {
        connections.push({
          id: kms.KeyId,
          resourceType: services.kms,
          relation: 'child',
          field: 'kms',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
