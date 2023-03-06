import isEmpty from 'lodash/isEmpty'

import {
  Snapshot,
  TagList,
} from 'aws-sdk/clients/ec2'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'


/**
 * EBS Snapshot
 */

export default ({
    service: snapshot,
    data,
    region,
    account,
  }: {
    account: string
    data: { name: string; data: { [property: string]: any[] } }[]
    service: Snapshot & {
      region: string
      Tags?: TagList
    }
    region: string
}): { [key: string]: ServiceConnection[] } => {
    const connections: ServiceConnection[] = []

    const {
      SnapshotId: id,
      KmsKeyId: kmsKeyId,
    } = snapshot

    /**
     * Find KMS
     * related to the cloudTrail
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

    const snapshotResult = {
      [id]: connections,
    }
    return snapshotResult
}
