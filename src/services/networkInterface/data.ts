import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeNetworkInterfacesRequest,
  DescribeNetworkInterfacesResult,
  NetworkInterface,
} from 'aws-sdk/clients/ec2'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

/**
 * Network Interface
 */

export interface RawNetworkInterface extends Omit<NetworkInterface, 'TagSet'> {
  region: string
  Tags?: { [key: string]: any }
}

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Network Interface'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listNetworkInterfaces = async ({
  ec2,
  region,
  nextToken: NextToken = '',
  networkInterfacesData,
  resolveRegion,
}: {
  ec2: EC2
  region: string
  nextToken?: string
  networkInterfacesData: (NetworkInterface & { region: string })[]
  resolveRegion: () => void
}): Promise<void> => {
  let args: DescribeNetworkInterfacesRequest = {}

  if (NextToken) {
    args = { ...args, NextToken }
  }

  ec2.describeNetworkInterfaces(
    args,
    (err: AWSError, data: DescribeNetworkInterfacesResult) => {
      if (err) {
        errorLog.generateAwsErrorLog({
          functionName: 'ec2:describeNetworkInterfaces',
          err,
        })
      }

      /**
       * No Network Interfaces data for this region
       */
      if (isEmpty(data)) {
        return resolveRegion()
      }

      const { NextToken: nextToken, NetworkInterfaces: networkInterfaces } =
        data || {}
      logger.debug(lt.fetchedNetworkInterfaces(networkInterfaces.length))

      /**
       * No Network Interfaces Found
       */

      if (isEmpty(networkInterfaces)) {
        return resolveRegion()
      }

      /**
       * Check to see if there are more
       */

      if (nextToken) {
        listNetworkInterfaces({
          region,
          nextToken,
          ec2,
          networkInterfacesData,
          resolveRegion,
        })
      }

      networkInterfacesData.push(
        ...networkInterfaces.map(({ TagSet, ...networkInterface }) => ({
          ...networkInterface,
          Tags: (TagSet || [])
            .map(({ Key, Value }) => ({ [Key]: Value }))
            .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
          region,
        }))
      )

      /**
       * If this is the last page of data then return the interfaces
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
  [region: string]: RawNetworkInterface[]
}> =>
  new Promise(async resolve => {
    const networkInterfacesData: RawNetworkInterface[] = []

    // Get all the network interfaces for each region
    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })
      return new Promise<void>(resolveRegion =>
        listNetworkInterfaces({
          ec2,
          region,
          networkInterfacesData,
          resolveRegion,
        })
      )
    })

    logger.debug(lt.lookingForNetworkInterfaces)
    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(networkInterfacesData, 'region'))
  })
