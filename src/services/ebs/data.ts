import * as Sentry from '@sentry/node'

import EC2, {
  DescribeVolumesResult,
  DescribeVolumesRequest,
  Volume,
} from 'aws-sdk/clients/ec2'
import { AWSError } from 'aws-sdk/lib/error'

import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import CloudGraph from '@cloudgraph/sdk'

import environment from '../../config/environment'
import { Credentials } from '../../types'

import awsLoggerText from '../../properties/logger'

/**
 * EBS
 */

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const endpoint =
  (environment.NODE_ENV === 'test' && environment.LOCALSTACK_AWS_ENDPOINT) ||
  undefined
endpoint && logger.debug('EBS getData in test mode!')

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
  ebsData: Volume & { region: string }[]
  resolveRegion: () => void
}): Promise<void> => {
  let args: DescribeVolumesRequest = {}

  if (NextToken) {
    args = { ...args, NextToken }
  }

  ec2.describeVolumes(args, (err: AWSError, data: DescribeVolumesResult) => {
    if (err) {
      logger.error(err)
      Sentry.captureException(new Error(err.message))
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

    ebsData.push(
      ...volumes.map(volume => ({
        ...volume,
        region,
      }))
    )

    /**
     * If this is the last page of data then return the instances
     */

    if (!nextToken) {
      resolveRegion()
    }
  })
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: Volume & { region: string }[]
}> =>
  new Promise(async resolve => {
    const ebsData: Volume & { region: string }[] = []

    // Get all the EBS data for each region
    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ region, credentials, endpoint })
      return new Promise<void>(resolveRegion =>
        listEbsVolumes({ ec2, region, ebsData, resolveRegion })
      )
    })

    logger.debug(lt.fetchingEbsData)
    await Promise.all(regionPromises)

    resolve(groupBy(ebsData, 'region'))
  })
