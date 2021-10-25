import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
// import { AWSError } from 'aws-sdk/lib/error'
// import { Config } from 'aws-sdk/lib/config'
import { EC2, Address, DescribeAddressesResult } from '@aws-sdk/client-ec2'

import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

/**
 * EIP
 */
const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EIP'
const endpoint = initTestEndpoint(serviceName)

/**
 * EIP
 */
export interface RawAwsEip extends Omit<Address, 'Tags'> {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: any
}): Promise<{ [property: string]: RawAwsEip[] }> =>
  new Promise(async resolve => {
    const eipData: RawAwsEip[] = []

    // Get all the EIP data for each region
    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })
      return new Promise<void>(resolveRegion =>
        ec2.describeAddresses(
          {},
          (err: any, data: DescribeAddressesResult) => {
            if (err) {
              generateAwsErrorLog(serviceName, 'ec2:describeAddresses', err)
            }

            const { Addresses: addresses = [] } = data || {}
            logger.debug(lt.fetchedEips(addresses.length))

            const eipAddresses = addresses.map(({ Tags, ...eip }) => ({
              ...eip,
              Tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
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
