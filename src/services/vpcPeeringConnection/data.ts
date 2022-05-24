import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeVpcPeeringConnectionsRequest,
  DescribeVpcPeeringConnectionsResult,
  VpcPeeringConnection,
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
const serviceName = 'Vpc Peering Connection'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listVpcPeeringConnectionsData = async ({
  ec2,
  resolveRegion,
}: {
  ec2: EC2
  resolveRegion: () => void
}): Promise<VpcPeeringConnection[]> =>
  new Promise<VpcPeeringConnection[]>(resolve => {
    const vpcPeeringConnectionsList: VpcPeeringConnection[] = []
    let args: DescribeVpcPeeringConnectionsRequest = {}

    const listVpcPeeringConnections = (token?: string): void => {
      if (token) {
        args = { ...args, NextToken: token }
      }
      try {
        ec2.describeVpcPeeringConnections(
          args,
          (err: AWSError, data: DescribeVpcPeeringConnectionsResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:describeVpcPeeringConnections',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolveRegion()
            }

            const {
              NextToken: nextToken,
              VpcPeeringConnections: vpcPeeringConnections = [],
            } = data

            if (isEmpty(vpcPeeringConnections)) {
              return resolveRegion()
            }

            vpcPeeringConnectionsList.push(...vpcPeeringConnections)

            logger.debug(
              lt.fetchedVpcPeeringConnections(vpcPeeringConnections.length)
            )

            if (nextToken) {
              listVpcPeeringConnections(nextToken)
            } else {
              resolve(vpcPeeringConnectionsList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listVpcPeeringConnections()
  })

/**
 * Vpc Peering Connection
 */
export interface RawAwsVpcPeeringConnection
  extends Omit<VpcPeeringConnection, 'Tags'> {
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
  [region: string]: RawAwsVpcPeeringConnection[]
}> =>
  new Promise(async resolve => {
    const vpcPeeringConnectionsResult: RawAwsVpcPeeringConnection[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveRegion => {
        const vpcPeeringConnections = await listVpcPeeringConnectionsData({
          ec2,
          resolveRegion,
        })

        if (!isEmpty(vpcPeeringConnections)) {
          for (const vpcPeeringConnection of vpcPeeringConnections) {
            vpcPeeringConnectionsResult.push({
              ...vpcPeeringConnection,
              region,
              Tags: convertAwsTagsToTagMap(
                vpcPeeringConnection.Tags as AwsTag[]
              ),
            })
          }
        }

        resolveRegion()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(vpcPeeringConnectionsResult, 'region'))
  })
