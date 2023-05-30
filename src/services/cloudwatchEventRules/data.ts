import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import CloudWatchEvents, {
  ListRulesRequest,
  ListRulesResponse,
  ListTargetsByRuleRequest,
  ListTargetsByRuleResponse,
  Rule,
  RuleResponseList,
  TargetList,
} from 'aws-sdk/clients/cloudwatchevents'
import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

/**
 * Cloudwatch Event Rules
 */
const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'CloudwatchEventRule'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsCloudwatchEventRule extends Rule {
  targets: TargetList
  region: string
}

const listRulesForRegion = async ({
  cloudwatch,
  resolveRegion,
}: {
  cloudwatch: CloudWatchEvents
  resolveRegion: () => void
}): Promise<RuleResponseList> =>
  new Promise<RuleResponseList>(resolve => {
    const ruleList: RuleResponseList = []
    const listRuleOpts: ListRulesRequest = {}
    const listAllRule = (token?: string): void => {
      if (token) {
        listRuleOpts.NextToken = token
      }
      try {
        cloudwatch.listRules(
          listRuleOpts,
          (err: AWSError, data: ListRulesResponse) => {
            const { NextToken: nextToken, Rules: entries } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'cloudwatchevents:listRules',
                err,
              })
            }
            /**
             * No rule for this region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            ruleList.push(...entries)

            if (nextToken) {
              listAllRule(nextToken)
            } else {
              resolve(ruleList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllRule()
  })

const listTargetsByRule = ({
  cloudwatch,
  ruleName,
  resolveRule,
}: {
  cloudwatch: CloudWatchEvents
  ruleName: string
  resolveRule: () => void
}): Promise<TargetList> =>
  new Promise<TargetList>(resolve => {
    const targetList: TargetList = []
    const listTargetOpts: ListTargetsByRuleRequest = { Rule: ruleName }
    const listAllTarget = (token?: string): void => {
      if (token) {
        listTargetOpts.NextToken = token
      }
      try {
        cloudwatch.listTargetsByRule(
          listTargetOpts,
          (err: AWSError, data: ListTargetsByRuleResponse) => {
            const { NextToken: nextToken, Targets: entries } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'cloudwatchevents:listTargetsByRule',
                err,
              })
            }

            /**
             * No targets for this rule
             */
            if (isEmpty(data)) {
              return resolveRule()
            }

            targetList.push(...entries)

            if (nextToken) {
              listAllTarget(nextToken)
            } else {
              resolve(targetList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllTarget()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsCloudwatchEventRule[] }> =>
  new Promise(async resolve => {
    const rulesData: RawAwsCloudwatchEventRule[] = []
    const regionPromises = []
    const targetPromises = []

    // get all rules for all regions
    regions.split(',').forEach(region => {
      const cloudwatch = new CloudWatchEvents({
        ...config,
        region,
        endpoint,
      })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const rules = await listRulesForRegion({
          cloudwatch,
          resolveRegion,
        })
        rulesData.push(...rules.map(rule => ({ ...rule, region, targets: [] })))
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    logger.debug(lt.gettingCloudwatchRules)
    await Promise.all(regionPromises)

    // load targets to every rule
    rulesData.forEach((rule, index) => {
      const cloudwatch = new CloudWatchEvents({
        ...config,
        region: rule.region,
        endpoint,
      })
      const targetPromise = new Promise<void>(async resolveRule => {
        const targets = await listTargetsByRule({
          cloudwatch,
          ruleName: rule.Name,
          resolveRule,
        })
        rulesData[index].targets.push(...targets)
        resolveRule()
      })
      targetPromises.push(targetPromise)
    })
    logger.debug(lt.gettingCloudwatchRuleTargets)
    await Promise.all(targetPromises)
    errorLog.reset()

    resolve(groupBy(rulesData, 'region'))
  })
