import * as Sentry from '@sentry/node'
import CloudGraph from 'cloud-graph-sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import CloudWatch, { MetricAlarm, TagList } from 'aws-sdk/clients/cloudwatch'
import {
  DescribeAlarmsInput,
  DescribeAlarmsOutput,
  ListTagsForResourceOutput,
  MetricAlarms,
} from 'aws-sdk/clients/cloudwatch'
import { AWSError } from 'aws-sdk/lib/error'

import { Credentials } from '../../types'
import { awsLoggerText } from '../../properties/logger'
import { Tag } from '../../types/generated'

/**
 * Cloudwatch
 */
const lt = { ...awsLoggerText }
const MAX_ITEMS = 100
const logger = CloudGraph.logger
const endpoint =
  (process.env.NODE_ENV === 'test' && process.env.LOCALSTACK_AWS_ENDPOINT) ||
  undefined
endpoint && logger.info('Cloudwatch getData in test mode!')

const listMetricAlarmsForRegion = async ({ cloudwatch, resolveRegion }) =>
  new Promise<MetricAlarms>(resolve => {
    const metricAlarmsList: MetricAlarms = []
    const listMetricAlarmsOpts: DescribeAlarmsInput = {}
    const listAllAlarms = (token?: string) => {
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
              logger.error(err)
              Sentry.captureException(new Error(err.message))
            }
            /**
             * No metrics for this region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            metricAlarmsList.push(...metricAlarms)

            if (nextToken) {
              logger.info(lt.foundMoreCloudwatchAlarms(metricAlarms.length))
              listAllAlarms(nextToken)
            }

            resolve(metricAlarmsList)
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllAlarms()
  })

const getResourceTags = async (cloudwatch: CloudWatch, arn: string) =>
  new Promise<Tag[]>(resolve => {
    try {
      cloudwatch.listTagsForResource(
        { ResourceARN: arn },
        (err: AWSError, data: ListTagsForResourceOutput) => {
          if (err) {
            logger.error(err)
            Sentry.captureException(new Error(err.message))
            return resolve([])
          }
          const { Tags = [] } = data || {}
          const tags =
            Tags.map(({ Key, Value }) => ({
              key: Key,
              value: Value,
            })) || []
          resolve(tags)
        }
      )
    } catch (error) {
      resolve([])
    }
  })

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}) =>
  new Promise(async resolve => {
    const cloudwatchData: Array<
      MetricAlarm & { tags?: Tag[]; region: string }
    > = []
    const regionPromises = []
    const tagsPromises = []

    // get all metrics for all regions
    regions.split(',').map(region => {
      const cloudwatch = new CloudWatch({
        region,
        credentials,
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

    logger.info(lt.gettingCloudwatchAlarms)
    await Promise.all(regionPromises)

    // get all tags for each environment
    cloudwatchData.map(({ AlarmArn, region }, idx) => {
      const cloudwatch = new CloudWatch({ region, credentials, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        const envTags = await getResourceTags(cloudwatch, AlarmArn)
        cloudwatchData[idx].tags = envTags
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })

    logger.info(lt.gettingCloudwatchAlarmTags)
    await Promise.all(tagsPromises)

    resolve(groupBy(cloudwatchData, 'region'))
  })
