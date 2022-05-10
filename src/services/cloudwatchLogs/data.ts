import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import CloudwatchLogs, {
  DescribeLogGroupsRequest,
  DescribeLogGroupsResponse,
  LogGroup,
  LogGroups,
  DescribeMetricFiltersRequest,
  DescribeMetricFiltersResponse,
  MetricFilter,
  MetricFilters,
} from 'aws-sdk/clients/cloudwatchlogs'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Cloudwatch Logs'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listLogGroupsForRegion = async ({
  region,
  cloudwatchLogsInstance,
  resolveRegion,
}: {
  region: string
  cloudwatchLogsInstance: CloudwatchLogs
  resolveRegion: () => void
}): Promise<(LogGroup & { region: string })[]> =>
  new Promise<(LogGroup & { region: string })[]>(resolve => {
    let logGroupsData: (LogGroup & { region: string })[] = []
    const logGroupsList: LogGroups = []
    let args: DescribeLogGroupsRequest = {}
    const listAllLogGroups = (token?: string): void => {
      if (token) {
        args = { ...args, nextToken: token }
      }

      try {
        cloudwatchLogsInstance.describeLogGroups(
          args,
          (err: AWSError, data: DescribeLogGroupsResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'cloudwatch:describeLogGroups',
                err,
              })
            }

            /**
             * No log group for this region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            const { nextToken, logGroups } = data || {}

            logGroupsList.push(...logGroups)

            if (nextToken) {
              logger.debug(lt.foundMoreCloudwatchLogGroups(logGroups.length))
              listAllLogGroups(nextToken)
            }

            logGroupsData = logGroupsList.map(logGroup => ({
              ...logGroup,
              region,
            }))

            if (!nextToken) {
              resolve(logGroupsData)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllLogGroups()
  })

const listLogGroupMetricFilters = async ({
  cloudwatchLogsInstance,
  logGroupName,
}: {
  cloudwatchLogsInstance: CloudwatchLogs
  logGroupName: string
}): Promise<(MetricFilter & { LogGroupName: string }) | unknown> =>
  new Promise<(MetricFilter & { LogGroupName: string }) | unknown>(resolve => {
    const metricFiltersList: MetricFilters = []
    let args: DescribeMetricFiltersRequest = {}
    const listAllLogMetricFilters = (token?: string): void => {
      args = { ...args, logGroupName }
      if (token) {
        args = { ...args, nextToken: token }
      }

      try {
        cloudwatchLogsInstance.describeMetricFilters(
          args,
          (err: AWSError, data: DescribeMetricFiltersResponse) => {
            const { nextToken, metricFilters } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'cloudwatch:describeMetricFilters',
                err,
              })
            }

            /**
             * No metric filter for this region
             */
            if (isEmpty(data)) {
              return resolve([])
            }

            metricFiltersList.push(...metricFilters)

            if (nextToken) {
              logger.debug(
                lt.foundMoreCloudwatchMetricFilters(metricFilters.length)
              )
              listAllLogMetricFilters(nextToken)
            }

            resolve(metricFiltersList)
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllLogMetricFilters()
  })

/**
 * Cloudwatch Logs
 */

export interface RawAwsLogGroup extends LogGroup {
  MetricFilters?: MetricFilters
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsLogGroup[] }> =>
  new Promise(async resolve => {
    const cloudwatchLogsResult: RawAwsLogGroup[] = []

    // get all log groups for all regions
    const regionPromises = regions.split(',').map(region => {
      const cloudwatchLogsInstance = new CloudwatchLogs({
        ...config,
        region,
        endpoint,
      })
      return new Promise<void>(async resolveRegion => {
        let cloudwatchLogsData = await listLogGroupsForRegion({
          region,
          cloudwatchLogsInstance,
          resolveRegion,
        })

        if (!isEmpty(cloudwatchLogsData)) {
          const logGroupNames: string[] = cloudwatchLogsData.map(
            logGroup => logGroup.logGroupName
          )
          if (!isEmpty(logGroupNames)) {
            // Get Log Group Metric Filters
            const logGroupMetricFilters = await Promise.all(
              logGroupNames.map(logGroupName =>
                listLogGroupMetricFilters({
                  cloudwatchLogsInstance,
                  logGroupName,
                })
              )
            )
            if (!isEmpty(logGroupMetricFilters)) {
              cloudwatchLogsData = cloudwatchLogsData.map(logGroup => {
                const metricFilters = logGroupMetricFilters.find(
                  (filters: MetricFilter[]) =>
                    filters.find(
                      mf => mf.logGroupName === logGroup.logGroupName
                    )
                )

                return {
                  ...logGroup,
                  MetricFilters: metricFilters || [],
                }
              })
            }
          }

          for (const cloudwatchLog of cloudwatchLogsData) {
            cloudwatchLogsResult.push({
              ...cloudwatchLog,
              region,
            })
          }
        }
        resolveRegion()
      })
    })

    logger.debug(lt.gettingCloudwatchLogGroups)
    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(cloudwatchLogsResult, 'region'))
  })
