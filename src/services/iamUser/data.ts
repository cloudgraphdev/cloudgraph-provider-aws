import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import cuid from 'cuid'

import { AWSError } from 'aws-sdk/lib/error'
import IAM, {
  AccessKeyLastUsed,
  AccessKeyMetadata,
  AttachedPolicy,
  GetAccessKeyLastUsedResponse,
  GetCredentialReportResponse,
  ListAccessKeysResponse,
  ListAttachedUserPoliciesResponse,
  ListGroupsForUserResponse,
  ListMFADevicesResponse,
  ListUserPoliciesResponse,
  ListUsersResponse,
  ListUserTagsResponse,
  ListVirtualMFADevicesRequest,
  ListVirtualMFADevicesResponse,
  MFADevice,
  User,
  VirtualMFADevice,
} from 'aws-sdk/clients/iam'
import { Config } from 'aws-sdk/lib/config'

import { TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { globalRegionName } from '../../enums/regions'
import { convertAwsTagsToTagMap, parseCSV } from '../../utils/format'
import {
  IAM_CUSTOM_DELAY,
  MAX_FAILED_AWS_REQUEST_RETRIES,
} from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'IAM User'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export interface RawAwsAccessKey extends AccessKeyMetadata {
  AccessKeyLastUsed: AccessKeyLastUsed
}

export interface RawAwsIamUserReport {
  User: string
  Arn: string
  UserCreationTime: string
  PasswordEnabled: string
  PasswordLastUsed: string
  PasswordLastChanged: string
  PasswordNextRotation: string
  MfaActive: string
  AccessKey1Active: string
  AccessKey1LastRotated: string
  AccessKey1LastUsedDate: string
  AccessKey1LastUsedRegion: string
  AccessKey1LastUsedService: string
  AccessKey2Active: string
  AccessKey2LastRotated: string
  AccessKey2LastUsedDate: string
  AccessKey2LastUsedRegion: string
  AccessKey2LastUsedService: string
  Cert1Active: string
  Cert1LastRotated: string
  Cert2Active: string
  Cert2LastRotated: string
}

export interface RawAwsIamUser extends Omit<User, 'Tags'> {
  AccessKeyLastUsedData: RawAwsAccessKey[]
  MFADevices: MFADevice[]
  VirtualMFADevices?: VirtualMFADevice[]
  Groups: string[]
  Policies: string[]
  ManagedPolicies: AttachedPolicy[]
  ReportData?: RawAwsIamUserReport
  region: string
  Tags?: TagMap
}

const tagsByUsername = async (
  iam: IAM,
  { UserName }: User
): Promise<{ UserName: string; Tags: TagMap }> =>
  new Promise(resolve => {
    iam.listUserTags(
      { UserName },
      (err: AWSError, data: ListUserTagsResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listUserTags',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { Tags: tags = [] } = data

          resolve({ UserName, Tags: convertAwsTagsToTagMap(tags) })
        }

        resolve(null)
      }
    )
  })

const groupsByUsername = async (
  iam: IAM,
  { UserName }: User
): Promise<{ UserName: string; Groups: string[] }> =>
  new Promise(resolve => {
    iam.listGroupsForUser(
      { UserName },
      (err: AWSError, data: ListGroupsForUserResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listGroupsForUser',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { Groups = [] } = data

          const userGroups = Groups.map(({ GroupId }) => GroupId)

          resolve({ UserName, Groups: userGroups })
        }

        resolve(null)
      }
    )
  })

const policiesByUsername = async (
  iam: IAM,
  { UserName }: User
): Promise<{ UserName: string; Policies: string[] }> =>
  new Promise(resolve => {
    iam.listUserPolicies(
      { UserName },
      (err: AWSError, data: ListUserPoliciesResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listGroupsForUser',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { PolicyNames = [] } = data

          resolve({ UserName, Policies: PolicyNames })
        }

        resolve(null)
      }
    )
  })

const managedPoliciesByUsername = async (
  iam: IAM,
  { UserName }: User
): Promise<{ UserName: string; ManagedPolicies: AttachedPolicy[] }> =>
  new Promise(resolve => {
    iam.listAttachedUserPolicies(
      { UserName },
      (err: AWSError, data: ListAttachedUserPoliciesResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listAttachedUserPolicies',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { AttachedPolicies = [] } = data

          resolve({
            UserName,
            ManagedPolicies: AttachedPolicies,
          })
        }

        resolve(null)
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
      async (err, data: ListAccessKeysResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listAccessKeys',
            err,
          })
          return resolveAccessKeyFetch(null)
        }

        const { AccessKeyMetadata: accessKeyMetadata } = data ?? {}
        if (!isEmpty(accessKeyMetadata)) {
          accessKeyMetadata.map(({ AccessKeyId, ...Metadata }) => {
            const lastUsedPromise = new Promise<RawAwsAccessKey>(
              resolveLastUsedData => {
                iam.getAccessKeyLastUsed(
                  {
                    AccessKeyId,
                  },
                  (err: AWSError, data: GetAccessKeyLastUsedResponse) => {
                    const { AccessKeyLastUsed: accessKeyLastUsed } = data || {}
                    if (err) {
                      errorLog.generateAwsErrorLog({
                        functionName: 'iam:getAccessKeyLastUsed',
                        err,
                      })
                    }

                    if (!isEmpty(accessKeyLastUsed)) {
                      resolveLastUsedData({
                        AccessKeyId,
                        ...Metadata,
                        AccessKeyLastUsed: accessKeyLastUsed,
                      })
                    }
                    resolveLastUsedData(null)
                  }
                )
              }
            )
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
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listMFADevices',
            err,
          })
        }
        if (!isEmpty(data)) {
          const { MFADevices = [] } = data

          resolve({ UserName, MFADevices })
        }

        resolve(null)
      }
    )
  })

export const listVirtualMFADevices = async (
  iam: IAM
): Promise<VirtualMFADevice[]> =>
  new Promise(resolve => {
    const virtualMFADeviceList: VirtualMFADevice[] = []
    let args: ListVirtualMFADevicesRequest = {}
    const listAllVirtualMFADevices = (marker?: string): void => {
      if (marker) {
        args = { ...args, Marker: marker }
      }
      try {
        iam.listVirtualMFADevices(
          args,
          (err: AWSError, data: ListVirtualMFADevicesResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'iam:listVirtualMFADevices',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { VirtualMFADevices = [], IsTruncated, Marker } = data

            virtualMFADeviceList.push(...VirtualMFADevices)

            if (IsTruncated) {
              listAllVirtualMFADevices(Marker)
            } else {
              resolve(virtualMFADeviceList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllVirtualMFADevices()
  })

export const listIamUsers = async (
  iam: IAM,
  marker?: string
): Promise<RawAwsIamUser[]> =>
  new Promise(resolve => {
    const result: RawAwsIamUser[] = []
    const groupsByNamePromises = []
    const policiesByNamePromise = []
    const managedPoliciesByNamePromise = []
    const accessKeysByUser = []
    const mfaDevicesPromises = []
    const tagsByNamePromises = []

    iam.listUsers(
      { Marker: marker },
      async (err: AWSError, data: ListUsersResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listUsers',
            err,
          })
        }

        // No data
        if (isEmpty(data)) {
          return resolve(result)
        }

        const { Users: users = [], IsTruncated, Marker } = data

        users.map(user => {
          groupsByNamePromises.push(groupsByUsername(iam, user))
          policiesByNamePromise.push(policiesByUsername(iam, user))
          managedPoliciesByNamePromise.push(
            managedPoliciesByUsername(iam, user)
          )
          accessKeysByUser.push(accessKeyByUsername(iam, user))
          mfaDevicesPromises.push(listMFADevicesByUsername(iam, user))
          tagsByNamePromises.push(tagsByUsername(iam, user))
        })

        const groups = await Promise.all(groupsByNamePromises)
        const policies = await Promise.all(policiesByNamePromise)
        const managedPolicies = await Promise.all(managedPoliciesByNamePromise)
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
              ManagedPolicies:
                managedPolicies
                  ?.filter(p => p?.UserName === UserName)
                  .map(p => p.ManagedPolicies)
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

export const getCredentialReportData = async (
  iam: IAM
): Promise<RawAwsIamUserReport[]> =>
  new Promise(resolve => {
    iam.generateCredentialReport((err: AWSError) => {
      if (err) {
        errorLog.generateAwsErrorLog({
          functionName: 'iam:generateCredentialReport',
          err,
        })
        return resolve([])
      }

      iam.getCredentialReport(
        async (err: AWSError, data: GetCredentialReportResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'iam:getCredentialReport',
              err,
            })
          }
          if (!isEmpty(data)) {
            const report = await parseCSV(data.Content.toString())

            resolve(report)
          }

          resolve([])
        }
      )
    })
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
    const iamUsers = await listIamUsers(client)

    // Fetch IAM Report Credential
    const credentialReport = await getCredentialReportData(client)

    // Fetch all virtual MFA Devices
    const virtualMFADevices = await listVirtualMFADevices(client)

    usersData = credentialReport
      .map(userReport => {
        const user = iamUsers.find(u => u.Arn === userReport.Arn)

        if (userReport.User.includes('root')) {
          return {
            Path: '/',
            UserName: 'root',
            UserId: cuid(),
            Arn: userReport.Arn,
            CreateDate: new Date(),
            AccessKeyLastUsedData: [],
            MFADevices: [],
            VirtualMFADevices:
              virtualMFADevices?.filter(d => d.User?.Arn === userReport.Arn) ||
              [],
            Groups: [],
            Policies: [],
            ManagedPolicies: [],
            ReportData: userReport,
            region: globalRegionName,
          }
        }

        if (!user) {
          return undefined
        }

        const { Arn, ...rest } = user

        return {
          Arn,
          VirtualMFADevices:
            virtualMFADevices?.filter(d => d.User?.Arn === Arn) || [],
          ...rest,
          ReportData: userReport,
        }
      })
      .filter(Boolean)

    errorLog.reset()
    logger.debug(lt.fetchedIamUsers(usersData.length))

    resolve(groupBy(usersData, 'region'))
  })
