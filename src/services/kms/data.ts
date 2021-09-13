import CloudGraph from '@cloudgraph/sdk'

import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError, Request } from 'aws-sdk'
import KMS, { KeyListEntry, KeyMetadata, ListKeysRequest, ListKeysResponse } from 'aws-sdk/clients/kms'

import { Credentials, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const endpoint = initTestEndpoint('KMS')
/**
/**
 * KMS
 */

export type AwsKms = KeyListEntry &
  KeyMetadata & {
    region: string
    policy: string
    Tags: TagMap
    enableKeyRotation: boolean
  }

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{ [property: string]: AwsKms[] }> =>
  new Promise(async resolve => {
    const kmsIds = []
    const kmsData: AwsKms[] = []
    const keyPromises = []
    const rotationStatusPromises = []
    const regionPromises = []
    const policyPromises = []
    const tagPromises = []

    /**
     * Step 1) for all regions, list the kms keys
     */

    const listKmsKeys = async ({
      kms,
      region,
      marker: Marker = '',
      resolveRegion,
    }: {
      kms: KMS
      region: string
      marker?: string
      resolveRegion: () => void
    }): Promise<Request<ListKeysResponse, AWSError>> => {
      let args: ListKeysRequest = {}

      if (Marker) {
        args = { ...args, Marker }
      }

      return kms.listKeys(args, (err, data) => {
        if (err) {
          logger.warn('There was a problem getting data for service kms: unable to listKeys')
          logger.debug(err)
        }

        /**
         * No KMS data for this region
         */
        if (isEmpty(data)) {
          return resolveRegion()
        }

        const {
          Keys: keys = [],
          NextMarker: marker,
          Truncated: truncated,
        } = data

        logger.debug(lt.fetchedKmsKeys(keys.length))

        /**
         * No KMS Keys Found
         */

        if (isEmpty(keys)) {
          return resolveRegion()
        }

        /**
         * Check to see if there are more
         */

        if (truncated) {
          listKmsKeys({ region, marker, kms, resolveRegion })
        }

        /**
         * If there are not, then add these to the kmsIds
         */

        kmsIds.push(...keys.map(({ KeyId }) => ({ KeyId, region })))

        /**
         * If this is the last page of data then return the zones
         */

        if (!truncated) {
          resolveRegion()
        }
      })
    }

    regions.split(',').map(region => {
      const kms = new KMS({ region, credentials, endpoint })
      const regionPromise = new Promise<void>(resolveRegion =>
        listKmsKeys({ kms, region, resolveRegion })
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    /**
     * Step 2) now that we have all of the KMS key ids, get the individual key data for each key
     */

    logger.debug(lt.gettingKeyDetails)

    kmsIds.map(({ region, KeyId }: { region: string; KeyId: string }) => {
      const kms = new KMS({ region, credentials, endpoint })

      const keyPromise = new Promise<void>(resolveKey =>
        kms.describeKey({ KeyId }, (err, data) => {
          if (err) {
            logger.warn('There was a problem getting data for service kms: unable to describeKey')
            logger.debug(err)
          }

          /**
           * No key data
           */

          if (isEmpty(data)) {
            return resolveKey()
          }

          /**
           * Add this key to the kmsData and return
           */

          const { KeyMetadata: keyData } = data || {}

          kmsData.push({
            ...keyData,
            region,
            policy: '',
            Tags: {},
            enableKeyRotation: null,
          })

          resolveKey()
        })
      )

      keyPromises.push(keyPromise)
    })

    await Promise.all(keyPromises)

    /**
     * Step 3) check on the key rotation status for each key
     */

    logger.debug(lt.gettingRotationStatus)

    kmsData.map(({ region, KeyId }, idx) => {
      const kms = new KMS({ region, credentials, endpoint })

      const rotationStatusPromise = new Promise<void>(resolveRotationStatus =>
        kms.getKeyRotationStatus({ KeyId }, (err, data) => {
          if (err) {
            logger.warn('There was a problem getting data for service kms: unable to getKeyRotationStatus')
            logger.debug(err)
          }

          /**
           * No rotation status
           */

          if (isEmpty(data)) {
            return resolveRotationStatus()
          }

          /**
           * Add the rotation status to the key
           */

          const { KeyRotationEnabled: enableKeyRotation } = data || {}

          kmsData[idx].enableKeyRotation = enableKeyRotation

          resolveRotationStatus()
        })
      )

      rotationStatusPromises.push(rotationStatusPromise)
    })

    await Promise.all(rotationStatusPromises)

    /**
     * Step 4) get the policy for each key
     */

    logger.debug(lt.gettingPolicies)

    kmsData.map(({ region, KeyId }, idx) => {
      const kms = new KMS({ region, credentials, endpoint })

      const policyPromise = new Promise<void>(resolvePolicy =>
        kms.getKeyPolicy({ KeyId, PolicyName: 'default' }, (err, data) => {
          if (err) {
            logger.warn('There was a problem getting data for service kms: unable to getKeyPolicy')
            logger.debug(err)
          }

          /**
           * No policy data
           */

          if (isEmpty(data)) {
            return resolvePolicy()
          }

          /**
           * Add the policy to the key
           */

          const { Policy: policy } = data || {}

          kmsData[idx].policy = policy

          resolvePolicy()
        })
      )

      policyPromises.push(policyPromise)
    })

    await Promise.all(policyPromises)

    /**
     * Step 5) get the tags for each key
     */

    logger.debug(lt.gettingTags)

    kmsData.map(({ region, KeyId }, idx) => {
      const kms = new KMS({ region, credentials, endpoint })

      const tagsPromise = new Promise<void>(resolveTags =>
        kms.listResourceTags({ KeyId }, (err, data) => {
          if (err) {
            logger.warn('There was a problem getting data for service kms: unable to listResourceTags')
            logger.debug(err)
          }

          /**
           * No tag data
           */

          if (isEmpty(data)) {
            return resolveTags()
          }

          /**
           * Add the tags to the key
           */

          const { Tags, Truncated: truncated } = data || {}

          /**
           * Limited to 50 tags currently - re write this if we want more later
           * Note that these tags have a strange shape of TagKey && TagValue
           */
          if (truncated) {
            logger.debug(lt.hasMoreKmsTags)
          }

          if (!isEmpty(Tags)) {
            const tagsMap = {}
            for (const tag of Tags) {
              const {TagKey, TagValue} = tag
              tagsMap[TagKey] = TagValue
            }
            kmsData[idx].Tags = tagsMap
          }

          resolveTags()
        })
      )

      tagPromises.push(tagsPromise)
    })

    await Promise.all(tagPromises)

    resolve(groupBy(kmsData, 'region'))
  })
