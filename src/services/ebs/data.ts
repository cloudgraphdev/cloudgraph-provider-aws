import EC2, {
  DescribeVolumesResult,
  DescribeVolumesRequest,
  Volume,
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
 * EBS
 */

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EBS'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsEBS extends Omit<Volume, 'Tags'> {
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

        return resolve(data?.CreateVolumePermissions)
      }
    )
  )

const listEbsVolumes = async ({
  ec2,
  region,
  nextToken: NextToken = '',
  ebsData,
  resolveRegion,
}: {
  ec2: EC2
  region: string
  nextToken?: string
  ebsData: RawAwsEBS[]
  resolveRegion: () => void
}): Promise<void> => {
  let args: DescribeVolumesRequest = {}

  if (NextToken) {
    args = { ...args, NextToken }
  }
  ec2.describeVolumes(
    args,
    async (err: AWSError, data: DescribeVolumesResult) => {
      if (err) {
        errorLog.generateAwsErrorLog({
          functionName: 'ec2:describeVolumes',
          err,
        })
      }

      /**
       * No EBS data for this region
       */
      if (isEmpty(data)) {
        return resolveRegion()
      }

      const { NextToken: nextToken, Volumes: volumes } = data || {}
      logger.debug(lt.fetchedEbsVolumes(volumes.length))

      /**
       * No EBS Volumes Found
       */

      if (isEmpty(volumes)) {
        return resolveRegion()
      }

      /**
       * Check to see if there are more
       */

      if (nextToken) {
        listEbsVolumes({ region, nextToken, ec2, ebsData, resolveRegion })
      }

      const ebsVolumes = []

      for (const { Tags, SnapshotId, ...volume } of volumes) {
        let snapshotAttributes: CreateVolumePermission[] = []
        if (SnapshotId) {
          snapshotAttributes = await listEbsSnapshotAttribute({
            ec2,
            snapshotId: SnapshotId,
          })
        }
        ebsVolumes.push({
          ...volume,
          region,
          SnapshotId,
          Permissions: snapshotAttributes,
          Tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
        })
      }

      ebsData.push(...ebsVolumes)

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
  [region: string]: Volume & { region: string }[]
}> =>
  new Promise(async resolve => {
    const ebsData: RawAwsEBS[] = []
    const volumePromises: Promise<void>[] = []

    // Get all the EBS data for each region with its snapshots
    for (const region of regions.split(',')) {
      const ec2 = new EC2({ ...config, region, endpoint })

      volumePromises.push(
        new Promise<void>(resolveRegion =>
          listEbsVolumes({ ec2, region, ebsData, resolveRegion })
        )
      )
    }

    logger.debug(lt.fetchingEbsData)
    // Fetch EBS volumes
    await Promise.all(volumePromises)

    errorLog.reset()

    resolve(groupBy(ebsData, 'region'))
  })
