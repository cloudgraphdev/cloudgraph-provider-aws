import CloudGraph from '@cloudgraph/sdk'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'
import OpsWorks, { DescribeInstancesResult, Instance } from 'aws-sdk/clients/opsworks'
import OpsWorksStack from '../opsworksStack'
import { RawAwsOpsWorksStack } from '../opsworksStack/data'
import { flatMap } from 'lodash'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'OpsWorks Instances'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export const getOpsWorksInstancesForRegion = async (
  opsWorks: OpsWorks,
  StackId: string,
): Promise<Instance[]> =>
  new Promise(async resolve => {
    const listAllInstances = (): void => {
      try {
        opsWorks.describeInstances(
          {StackId},
          (err: AWSError, data: DescribeInstancesResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'opsWorks:describeInstances',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { Instances: instances = [] } = data || {}

            logger.debug(lt.fetchedOpsWorksInstances(instances.length))

            resolve(instances)
          }
        );
      } catch (error) {
        resolve([])
      }
    }
    listAllInstances()
  })

export interface RawAwsOpsWorksInstance extends Omit<Instance, 'tags'> {
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
  [region: string]: RawAwsOpsWorksInstance[]
}> =>
  new Promise(async resolve => {
    const opsWorksResult: RawAwsOpsWorksInstance[] = []
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
        // Get OpsWorks Instance Data
        opsWorksStacks.map(async ({StackId}: RawAwsOpsWorksStack) => {
          const opsWorksInstances = await getOpsWorksInstancesForRegion(opsWorks, StackId)

          if (!isEmpty(opsWorksInstances)) {
            for (const instance of opsWorksInstances) {
              opsWorksResult.push({
                ...instance,
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
