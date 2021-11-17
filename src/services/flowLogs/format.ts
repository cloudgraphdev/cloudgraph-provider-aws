import { AwsFlowLog } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawFlowLog } from './data'

/**
 * ELB
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawFlowLog
  account: string
  region: string
}): AwsFlowLog => {
  const {
    FlowLogId: id,
    DeliverLogsErrorMessage: deliverLogsErrorMessage,
    DeliverLogsPermissionArn: deliverLogsPermissionArn,
    DeliverLogsStatus: deliverLogsStatus,
    FlowLogStatus: logStatus,
    LogGroupName: groupName,
    ResourceId: resourceId,
    TrafficType: trafficType,
    LogDestinationType: destinationType,
    LogDestination: destination,
    LogFormat: format,
    MaxAggregationInterval: maxAggregationInterval,
    CreationTime: creationTime,
    Tags: tags = {},
  } = rawData

  // Format Flow Log Tags
  const flowLogTags = formatTagsFromMap(tags)

  const flowLog = {
    id,
    region,
    accountId: account,
    deliverLogsErrorMessage,
    deliverLogsPermissionArn,
    deliverLogsStatus,
    logStatus,
    groupName,
    resourceId,
    trafficType,
    destinationType,
    destination,
    format,
    maxAggregationInterval,
    creationTime: creationTime.toISOString(),
    tags: flowLogTags,
  }
  return flowLog
}
