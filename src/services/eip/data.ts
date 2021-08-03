import * as Sentry from '@sentry/node'
// import CloudGraph, { Opts } from '@cloudgraph/sdk'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import { AWSError } from 'aws-sdk/lib/error'
import EC2, { DescribeAddressesResult } from 'aws-sdk/clients/ec2'

import { Credentials } from '../../types'
import environment from '../../config/environment'
import awsLoggerText from '../../properties/logger'

/**
 * EIP
 */

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const endpoint =
  (environment.NODE_ENV === 'test' && environment.LOCALSTACK_AWS_ENDPOINT) ||
  undefined
endpoint && logger.info('EIP getData in test mode!')

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}) =>
  new Promise(async resolve => {
    const eipData: DescribeAddressesResult & { region: string }[] = []

    // Get all the EIB data for each region
    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ region, credentials, endpoint })
      return new Promise<void>(resolveRegion =>
        ec2.describeAddresses(
          {},
          (err: AWSError, data: DescribeAddressesResult) => {
            if (err) {
              logger.error('Therew as an error in Service EIP function describeAddresses')
              logger.debug(err)
              Sentry.captureException(new Error(err.message))
            }

            const { Addresses: addresses = [] } = data || {}
            logger.debug(lt.fetchedEips(addresses.length))

            const eipAddresses = addresses.map(address => ({
              ...address,
              region,
            }))

            eipData.push(...eipAddresses)

            resolveRegion()
          }
        )
      )
    })

    logger.debug(lt.fetchingEip)
    await Promise.all(regionPromises)

    resolve(groupBy(eipData, 'region'))
  })
