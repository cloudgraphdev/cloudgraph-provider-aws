import { ServiceConnection } from '@cloudgraph/sdk'

import { isEmpty } from 'lodash'
import services from '../../enums/services'
import { RawAwsEcsCluster } from '../ecsCluster/data'
import { RawAwsS3 } from '../s3/data'
import { RawAwsLogGroup } from '../cloudwatchLogs/data'
import { AwsKms } from '../kms/data'
import { gets3BucketId } from '../../utils/ids'

export default ({
  service: ecsCluster,
  data,
  region,
}: {
  service: RawAwsEcsCluster
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const {
    clusterArn: arn,
    configuration: {
      executeCommandConfiguration: { logConfiguration, kmsKeyId } = {},
    } = {},
  } = ecsCluster
  const connections: ServiceConnection[] = []

  /**
   * Find S3
   * related to this ecs cluster
   */
  const buckets = data.find(({ name }) => name === services.s3)
  if (buckets?.data?.[region]) {
    const dataAtRegion: RawAwsS3[] = buckets.data[region].filter(
      ({ Name: name }: RawAwsS3) => name === logConfiguration?.s3BucketName
    )
    for (const bucket of dataAtRegion) {
      connections.push({
        id: gets3BucketId(bucket.Name),
        resourceType: services.s3,
        relation: 'child',
        field: 's3',
      })
    }
  }

  /**
   * Find Cloudwatch Log Group
   * related to this ecs cluster
   */
  const logGroups = data.find(({ name }) => name === services.cloudwatchLog)
  let logGroupsInRegion: RawAwsLogGroup[] = []
  if (logGroups?.data?.[region]) {
    logGroupsInRegion = logGroups.data[region].filter(
      ({ logGroupName }: RawAwsLogGroup) =>
        logGroupName === logConfiguration?.cloudWatchLogGroupName
    )
  }

  if (!isEmpty(logGroupsInRegion)) {
    for (const logGroup of logGroupsInRegion) {
      connections.push({
        id: logGroup.logGroupName,
        resourceType: services.cloudwatchLog,
        relation: 'child',
        field: 'cloudwatchLog',
      })
    }
  }

  /**
   * Find MKS
   * related to this ecs cluster
   */
  const kms = data.find(({ name }) => name === services.kms)
  if (kms?.data?.[region]) {
    const kmsInRegion: AwsKms = kms.data[region].find(
      ({ KeyArn }: AwsKms) => KeyArn === kmsKeyId
    )

    if (kmsInRegion) {
      connections.push({
        id: kmsInRegion.KeyId,
        resourceType: services.kms,
        relation: 'child',
        field: 'kms',
      })
    }
  }

  const natResult = {
    [arn]: connections,
  }
  return natResult
}
