import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  Subnet,
  DescribeSubnetsResult,
  DescribeSubnetsRequest,
} from 'aws-sdk/clients/ec2'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import { Request } from 'aws-sdk/lib/request'

import CloudGraph from '@cloudgraph/sdk'
import { TagMap, AwsTag } from '../../types'

import awsLoggerText from '../../properties/logger'
// import { Tag } from '../../types/generated'
import { generateAwsErrorLog, initTestEndpoint } from '../../utils'
import { convertAwsTagsToTagMap } from '../../utils/format'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Subnet'
const endpoint = initTestEndpoint(serviceName)

/**
 * Subnets
 */

export interface RawAwsSubnet extends Omit<Subnet, 'Tags'> {
  region: string
  Tags: TagMap
}

export default ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsSubnet[] }> =>
  new Promise(async resolve => {
    const subnetData: RawAwsSubnet[] = []
    const regionPromises = []

    const listSubnetData = async ({
      ec2,
      region,
      token: NextToken = '',
      resolveSubnet,
    }: {
      ec2: EC2
      region: string
      token?: string
      resolveSubnet: () => void
    }): Promise<Request<DescribeSubnetsResult, AWSError>> => {
      let args: DescribeSubnetsRequest = {}

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeSubnets(
        args,
        (err: AWSError, data: DescribeSubnetsResult) => {
          if (err) {
            generateAwsErrorLog({
              serviceName,
              functionName: 'ec2:describeSubnets',
              err,
            })
          }

          /**
           * No Subnet data for this region
           */

          if (isEmpty(data)) {
            return resolveSubnet()
          }

          const { Subnets: subnets, NextToken: token } = data

          logger.debug(lt.fetchedSubnets(subnets.length))

          /**
           * No subnets Found
           */

          if (isEmpty(subnets)) {
            return resolveSubnet()
          }

          /**
           * Check to see if there are more
           */

          if (token) {
            listSubnetData({ region, token, ec2, resolveSubnet })
          }

          /**
           * Add the found subnets to the subnetData
           */

          subnetData.push(
            ...subnets.map(({ Tags, ...subnet }) => ({
              ...subnet,
              region,
              Tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
            }))
          )

          /**
           * If this is the last page of data then return
           */

          if (!token) {
            resolveSubnet()
          }
        }
      )
    }

    regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(resolveSubnet =>
        listSubnetData({ region, ec2, resolveSubnet })
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    resolve(groupBy(subnetData, 'region'))
  })
