import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsEfs } from './data'
import services from '../../enums/services'

export default ({
  account,
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsEfs
  data: { name: string; data: { [property: string]: any[] } }[]
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { FileSystemArn: id, KmsKeyId: kmsKeyId, FileSystemId: fileSystemId } = service
  const connections: ServiceConnection[] = []

  /**
   * Find KMS
   */
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(kmsKey => kmsKey.Arn === kmsKeyId)
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

  /**
   * Find EFS mount target
   */
  const efsMountTarget = data.find(({ name }) => name === services.efsMountTarget)
  if (efsMountTarget?.data?.[region]) {
    const mountTargetInRegion = efsMountTarget.data[region].filter(mt => mt.FileSystemId === fileSystemId)
    if (!isEmpty(mountTargetInRegion)) {
      for (const mountTarget of mountTargetInRegion) {
        connections.push({
          id: mountTarget.MountTargetId,
          resourceType: services.efsMountTarget,
          relation: 'child',
          field: 'efsMountTarget',
        })
      }
    }
  }

  const result = {
    [id]: connections,
  }
  return result
}
