import { Request } from 'aws-sdk'
import EC2, {
  DescribeNatGatewaysRequest,
  DescribeNatGatewaysResult,
  NatGateway,
} from 'aws-sdk/clients/ec2'
import { AWSError } from 'aws-sdk/lib/error'

import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import awsLoggerText from '../../properties/logger'
import { AwsTag, Credentials, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'NAT Gateway'
const endpoint = initTestEndpoint(serviceName)

/**
 * NAT Gateway
 */
export interface RawAwsNATGateway extends Omit<NatGateway, 'Tags'> {
  region: string
  Tags: TagMap
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{ [property: string]: RawAwsNATGateway[] }> =>
  new Promise(async resolve => {
    const natGatewayData: RawAwsNATGateway[] = []
    const regionPromises = []

    const listNatGatewayData = async ({
      ec2,
      region,
      token: NextToken = '',
      resolveRegion,
    }: {
      ec2: EC2
      region: string
      token?: string
      resolveRegion: () => void
    }): Promise<Request<DescribeNatGatewaysResult, AWSError>> => {
      let args: DescribeNatGatewaysRequest = {}

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeNatGateways(
        args,
        (err: AWSError, data: DescribeNatGatewaysResult) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'ec2:describeNatGateways', err)
          }

          /**
           * No Nat Gateway data for this region
           */
          if (isEmpty(data)) {
            return resolveRegion()
          }

          const { NatGateways: natGateways, NextToken: token } = data

          logger.debug(lt.fetchedNatGateways(natGateways.length))

          /**
           * No Nat Gateways Found
           */

          if (isEmpty(natGateways)) {
            return resolveRegion()
          }

          /**
           * Check to see if there are more
           */

          if (token) {
            listNatGatewayData({ region, token, ec2, resolveRegion })
          }

          /**
           * Add the found Nat Gateways to the natGatewayData
           */

          natGatewayData.push(
            ...natGateways.map(({ Tags, ...nat }) => ({
              ...nat,
              region,
              Tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
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
        listNatGatewayData({ ec2, region, resolveRegion })
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    resolve(groupBy(natGatewayData, 'region'))
  })
