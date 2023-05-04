import CloudGraph from '@cloudgraph/sdk'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'
import OpsWorks, { DescribeStacksResult, Stack } from 'aws-sdk/clients/opsworks'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'OpsWorks Stack'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export const getOpsWorksStacksForRegion = async (
  opsWorks: OpsWorks
): Promise<Stack[]> =>
  new Promise(async resolve => {
    const listAllStacks = (): void => {
      try {
        opsWorks.describeStacks(
          (err: AWSError, data: DescribeStacksResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'opsWorks:describeStacks',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { Stacks: stacks = [] } = data || {}

            logger.debug(lt.fetchedOpsWorksStacks(stacks.length))
            resolve(stacks)
          }
        );
      } catch (error) {
        resolve([])
      }
    }
    listAllStacks()
  })

export interface RawAwsOpsWorksStack extends Omit<Stack, 'tags'> {
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
  [region: string]: RawAwsOpsWorksStack[]
}> =>
  new Promise(async resolve => {
    const opsWorksResult: RawAwsOpsWorksStack[] = []

    const regionPromises = regions.split(',').map(region => {
      const opsWorks = new OpsWorks({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })

      return new Promise<void>(async resolveOpsWorksData => {
        // Get OpsWorks Stack Data
        const opsWorksStacks = await getOpsWorksStacksForRegion(opsWorks)

        if (!isEmpty(opsWorksStacks)) {
          for (const stack of opsWorksStacks) {
            opsWorksResult.push({
              ...stack,
              region,
              // Tags: domain.Tags,
              account,
            })
          }
        }

        resolveOpsWorksData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(opsWorksResult, 'region'))
  })
