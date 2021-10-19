import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'
import IAM, {
  AccessKeyLastUsed,
  GetAccessKeyLastUsedResponse,
  ListGroupsForUserResponse,
  ListMFADevicesResponse,
  ListUserPoliciesResponse,
  ListUsersResponse,
  ListUserTagsResponse,
  MFADevice,
  User,
} from 'aws-sdk/clients/iam'
import { Config } from 'aws-sdk/lib/config'

import { TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import {
  initTestEndpoint,
  generateAwsErrorLog,
  setAwsRetryOptions,
} from '../../utils'
import { globalRegionName } from '../../enums/regions'
import { convertAwsTagsToTagMap } from '../../utils/format'
import {
  IAM_CUSTOM_DELAY,
  MAX_FAILED_AWS_REQUEST_RETRIES,
} from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'IAM User'
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export interface RawAwsAccessKey {
  AccessKeyId: string
  AccessKeyLastUsed: AccessKeyLastUsed
}
export interface RawAwsIamUser extends Omit<User, 'Tags'> {
  AccessKeyLastUsedData: RawAwsAccessKey[]
  MFADevices: MFADevice[]
  Groups: string[]
  Policies: string[]
  region: string
  Tags?: TagMap
}

const tagsByUsername = async (
  iam: IAM,
  { UserName }: User
): Promise<{ UserName: string; Tags: TagMap }> =>
  new Promise(resolveUserPolicies => {
    iam.listUserTags(
      { UserName },
      (err: AWSError, data: ListUserTagsResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listUserTags', err)
        }

        if (!isEmpty(data)) {
          const { Tags: tags = [] } = data

          resolveUserPolicies({ UserName, Tags: convertAwsTagsToTagMap(tags) })
        }

        resolveUserPolicies(null)
      }
    )
  })

const groupsByUsername = async (
  iam: IAM,
  { UserName }: User
): Promise<{ UserName: string; Groups: string[] }> =>
  new Promise(resolveUserGroups => {
    iam.listGroupsForUser(
      { UserName },
      (err: AWSError, data: ListGroupsForUserResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listGroupsForUser', err)
        }

        if (!isEmpty(data)) {
          const { Groups = [] } = data

          const userGroups = Groups.map(({ GroupId }) => GroupId)

          resolveUserGroups({ UserName, Groups: userGroups })
        }

        resolveUserGroups(null)
      }
    )
  })

const policiesByUsername = async (
  iam: IAM,
  { UserName }: User
): Promise<{ UserName: string; Policies: string[] }> =>
  new Promise(resolveUserPolicies => {
    iam.listUserPolicies(
      { UserName },
      (err: AWSError, data: ListUserPoliciesResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listGroupsForUser', err)
        }

        if (!isEmpty(data)) {
          const { PolicyNames = [] } = data

          resolveUserPolicies({ UserName, Policies: PolicyNames })
        }

        resolveUserPolicies(null)
      }
    )
  })

const accessKeyByUsername = async (
  iam: IAM,
  { UserName }
): Promise<{
  UserName: string
  AccessKeys: RawAwsAccessKey[]
}> =>
  new Promise(resolveAccessKeyFetch => {
    const promises = []

    iam.listAccessKeys(
      {
        UserName,
      },
      async (err, { AccessKeyMetadata }) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listAccessKeys', err)
        }
        if (!isEmpty(AccessKeyMetadata)) {
          AccessKeyMetadata.map(({ AccessKeyId }) => {
            const lastUsedPromise = new Promise<{
              AccessKeyId: string
              AccessKeyLastUsed: AccessKeyLastUsed
            }>(resolveLastUsedData => {
              iam.getAccessKeyLastUsed(
                {
                  AccessKeyId,
                },
                (
                  err: AWSError,
                  { AccessKeyLastUsed }: GetAccessKeyLastUsedResponse
                ) => {
                  if (err) {
                    generateAwsErrorLog(
                      serviceName,
                      'iam:getAccessKeyLastUsed',
                      err
                    )
                  }

                  if (!isEmpty(AccessKeyLastUsed)) {
                    resolveLastUsedData({
                      AccessKeyId,
                      AccessKeyLastUsed,
                    })
                  }
                  resolveLastUsedData(null)
                }
              )
            })
            promises.push(lastUsedPromise)
          })
          const accessKeys = await Promise.all(promises)
          resolveAccessKeyFetch({ UserName, AccessKeys: accessKeys })
        }
        resolveAccessKeyFetch(null)
      }
    )
  })

export const listMFADevicesByUsername = async (
  iam: IAM,
  user: User,
  marker?: string
): Promise<{ UserName: string; MFADevices: MFADevice[] }> =>
  new Promise(resolve => {
    const { UserName } = user

    iam.listMFADevices(
      {
        UserName,
        Marker: marker,
      },
      async (err: AWSError, data: ListMFADevicesResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listMFADevices', err)
        }
        if (!isEmpty(data)) {
          const { MFADevices = [] } = data

          resolve({ UserName, MFADevices })
        }

        resolve(null)
      }
    )
  })

export const listIamUsers = async (
  iam: IAM,
  marker?: string
): Promise<RawAwsIamUser[]> =>
  new Promise(resolve => {
    const result: RawAwsIamUser[] = []
    const groupsByNamePromises = []
    const policiesByNamePromise = []
    const accessKeysByUser = []
    const mfaDevicesPromises = []
    const tagsByNamePromises = []

    iam.listUsers(
      { Marker: marker },
      async (err: AWSError, data: ListUsersResponse) => {
        /**
         * No data
         */

        if (isEmpty(data)) {
          return resolve(result)
        }

        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listUsers', err)
        }

        const { Users: users = [], IsTruncated, Marker } = data

        users.map(user => {
          groupsByNamePromises.push(groupsByUsername(iam, user))
          policiesByNamePromise.push(policiesByUsername(iam, user))
          accessKeysByUser.push(accessKeyByUsername(iam, user))
          mfaDevicesPromises.push(listMFADevicesByUsername(iam, user))
          tagsByNamePromises.push(tagsByUsername(iam, user))
        })

        const groups = await Promise.all(groupsByNamePromises)
        const policies = await Promise.all(policiesByNamePromise)
        const accessKeys = await Promise.all(accessKeysByUser)
        const mfaDevices = await Promise.all(mfaDevicesPromises)
        const tags = await Promise.all(tagsByNamePromises)

        result.push(
          ...users.map(({ UserName, ...user }) => {
            return {
              UserName,
              ...user,
              region: globalRegionName,
              Groups:
                groups
                  ?.filter(g => g?.UserName === UserName)
                  .map(g => g.Groups)
                  .reduce((current, acc) => [...acc, ...current], []) || [],
              Policies:
                policies
                  ?.filter(p => p?.UserName === UserName)
                  .map(p => p.Policies)
                  .reduce((current, acc) => [...acc, ...current], []) || [],
              AccessKeyLastUsedData:
                accessKeys
                  ?.filter(k => k?.UserName === UserName)
                  .map(k => k.AccessKeys)
                  .reduce((current, acc) => [...acc, ...current], []) || [],
              MFADevices:
                mfaDevices
                  ?.filter(d => d?.UserName === UserName)
                  .map(d => d.MFADevices)
                  .reduce((current, acc) => [...acc, ...current], []) || [],
              Tags: tags.find(t => t?.UserName === UserName)?.Tags || {},
            }
          })
        )

        if (IsTruncated) {
          result.push(...(await listIamUsers(iam, Marker)))
        }

        resolve(result)
      }
    )
  })

/**
 * IAM User
 */

export default async ({
  config,
}: {
  regions: string
  config: Config
  rawData: any
}): Promise<{
  [region: string]: RawAwsIamUser[]
}> =>
  new Promise(async resolve => {
    let usersData: RawAwsIamUser[] = []

    const client = new IAM({
      ...config,
      region: globalRegionName,
      endpoint,
      ...customRetrySettings,
    })

    logger.debug(lt.lookingForIamUsers)

    // Fetch IAM Users
    usersData = await listIamUsers(client)

    logger.debug(lt.fetchedIamUsers(usersData.length))

    resolve(groupBy(usersData, 'region'))
  })
