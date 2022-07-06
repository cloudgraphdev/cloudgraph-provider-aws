import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import camelCase from 'lodash/camelCase'

import EC2, {
  DescribeIamInstanceProfileAssociationsResult,
  DescribeInstancesRequest,
  DescribeInstancesResult,
  DescribeKeyPairsResult,
  DescribeTagsRequest,
  DescribeTagsResult,
  IamInstanceProfile,
  Instance,
  InstanceAttribute,
  DescribeImagesResult,
} from 'aws-sdk/clients/ec2'
import CloudWatch, {
  GetMetricDataInput,
  MetricDataQueries,
  Timestamps,
} from 'aws-sdk/clients/cloudwatch'
import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import CloudGraph, { generateUniqueId } from '@cloudgraph/sdk'

import metricsTypes, { metricStats } from './metrics'
import { TagMap, AwsTag } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'
import getIamInstanceProfiles, {
  RawAwsInstanceProfile,
} from '../iamInstanceProfile/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EC2'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const cwGetMetricDataLimit = 500

export interface RawAwsEC2 extends Omit<Instance, 'Tags'> {
  region: string
  DisableApiTermination?: boolean
  KeyPair?: {
    id: string
    fingerprint: string
    name: string
    type: string
    tags: TagMap
  }
  Tags?: TagMap
  IamInstanceProfile?: IamInstanceProfile
  cloudWatchMetricData?: any
  PlatformDetails?: string
  IamRolesArn?: string[]
}

/**
 * EC2
 */

export default async ({
  regions,
  config,
  rawData,
}: {
  regions: string
  config: Config
  rawData: any
}): Promise<{
  [region: string]: RawAwsEC2[]
}> =>
  new Promise(async resolve => {
    const ec2Instances: RawAwsEC2[] = []

    /**
     * Step 1) for all regions, list the EC2 Instances
     */

    const listEc2Instances = async ({
      ec2,
      region,
      nextToken: NextToken = '',
      resolveRegion,
    }: {
      ec2: EC2
      region: string
      nextToken?: string
      resolveRegion: () => void
    }): Promise<any> => {
      let args: DescribeInstancesRequest = {}

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeInstances(
        args,
        (err: AWSError, data: DescribeInstancesResult) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ec2:describeInstances',
              err,
            })
          }

          /**
           * No EC2 data for this region
           */
          if (isEmpty(data)) {
            return resolveRegion()
          }

          const { NextToken: nextToken, Reservations: res = [] } = data || {}

          const instances = res
            .map(({ Instances }) => Instances)
            .reduce((current, acc) => [...acc, ...current], [])

          logger.debug(lt.fetchedEc2Instances(instances.length))

          /**
           * No EC2 Instances Found
           */

          if (isEmpty(instances)) {
            return resolveRegion()
          }

          /**
           * Check to see if there are more
           */

          if (nextToken) {
            listEc2Instances({ region, nextToken, ec2, resolveRegion })
          }

          ec2Instances.push(
            ...instances.map(({ Tags, ...instance }) => ({
              ...instance,
              region,
            }))
          )

          /**
           * If this is the last page of data then return the instances
           */

          if (!nextToken) {
            resolveRegion()
          }
        }
      )
    }

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      const regionPromise = new Promise<void>(resolveRegion =>
        listEc2Instances({ ec2, region, resolveRegion })
      )
      return regionPromise
    })

    await Promise.all(regionPromises)

    /**
     * Step 2) Get the Key Pair names for each instance's key pair
     */

    const keyPairPromises = ec2Instances.map(({ region, KeyName }, ec2Idx) => {
      const ec2 = new EC2({ ...config, region, endpoint })
      const keyPairPromise = new Promise<void>(resolveKeyPair =>
        ec2.describeKeyPairs(
          { KeyNames: [KeyName] },
          (err: AWSError, data: DescribeKeyPairsResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:describeKeyPairs',
                err,
              })
            }
            /**
             * No Key Pair data for this instance
             */

            if (isEmpty(data) || !KeyName) {
              return resolveKeyPair()
            }

            const { KeyPairs: pairs } = data || {}

            /**
             * No Key Pairs Found
             */

            if (isEmpty(pairs)) {
              return resolveKeyPair()
            }
            const [keyPair] = pairs.map(
              ({
                KeyName: instanceKeyName,
                KeyPairId: id,
                KeyFingerprint: fingerprint,
                KeyType: type,
                Tags,
              }) => ({
                id,
                fingerprint,
                type,
                name: instanceKeyName,
                tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
              })
            )
            logger.debug(
              `${lt.foundKeyPair(keyPair.id)} for instance ${
                ec2Instances[ec2Idx]?.InstanceId
              }`
            )
            ec2Instances[ec2Idx].KeyPair = keyPair

            resolveKeyPair()
          }
        )
      )
      return keyPairPromise
    })

    await Promise.all(keyPairPromises)

    /**
     * Step 3) check to see if disableApiTermination is on for each instance
     */

    const deletionProtectionPromises = ec2Instances.map(
      ({ region, InstanceId }, ec2Idx) => {
        const ec2 = new EC2({ ...config, region, endpoint })

        const deletionProtectionPromise = new Promise<void>(
          resolveDeletionProtection =>
            ec2.describeInstanceAttribute(
              { InstanceId, Attribute: 'disableApiTermination' },
              (err: AWSError, data: InstanceAttribute) => {
                if (err) {
                  errorLog.generateAwsErrorLog({
                    functionName: 'ec2:desrcibeInstanceAttributes',
                    err,
                  })
                }

                /**
                 * No data
                 */
                if (isEmpty(data)) {
                  return resolveDeletionProtection()
                }

                const {
                  DisableApiTermination: { Value: val },
                } = data || { DisableApiTermination: {} }

                ec2Instances[ec2Idx].DisableApiTermination = val
                resolveDeletionProtection()
              }
            )
        )

        return deletionProtectionPromise
      }
    )

    await Promise.all(deletionProtectionPromises)

    /**
     * Step 4) get all of the tags for all instances... For some reason, there
     * Is an empty tags object returned from the initial describeInstances call...
     */

    const allTags = {}

    const listAllTagsforAllInstances = async ({
      ec2,
      region,
      nextToken: NextToken = '',
      resolveTags,
    }: {
      ec2: EC2
      region: string
      nextToken?: string
      resolveTags: () => void
    }): Promise<any> => {
      let args: DescribeTagsRequest = {
        Filters: [{ Name: 'resource-type', Values: ['instance'] }],
      }

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeTags(
        args,
        (err: AWSError, data: DescribeTagsResult) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ec2:describeTags',
              err,
            })
          }

          /**
           * No tag data for this region
           */
          if (isEmpty(data)) {
            return resolveTags()
          }

          const { NextToken: nextToken, Tags: tags = [] } = data || {}

          logger.debug(lt.fetchedEc2InstanceTags(tags.length))

          /**
           * No Tags Found
           */

          if (isEmpty(tags)) {
            return resolveTags()
          }

          /**
           * Check to see if there are more
           */

          if (nextToken) {
            listAllTagsforAllInstances({
              region,
              nextToken,
              ec2,
              resolveTags,
            })
          }

          /**
           * Add the tags to the allTags Cache
           */

          tags.map(({ Key, Value, ResourceId }) => {
            if (!allTags[ResourceId]) {
              allTags[ResourceId] = {}
            }
            allTags[ResourceId] = !isEmpty(allTags[ResourceId])
              ? [...allTags[ResourceId], { Key, Value }]
              : [{ Key, Value }]
          })

          /**
           * If this is the last page of data then return the instances
           */

          if (!nextToken) {
            resolveTags()
          }
        }
      )
    }

    const tagsPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })
      const tagPromise = new Promise<void>(resolveTags =>
        listAllTagsforAllInstances({
          region,
          ec2,
          resolveTags,
        })
      )
      return tagPromise
    })

    await Promise.all(tagsPromises)

    /**
     * Now add all of the tags to the instances
     */

    ec2Instances.map(({ InstanceId }, ec2Idx) => {
      ec2Instances[ec2Idx].Tags = (allTags[InstanceId] || [])
        .map(({ Key, Value }) => ({ [Key]: Value }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})
    })

    /**
     * Step 5) Get the platform details associated with the billing code of the AMI for all instances
     */

    const describeImagesPromises = ec2Instances.map(
      ({ region, ImageId }, ec2Idx) => {
        const ec2 = new EC2({ ...config, region, endpoint })

        const describeImagesPromise = new Promise<void>(resolveImage =>
          ec2.describeImages(
            { ImageIds: [ImageId] },
            (err: AWSError, data: DescribeImagesResult) => {
              if (err) {
                errorLog.generateAwsErrorLog({
                  functionName: 'ec2:describeImages',
                  err,
                })
              }

              /**
               * No data
               */
              if (isEmpty(data)) {
                return resolveImage()
              }

              const { Images: images } = data || {}

              ec2Instances[ec2Idx].PlatformDetails = images[0]?.PlatformDetails

              resolveImage()
            }
          )
        )

        return describeImagesPromise
      }
    )

    await Promise.all(describeImagesPromises)

    const iamInstanceProfile = {}

    const iamProfileAssociationsPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })
      return new Promise<void>(resolveRegion =>
        ec2.describeIamInstanceProfileAssociations(
          {},
          (
            err: AWSError,
            data: DescribeIamInstanceProfileAssociationsResult
          ) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:describeIamInstanceProfileAssociations',
                err,
              })
            }

            const {
              IamInstanceProfileAssociations: iamProfileAssociations = [],
            } = data || {}

            iamProfileAssociations.map(
              ({ InstanceId, IamInstanceProfile: curr }) => {
                if (!iamInstanceProfile[InstanceId]) {
                  iamInstanceProfile[InstanceId] = {}
                }
                iamInstanceProfile[InstanceId] = curr
              }
            )

            resolveRegion()
          }
        )
      )
    })

    const metricQueries: MetricDataQueries = ec2Instances
      .map(({ InstanceId }) => {
        return metricsTypes.map(metricName => ({
          Id: `${generateUniqueId({ InstanceId, metricName })}_${metricName}`, // Must be unique across all metrics
          Label: `${metricName}:${InstanceId}`,
          MetricStat: {
            Metric: {
              Dimensions: [{ Name: 'InstanceId', Value: InstanceId }],
              Namespace: 'AWS/EC2',
              MetricName: metricName,
            },
            Stat: metricStats[metricName],
            Period: 60 * 25,
          },
        }))
      })
      .flat()

    const getMeticsForTimePeriod = async ({
      minsAgo,
      end = new Date(),
    }): Promise<any> => {
      const metrics: {
        metric: string
        label: string
        values: number[]
        timestamps: Timestamps
      }[] = []
      const startTime = new Date(Date.now() - 60000 * minsAgo)
      await new Promise<void>(async resolveTimePeriod => {
        for (const region of regions.split(',')) {
          const client = new CloudWatch({ ...config, region })
          let loopBreak = false
          let token
          let metricsToFetch = [metricQueries]
          if (metricQueries.length > cwGetMetricDataLimit) {
            logger.debug(
              'EC2:getMetricData has more than 500 requests, chunking the requests...'
            )
            metricsToFetch = metricQueries.reduce(
              (resultArray, item, index) => {
                const chunkIndex = Math.floor(index / cwGetMetricDataLimit)

                if (!resultArray[chunkIndex]) {
                  // eslint-disable-next-line no-param-reassign
                  resultArray[chunkIndex] = [] // start a new chunk
                }

                resultArray[chunkIndex].push(item)

                return resultArray
              },
              []
            )
          }
          const promises = []
          metricsToFetch.forEach(async metricSet => {
            const metricPromise = new Promise<void>(async resolveMetric => {
              while (!loopBreak) {
                const params: GetMetricDataInput = {
                  MetricDataQueries: metricSet,
                  StartTime: startTime,
                  EndTime: end,
                  NextToken: token,
                }
                try {
                  const data = await client.getMetricData(params).promise()
                  if (data && data.MetricDataResults) {
                    for (const result of data.MetricDataResults) {
                      metrics.push({
                        metric: result.Label.split(':')[0],
                        label: result.Label.split(':')[1],
                        values: result.Values,
                        timestamps: result.Timestamps,
                      })
                    }
                  }
                  if (!data?.NextToken) {
                    loopBreak = true
                  } else {
                    token = data.NextToken
                  }
                } catch (err: any) {
                  errorLog.generateAwsErrorLog({
                    functionName: 'ec2:getMetricData',
                    err,
                  })
                  loopBreak = true
                  resolveMetric()
                }
              }
              resolveMetric()
            })
            promises.push(metricPromise)
          })
          await Promise.all(promises)
          resolveTimePeriod()
        }
      })
      return metrics
    }
    const timePeriod = {
      last6Hours: { minsAgo: 360, metrics: [] },
      last24Hours: { minsAgo: 1440, metrics: [] },
      lastWeek: { minsAgo: 10080, metrics: [] },
      lastMonth: { minsAgo: 43800, metrics: [] },
    }
    // First populate the time periods with the corresponding metrics
    try {
      for (const [key, periodObj] of Object.entries(timePeriod)) {
        const metrics = await getMeticsForTimePeriod({
          minsAgo: periodObj.minsAgo,
        })
        timePeriod[key].metrics = metrics
      }
      // Now populate the ec2Instances with the metric data
      ec2Instances.map(({ InstanceId }, idx) => {
        ec2Instances[idx].cloudWatchMetricData = {}
        for (const [key, { metrics }] of Object.entries(timePeriod)) {
          ec2Instances[idx].cloudWatchMetricData[key] = {}
          const instanceMetrics = metrics.filter(
            ({ label }) => label === InstanceId
          )
          const groupedMetrics = groupBy(instanceMetrics, 'metric')
          Object.keys(groupedMetrics).map(metricKey => {
            const camelKey = camelCase(metricKey)
            const operator = metricStats[metricKey]
            ec2Instances[idx].cloudWatchMetricData[key][
              `${camelKey}${operator}`
            ] = 0
            const metric = groupedMetrics[metricKey]
            const filteredMetric: { values: number[]; timestamps: Date[] }[] =
              metric.filter(({ values }) => values.length > 1)
            let valuesSumOrAverage
            for (const { values } of filteredMetric) {
              if (operator === 'Average') {
                valuesSumOrAverage = values.reduce(
                  (prev, curr, _, self) => (curr + prev) / self.length
                )
              } else {
                valuesSumOrAverage = values.reduce((prev, curr) => prev + curr)
              }
            }
            ec2Instances[idx].cloudWatchMetricData[key][
              `${camelKey}${operator}`
            ] = valuesSumOrAverage
          })
        }
      })
    } catch (e: unknown) {
      logger.debug(e)
      logger.error('There was an issue adding CW metric data to ec2 instances')
    }

    await Promise.all(iamProfileAssociationsPromises)

    ec2Instances.map(({ InstanceId }, ec2Idx) => {
      ec2Instances[ec2Idx].IamInstanceProfile =
        iamInstanceProfile[InstanceId] || {}
    })

    // populate ec2Instances with the iamRoles Arn
    const iamInstancesProfiles: RawAwsInstanceProfile[] =
      Object.values(
        await getIamInstanceProfiles({
          config,
          rawData,
        })
      )?.reduce((acc, val) => acc.concat(val), []) || []

    ec2Instances.map(({ IamInstanceProfile: instanceProfile }, ec2Idx) => {
      const instance = iamInstancesProfiles.find(
        i => i.Arn === instanceProfile?.Arn
      )
      if (instance) {
        ec2Instances[ec2Idx].IamRolesArn =
          instance?.Roles?.map(r => r.Arn) || []
      }
    })

    errorLog.reset()

    /**
     * Return the instances grouped by region
     */

    resolve(groupBy(ec2Instances, 'region'))
  })
