import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, { DescribeVpnGatewaysResult, VpnGateway } from 'aws-sdk/clients/ec2'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { AwsTag, TagMap } from '../../types'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'VpnGateway'
const endpoint = initTestEndpoint(serviceName)

const listVpnGatewaysData = async ({
  ec2,
  region,
}: {
  ec2: EC2
  region: string
  nextToken?: string
}): Promise<(VpnGateway & { region: string })[]> =>
  new Promise<(VpnGateway & { region: string })[]>(resolve => {
    let vpnGatewayData: (VpnGateway & { region: string })[] = []

    ec2.describeVpnGateways(
      {},
      (err: AWSError, data: DescribeVpnGatewaysResult) => {
        if (err) {
          generateAwsErrorLog({
            serviceName,
            functionName: 'ec2:describeVpnGateways',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { VpnGateways: vpnGateways = [] } = data

          logger.debug(lt.fetchedVpnGateways(vpnGateways.length))

          vpnGatewayData = vpnGateways.map(gateway => ({
            ...gateway,
            region,
          }))
        }

        resolve(vpnGatewayData)
      }
    )
  })

/**
 * Vpn Gateway
 */

export interface RawAwsVpnGateway extends Omit<VpnGateway, 'Tags'> {
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
  [region: string]: RawAwsVpnGateway[]
}> =>
  new Promise(async resolve => {
    const vpnGatewaysResult: RawAwsVpnGateway[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveVpnGatewayData => {
        // Get Vpn Gateway Data
        const vpnGateways = await listVpnGatewaysData({ ec2, region })

        if (!isEmpty(vpnGateways)) {
          for (const vpnGateway of vpnGateways) {
            vpnGatewaysResult.push({
              ...vpnGateway,
              region,
              Tags: convertAwsTagsToTagMap(vpnGateway.Tags as AwsTag[]),
            })
          }
        }

        resolveVpnGatewayData()
      })
    })

    await Promise.all(regionPromises)

    resolve(groupBy(vpnGatewaysResult, 'region'))
  })
