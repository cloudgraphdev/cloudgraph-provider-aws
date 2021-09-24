import { AwsKinesisStream } from '../../types/generated';
import { RawAwsKinesisStream } from './data';

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsKinesisStream
  account: string
  region: string
}): AwsKinesisStream => {
  const {
    StreamName: streamName,
    StreamARN: streamARN,
    StreamStatus: streamStatus,
    Shards: shards,
    RetentionPeriodHours: retentionPeriodHours,
    EnhancedMonitoring: enhancedMonitoring,
    EncryptionType: encryptionType,
    KeyId: keyId,
  } = rawData

  const enhancedMonitoringList = enhancedMonitoring
    .map(({ShardLevelMetrics: shardLevelMetrics}) => {
      return {shardLevelMetrics}
    })

  const shardList = shards.map(({
    ShardId: shardId,
    ParentShardId: parentShardId,
    AdjacentParentShardId: adjacentParentShardId,
    HashKeyRange: hashKeyRange,
    SequenceNumberRange: sequenceNumberRange,
  }) => {
    return {
      shardId,
      parentShardId,
      adjacentParentShardId,
      hashKeyRangeStarting: hashKeyRange.StartingHashKey,
      hashKeyRangeEnding: hashKeyRange.EndingHashKey,
      sequenceNumberRangeStaring: sequenceNumberRange.StartingSequenceNumber,
      sequenceNumberRangeEnding: sequenceNumberRange?.EndingSequenceNumber || '',
    }
  })

  const dataStream = {
    id: streamARN,
    accountId: account,
    arn: streamARN,
    streamName,
    streamStatus,
    shards: shardList,
    retentionPeriodHours,
    enhancedMonitoring: enhancedMonitoringList,
    encryptionType,
    keyId,
    region,
  }

  return dataStream
}
