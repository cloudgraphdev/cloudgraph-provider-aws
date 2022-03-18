import { Config } from 'aws-sdk/lib/config'
import { groupBy, isEmpty } from 'lodash'
import RDS from 'aws-sdk/clients/rds'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import ErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { TagMap, AwsTag } from '../../types'

const serviceName = 'rdsClusterSnapshot'
const endpoint = initTestEndpoint(serviceName)
const errorLog = new ErrorLog(serviceName)

export interface RawAwsRdsClusterSnapshot extends RDS.DBClusterSnapshot {
  region: string
  attributes: RDS.DBClusterSnapshotAttributeList
  Tags: TagMap
}

/**
 * RdsClusterSnapshot
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsRdsClusterSnapshot[] }> => {
  const result: RawAwsRdsClusterSnapshot[] = []

  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    const client = new RDS({ ...config, region, endpoint })
    let rdsClusterSnapshotData: RDS.DBClusterSnapshot[]
    try {
      rdsClusterSnapshotData = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: client,
          fnName: 'describeDBClusterSnapshots',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({ functionName: 'describeDBClusterSnapshots', err })
    }

    if (!isEmpty(rdsClusterSnapshotData)) {
      for (const snapshot of rdsClusterSnapshotData) {
        let snapshotAttributes: RDS.DBClusterSnapshotAttributeList
        try {
          const attributeResponse = await client
            .describeDBClusterSnapshotAttributes({
              DBClusterSnapshotIdentifier: snapshot.DBClusterSnapshotIdentifier,
            })
            .promise()
          snapshotAttributes =
            attributeResponse?.DBClusterSnapshotAttributesResult?.DBClusterSnapshotAttributes
        } catch (err) {
          errorLog.generateAwsErrorLog({ functionName: 'describeDBClusterSnapshotAttributes', err })
        }
        result.push({ ...snapshot, Tags: convertAwsTagsToTagMap(snapshot?.TagList as AwsTag[]), attributes: snapshotAttributes, region })
      }
    }
  }

  errorLog.reset()
  return groupBy(result, 'region')
}
