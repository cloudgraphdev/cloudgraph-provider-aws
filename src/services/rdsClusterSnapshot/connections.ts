import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsRdsClusterSnapshot } from './data'
import services from '../../enums/services'

export default ({
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsRdsClusterSnapshot
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { DBClusterSnapshotIdentifier, KmsKeyId } = service
  const connections: ServiceConnection[] = []

  /**
   * Find KMS
   */
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(kmsKey => kmsKey.Arn === KmsKeyId)
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
    [DBClusterSnapshotIdentifier]: connections,
  }
  return result
}
