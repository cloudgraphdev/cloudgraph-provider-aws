import SES, {
  ListReceiptRuleSetsResponse,
  ReceiptRuleSetMetadata,
  ReceiptRule,
} from 'aws-sdk/clients/ses'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'

import groupBy from 'lodash/groupBy'

import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const serviceName = 'SES Receipt Rule Set'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

/**
 * SES Receipt Rule Set
 */

export interface RawAwsSesReceiptRuleSet {
  ReceiptRuleSet: ReceiptRuleSetMetadata
  Rules: ReceiptRule[]
  region: string
}

const getReceiptRuleSets = async (
  ses: SES
): Promise<ReceiptRuleSetMetadata[]> =>
  new Promise(resolve => {
    const ruleSets: ReceiptRuleSetMetadata[] = []
    const listReceiptRuleSets = (nextToken?: string): void => {
      try {
        ses.listReceiptRuleSets(
          { NextToken: nextToken },
          (err: AWSError, data: ListReceiptRuleSetsResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'sesReceiptRuleSet:listReceiptRuleSets',
                err,
              })
              return resolve([])
            }
            const { RuleSets = [] } = data || {}
            ruleSets.push(...RuleSets)
            if (data?.NextToken) {
              listReceiptRuleSets(data.NextToken)
            } else {
              resolve(RuleSets)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listReceiptRuleSets()
  })

const getReceiptRules = async (
  ses: SES,
  ruleSets: ReceiptRuleSetMetadata[]
): Promise<{ ruleSet: ReceiptRuleSetMetadata; rules: ReceiptRule[] }[]> => {
  const receiptRules: {
    ruleSet: ReceiptRuleSetMetadata
    rules: ReceiptRule[]
  }[] = []
  for (const ruleSet of ruleSets) {
    try {
      const response = await ses
        .describeReceiptRuleSet({
          RuleSetName: ruleSet.Name,
        })
        .promise()
      const { Metadata, Rules = [] } = response

      receiptRules.push({
        ruleSet: Metadata,
        rules: Rules,
      })
    } catch (error) {
      errorLog.generateAwsErrorLog({
        functionName: 'sesReceiptRuleSet:describeReceiptRuleSet',
        err: error,
      })
    }
  }
  return receiptRules
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsSesReceiptRuleSet[] }> =>
  new Promise(async resolve => {
    const sesData: RawAwsSesReceiptRuleSet[] = []
    const regionPromises = []

    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(async resolveRegion => {
        const ses = new SES({ ...config, region, endpoint })

        const ruleSets = await getReceiptRuleSets(ses)
        const receiptRuleSets = await getReceiptRules(ses, ruleSets)

        for (const { ruleSet, rules } of receiptRuleSets) {
          sesData.push({
            ReceiptRuleSet: ruleSet,
            Rules: rules,
            region,
          })
        }

        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(sesData, 'region'))
  })
