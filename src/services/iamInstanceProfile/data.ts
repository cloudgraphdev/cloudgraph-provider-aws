import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import IAM, {
  InstanceProfile,
  ListInstanceProfilesRequest,
  ListInstanceProfilesResponse,
  ListInstanceProfileTagsResponse,
} from 'aws-sdk/clients/iam'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import { flatMap } from 'lodash'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { AwsTag, TagMap } from '../../types'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { globalRegionName } from '../../enums/regions'
import services from '../../enums/services'

import {
  IAM_CUSTOM_DELAY,
  MAX_FAILED_AWS_REQUEST_RETRIES,
} from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'IAM Instace Profile'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export const listInstancesProfiles = async (
  iam: IAM
): Promise<InstanceProfile[]> =>
  new Promise(resolve => {
    const instanceProfileList: InstanceProfile[] = []
    let args: ListInstanceProfilesRequest = {}
    const listAllInstanceProfiles = (marker?: string): void => {
      if (marker) {
        args = { ...args, Marker: marker }
      }
      try {
        iam.listInstanceProfiles(
          args,
          async (err: AWSError, data: ListInstanceProfilesResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'iam:listInstanceProfiles',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { InstanceProfiles = [], IsTruncated, Marker } = data

            instanceProfileList.push(...InstanceProfiles)

            if (IsTruncated) {
              listAllInstanceProfiles(Marker)
            } else {
              resolve(instanceProfileList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllInstanceProfiles()
  })

export const getTags = async ({
  iam,
  name,
}: {
  iam: IAM
  name: string
}): Promise<TagMap> =>
  new Promise(resolve => {
    try {
      iam.listInstanceProfileTags(
        { InstanceProfileName: name },
        (err: AWSError, data: ListInstanceProfileTagsResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'iam:listInstanceProfileTags',
              err,
            })
            resolve({})
          }
          const { Tags = [] } = data || {}
          resolve(convertAwsTagsToTagMap(Tags as AwsTag[]))
        }
      )
    } catch (error) {
      resolve({})
    }
  })

/**
 * IAM Instance Profile
 */

export interface RawAwsInstanceProfile extends Omit<InstanceProfile, 'Tags'> {
  region: string
  Tags?: TagMap
}

export default async ({
  config,
  rawData,
}: {
  config: Config
  rawData: any
}): Promise<{
  [region: string]: RawAwsInstanceProfile[]
}> =>
  new Promise(async resolve => {
    let instancesProfilesResult: RawAwsInstanceProfile[] = []
    const tagsPromises = []

    const existingData: RawAwsInstanceProfile[] =
      flatMap(
        rawData.find(({ name }) => name === services.iamInstanceProfile)?.data
      ) || []

    if (isEmpty(existingData)) {
      const client = new IAM({
        ...config,
        region: globalRegionName,
        endpoint,
        ...customRetrySettings,
      })

      const instancesProfiles = await listInstancesProfiles(client)

      if (!isEmpty(instancesProfiles)) {
        instancesProfiles.map(
          ({ Tags, InstanceProfileName, ...instancesProfile }, idx) => {
            instancesProfilesResult.push({
              InstanceProfileName,
              ...instancesProfile,
              region: globalRegionName,
            })

            const tagsPromise = new Promise<void>(async resolveTags => {
              instancesProfilesResult[idx].Tags = await getTags({
                iam: client,
                name: InstanceProfileName,
              })
              resolveTags()
            })
            tagsPromises.push(tagsPromise)
          }
        )
      }

      logger.debug(lt.foundInstanceProfiles(instancesProfiles.length))
      await Promise.all(tagsPromises)
      errorLog.reset()
    } else {
      // Uses existing data
      instancesProfilesResult = existingData
    }

    resolve(groupBy(instancesProfilesResult, 'region'))
  })
