import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import CloudWatch, {
  MetricAlarm,
  DescribeAlarmsInput,
  DescribeAlarmsOutput,
  ListTagsForResourceOutput,
  MetricAlarms,
} from 'aws-sdk/clients/cloudwatch'
import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import { TagMap, AwsTag } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { CLOUDWATCH_CUSTOM_DELAY } from '../../config/constants'

/**
 * Cloudwatch
 */
const lt = { ...awsLoggerText }
const MAX_ITEMS = 100
const { logger } = CloudGraph
const serviceName = 'Cloudwatch'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: CLOUDWATCH_CUSTOM_DELAY,
})

export interface RawAwsCloudwatch extends MetricAlarm {
  region: string
  Tags?: TagMap
}

const listMetricAlarmsForRegion = async ({
  cloudwatch,
  resolveRegion,
}: {
  cloudwatch: CloudWatch
  resolveRegion: () => void
}): Promise<MetricAlarm[]> =>
  new Promise<MetricAlarms>(resolve => {
    const metricAlarmsList: MetricAlarms = []
    const listMetricAlarmsOpts: DescribeAlarmsInput = {}
    const listAllAlarms = (token?: string): void => {
      listMetricAlarmsOpts.MaxRecords = MAX_ITEMS
      if (token) {
        listMetricAlarmsOpts.NextToken = token
      }
      try {
        cloudwatch.describeAlarms(
          listMetricAlarmsOpts,
          (err: AWSError, data: DescribeAlarmsOutput) => {
            const { NextToken: nextToken, MetricAlarms: metricAlarms } =
              data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'cloudwatch:describeAlarms',
                err,
              })
            }
            /**
             * No metrics for this region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            metricAlarmsList.push(...metricAlarms)

            if (nextToken) {
              logger.debug(lt.foundMoreCloudwatchAlarms(metricAlarms.length))
              listAllAlarms(nextToken)
            } else {
              resolve(metricAlarmsList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllAlarms()
  })

const getResourceTags = async (
  cloudwatch: CloudWatch,
  arn: string
): Promise<TagMap> =>
  new Promise<TagMap>(resolve => {
    try {
      cloudwatch.listTagsForResource(
        { ResourceARN: arn },
        (err: AWSError, data: ListTagsForResourceOutput) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'cloudwatch:listTagsForResource',
              err,
            })
            return resolve({})
          }
          const { Tags = [] } = data || {}
          resolve(convertAwsTagsToTagMap(Tags as AwsTag[]))
        }
      )
    } catch (error) {
      resolve({})
    }
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsCloudwatch[] }> =>
  new Promise(async resolve => {
    const cloudwatchData: Array<
      MetricAlarm & { Tags?: TagMap; region: string }
    > = []
    const regionPromises = []
    const tagsPromises = []

    // get all metrics for all regions
    regions.split(',').map(region => {
      const cloudwatch = new CloudWatch({
        ...config,
        region,
        endpoint,
      })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const metricAlarmsList = await listMetricAlarmsForRegion({
          cloudwatch,
          resolveRegion,
        })
        cloudwatchData.push(
          ...metricAlarmsList.map(metricAlarm => ({
            ...metricAlarm,
            region,
          }))
        )
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    logger.debug(lt.gettingCloudwatchAlarms)
    await Promise.all(regionPromises)

    // get all tags for each environment
    cloudwatchData.map(({ AlarmArn, region }, idx) => {
      const cloudwatch = new CloudWatch({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const tagsPromise = new Promise<void>(async resolveTags => {
        const envTags = await getResourceTags(cloudwatch, AlarmArn)
        cloudwatchData[idx].Tags = envTags
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    logger.debug(lt.gettingCloudwatchAlarmTags)
    await Promise.all(tagsPromises)
    errorLog.reset()

    resolve(groupBy(cloudwatchData, 'region'))
  })
