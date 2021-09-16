import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { Request } from 'aws-sdk'
import EC2, {
  DescribeRouteTablesRequest,
  DescribeRouteTablesResult,
  RouteTable,
} from 'aws-sdk/clients/ec2'
import { AWSError } from 'aws-sdk/lib/error'

import { Credentials, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { generateAwsErrorLog, initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Route Table'
const endpoint = initTestEndpoint(serviceName)

/**
 * Route Table
 */
export interface RawAwsRouteTable extends Omit<RouteTable, 'Tags'> {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: RawAwsRouteTable[]
}> =>
  new Promise(async resolve => {
    const routeTableData = []
    const regionPromises = []

    const listRouteTableData = async ({
      ec2,
      region,
      token: NextToken = '',
      resolveRegion,
    }: {
      ec2: EC2
      region: string
      token?: string
      resolveRegion: () => void
    }): Promise<Request<EC2.Types.DescribeRouteTablesResult, AWSError>> => {
      let args: DescribeRouteTablesRequest = {}

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeRouteTables(
        args,
        (err: AWSError, data: DescribeRouteTablesResult) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'ec2:describeRouteTables', err)
          }

          /**
           * No Route Table data for this region
           */
          if (isEmpty(data)) {
            return resolveRegion()
          }

          const { RouteTables: routeTables, NextToken: token } = data

          logger.debug(lt.fetchedRouteTables(routeTables.length))

          /**
           * No Route Tables Found
           */

          if (isEmpty(routeTables)) {
            return resolveRegion()
          }

          /**
           * Check to see if there are more
           */

          if (token) {
            listRouteTableData({ region, token, ec2, resolveRegion })
          }

          /**
           * Add the found Route Tables to the routeTableData
           */

          routeTableData.push(
            ...routeTables.map(({ Tags, ...rt }) => ({
              ...rt,
              region,
              Tags: (Tags || [])
                .map(({ Key, Value }) => ({ [Key]: Value }))
                .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
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
        listRouteTableData({ ec2, region, resolveRegion })
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    resolve(groupBy(routeTableData, 'region'))
  })
