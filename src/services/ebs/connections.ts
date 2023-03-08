import isEmpty from 'lodash/isEmpty'

import {
  Volume,
  Snapshot,
  TagList,
} from 'aws-sdk/clients/ec2'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'

/**
 * EBS
 */

export default ({
    service: volume,
    data,
    region,
    account,
  }: {
    account: string
    data: { name: string; data: { [property: string]: any[] } }[]
    service: Volume & {
      region: string
      Tags?: TagList
    }
    region: string
}): { [key: string]: ServiceConnection[] } => {
    const connections: ServiceConnection[] = []

    const {
      VolumeId: id,
      SnapshotId: snapshotId,
    } = volume

    /**
     * Find EBS Snapshot
     * related to this EBS Volume
     */
    const ebsSnapshots: {
      name: string
      data: { [property: string]: Snapshot[] }
    } = data.find(({ name }) => name === services.ebsSnapshot)

    if (ebsSnapshots?.data?.[region]) {
      const snapshotInRegion: Snapshot[] = ebsSnapshots.data[region].filter(
        ({ SnapshotId }: Snapshot) => SnapshotId === snapshotId
      )
  
      if (!isEmpty(snapshotInRegion)) {
        for (const sh of snapshotInRegion) {
          connections.push({
            id: sh.SnapshotId,
            resourceType: services.ebsSnapshot,
            relation: 'child',
            field: 'ebsSnapshots',
          })
        }
      }
    }

    const ebsResult = {
      [id]: connections,
    }
    return ebsResult
}
