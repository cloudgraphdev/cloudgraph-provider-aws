import { AWSError, Request, Config } from 'aws-sdk'
import ELBV2, {
  DescribeListenersInput,
  DescribeListenersOutput,
  DescribeLoadBalancerAttributesOutput,
  DescribeLoadBalancersInput,
  DescribeLoadBalancersOutput,
  DescribeTagsOutput,
  DescribeTargetGroupsInput,
  DescribeTargetGroupsOutput,
  DescribeTargetHealthOutput,
  Listeners,
  LoadBalancer,
  LoadBalancerAttributeValue,
  TargetGroups,
} from 'aws-sdk/clients/elbv2'
import CloudGraph, { Opts } from '@cloudgraph/sdk'

import head from 'lodash/head'
import groupBy from 'lodash/groupBy'

import isEmpty from 'lodash/isEmpty'

import { TagMap } from '../../types'

import awsLoggerText from '../../properties/logger'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import { ALB_CUSTOM_DELAY } from '../../config/constants'

const lt = { ...awsLoggerText }
/**
 * ALB
 */
const { logger } = CloudGraph
const serviceName = 'ALB'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({ baseDelay: ALB_CUSTOM_DELAY })

export type RawAwsAlb = LoadBalancer & {
  listeners: Listeners
  targetIds: Array<string>
  attributes: { [property: string]: LoadBalancerAttributeValue }
  targetGroups: TargetGroups
  region: string
  Tags: TagMap
}

export default async ({
  regions,
  config,
}: // opts,
{
  regions: string
  config: Config
  opts: Opts
}): Promise<{ [property: string]: RawAwsAlb[] }> =>
  new Promise(async resolve => {
    const albData: RawAwsAlb[] = []
    const tagPromises = []
    const regionPromises = []
    const listenerPromises = []
    const targetGroupPromises = []
    const targetHealthPromises = []

    /**
     * Step 1) for all regions, list all the albs
     */

    const describeAlbs = async ({
      region,
      marker: Marker = '',
      elbv2,
      resolveRegion,
    }: {
      region: string
      marker?: string
      elbv2: ELBV2
      resolveRegion: () => void
    }): Promise<Request<DescribeLoadBalancersOutput, AWSError>> => {
      let args: DescribeLoadBalancersInput = {}

      if (Marker) {
        args = { ...args, Marker }
      }

      return elbv2.describeLoadBalancers(args, async (err, data) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elbv2:describeLoadBalancers',
            err,
          })
        }

        /**
         * No Data for the region
         */

        if (isEmpty(data)) {
          return resolveRegion()
        }

        const { LoadBalancers: albs, NextMarker: marker } = data

        logger.debug(lt.fetchedAlbs(albs.length))

        /**
         * No Albs
         */

        if (isEmpty(albs)) {
          return resolveRegion()
        }

        /**
         * Check to see if there are more
         */

        if (marker) {
          describeAlbs({ region, marker, elbv2, resolveRegion })
        }

        /**
         * If there are not, then add these to the albs
         */
        albData.push(
          ...albs.map(alb => ({
            ...alb,
            region,
            Tags: {},
            listeners: [],
            targetIds: [],
            attributes: {},
            targetGroups: [],
          }))
        )

        /**
         * If this is the last page of data then return the zones
         */

        if (!marker) {
          resolveRegion()
        }
      })
    }

    regions.split(',').map(region =>
      regionPromises.push(
        new Promise<void>(resolveRegion =>
          describeAlbs({
            region,
            elbv2: new ELBV2({
              ...config,
              region,
              endpoint,
              ...customRetrySettings,
            }),
            resolveRegion,
          })
        )
      )
    )

    await Promise.all(regionPromises)

    /**
     * Step 2, get all the listeners for each alb
     */

    const getTagsForAlb = async ({
      alb,
      elbv2,
      resolveTags,
      ResourceArns,
    }: {
      alb: RawAwsAlb
      elbv2: ELBV2
      resolveTags: () => void
      ResourceArns: string[]
    }): Promise<Request<DescribeTagsOutput, AWSError>> =>
      elbv2.describeTags({ ResourceArns }, async (err, data) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elbv2:describeTags',
            err,
          })
        }

        /**
         * No tags
         */

        if (isEmpty(data)) {
          return resolveTags()
        }

        const { TagDescriptions: allTags = [] } = data || {}

        const tags = ((head(allTags) as { Tags: [] }) || { Tags: [] }).Tags

        logger.debug(lt.fetchedAlbTags(tags.length, ResourceArns.toString()))

        /**
         * No tags found
         */

        if (isEmpty(tags)) {
          return resolveTags()
        }

        /**
         * Add the tags to the alb
         */

        const result = {}

        tags.map(({ Key, Value }) => {
          result[Key] = Value
        })

        alb.Tags = convertAwsTagsToTagMap(tags)

        resolveTags()
      })

    albData.map(alb => {
      const { LoadBalancerArn: arn, region } = alb
      const elbv2 = new ELBV2({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })

      tagPromises.push(
        new Promise<void>(resolveTags => {
          getTagsForAlb({
            alb,
            elbv2,
            resolveTags,
            ResourceArns: [arn],
          })
        })
      )
    })

    await Promise.all(tagPromises)

    /**
     * Step 3, get all the attributed for each alb
     */

    const getAttributesForAlb = async ({
      alb,
      elbv2,
      resolveAttributes,
      LoadBalancerArn,
    }: {
      alb: RawAwsAlb
      elbv2: ELBV2
      resolveAttributes: () => void
      LoadBalancerArn: string
    }): Promise<Request<DescribeLoadBalancerAttributesOutput, AWSError>> =>
      elbv2.describeLoadBalancerAttributes(
        { LoadBalancerArn },
        async (err, data) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'elbv2:describeLoadBalancerAttributes',
              err,
            })
          }

          /**
           * No attributes
           */

          if (isEmpty(data)) {
            return resolveAttributes()
          }

          const { Attributes: attributes = [] } = data || {}

          logger.debug(
            lt.fetchedAlbAttributes(attributes.length, LoadBalancerArn)
          )

          /**
           * No attributes found
           */

          if (isEmpty(attributes)) {
            return resolveAttributes()
          }

          /**
           * Add the attributes to the alb
           */

          const result = {}

          attributes.map(({ Key, Value }) => {
            result[Key] = Value
          })

          alb.attributes = result
          resolveAttributes()
        }
      )

    albData.map(alb => {
      const { LoadBalancerArn, region } = alb
      const elbv2 = new ELBV2({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      tagPromises.push(
        new Promise<void>(resolveAttributes => {
          getAttributesForAlb({
            alb,
            elbv2,
            resolveAttributes,
            LoadBalancerArn,
          })
        })
      )
    })

    await Promise.all(tagPromises)

    /**
     * Step 4, get all the listeners for each alb
     */

    const describeListenersForAlb = async ({
      alb,
      elbv2,
      marker: Marker = '',
      LoadBalancerArn,
      resolveListeners,
    }: {
      alb: RawAwsAlb
      elbv2: ELBV2
      marker?: string
      LoadBalancerArn: string
      resolveListeners: () => void
    }): Promise<Request<DescribeListenersOutput, AWSError>> => {
      let args: DescribeListenersInput = { LoadBalancerArn }

      if (Marker) {
        args = {
          ...args,
          Marker,
        }
      }

      return elbv2.describeListeners(args, async (err, data) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elbv2:describeListeners',
            err,
          })
        }

        /**
         * No listeners
         */

        if (isEmpty(data)) {
          return resolveListeners()
        }

        const { Listeners: listeners = [], NextMarker: marker } = data || {}

        logger.debug(lt.fetchedAlbListeners(listeners.length, LoadBalancerArn))

        /**
         * No listeners found
         */

        if (isEmpty(listeners)) {
          return resolveListeners()
        }

        /**
         * Check to see if there are more
         */

        if (marker) {
          describeListenersForAlb({
            alb,
            elbv2,
            LoadBalancerArn,
            resolveListeners,
            marker,
          })
        }

        /**
         * If there are not, then add the listeners to the alb's listeners
         */
        alb.listeners.push(...listeners)

        /**
         * If this is the last page of data then return
         */

        if (!marker) {
          resolveListeners()
        }
      })
    }

    albData.map(alb => {
      const { LoadBalancerArn, region } = alb
      const elbv2 = new ELBV2({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const listenerPromise = new Promise<void>(resolveListeners => {
        describeListenersForAlb({
          alb,
          elbv2,
          LoadBalancerArn,
          resolveListeners,
        })
      })
      listenerPromises.push(listenerPromise)
    })

    await Promise.all(listenerPromises)

    /**
     * Step 5, get all the target groups for each alb
     */

    const describeTargetGroupsForAlb = async ({
      alb,
      elbv2,
      marker: Marker = '',
      LoadBalancerArn,
      resolveTargetGroups,
    }: {
      alb: RawAwsAlb
      elbv2: ELBV2
      marker?: string
      LoadBalancerArn: string
      resolveTargetGroups: () => void
    }): Promise<Request<DescribeTargetGroupsOutput, AWSError>> => {
      let args: DescribeTargetGroupsInput = { LoadBalancerArn }

      if (Marker) {
        args = {
          ...args,
          Marker,
        }
      }

      return elbv2.describeTargetGroups(args, async (err, data) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elbv2:describeTargetGroups',
            err,
          })
        }

        /**
         * No target groups
         */

        if (isEmpty(data)) {
          return resolveTargetGroups()
        }

        const { TargetGroups: targetGroups = [], NextMarker: marker } =
          data || {}

        logger.debug(
          lt.fetchedAlbTargetGroups(targetGroups.length, LoadBalancerArn)
        )

        /**
         * No targetGroups found
         */

        if (isEmpty(targetGroups)) {
          return resolveTargetGroups()
        }

        /**
         * Check to see if there are more
         */

        if (marker) {
          describeTargetGroupsForAlb({
            alb,
            elbv2,
            marker,
            LoadBalancerArn,
            resolveTargetGroups,
          })
        }

        /**
         * If there are not, then add the targetGroups to the alb's targetGroups
         */
        alb.targetGroups.push(...targetGroups)

        /**
         * If this is the last page of data then return
         */

        if (!marker) {
          resolveTargetGroups()
        }
      })
    }

    albData.map(alb => {
      const { LoadBalancerArn, region } = alb
      const elbv2 = new ELBV2({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const targetGroupPromise = new Promise<void>(resolveTargetGroups => {
        describeTargetGroupsForAlb({
          alb,
          elbv2,
          LoadBalancerArn,
          resolveTargetGroups,
        })
      })
      targetGroupPromises.push(targetGroupPromise)
    })

    await Promise.all(targetGroupPromises)

    /**
     * Step 6, use the describeTargetHealth method to get the target IDs
     */

    const describeTargetHealth = async ({
      alb,
      elbv2,
      TargetGroupArn,
      resolveTargetHealth,
    }: {
      alb: RawAwsAlb
      elbv2: ELBV2
      TargetGroupArn: string
      resolveTargetHealth: () => void
    }): Promise<Request<DescribeTargetHealthOutput, AWSError>> =>
      elbv2.describeTargetHealth({ TargetGroupArn }, async (err, data) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elbv2:describeTargetHealth',
            err,
          })
        }

        /**
         * No target health info
         */

        if (isEmpty(data)) {
          return resolveTargetHealth()
        }

        const { TargetHealthDescriptions: targetHealth = [] } = data || {}

        logger.debug(
          lt.fetchedAlbTargetIds(targetHealth.length, TargetGroupArn)
        )

        /**
         * No target health info found
         */

        if (isEmpty(targetHealth)) {
          return resolveTargetHealth()
        }

        /**
         * Add the ids to the alb's targetIds
         */

        alb.targetIds.push(
          ...targetHealth.map(({ Target: { Id = '' } = {} }) => Id)
        )

        resolveTargetHealth()
      })

    albData.map(alb => {
      const { region, targetGroups = [] } = alb
      const elbv2 = new ELBV2({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      targetGroups.map(({ TargetGroupArn }) => {
        targetHealthPromises.push(
          new Promise<void>(resolveTargetHealth => {
            describeTargetHealth({
              alb,
              elbv2,
              TargetGroupArn,
              resolveTargetHealth,
            })
          })
        )
      })
    })

    await Promise.all(targetHealthPromises)
    errorLog.reset()

    resolve(groupBy(albData, 'region'))
  })
