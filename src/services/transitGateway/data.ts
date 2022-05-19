import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeTransitGatewaysRequest,
  DescribeTransitGatewaysResult,
  TransitGateway,
  TransitGatewayList,
} from 'aws-sdk/clients/ec2'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import { AwsTag, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'TransitGateway'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listTransitGatewaysData = async ({
  ec2,
  resolveRegion,
}: {
  ec2: EC2
  resolveRegion: () => void
}): Promise<TransitGateway[]> =>
  new Promise<TransitGateway[]>(resolve => {
    const transitGatewayList: TransitGatewayList = []
    let args: DescribeTransitGatewaysRequest = {}

    const listTransitGateways = (token?: string): void => {
      if (token) {
        args = { ...args, NextToken: token }
      }
      try {
        ec2.describeTransitGateways(
          args,
          (err: AWSError, data: DescribeTransitGatewaysResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:describeTransitGateways',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolveRegion()
            }

            const {
              NextToken: nextToken,
              TransitGateways: transitGateways = [],
            } = data

            transitGatewayList.push(...transitGateways)

            logger.debug(lt.fetchedTransitGateways(transitGateways.length))

            if (nextToken) {
              listTransitGateways(nextToken)
            } else {
              resolve(transitGatewayList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listTransitGateways()
  })

/**
 * Transit Gateway
 */
export interface RawAwsTransitGateway extends Omit<TransitGateway, 'Tags'> {
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
  [region: string]: RawAwsTransitGateway[]
}> =>
  new Promise(async resolve => {
    const transitGatewaysResult: RawAwsTransitGateway[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveRegion => {
        // Get Transit Gateway Data
        const transitGateways = await listTransitGatewaysData({
          ec2,
          resolveRegion,
        })

        if (!isEmpty(transitGateways)) {
          for (const gateway of transitGateways) {
            transitGatewaysResult.push({
              ...gateway,
              region,
              Tags: convertAwsTagsToTagMap(gateway.Tags as AwsTag[]),
            })
          }
        }

        resolveRegion()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(transitGatewaysResult, 'region'))
  })
