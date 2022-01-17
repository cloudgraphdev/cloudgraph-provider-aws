import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { Config } from 'aws-sdk/lib/config'
import EC2, { FlowLog } from 'aws-sdk/clients/ec2'
import CloudGraph from '@cloudgraph/sdk'

import { AwsTag, TagMap } from '../../types'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'

const { logger } = CloudGraph
const serviceName = 'flowLog'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawFlowLog extends Omit<FlowLog, 'Tags'> {
  region: string
  Tags: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [key: string]: RawFlowLog[] }> => {
  const flowLogsResult: RawFlowLog[] = []
  const regionArray = regions.split(',')
  for (const region of regionArray) {
    const ec2 = new EC2({ ...config, region, endpoint })
    const MAX_RESULTS = 100
    try {
      let nextTokenWatcher = true
      while (nextTokenWatcher) {
        const flowLogs = await ec2
          .describeFlowLogs({ MaxResults: MAX_RESULTS })
          .promise()
        if (!isEmpty(flowLogs?.FlowLogs)) {
          logger.debug(`found ${flowLogs.FlowLogs.length} Flow logs`)
          for (const flowLog of flowLogs.FlowLogs) {
            flowLogsResult.push({
              ...flowLog,
              region,
              Tags: convertAwsTagsToTagMap(flowLog.Tags as AwsTag[]),
            })
          }
        }
        if (!flowLogs.NextToken) {
          nextTokenWatcher = false
        }
      }
    } catch (err) {
      errorLog.generateAwsErrorLog({
        functionName: 'EC2:describeFlowLogs',
        err,
      })
    }
  }
  errorLog.reset()

  return groupBy(flowLogsResult, 'region')
}
