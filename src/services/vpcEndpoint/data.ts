import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeVpcEndpointsRequest,
  DescribeVpcEndpointsResult,
  VpcEndpoint,
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
const serviceName = 'Vpc Endpoint'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listVpcEndpointsData = async ({
  ec2,
  resolveRegion,
}: {
  ec2: EC2
  resolveRegion: () => void
}): Promise<VpcEndpoint[]> =>
  new Promise<VpcEndpoint[]>(resolve => {
    const vpcEndpointsList: VpcEndpoint[] = []
    let args: DescribeVpcEndpointsRequest = {}

    const listVpcEndpoints = (token?: string): void => {
      if (token) {
        args = { ...args, NextToken: token }
      }
      try {
        ec2.describeVpcEndpoints(
          args,
          (err: AWSError, data: DescribeVpcEndpointsResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:describeVpcEndpoints',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolveRegion()
            }

            const { NextToken: nextToken, VpcEndpoints: vpcEndpoints = [] } =
              data

            if (isEmpty(vpcEndpoints)) {
              return resolveRegion()
            }

            vpcEndpointsList.push(...vpcEndpoints)

            logger.debug(lt.fetchedVpcEndpoints(vpcEndpoints.length))

            if (nextToken) {
              listVpcEndpoints(nextToken)
            } else {
              resolve(vpcEndpointsList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listVpcEndpoints()
  })

/**
 * Vpc Endpoint
 */

export interface RawAwsVpcEndpoint extends Omit<VpcEndpoint, 'Tags'> {
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
  [region: string]: RawAwsVpcEndpoint[]
}> =>
  new Promise(async resolve => {
    const vpcEndpointsResult: RawAwsVpcEndpoint[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveRegion => {
        const vpcEndpoints = await listVpcEndpointsData({
          ec2,
          resolveRegion,
        })

        if (!isEmpty(vpcEndpoints)) {
          for (const vpcEndpoint of vpcEndpoints) {
            vpcEndpointsResult.push({
              ...vpcEndpoint,
              region,
              Tags: convertAwsTagsToTagMap(vpcEndpoint.Tags as AwsTag[]),
            })
          }
        }

        resolveRegion()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(vpcEndpointsResult, 'region'))
  })
