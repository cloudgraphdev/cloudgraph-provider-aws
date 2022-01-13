import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  ClientVpnEndpoint,
  DescribeClientVpnEndpointsResult,
  DescribeClientVpnEndpointsRequest,
} from 'aws-sdk/clients/ec2'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import { AwsTag, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ClientVpnEndpoint'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

/**
 * Client Vpn Endpoint
 */

const listClientVpnEndpoints = async ({
  ec2,
  region,
  nextToken: NextToken = '',
  clientVpnEndpointData,
  resolveRegion,
}: {
  ec2: EC2
  region: string
  nextToken?: string
  clientVpnEndpointData: ClientVpnEndpoint & { region: string }[]
  resolveRegion: () => void
}): Promise<void> => {
  let args: DescribeClientVpnEndpointsRequest = {}

  if (NextToken) {
    args = { ...args, NextToken }
  }

  ec2.describeClientVpnEndpoints(
    args,
    (err: AWSError, data: DescribeClientVpnEndpointsResult) => {
      if (err) {
        errorLog.generateAwsErrorLog({
          functionName: 'ec2:describeClientVpnEndpoints',
          err,
        })
      }

      /**
       * No Client Vpn Endpoint data for this region
       */
      if (isEmpty(data)) {
        return resolveRegion()
      }

      const { ClientVpnEndpoints: endpoints, NextToken: nextToken } = data || {}

      logger.debug(lt.fetchedClientVpnEndpoints(endpoints.length))

      /**
       * No Client Vpn Endpoints Found
       */

      if (isEmpty(endpoints)) {
        return resolveRegion()
      }

      /**
       * Check to see if there are more
       */

      if (nextToken) {
        listClientVpnEndpoints({
          ec2,
          region,
          nextToken,
          clientVpnEndpointData,
          resolveRegion,
        })
      }

      /**
       * Add the found Client Vpn Endpoints to the clientVpnEndpointData
       */

      clientVpnEndpointData.push(
        ...endpoints.map(clientVpnEndpoint => ({
          ...clientVpnEndpoint,
          region,
          Tags: convertAwsTagsToTagMap(clientVpnEndpoint.Tags as AwsTag[]),
        }))
      )

      /**
       * If this is the last page of data then return
       */

      if (!nextToken) {
        resolveRegion()
      }
    }
  )
}

export interface RawAwsClientVpnEndpoint
  extends Omit<ClientVpnEndpoint, 'Tags'> {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsClientVpnEndpoint[]
}> =>
  new Promise(async resolve => {
    const clientVpnEndpointData: ClientVpnEndpoint & { region: string }[] = []

    // Get all the Client Vpn Endpoint data for each region
    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })
      return new Promise<void>(resolveRegion =>
        listClientVpnEndpoints({
          ec2,
          region,
          clientVpnEndpointData,
          resolveRegion,
        })
      )
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(clientVpnEndpointData, 'region'))
  })
