import { RawAwsSsmAssociation } from './data'
import { AwsSsmAssociation } from '../../types/generated'
import { ssmAssociationArn } from '../../utils/generateArns'
import { AssociationStatusAggregatedCount, TargetMap, TargetMaps } from 'aws-sdk/clients/ssm'

export default ({
  service,
  account,
  region,
}: {
  service: RawAwsSsmAssociation
  account: string
  region: string
}): AwsSsmAssociation => {
  const {
    Name: documentArn,
    InstanceId: instanceId,
    AssociationId: associationId,
    AssociationVersion: associationVersion,
    DocumentVersion: documentVersion,
    Targets: targets,
    LastExecutionDate: lastExecutionDate,
    Overview: overview,
    ScheduleExpression: scheduleExpression,
    AssociationName: associationName,
    ScheduleOffset: scheduleOffset,
    TargetMaps: targetMaps,
  } = service

  const arn = ssmAssociationArn({ region, account, id: associationId })

  const formatStatusAggregatedCount = (aggregatedCount: AssociationStatusAggregatedCount): {id: string, key: string, count: number}[] => {
    const result: {id: string, key: string, count: number}[] = []
    for (const [key, value] of Object.entries(aggregatedCount)) {
      result.push({ id: `${key}:${value}`, key, count: value })
    }
    return result
  }

  const formatTargetMap = (targetMaps: TargetMaps): {id: string, key: string, values: string[]}[] => {
    const result: {id: string, key: string, values: string[]}[] = []
    targetMaps.forEach(tm => {
      for (const [key, value] of Object.entries(tm)) {
        result.push({ id: `${key}:${value}`, key, values: value})
      }
    });
    return result
  }

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    documentArn,
    instanceId,
    associationId,
    associationVersion,
    documentVersion,
    targets: targets?.map(t => ({
      id: `${t.Key}:${t.Values.join(':')}`,
      key: t.Key,
      value: t.Values
    })) || [],
    lastExecutionDate: lastExecutionDate?.toISOString(),
    overview: {
      status: overview?.Status,
      detailedStatus: overview?.DetailedStatus,
      associationStatusAggregatedCount: overview?.AssociationStatusAggregatedCount?formatStatusAggregatedCount(overview?.AssociationStatusAggregatedCount):[],
    },
    scheduleExpression,
    associationName,
    scheduleOffset,
    targetMaps: targetMaps? formatTargetMap(targetMaps) : [],
  }
}
