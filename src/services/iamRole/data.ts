import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'

import IAM, {
  AttachedPolicy,
  GetRoleResponse,
  ListAttachedRolePoliciesResponse,
  ListRolePoliciesResponse,
  ListRolesResponse,
  ListRoleTagsResponse,
  Role,
} from 'aws-sdk/clients/iam'
import { Config } from 'aws-sdk/lib/config'

import { TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { globalRegionName } from '../../enums/regions'
import { convertAwsTagsToTagMap } from '../../utils/format'

import {
  IAM_CUSTOM_DELAY,
  MAX_FAILED_AWS_REQUEST_RETRIES,
} from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'IAM Role'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export interface RawAwsIamRole extends Omit<Role, 'Tags'> {
  Policies: string[]
  ManagedPolicies: AttachedPolicy[]
  region: string
  Tags?: TagMap
}

const roleByRoleName = async (
  iam: IAM,
  { RoleName }: Role
): Promise<{ RoleName: string; Role: Role }> =>
  new Promise(resolve => {
    iam.getRole({ RoleName }, (err: AWSError, data: GetRoleResponse) => {
      if (err) {
        errorLog.generateAwsErrorLog({
          err,
          functionName: 'iam:getRole',
        })
      }

      if (!isEmpty(data)) {
        const { Role } = data

        resolve({
          RoleName,
          Role,
        })
      }

      resolve(null)
    })
  })

const tagsByRoleName = async (
  iam: IAM,
  { RoleName }: Role
): Promise<{ RoleName: string; Tags: TagMap }> =>
  new Promise(resolve => {
    iam.listRoleTags(
      { RoleName },
      (err: AWSError, data: ListRoleTagsResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listRoleTags',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { Tags: tags = [] } = data

          resolve({
            RoleName,
            Tags: convertAwsTagsToTagMap(tags),
          })
        }

        resolve(null)
      }
    )
  })

const policiesByRoleName = async (
  iam: IAM,
  { RoleName }: Role
): Promise<{ RoleName: string; Policies: string[] }> =>
  new Promise(resolve => {
    iam.listRolePolicies(
      { RoleName },
      (err: AWSError, data: ListRolePoliciesResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listRolePolicies',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { PolicyNames = [] } = data

          resolve({ RoleName, Policies: PolicyNames })
        }

        resolve(null)
      }
    )
  })

const managedPoliciesByRoleName = async (
  iam: IAM,
  { RoleName }: Role
): Promise<{ RoleName: string; ManagedPolicies: AttachedPolicy[] }> =>
  new Promise(resolve => {
    iam.listAttachedRolePolicies(
      { RoleName },
      (err: AWSError, data: ListAttachedRolePoliciesResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listAttachedRolePolicies',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { AttachedPolicies = [] } = data

          resolve({
            RoleName,
            ManagedPolicies: AttachedPolicies,
          })
        }

        resolve(null)
      }
    )
  })

export const listIamRoles = async (
  iam: IAM,
  marker?: string
): Promise<RawAwsIamRole[]> =>
  new Promise(resolve => {
    const result: RawAwsIamRole[] = []
    const policiesByRoleNamePromises = []
    const tagsByRoleNamePromises = []
    const managedPoliciesByRoleNamePromises = []
    const roleByRoleNamePromises: Promise<{ RoleName: string; Role: Role }>[] =
      []

    iam.listRoles(
      { Marker: marker },
      async (err: AWSError, data: ListRolesResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listRoles',
            err,
          })
        }
        if (!isEmpty(data)) {
          const { Roles: roles = [], IsTruncated, Marker } = data

          roles.map(role => {
            tagsByRoleNamePromises.push(tagsByRoleName(iam, role))
            policiesByRoleNamePromises.push(policiesByRoleName(iam, role))
            managedPoliciesByRoleNamePromises.push(
              managedPoliciesByRoleName(iam, role)
            )
            roleByRoleNamePromises.push(roleByRoleName(iam, role))
          })

          const tags = await Promise.all(tagsByRoleNamePromises)
          const policies = await Promise.all(policiesByRoleNamePromises)
          const managedPolicies = await Promise.all(
            managedPoliciesByRoleNamePromises
          )
          const detailedRoles = await Promise.all(roleByRoleNamePromises)

          result.push(
            ...roles.map(
              ({ RoleName, AssumeRolePolicyDocument, Tags, ...role }) => {
                return {
                  RoleName,
                  AssumeRolePolicyDocument: decodeURIComponent(
                    AssumeRolePolicyDocument
                  ),
                  ...role,
                  region: globalRegionName,
                  RoleLastUsed: detailedRoles?.find(
                    r => r?.RoleName === RoleName
                  )?.Role.RoleLastUsed,
                  Policies:
                    policies
                      ?.filter(p => p?.RoleName === RoleName)
                      .map(p => p.Policies)
                      .reduce((current, acc) => [...acc, ...current], []) || [],
                  ManagedPolicies:
                    managedPolicies
                      ?.filter(p => p?.RoleName === RoleName)
                      .map(p => p.ManagedPolicies)
                      .reduce((current, acc) => [...acc, ...current], []) || [],
                  Tags: tags.find(t => t?.RoleName === RoleName)?.Tags || {},
                }
              }
            )
          )

          if (IsTruncated) {
            result.push(...(await listIamRoles(iam, Marker)))
          }

          resolve(result)
        }

        resolve([])
      }
    )
  })

/**
 * IAM Role
 */

export default async ({
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsIamRole[]
}> =>
  new Promise(async resolve => {
    let rolesData: RawAwsIamRole[] = []

    const client = new IAM({
      ...config,
      region: globalRegionName,
      endpoint,
      ...customRetrySettings,
    })

    logger.debug(lt.lookingForIamRoles)

    // Fetch IAM Roles
    rolesData = await listIamRoles(client)

    errorLog.reset()
    logger.debug(lt.foundRoles(rolesData.length))

    resolve(groupBy(rolesData, 'region'))
  })
