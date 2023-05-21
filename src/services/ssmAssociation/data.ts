import CloudGraph from '@cloudgraph/sdk'
import SSM, { Association, ListAssociationsRequest, ListAssociationsResult } from 'aws-sdk/clients/ssm'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_ACTIVATIONS = 50
const serviceName = 'ssmAssociations'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

/**
 * SSM Association
 */

export const getAssociationsForRegion = async (
  ssm: SSM
): Promise<Association[]> =>
  new Promise(async resolve => {
    const associationList: Association[] = []

    const listAssociationsOpts: ListAssociationsRequest = {}
    const listAllAssociations = (token?: string): void => {
      listAssociationsOpts.MaxResults = MAX_ACTIVATIONS
      if (token) {
        listAssociationsOpts.NextToken = token
      }
      try {
        ssm.listAssociations(
          listAssociationsOpts,
          (err: AWSError, data: ListAssociationsResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ssm:listAssociations',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { NextToken: nextToken, Associations: items = [] } = data || {}

            if (isEmpty(items)) {
              return resolve([])
            }

            logger.debug(lt.fetchedSsmAssociations(items.length))

            associationList.push(...items)

            if (nextToken) {
              listAllAssociations(nextToken)
            } else {
              resolve(associationList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllAssociations()
  })

export interface RawAwsSsmAssociation extends Association {
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
  [region: string]: RawAwsSsmAssociation[]
}> =>
  new Promise(async resolve => {
    const associationsResult: RawAwsSsmAssociation[] = []

    const regionPromises = regions.split(',').map(region => {
      const ssm = new SSM({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })

      return new Promise<void>(async resolveSsmAssociationData => {
        // Get SSM Associations
        const associations = await getAssociationsForRegion(ssm)

        if (!isEmpty(associations)) {
          associationsResult.push(
            ...associations.map((association) => ({
              ...association,
              region,
              account,
            }))
          )
        }

        resolveSsmAssociationData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(associationsResult, 'region'))
  })
