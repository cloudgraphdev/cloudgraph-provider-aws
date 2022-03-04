import { Config } from 'aws-sdk/lib/config'
import { PromiseResult } from 'aws-sdk/lib/request'
import { AWSError } from 'aws-sdk/lib/error'
import DMS from 'aws-sdk/clients/dms'
import { groupBy, isEmpty } from 'lodash'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { TagMap, AwsTag } from '../../types'

const serviceName = 'dms'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsDmsReplicationInstance extends DMS.ReplicationInstance {
  region: string
  Tags: TagMap
}

/**
 * DmsReplicationInstance
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsDmsReplicationInstance[] }> => {
  const result: RawAwsDmsReplicationInstance[] = []

  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    const client = new DMS({ ...config, region, endpoint })
    let dmsReplicationInstanceData: DMS.ReplicationInstance[]
    try {
      dmsReplicationInstanceData = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: client,
          fnName: 'describeReplicationInstances',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({
        functionName: 'describeReplicationInstances',
        err,
      })
    }
    if (!isEmpty(dmsReplicationInstanceData)) {
      const arns = dmsReplicationInstanceData.map(
        ({ ReplicationInstanceArn }) => ReplicationInstanceArn
      )
      let tagData: PromiseResult<DMS.ListTagsForResourceResponse, AWSError>
      try {
        tagData = await client
          .listTagsForResource({ ResourceArnList: arns })
          .promise()
      } catch (err) {
        errorLog.generateAwsErrorLog({
          functionName: 'listTagsForResource',
          err,
        })
      }
      for (const replication of dmsReplicationInstanceData) {
        result.push({
          ...replication,
          region,
          Tags: convertAwsTagsToTagMap(
            tagData?.TagList?.filter(
              ({ ResourceArn }) =>
                ResourceArn === replication.ReplicationInstanceArn
            ) as AwsTag[]
          ),
        })
      }
    }
  }

  errorLog.reset()
  return groupBy(result, 'region')
}
