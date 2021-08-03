import * as Sentry from '@sentry/node'
import CloudGraph from '@cloudgraph/sdk'

import EC2, {
  DescribeInternetGatewaysResult,
  InternetGateway,
} from 'aws-sdk/clients/ec2'
import { AWSError } from 'aws-sdk/lib/error'

import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { Credentials } from '../../types'
import awsLoggerText from '../../properties/logger'
import { Tag } from '../../types/generated'
import environment from '../../config/environment'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const endpoint =
  (environment.NODE_ENV === 'test' && environment.LOCALSTACK_AWS_ENDPOINT) ||
  undefined
endpoint && logger.log('IGW getData in test mode!')
/**
 * IGW
 */

export interface RawAwsIgw extends Omit<InternetGateway, 'Tags'> {
  Tags: Tag[]
  region: string
}

export default async ({
  credentials,
  regions,
}: {
  credentials: Credentials
  regions: string
}): Promise<{ [property: string]: RawAwsIgw[] }> =>
  new Promise(async resolve => {
    const igwData: RawAwsIgw[] = []
    const regionPromises = []

    const listIgwData = async ({
      ec2,
      region,
      token: NextToken = '',
      resolveRegion,
    }) => {
      let args: any = {}

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeInternetGateways(
        args,
        (err: AWSError, data: DescribeInternetGatewaysResult) => {
          if (err) {
            logger.error(err)
            Sentry.captureException(new Error(err.message))
          }

          /**
           * No IGW data for this region
           */
          if (isEmpty(data)) {
            return resolveRegion()
          }

          const { InternetGateways: igws, NextToken: token } = data

          logger.debug(lt.fetchedIgws(igws.length))

          /**
           * No IGWs Found
           */

          if (isEmpty(igws)) {
            return resolveRegion()
          }

          /**
           * Check to see if there are more
           */

          if (token) {
            listIgwData({ region, token, ec2, resolveRegion })
          }

          /**
           * Add the found IGWs to the igwData
           */

          igwData.push(
            ...igws.map(({ Tags, ...igw }) => ({
              ...igw,
              region,
              Tags: Tags.map(({ Key, Value }) => ({
                key: Key,
                value: Value,
              })),
            }))
          )

          /**
           * If this is the last page of data then return
           */

          if (!token) {
            resolveRegion()
          }
        }
      )
    }

    regions.split(',').map(region => {
      const ec2 = new EC2({ region, credentials, endpoint })
      const regionPromise = new Promise<void>(resolveRegion =>
        listIgwData({ ec2, region, resolveRegion })
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    resolve(groupBy(igwData, 'region'))
  })
