import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'

import IAM, {
  AttachedPolicy,
  ListAttachedRolePoliciesResponse,
  ListRolePoliciesResponse,
  ListRolesResponse,
  ListRoleTagsResponse,
  Role,
} from 'aws-sdk/clients/iam'

import { Credentials, TagMap } from '../../types'
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
const serviceName = 'IAM Role'
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

const tagsByRoleName = async (
  iam: IAM,
  { RoleName }: Role
): Promise<{ RoleName: string; Tags: TagMap }> =>
  new Promise(resolveUserPolicies => {
    iam.listRoleTags(
      { RoleName },
      (err: AWSError, data: ListRoleTagsResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listRoleTags', err)
        }

        if (!isEmpty(data)) {
          const { Tags: tags = [] } = data

          resolveUserPolicies({
            RoleName,
            Tags: convertAwsTagsToTagMap(tags),
          })
        }

        resolveUserPolicies(null)
      }
    )
  })

const policiesByRoleName = async (
  iam: IAM,
  { RoleName }: Role
): Promise<{ RoleName: string; Policies: string[] }> =>
  new Promise(resolveUserPolicies => {
    iam.listRolePolicies(
      { RoleName },
      (err: AWSError, data: ListRolePoliciesResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listRolePolicies', err)
        }

        if (!isEmpty(data)) {
          const { PolicyNames = [] } = data

          resolveUserPolicies({ RoleName, Policies: PolicyNames })
        }

        resolveUserPolicies(null)
      }
    )
  })

const managedPoliciesByRoleName = async (
  iam: IAM,
  { RoleName }: Role
): Promise<{ RoleName: string; ManagedPolicies: AttachedPolicy[] }> =>
  new Promise(resolveUserPolicies => {
    iam.listAttachedRolePolicies(
      { RoleName },
      (err: AWSError, data: ListAttachedRolePoliciesResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listAttachedRolePolicies', err)
        }

        if (!isEmpty(data)) {
          const { AttachedPolicies = [] } = data

          resolveUserPolicies({
            RoleName,
            ManagedPolicies: AttachedPolicies,
          })
        }

        resolveUserPolicies(null)
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

    iam.listRoles(
      { Marker: marker },
      async (err: AWSError, data: ListRolesResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listRoles', err)
        }
        if (!isEmpty(data)) {
          const { Roles: roles = [], IsTruncated, Marker } = data

          roles.map(role => {
            tagsByRoleNamePromises.push(tagsByRoleName(iam, role))
            policiesByRoleNamePromises.push(policiesByRoleName(iam, role))
            managedPoliciesByRoleNamePromises.push(
              managedPoliciesByRoleName(iam, role)
            )
          })

          const tags = await Promise.all(tagsByRoleNamePromises)
          const policies = await Promise.all(policiesByRoleNamePromises)
          const managedPolicies = await Promise.all(
            managedPoliciesByRoleNamePromises
          )

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
  credentials,
}: {
  regions: string
  credentials: Credentials
  rawData: any
}): Promise<{
  [region: string]: RawAwsIamRole[]
}> =>
  new Promise(async resolve => {
    let rolesData: RawAwsIamRole[] = []

    const client = new IAM({ credentials, endpoint, ...customRetrySettings })

    logger.debug(lt.lookingForIamRoles)

    // Fetch IAM Roles
    rolesData = await listIamRoles(client)

    logger.debug(lt.foundRoles(rolesData.length))

    resolve(groupBy(rolesData, 'region'))
  })
