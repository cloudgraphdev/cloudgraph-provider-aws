import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeConfigRulesResponse,
  ConfigRule,
  ConfigRules,
  DescribeConfigRulesRequest,
} from 'aws-sdk/clients/configservice'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Configuration Rule'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsConfigurationRule extends ConfigRule {
  region: string
}

const listConfigurationRuleData = async ({
  ec2,
}: {
  ec2: EC2
}): Promise<ConfigRules> =>
  new Promise<ConfigRules>(resolve => {
    const configurationRulesData: ConfigRules = []
    const getConfigurationRuleOpts: DescribeConfigRulesRequest = {}
    const listAllConfigRules = (token?: string): void => {
      if (token) {
        getConfigurationRuleOpts.NextToken = token
      }
      try {
        ec2.describeConfigRules(
          getConfigurationRuleOpts,
          (err: AWSError, data: DescribeConfigRulesResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:describeConfigRules',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { NextToken: nextToken, ConfigRules: configRules = [] } =
              data || {}

            if (isEmpty(configRules)) {
              return resolve([])
            }

            configurationRulesData.push(...configRules)

            if (nextToken) {
              listAllConfigRules(nextToken)
            } else {
              resolve(configurationRulesData)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllConfigRules()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsConfigurationRule[]
}> =>
  new Promise(async resolve => {
    const configurationRulesResult: RawAwsConfigurationRule[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveConfigurationRuleData => {
        // Get Configuration Rule Data
        const configurationRules = await listConfigurationRuleData({
          ec2,
        })

        if (!isEmpty(configurationRules)) {
          for (const configurationRule of configurationRules) {
            configurationRulesResult.push({
              ...configurationRule,
              region,
            })
          }
        }

        resolveConfigurationRuleData()
      })
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedConfigurationRules(configurationRulesResult.length))
    errorLog.reset()

    resolve(groupBy(configurationRulesResult, 'region'))
  })
