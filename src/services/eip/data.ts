import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import EC2, { Address, DescribeAddressesResult } from 'aws-sdk/clients/ec2'

import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

/**
 * EIP
 */
const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EIP'
const errorLog = new AwsErrorLog(serviceName)
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
  config: Config
}): Promise<{ [property: string]: RawAwsEip[] }> =>
  new Promise(async resolve => {
    const eipData: RawAwsEip[] = []

    // Get all the EIP data for each region
    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })
      return new Promise<void>(resolveRegion =>
        ec2.describeAddresses(
          {},
          (err: AWSError, data: DescribeAddressesResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:describeAddresses',
                err,
              })
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
    errorLog.reset()

    resolve(groupBy(eipData, 'region'))
  })
