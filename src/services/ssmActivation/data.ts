import CloudGraph from '@cloudgraph/sdk'
import SSM, { Activation, DescribeActivationsRequest, DescribeActivationsResult } from 'aws-sdk/clients/ssm'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_ACTIVATIONS = 50
const serviceName = 'ssmActivations'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

/**
 * SSM Activation
 */

export const getActivationsForRegion = async (
  ssm: SSM
): Promise<Activation[]> =>
  new Promise(async resolve => {
    const activationList: Activation[] = []

    const describeActivationsOpts: DescribeActivationsRequest = {}
    const listAllActivations = (token?: string): void => {
      describeActivationsOpts.MaxResults = MAX_ACTIVATIONS
      if (token) {
        describeActivationsOpts.NextToken = token
      }
      try {
        ssm.describeActivations(
          describeActivationsOpts,
          (err: AWSError, data: DescribeActivationsResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ssm:describeActivations',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { NextToken: nextToken, ActivationList: items = [] } = data || {}

            if (isEmpty(items)) {
              return resolve([])
            }

            logger.debug(lt.fetchedSsmActivations(items.length))

            activationList.push(...items)

            if (nextToken) {
              listAllActivations(nextToken)
            } else {
              resolve(activationList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllActivations()
  })

export interface RawAwsSsmActivation extends Omit<Activation, 'Tags'> {
  Tags: TagMap
  region: string
  account
}

export default async ({
  regions,
  config,
  account,
}: {
  account: string
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsSsmActivation[]
}> =>
  new Promise(async resolve => {
    const activationResult: RawAwsSsmActivation[] = []

    const regionPromises = regions.split(',').map(region => {
      const ssm = new SSM({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })

      return new Promise<void>(async resolveSsmActivationData => {
        // Get SSM Activations
        const activations = await getActivationsForRegion(ssm)

        if (!isEmpty(activations)) {
          activationResult.push(
            ...activations.map(({Tags, ...activation}) => ({
              ...activation,
              region,
              account,
              Tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
            }))
          )
        }

        resolveSsmActivationData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(activationResult, 'region'))
  })
