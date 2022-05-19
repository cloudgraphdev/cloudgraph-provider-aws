import { AWSError } from 'aws-sdk'
import CloudFormation, {
  DescribeStackResourceDriftsInput,
  DescribeStackResourceDriftsOutput,
  DescribeStacksInput,
  DescribeStacksOutput,
  Stack,
  StackResourceDrift,
} from 'aws-sdk/clients/cloudformation'
import { Config } from 'aws-sdk/lib/config'
import { groupBy, isEmpty } from 'lodash'

import { TagMap } from '../../types'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { CLOUDFORMATION_STACK_CUSTOM_DELAY } from '../../config/constants'
import { settleAllPromises } from '../../utils/index'

const serviceName = 'CloudFormationStack'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: CLOUDFORMATION_STACK_CUSTOM_DELAY,
})

/**
 * Cloud Formation Stack
 */
export interface RawAwsCloudFormationStack extends Omit<Stack, 'Tags'> {
  stackDrifts?: StackResourceDrift[]
  Tags: TagMap
  region: string
}

const getAllStacks = async (cf: CloudFormation): Promise<Stack[]> =>
  new Promise<Stack[]>(resolve => {
    const fullStacks: Stack[] = []
    const opts: DescribeStacksInput = {}
    const listAllStacks = (token?: string): void => {
      if (token) {
        opts.NextToken = token
      }

      try {
        cf.describeStacks(opts, (err: AWSError, data: DescribeStacksOutput) => {
          const { Stacks = [], NextToken } = data || {}

          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'CloudFormationStack:describeStacks',
              err,
            })
          }

          fullStacks.push(...Stacks)

          if (NextToken) {
            listAllStacks(NextToken)
          } else {
            resolve(fullStacks)
          }
        })
      } catch (error) {
        resolve([])
      }
    }
    listAllStacks()
  })

const getStackResourceDrifts = async (
  cf: CloudFormation,
  StackName: string
): Promise<StackResourceDrift[]> =>
  new Promise<StackResourceDrift[]>(resolve => {
    const driftedResources: StackResourceDrift[] = []
    const opts: DescribeStackResourceDriftsInput = { StackName }
    const listAllStacks = (token?: string): void => {
      if (token) {
        opts.NextToken = token
      }

      cf.describeStackResourceDrifts(
        opts,
        (err: AWSError, data: DescribeStackResourceDriftsOutput) => {
          const { StackResourceDrifts = [], NextToken } = data || {}

          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'CloudFormationStack:describeStackResourceDrifts',
              err,
            })
          }

          driftedResources.push(...StackResourceDrifts)

          if (NextToken) {
            listAllStacks(NextToken)
          }

          resolve(driftedResources)
        }
      )
    }
    listAllStacks()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsCloudFormationStack[]
}> => {
  const cfStacksData: RawAwsCloudFormationStack[] = []

  for (const region of regions.split(',')) {
    const cf = new CloudFormation({
      ...config,
      region,
      endpoint,
      ...customRetrySettings,
    })

    const stackList = await getAllStacks(cf)

    if (!isEmpty(stackList)) {
      const data = stackList.map(async (stack: Stack) => ({
        ...stack,
        driftedResources: await getStackResourceDrifts(cf, stack.StackName),
        Tags: convertAwsTagsToTagMap(stack.Tags),
        region,
      }))
      cfStacksData.push(...(await settleAllPromises(data)))
    }
  }
  errorLog.reset()

  return groupBy(cfStacksData, 'region')
}
