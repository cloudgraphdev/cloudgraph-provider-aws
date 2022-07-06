import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import unionBy from 'lodash/unionBy'

import { AWSError } from 'aws-sdk/lib/error'

import IAM, {
  GetPolicyVersionResponse,
  ListPoliciesResponse,
  ListPolicyTagsResponse,
  Policy,
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
import MessageInterval from '../../utils/messageInterval'

const MAX_ITEMS = 1000
const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'IAM Policy'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export interface RawAwsIamPolicy extends Omit<Policy, 'Tags'> {
  Document: string
  region: string
  Tags?: TagMap
}

const tagsByPolicyArn = async (
  iam: IAM,
  { Arn }: Policy
): Promise<{ Arn: string; Tags: TagMap }> =>
  new Promise(resolve => {
    iam.listPolicyTags(
      { PolicyArn: Arn },
      (err: AWSError, data: ListPolicyTagsResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listPolicyTags',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { Tags: tags = [] } = data
          resolve({
            Arn,
            Tags: convertAwsTagsToTagMap(tags),
          })
        }

        resolve(null)
      }
    )
  })

const policyVersionByPolicyArn = async (
  iam: IAM,
  { Arn, DefaultVersionId }: Policy
): Promise<{ Arn: string; Content: string }> =>
  new Promise(resolve => {
    iam.getPolicyVersion(
      { PolicyArn: Arn, VersionId: DefaultVersionId },
      (err: AWSError, data: GetPolicyVersionResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:getPolicyVersion',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { PolicyVersion = { Document: '' } } = data
          resolve({
            Arn,
            Content: decodeURIComponent(PolicyVersion.Document),
          })
        }

        resolve(null)
      }
    )
  })

export const listIamPolicies = async ({
  iam,
  marker,
  intervalMessage,
  scope,
}: {
  iam: IAM
  marker?: string
  scope: 'All' | 'Local'
  intervalMessage: MessageInterval
}): Promise<RawAwsIamPolicy[]> =>
  new Promise(resolve => {
    const result: RawAwsIamPolicy[] = []
    const tagsByArnPromises = []
    const policyDetailByArnePromises = []

    iam.listPolicies(
      {
        Marker: marker,
        MaxItems: MAX_ITEMS,
        OnlyAttached: scope === 'All',
        Scope: scope,
      },
      async (err: AWSError, data: ListPoliciesResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listPolicies',
            err,
          })
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

          intervalMessage.updateFetchedCounter(result.length)

          if (IsTruncated) {
            result.push(
              ...(await listIamPolicies({
                iam,
                marker: Marker,
                intervalMessage,
                scope,
              }))
            )
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
  config,
}: {
  regions: string
  config: Config
  rawData: any
}): Promise<{
  [region: string]: RawAwsIamPolicy[]
}> =>
  new Promise(async resolve => {
    let policiesData: RawAwsIamPolicy[] = []
    const intervalMessage = new MessageInterval('IAM Policies')

    const client = new IAM({
      ...config,
      region: globalRegionName,
      endpoint,
      ...customRetrySettings,
    })

    logger.debug(lt.lookingForIamPolicies)
    logger.warn(
      'Please be patient, IAM policies can take a long time to fetch if you have a large account'
    )

    intervalMessage.start()
    // Fetch IAM Policies (scope: All, Attached: true)
    const allAttachedPolicies = await listIamPolicies({
      iam: client,
      intervalMessage,
      scope: 'All',
    })
    // Fetch IAM Policies (scope: Local, Attached: false)
    const localPolicies = await listIamPolicies({
      iam: client,
      intervalMessage,
      scope: 'Local',
    })
    intervalMessage.stop()

    policiesData = unionBy(allAttachedPolicies, localPolicies, 'Arn')

    errorLog.reset()
    logger.debug(lt.foundPolicies(policiesData.length))

    resolve(groupBy(policiesData, 'region'))
  })
