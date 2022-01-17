import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeVpnConnectionsResult,
  VpnConnection,
} from 'aws-sdk/clients/ec2'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { AwsTag, TagMap } from '../../types'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'VpnConnections'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const getVpnConnectionsData = async ({
  ec2,
  region,
}: {
  ec2: EC2
  region: string
  nextToken?: string
}): Promise<(VpnConnection & { region: string })[]> =>
  new Promise<(VpnConnection & { region: string })[]>(resolve => {
    let vpnConnectionData: (VpnConnection & { region: string })[] = []

    ec2.describeVpnConnections(
      {},
      (err: AWSError, data: DescribeVpnConnectionsResult) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'ec2:describeVpnConnections',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { VpnConnections: vpnConnections = [] } = data

          logger.debug(lt.fetchedVpnConnections(vpnConnections.length))

          vpnConnectionData = vpnConnections.map(vpnConnection => ({
            ...vpnConnection,
            region,
          }))
        }

        resolve(vpnConnectionData)
      }
    )
  })

/**
 * Vpn Connections
 */

export interface RawAwsVpnConnection extends Omit<VpnConnection, 'Tags'> {
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
  [region: string]: RawAwsVpnConnection[]
}> =>
  new Promise(async resolve => {
    const vpnConnectionsResult: RawAwsVpnConnection[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveVpnConnectionData => {
        // Get Vpn Connections Data
        const vpnConnections = await getVpnConnectionsData({ ec2, region })

        if (!isEmpty(vpnConnections)) {
          for (const vpnConnection of vpnConnections) {
            vpnConnectionsResult.push({
              ...vpnConnection,
              region,
              Tags: convertAwsTagsToTagMap(vpnConnection.Tags as AwsTag[]),
            })
          }
        }

        resolveVpnConnectionData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(vpnConnectionsResult, 'region'))
  })
