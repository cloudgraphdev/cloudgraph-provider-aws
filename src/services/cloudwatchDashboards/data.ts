import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import CloudWatch, {
  DashboardEntries,
  ListDashboardsOutput,
  ListDashboardsInput,
  DashboardEntry,
} from 'aws-sdk/clients/cloudwatch'
import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

/**
 * Cloudwatch Dashboard
 */
const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'CloudwatchDashboard'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsCloudwatchDashboard extends DashboardEntry {
  region: string
}

const listDashboardsForRegion = async ({
  cloudwatch,
  resolveRegion,
}: {
  cloudwatch: CloudWatch
  resolveRegion: () => void
}): Promise<DashboardEntries> =>
  new Promise<DashboardEntries>(resolve => {
    const dashboardList: DashboardEntries = []
    const listDashboardOpts: ListDashboardsInput = {}
    const listAllDashboard = (token?: string): void => {
      if (token) {
        listDashboardOpts.NextToken = token
      }
      try {
        cloudwatch.listDashboards(
          listDashboardOpts,
          (err: AWSError, data: ListDashboardsOutput) => {
            const { NextToken: nextToken, DashboardEntries: entries } =
              data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'cloudwatch:listDashboards',
                err,
              })
            }
            /**
             * No dashboard for this region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            dashboardList.push(...entries)

            if (nextToken) {
              listAllDashboard(nextToken)
            } else {
              resolve(dashboardList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllDashboard()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsCloudwatchDashboard[] }> =>
  new Promise(async resolve => {
    const cloudwatchData: RawAwsCloudwatchDashboard[] = []
    const regionPromises = []

    // get all dashboard for all regions
    regions.split(',').forEach(region => {
      const cloudwatch = new CloudWatch({
        ...config,
        region,
        endpoint,
      })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const dashboards = await listDashboardsForRegion({
          cloudwatch,
          resolveRegion,
        })
        cloudwatchData.push(
          ...dashboards.map(dashboard => ({ ...dashboard, region }))
        )
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    logger.debug(lt.gettingCloudwatchDashboards)
    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(cloudwatchData, 'region'))
  })
