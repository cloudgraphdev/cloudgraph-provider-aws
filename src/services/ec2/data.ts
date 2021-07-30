import * as Sentry from '@sentry/node'

import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2 from 'aws-sdk/clients/ec2'
import { Opts } from 'cloud-graph-sdk'

import { Credentials } from '../../types'

// import { logger } from '../../../../../middleware'

// import awsLoggerText from '../../properties/logger'
// import { commonVsdLoggerText } from '../../../../shared/visualServiceDiscovery/properties/logger'

// const lt = { ...commonVsdLoggerText, ...awsLoggerText }

/**
 * EC2
 */

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
    const tagsPromises = []
    const ec2Instances = []
    const regionPromises = []
    const keyPairPromises = []
    const deletionProtectionPromises = []

    /**
     * Step 1) for all regions, list the EC2 Instances
     */

    const listEc2Instances = async ({
      ec2,
      region,
      nextToken: NextToken = '',
      resolveRegion,
    }) => {
      let args: any = {}

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeInstances(args, (err, data) => {
        if (err) {
          // logger.error(err, err.stack)
          Sentry.captureException(new Error(err.message))
        }

        /**
         * No EC2 data for this region
         */
        if (isEmpty(data)) {
          return resolveRegion()
        }

        const { NextToken: nextToken, Reservations: res = [] } = data || {}

        const instances = res.flatMap(({ Instances }) => Instances)

        // logger.info(lt.fetchedEc2Instances(instances.length))

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

        /**
         * If there are not, then add these to the ec2Instances and convert the tags
         * To the correct shape [{ Key1: Value1 }] -> { Key1: Value1 }
         */

        const Tags = {}

        instances.map(({ Tags }) =>
          Tags.map(({ Key, Value }) => {
            Tags[Key] = Value
          })
        )

        ec2Instances.push(
          ...instances.map(instance => ({ ...instance, Tags, region }))
        )

        /**
         * If this is the last page of data then return the instances
         */

        if (!nextToken) {
          resolveRegion()
        }
      })
    }

    regions.split(',').map(region => {
      const ec2 = new EC2({ region, credentials })

      const regionPromise = new Promise<void>(resolveRegion =>
        listEc2Instances({ ec2, region, resolveRegion })
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    /**
     * Step 2) Get the Key Pair names for each instance's key pair
     */

    // let totalKeyPairs = 0

    ec2Instances.map(({ region }, ec2Idx) => {
      const ec2 = new EC2({ region, credentials })

      const keyPairPromise = new Promise<void>(resolveKeyPair =>
        ec2.describeKeyPairs({}, (err, data) => {
          if (err) {
            // logger.error(err, err.stack)
            Sentry.captureException(new Error(err.message))
          }

          /**
           * No Key Pair data for this instance
           */

          if (isEmpty(data)) {
            return resolveKeyPair()
          }

          const { KeyPairs: pairs } = data || {}

          /**
           * No Key Pairs Found
           */

          if (isEmpty(pairs)) {
            return resolveKeyPair()
          }

          ec2Instances[ec2Idx].keyPairName = pairs
            .map(({ KeyName }) => KeyName)
            .join(', ')
          // totalKeyPairs += 1
          resolveKeyPair()
        })
      )
      keyPairPromises.push(keyPairPromise)
    })

    await Promise.all(keyPairPromises)

    // logger.info(lt.fetchedKeyPairs(totalKeyPairs))

    /**
     * Step 3) check to see if disableApiTermination is on for each instance
     */

    ec2Instances.map(({ region, InstanceId }, ec2Idx) => {
      const ec2 = new EC2({ region, credentials })

      const deletionProtectionPromise = new Promise<void>(
        resolveDeletionProtection =>
          ec2.describeInstanceAttribute(
            { InstanceId, Attribute: 'disableApiTermination' },
            (err, data) => {
              if (err) {
                // logger.error(err, err.stack)
                Sentry.captureException(new Error(err.message))
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
      deletionProtectionPromises.push(deletionProtectionPromise)
    })

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
    }) => {
      let args: any = {
        Filters: [{ Name: 'resource-type', Values: ['instance'] }],
      }

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeTags(args, (err, data) => {
        if (err) {
          // logger.error(err, err.stack)
          Sentry.captureException(new Error(err.message))
        }

        /**
         * No tag data for this region
         */
        if (isEmpty(data)) {
          return resolveTags()
        }

        const { NextToken: nextToken, Tags: tags = [] } = data || {}

        // logger.info(lt.fetchedEc2InstanceTags(tags.length))

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
          allTags[ResourceId][Key] = Value
        })

        /**
         * If this is the last page of data then return the instances
         */

        if (!nextToken) {
          resolveTags()
        }
      })
    }

    regions.split(',').map(region => {
      const ec2 = new EC2({ region, credentials })
      const tagPromise = new Promise<void>(resolveTags =>
        listAllTagsforAllInstances({
          region,
          ec2,
          resolveTags,
        })
      )
      tagsPromises.push(tagPromise)
    })

    await Promise.all(tagsPromises)

    /**
     * Now add all of the tags to the instances
     */

    ec2Instances.map(({ InstanceId }, ec2Idx) => {
      ec2Instances[ec2Idx].Tags = allTags[InstanceId] || {}
    })

    /**
     * Return the instances grouped by region
     */

    resolve(groupBy(ec2Instances, 'region'))
  })
