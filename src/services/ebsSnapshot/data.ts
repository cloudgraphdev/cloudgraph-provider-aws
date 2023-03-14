import EC2, {
  DescribeSnapshotsResult,
  DescribeSnapshotsRequest,
  Snapshot,
  CreateVolumePermission,
  DescribeSnapshotAttributeResult,
} from 'aws-sdk/clients/ec2'
import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import CloudGraph from '@cloudgraph/sdk'

import { AwsTag, TagMap } from '../../types'

import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'
import awsLoggerText from '../../properties/logger'

/**
 * EBS Snapshot
 */

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EBS'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsEBSSnapshot extends Omit<Snapshot, 'Tags'> {
  region: string
  Permissions?: CreateVolumePermission[]
  Tags?: TagMap
}

const listEbsSnapshotAttribute = async ({
  ec2,
  snapshotId,
}: {
  ec2: EC2
  snapshotId: string
}): Promise<CreateVolumePermission[]> =>
  new Promise(resolve =>
    ec2.describeSnapshotAttribute(
      {
        Attribute: 'createVolumePermission',
        SnapshotId: snapshotId,
      },
      (err: AWSError, data: DescribeSnapshotAttributeResult) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'ec2:describeSnapshotAttribute',
            err,
          })
        }

        if (isEmpty(data)) {
          return resolve([])
        }

        return resolve(data?.CreateVolumePermissions ?? [])
      }
    )
  )

const listEbsSnapshots = async ({
  ec2,
  region,
  nextToken: NextToken = '',
  ebsSnapshotData,
  resolveRegion,
}: {
  ec2: EC2
  region: string
  nextToken?: string
  ebsSnapshotData: RawAwsEBSSnapshot[]
  resolveRegion: () => void
}): Promise<void> => {
  let args: DescribeSnapshotsRequest = {
    OwnerIds: ['self']
  }

  if (NextToken) {
    args = { ...args, NextToken }
  }

  ec2.describeSnapshots(
    args,
    async (err: AWSError, data: DescribeSnapshotsResult) => {
      if (err) {
        errorLog.generateAwsErrorLog({
          functionName: 'ec2:describeSnapshots',
          err,
        })
      }

      /**
       * No EBS snapshot data for this region
       */
      if (isEmpty(data)) {
        return resolveRegion()
      }

      const { NextToken: nextToken, Snapshots: snapshots } = data || {}
      logger.debug(lt.fetchedEbsSnapshots(snapshots.length))

      /**
       * No EBS Snapshot Found
       */

      if (isEmpty(snapshots)) {
        return resolveRegion()
      }

      /**
       * Check to see if there are more
       */

      if (nextToken) {
        listEbsSnapshots({ region, nextToken, ec2, ebsSnapshotData, resolveRegion })
      }

      const ebsVolumes = []

      for (const { Tags, SnapshotId, ...snapshot } of snapshots) {
        let snapshotAttributes: CreateVolumePermission[] = []
        if (SnapshotId) {
          snapshotAttributes = await listEbsSnapshotAttribute({
            ec2,
            snapshotId: SnapshotId,
          })
        }
        ebsVolumes.push({
          ...snapshot,
          region,
          SnapshotId,
          Permissions: snapshotAttributes,
          Tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
        })
      }

      ebsSnapshotData.push(...ebsVolumes)

      /**
       * If this is the last page of data then return the instances
       */

      if (!nextToken) {
        resolveRegion()
      }
    }
  )
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: Snapshot & { region: string }[]
}> =>
  new Promise(async resolve => {
    const ebsSnapshotData: RawAwsEBSSnapshot[] = []
    const volumePromises: Promise<void>[] = []

    // Get all the EBS data for each region with its snapshots
    for (const region of regions.split(',')) {
      const ec2 = new EC2({ ...config, region, endpoint })

      volumePromises.push(
        new Promise<void>(resolveRegion =>
          listEbsSnapshots({ ec2, region, ebsSnapshotData, resolveRegion })
        )
      )
    }

    logger.debug(lt.fetchingEbsSnapshotData)
    // Fetch EBS volumes
    await Promise.all(volumePromises)

    errorLog.reset()

    resolve(groupBy(ebsSnapshotData, 'region'))
  })
