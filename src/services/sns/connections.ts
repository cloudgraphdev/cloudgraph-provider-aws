import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsSns } from '../sns/data'
import services from '../../enums/services'
import { kmsArn } from '../../utils/generateArns'

export default ({
  account,
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsSns
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const connections: ServiceConnection[] = []
  const { 
    TopicArn: id, 
    KmsMasterKeyId: kmsKeyId 
  } = service
  const kmsKeyArn = kmsArn({ region, account, id: kmsKeyId })

  /**
   * Find KMS
   */
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(kmsKey =>
      kmsKey.Arn === kmsKeyArn
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

  const snsResult = {
    [id]: connections,
  }
  return snsResult
}
