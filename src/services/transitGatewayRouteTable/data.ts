import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeTransitGatewayRouteTablesRequest,
  DescribeTransitGatewayRouteTablesResult,
  SearchTransitGatewayRoutesRequest,
  SearchTransitGatewayRoutesResult,
  TransitGatewayRoute,
  TransitGatewayRouteTable,
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
const serviceName = 'Transit Gateway Route Table'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listTransitGatewayRouteTablesData = async ({
  ec2,
  resolveRegion,
}: {
  ec2: EC2
  resolveRegion: () => void
}): Promise<TransitGatewayRouteTable[]> =>
  new Promise<TransitGatewayRouteTable[]>(resolve => {
    const transitGatewayRouteTableList: TransitGatewayRouteTable[] = []
    let args: DescribeTransitGatewayRouteTablesRequest = {}

    const listTransitGatewayRouteTables = (token?: string): void => {
      if (token) {
        args = { ...args, NextToken: token }
      }
      try {
        ec2.describeTransitGatewayRouteTables(
          args,
          (err: AWSError, data: DescribeTransitGatewayRouteTablesResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:describeTransitGatewayRouteTables',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolveRegion()
            }

            const {
              NextToken: nextToken,
              TransitGatewayRouteTables: transitGatewayRouteTables = [],
            } = data

            if (isEmpty(transitGatewayRouteTables)) {
              return resolveRegion()
            }

            transitGatewayRouteTableList.push(...transitGatewayRouteTables)

            logger.debug(
              lt.fetchedTransitGatewayRouteTables(
                transitGatewayRouteTables.length
              )
            )

            if (nextToken) {
              listTransitGatewayRouteTables(nextToken)
            } else {
              resolve(transitGatewayRouteTableList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listTransitGatewayRouteTables()
  })

const searchTransitGatewayRoutes = async ({
  ec2,
  transitGatewayRouteTableId,
}: {
  ec2: EC2
  transitGatewayRouteTableId: string
}): Promise<TransitGatewayRoute[]> =>
  new Promise<TransitGatewayRoute[]>(resolve => {
    const args: SearchTransitGatewayRoutesRequest = {
      TransitGatewayRouteTableId: transitGatewayRouteTableId,
      Filters: [
        {
          Name: 'type',
          Values: ['propagated', 'static'],
        },
      ],
    }
    ec2.searchTransitGatewayRoutes(
      args,
      (err: AWSError, data: SearchTransitGatewayRoutesResult) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'ec2:searchTransitGatewayRoutes',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { Routes: routes = [] } = data
          resolve(routes)
        }

        resolve([])
      }
    )
  })

/**
 * Transit Gateway Route Table
 */
export interface RawAwsTransitGatewayRouteTable
  extends Omit<TransitGatewayRouteTable, 'Tags'> {
  region: string
  Tags?: TagMap
  Routes?: TransitGatewayRoute[]
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsTransitGatewayRouteTable[]
}> =>
  new Promise(async resolve => {
    const transitGatewayRouteTableResult: RawAwsTransitGatewayRouteTable[] = []
    const routesPromises = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveRegion => {
        // Get Transit Gateway Route Table Data
        const transitGatewayRouteTables =
          await listTransitGatewayRouteTablesData({
            ec2,
            resolveRegion,
          })

        if (!isEmpty(transitGatewayRouteTables)) {
          for (const routeTable of transitGatewayRouteTables) {
            transitGatewayRouteTableResult.push({
              ...routeTable,
              region,
              Tags: convertAwsTagsToTagMap(routeTable.Tags as AwsTag[]),
            })
          }
        }

        resolveRegion()
      })
    })

    await Promise.all(regionPromises)

    transitGatewayRouteTableResult.map(
      (
        { TransitGatewayRouteTableId: transitGatewayRouteTableId, region },
        idx
      ) => {
        const ec2 = new EC2({ ...config, region, endpoint })
        const routePromise = new Promise<void>(async resolveRoute => {
          const routes: TransitGatewayRoute[] =
            await searchTransitGatewayRoutes({
              ec2,
              transitGatewayRouteTableId,
            })
          transitGatewayRouteTableResult[idx] = {
            ...transitGatewayRouteTableResult[idx],
            Routes: routes || [],
          }
          resolveRoute()
        })
        routesPromises.push(routePromise)
      }
    )
    await Promise.all(routesPromises)

    errorLog.reset()
    resolve(groupBy(transitGatewayRouteTableResult, 'region'))
  })
