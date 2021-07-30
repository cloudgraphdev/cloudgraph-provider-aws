import * as Sentry from '@sentry/node'

import ELBV2 from 'aws-sdk/clients/elbv2'
import CloudGraph, { Opts } from 'cloud-graph-sdk'

import head from 'lodash/head'
import groupBy from 'lodash/groupBy'

import isEmpty from 'lodash/isEmpty'

import { Credentials } from '../../types'

import awsLoggerText from '../../properties/logger'

const lt = { ...awsLoggerText }
/**
 * ALB
 */
const { logger } = CloudGraph

export default async ({
  regions,
  credentials,
}: // opts,
{
  regions: string
  credentials: Credentials
  opts: Opts
}) =>
  new Promise(async resolve => {
    const albData = []
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
    }) => {
      let args: any = {}

      if (Marker) {
        args = { ...args, Marker }
      }

      return elbv2.describeLoadBalancers(args, async (err, data) => {
        if (err) {
          logger.debug(err)
          Sentry.captureException(new Error(err.message))
        }

        /**
         * No Data for the region
         */

        if (isEmpty(data)) {
          return resolveRegion()
        }

        const { LoadBalancers: albs, NextMarker: marker } = data

        logger.info(lt.fetchedAlbs(albs.length))

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
            tags: {},
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
            elbv2: new ELBV2({ region, credentials }),
            resolveRegion,
          })
        )
      )
    )

    await Promise.all(regionPromises)

    /**
     * Step 2, get all the listeners for each alb
     */

    const getTagsForAlb = async ({ alb, elbv2, resolveTags, ResourceArns }) =>
      elbv2.describeTags({ ResourceArns }, async (err, data) => {
        if (err) {
          logger.debug(err)
          Sentry.captureException(new Error(err.message))
        }

        /**
         * No tags
         */

        if (isEmpty(data)) {
          return resolveTags()
        }

        const { TagDescriptions: allTags = [] } = data || {}

        const tags = ((head(allTags) as { Tags: [] }) || { Tags: [] }).Tags

        logger.info(lt.fetchedAlbTags(tags.length, ResourceArns))

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

        alb.tags = result

        resolveTags()
      })

    albData.map(alb => {
      const { LoadBalancerArn: arn, region } = alb
      const elbv2 = new ELBV2({ region, credentials })

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
    }) =>
      elbv2.describeLoadBalancerAttributes(
        { LoadBalancerArn },
        async (err, data) => {
          if (err) {
            logger.debug(err)
            Sentry.captureException(new Error(err.message))
          }

          /**
           * No attributes
           */

          if (isEmpty(data)) {
            return resolveAttributes()
          }

          const { Attributes: attributes = [] } = data || {}

          logger.info(
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
      const elbv2 = new ELBV2({ region, credentials })
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
    }) => {
      let args: any = { LoadBalancerArn }

      if (Marker) {
        args = {
          ...args,
          Marker,
        }
      }

      return elbv2.describeListeners(args, async (err, data) => {
        if (err) {
          logger.debug(err)
          Sentry.captureException(new Error(err.message))
        }

        /**
         * No listeners
         */

        if (isEmpty(data)) {
          return resolveListeners()
        }

        const { Listeners: listeners = [], NextMarker: marker } = data || {}

        logger.info(lt.fetchedAlbListeners(listeners.length, LoadBalancerArn))

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
      const elbv2 = new ELBV2({ region, credentials })
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
    }) => {
      let args: any = { LoadBalancerArn }

      if (Marker) {
        args = {
          ...args,
          Marker,
        }
      }

      return elbv2.describeTargetGroups(args, async (err, data) => {
        if (err) {
          logger.debug(err)
          Sentry.captureException(new Error(err.message))
        }

        /**
         * No target groups
         */

        if (isEmpty(data)) {
          return resolveTargetGroups()
        }

        const { TargetGroups: targetGroups = [], NextMarker: marker } =
          data || {}

        logger.info(
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
      const elbv2 = new ELBV2({ region, credentials })
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
    }) =>
      elbv2.describeTargetHealth({ TargetGroupArn }, async (err, data) => {
        if (err) {
          logger.debug(err)
          Sentry.captureException(new Error(err.message))
        }

        /**
         * No target health info
         */

        if (isEmpty(data)) {
          return resolveTargetHealth()
        }

        const { TargetHealthDescriptions: targetHealth = [] } = data || {}

        logger.info(lt.fetchedAlbTargetIds(targetHealth.length, TargetGroupArn))

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
      const elbv2 = new ELBV2({ region, credentials })
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

    resolve(groupBy(albData, 'region'))
  })
