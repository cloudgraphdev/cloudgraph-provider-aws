import CloudGraph from '@cloudgraph/sdk'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import flatMap from 'lodash/flatMap'
import groupBy from 'lodash/groupBy'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'
import OpsWorks, { App, DescribeAppsResult } from 'aws-sdk/clients/opsworks'
import OpsWorksStack from '../opsworksStack'
import { RawAwsOpsWorksStack } from '../opsworksStack/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'OpsWorks Stack'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export const getOpsWorksAppsForRegion = async (
  opsWorks: OpsWorks,
  StackId: string,
): Promise<App[]> =>
  new Promise(async resolve => {
    const listAllApps = (): void => {
      try {
        opsWorks.describeApps(
          {StackId},
          (err: AWSError, data: DescribeAppsResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'opsWorks:describeApps',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { Apps: apps = [] } = data || {}

            logger.debug(lt.fetchedOpsWorksApps(apps.length))

            resolve(apps)
          }
        );
      } catch (error) {
        resolve([])
      }
    }
    listAllApps()
  })

export interface RawAwsOpsWorksApp extends Omit<App, 'tags'> {
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
  [region: string]: RawAwsOpsWorksApp[]
}> =>
  new Promise(async resolve => {
    const opsWorksResult: RawAwsOpsWorksApp[] = []
    const opsWorksStackClass = new OpsWorksStack({ logger: CloudGraph.logger })
    const stacksResult = await opsWorksStackClass.getData({
      ...config,
      regions,
    })
    const opsWorksStacks: RawAwsOpsWorksStack[] = flatMap(stacksResult)


    const regionPromises = regions.split(',').map(region => {
      const opsWorks = new OpsWorks({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })

      return new Promise<void>(async resolveOpsWorksData => {
        // Get OpsWorks Apps Data
        opsWorksStacks.map(async ({StackId}: RawAwsOpsWorksStack) => {
          const opsWorksApps = await getOpsWorksAppsForRegion(opsWorks, StackId)
  
          if (!isEmpty(opsWorksApps)) {
            for (const app of opsWorksApps) {
              opsWorksResult.push({
                ...app,
                region,
                account,
              })
            }
          }
        })

        resolveOpsWorksData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(opsWorksResult, 'region'))
  })
