import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'

import IAM, {
  GetPolicyVersionResponse,
  ListPoliciesResponse,
  ListPolicyTagsResponse,
  Policy,
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
const serviceName = 'IAM Policy'
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export interface RawAwsPolicy extends Omit<Policy, 'Tags'> {
  Document: string
  region: string
  Tags?: TagMap
}

const tagsByPolicyArn = async (
  iam: IAM,
  { Arn }: Policy
): Promise<{ Arn: string; Tags: TagMap }> =>
  new Promise(resolveUserPolicies => {
    iam.listPolicyTags(
      { PolicyArn: Arn },
      (err: AWSError, data: ListPolicyTagsResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listPolicyTags', err)
        }

        if (!isEmpty(data)) {
          const { Tags: tags = [] } = data
          resolveUserPolicies({
            Arn,
            Tags: convertAwsTagsToTagMap(tags),
          })
        }

        resolveUserPolicies(null)
      }
    )
  })

const policyVersionByPolicyArn = async (
  iam: IAM,
  { Arn, DefaultVersionId }: Policy
): Promise<{ Arn: string; Content: string }> =>
  new Promise(resolveUserPolicies => {
    iam.getPolicyVersion(
      { PolicyArn: Arn, VersionId: DefaultVersionId },
      (err: AWSError, data: GetPolicyVersionResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:getPolicyVersion', err)
        }

        if (!isEmpty(data)) {
          const { PolicyVersion = { Document: '' } } = data
          resolveUserPolicies({
            Arn,
            Content: decodeURIComponent(PolicyVersion.Document),
          })
        }

        resolveUserPolicies(null)
      }
    )
  })

export const listIamPolicies = async (
  iam: IAM,
  marker?: string
): Promise<RawAwsPolicy[]> =>
  new Promise(resolve => {
    const result: RawAwsPolicy[] = []
    const tagsByArnPromises = []
    const policyDetailByArnePromises = []

    iam.listPolicies(
      { Marker: marker },
      async (err: AWSError, data: ListPoliciesResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listPolicies', err)
        }
        if (!isEmpty(data)) {
          const { Policies: policies = [], IsTruncated, Marker } = data

          policies.map(policy => {
            tagsByArnPromises.push(tagsByPolicyArn(iam, policy))
            policyDetailByArnePromises.push(
              policyVersionByPolicyArn(iam, policy)
            )
          })

          const tags = await Promise.all(tagsByArnPromises)
          const policiesDetails = await Promise.all(policyDetailByArnePromises)

          result.push(
            ...policies.map(({ Arn, Tags, ...policy }) => {
              return {
                Arn,
                ...policy,
                region: globalRegionName,
                Document:
                  policiesDetails.find(p => p?.Arn === Arn)?.Content || '',
                Tags: tags.find(p => p?.Arn === Arn)?.Tags || {},
              }
            })
          )

          if (IsTruncated) {
            result.push(...(await listIamPolicies(iam, Marker)))
          }

          resolve(result)
        }

        resolve([])
      }
    )
  })

/**
 * IAM Policy
 */

export default async ({
  credentials,
}: // rawData,
{
  regions: string
  credentials: Credentials
  rawData: any
}): Promise<{
  [region: string]: RawAwsPolicy[]
}> =>
  new Promise(async resolve => {
    let policiesData: RawAwsPolicy[] = []

    const client = new IAM({ credentials, endpoint, ...customRetrySettings })

    logger.debug(lt.lookingForIamPolicies)

    // Fetch IAM Policies
    policiesData = await listIamPolicies(client)

    logger.debug(lt.foundPolicies(policiesData.length))

    resolve(groupBy(policiesData, 'region'))
  })
