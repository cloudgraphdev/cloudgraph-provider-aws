import * as Sentry from '@sentry/node'

import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

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
  TagList,
} from 'aws-sdk/clients/ec2'
import { AWSError } from 'aws-sdk/lib/error'

import CloudGraph from '@cloudgraph/sdk'

import { Credentials } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const endpoint = initTestEndpoint('EC2')

/**
 * EC2
 */

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: (Instance & {
    region: string
    DisableApiTermination?: boolean
    KeyPairName?: string
    Tags?: TagList
    IamInstanceProfile?: IamInstanceProfile
  })[]
}> =>
  new Promise(async resolve => {
    const ec2Instances: (Instance & {
      region: string
      DisableApiTermination?: boolean
      KeyPairName?: string
      Tags?: TagList
      IamInstanceProfile?: IamInstanceProfile
    })[] = []

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
            logger.error(err)
            Sentry.captureException(new Error(err.message))
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
            ...instances.map(instance => ({ ...instance, region }))
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
      const ec2 = new EC2({ region, credentials, endpoint })

      const regionPromise = new Promise<void>(resolveRegion =>
        listEc2Instances({ ec2, region, resolveRegion })
      )
      return regionPromise
    })

    await Promise.all(regionPromises)

    /**
     * Step 2) Get the Key Pair names for each instance's key pair
     */

    const keyPairPromises = ec2Instances.map(({ region }, ec2Idx) => {
      const ec2 = new EC2({ region, credentials, endpoint })

      const keyPairPromise = new Promise<void>(resolveKeyPair =>
        ec2.describeKeyPairs(
          {},
          (err: AWSError, data: DescribeKeyPairsResult) => {
            if (err) {
              logger.error(err)
              Sentry.captureException(new Error(err.message))
            }

            /**
             * No Key Pair data for this instance
             */

            if (isEmpty(data)) {
              return resolveKeyPair()
            }

            const { KeyPairs: pairs } = data || {}

            logger.debug(`${lt.fetchedKeyPairs(pairs.length)} at ${region}`)

            /**
             * No Key Pairs Found
             */

            if (isEmpty(pairs)) {
              return resolveKeyPair()
            }

            ec2Instances[ec2Idx].KeyPairName = pairs
              .map(({ KeyName }) => KeyName)
              .join(', ')

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
        const ec2 = new EC2({ region, credentials, endpoint })

        const deletionProtectionPromise = new Promise<void>(
          resolveDeletionProtection =>
            ec2.describeInstanceAttribute(
              { InstanceId, Attribute: 'disableApiTermination' },
              (err: AWSError, data: InstanceAttribute) => {
                if (err) {
                  logger.error(err)
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
            logger.error(err)
            Sentry.captureException(new Error(err.message))
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
      const ec2 = new EC2({ region, credentials, endpoint })
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
      ec2Instances[ec2Idx].Tags = allTags[InstanceId] || []
    })

    const iamInstanceProfile = {}

    const iamProfileAssociationsPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ region, credentials, endpoint })
      return new Promise<void>(resolveRegion =>
        ec2.describeIamInstanceProfileAssociations(
          {},
          (
            err: AWSError,
            data: DescribeIamInstanceProfileAssociationsResult
          ) => {
            if (err) {
              logger.error(
                'Therew as an error in Service EIP function describeAddresses'
              )
              logger.debug(err)
              Sentry.captureException(new Error(err.message))
            }

            const {
              IamInstanceProfileAssociations: iamProfileAssociations = [],
            } = data || {}

            iamProfileAssociations.map(({ InstanceId, IamInstanceProfile }) => {
              if (!iamInstanceProfile[InstanceId]) {
                iamInstanceProfile[InstanceId] = {}
              }
              iamInstanceProfile[InstanceId] = IamInstanceProfile
            })

            resolveRegion()
          }
        )
      )
    })

    await Promise.all(iamProfileAssociationsPromises)

    ec2Instances.map(({ InstanceId }, ec2Idx) => {
      ec2Instances[ec2Idx].IamInstanceProfile =
        iamInstanceProfile[InstanceId] || {}
    })

    /**
     * Return the instances grouped by region
     */

    resolve(groupBy(ec2Instances, 'region'))
  })
