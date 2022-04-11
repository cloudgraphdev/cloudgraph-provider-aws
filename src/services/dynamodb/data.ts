import CloudGraph from '@cloudgraph/sdk'
import DynamoDB, {
  ListTablesOutput,
  TableName,
  DescribeTableOutput,
  ListTagsOfResourceInput,
  TagList,
  TimeToLiveDescription,
  ListTagsOfResourceOutput,
  DescribeTimeToLiveOutput,
  TableDescription,
  DescribeContinuousBackupsOutput,
  TableNameList,
  ListTablesInput,
  ContinuousBackupsDescription,
  DescribeTableReplicaAutoScalingOutput,
  TableAutoScalingDescription,
  ReplicaAutoScalingDescription,
  ReplicaDescription,
} from 'aws-sdk/clients/dynamodb'
import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'

import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'DynamoDB'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsReplicaDescription extends ReplicaDescription {
  AutoScaling?: ReplicaAutoScalingDescription
}

export interface RawAwsDynamoDbTable
  extends Omit<TableDescription, 'Replicas'> {
  region: string
  ttlEnabled?: boolean
  pointInTimeRecoveryEnabled?: boolean
  Tags?: TagMap
  Replicas?: RawAwsReplicaDescription[]
}

const checkIfEnabled = (status: string): boolean =>
  status && !['DISABLED', 'DISABLING'].includes(status)

const ttlInfoFormatter = (ttlInfo: TimeToLiveDescription): boolean => {
  const { TimeToLiveStatus } = ttlInfo
  return checkIfEnabled(TimeToLiveStatus)
}

const backupInfoFormatter = (
  backupInfo: ContinuousBackupsDescription
): boolean => {
  const {
    PointInTimeRecoveryDescription: { PointInTimeRecoveryStatus },
  } = backupInfo
  return checkIfEnabled(PointInTimeRecoveryStatus)
}

/**
 * DynamoDB
 */
const listTableNamesForRegion = async ({
  dynamoDb,
  resolveRegion,
}): Promise<TableName[]> =>
  new Promise<TableName[]>(resolve => {
    const tableList: TableNameList = []
    const listTableNameOpts: ListTablesInput = {}
    const listTables = (exclusiveStartTableName?: string): void => {
      if (exclusiveStartTableName) {
        listTableNameOpts.ExclusiveStartTableName = exclusiveStartTableName
      }
      dynamoDb.listTables(
        listTableNameOpts,
        (err: AWSError, listTablesOutput: ListTablesOutput) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'dynamodb:listTables',
              err,
            })
          }
          /**
           * No DynamoDB data for this region
           */
          if (isEmpty(listTablesOutput)) {
            return resolveRegion()
          }

          const { TableNames, LastEvaluatedTableName: lastEvaluatedTable } =
            listTablesOutput

          /**
           * No DynamoDB Tables for this region
           */
          if (isEmpty(TableNames)) {
            return resolveRegion()
          }
          tableList.push(...TableNames)

          if (lastEvaluatedTable) {
            listTables(lastEvaluatedTable)
          }

          resolve(tableList)
        }
      )
    }
    listTables()
  })

const getTableDescription = async (
  dynamoDb: DynamoDB,
  tableName: TableName
): Promise<TableDescription> =>
  new Promise(resolve => {
    dynamoDb.describeTable(
      { TableName: tableName },
      (err: AWSError, tableInfoOutput: DescribeTableOutput) => {
        if (err || !tableInfoOutput) {
          errorLog.generateAwsErrorLog({
            functionName: 'dynamodb:describeTable',
            err,
          })
        }
        if (!isEmpty(tableInfoOutput)) {
          resolve(tableInfoOutput.Table)
        }
        resolve({})
      }
    )
  })

const getTableTags = async (
  dynamoDb: DynamoDB,
  resourceArn: string
): Promise<TagMap> =>
  new Promise(resolveTags => {
    const tags: TagList = []

    const listAllTagsOpts: ListTagsOfResourceInput = {
      ResourceArn: resourceArn,
    }
    const listAllTags = (token?: string): void => {
      if (token) {
        listAllTagsOpts.NextToken = token
      }
      try {
        dynamoDb.listTagsOfResource(
          listAllTagsOpts,
          (err: AWSError, data: ListTagsOfResourceOutput) => {
            const { Tags = [], NextToken: nextToken } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'dynamodb:listTagsOfResource',
                err,
              })
            }

            tags.push(...Tags)

            if (nextToken) {
              logger.debug(lt.foundAnotherThousand)
              listAllTags(nextToken)
            } else {
              resolveTags(convertAwsTagsToTagMap(tags as AwsTag[]))
            }
          }
        )
      } catch (error) {
        resolveTags({})
      }
    }
    listAllTags()
  })

const getTableTTLDescription = async (
  dynamoDb: DynamoDB,
  tableName: TableName
): Promise<TimeToLiveDescription> =>
  new Promise(resolve => {
    dynamoDb.describeTimeToLive(
      {
        TableName: tableName,
      },
      (err: AWSError, data: DescribeTimeToLiveOutput) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'dynamodb:describeTimeToLive',
            err,
          })
        }
        if (!isEmpty(data)) {
          resolve(data.TimeToLiveDescription)
        }
        resolve({})
      }
    )
  })

const getTableBackupsDescription = async (
  dynamoDb: DynamoDB,
  tableName: TableName
): Promise<ContinuousBackupsDescription> =>
  new Promise(resolve => {
    dynamoDb.describeContinuousBackups(
      {
        TableName: tableName,
      },
      (err: AWSError, data: DescribeContinuousBackupsOutput) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'dynamodb:describeContinuousBackups',
            err,
          })
        }
        if (!isEmpty(data)) {
          resolve(data.ContinuousBackupsDescription)
        }
        resolve({ ContinuousBackupsStatus: 'DISABLED' })
      }
    )
  })

const getTableReplicaAutoScaling = async (
  dynamoDb: DynamoDB,
  tableName: TableName
): Promise<TableAutoScalingDescription> =>
  new Promise(resolve => {
    dynamoDb.describeTableReplicaAutoScaling(
      {
        TableName: tableName,
      },
      (err: AWSError, data: DescribeTableReplicaAutoScalingOutput) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'dynamodb:describeTableReplicaAutoScaling',
            err,
          })
        }
        if (!isEmpty(data)) {
          resolve(data.TableAutoScalingDescription)
        }
        resolve({})
      }
    )
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsDynamoDbTable[] }> =>
  new Promise(async resolve => {
    const tableNames: Array<{ name: TableName; region: string }> = []
    const tableData: Array<RawAwsDynamoDbTable> = []
    const regionPromises = []
    const tablePromises = []
    const tagsPromises = []
    const ttlInfoPromises = []
    const backupInfoPromises = []
    const tableReplicaAutoScalingPromises = []

    // First we get all table name for all regions
    regions.split(',').map(region => {
      // We instatiate a client per region
      const dynamoDb = new DynamoDB({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(async resolveRegion => {
        // Then we try to fetch all table names per region
        // region gets resolved if there's any data found for this region
        const regionTableNameList = await listTableNamesForRegion({
          dynamoDb,
          resolveRegion,
        })
        // If data exists in this region we begin populating the tableNames array of objects
        tableNames.push(...regionTableNameList.map(name => ({ name, region })))
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })
    await Promise.all(regionPromises)
    logger.debug(lt.fetchedDynamoDbTableNames(tableNames.length))

    // In each of the following we set simultaneous clients for each of the tables,
    // to fetch all data at once, if possible

    // Then we get the full table description for each name
    tableNames.map(({ name: tableName, region }) => {
      const dynamoDb = new DynamoDB({ ...config, region, endpoint })
      const tablePromise = new Promise<void>(async resolveTable => {
        const tableDescription: TableDescription = await getTableDescription(
          dynamoDb,
          tableName
        )
        tableData.push({
          region,
          ...tableDescription,
        })
        resolveTable()
      })
      tablePromises.push(tablePromise)
    })
    logger.debug(lt.gettingTableDetails)
    await Promise.all(tablePromises)

    // Afterwards we get all tags for each table
    tableData.map(({ TableArn: tableArn, region }, idx) => {
      const dynamoDb = new DynamoDB({ ...config, region, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        tableData[idx].Tags = (await getTableTags(dynamoDb, tableArn)) || {}
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })
    logger.debug(lt.gettingTableTags)
    await Promise.all(tagsPromises)

    // Then we get the ttl description for each table
    tableData.map(({ TableName, region }, idx) => {
      const dynamoDb = new DynamoDB({ ...config, region, endpoint })
      const ttlInfoPromise = new Promise<void>(async resolveTtlInfo => {
        const ttlInfo: TimeToLiveDescription = await getTableTTLDescription(
          dynamoDb,
          TableName
        )
        tableData[idx].ttlEnabled = ttlInfoFormatter(ttlInfo)
        resolveTtlInfo()
      })
      ttlInfoPromises.push(ttlInfoPromise)
    })
    logger.debug(lt.gettingTableTtlInfo)
    await Promise.all(ttlInfoPromises)

    // Get the backup information for each table
    tableData.map(({ TableName, region }, idx) => {
      const dynamoDb = new DynamoDB({ ...config, region, endpoint })
      const backupInfoPromise = new Promise<void>(async resolveBackupInfo => {
        const backupInfo: ContinuousBackupsDescription =
          await getTableBackupsDescription(dynamoDb, TableName)
        tableData[idx].pointInTimeRecoveryEnabled =
          backupInfoFormatter(backupInfo)
        resolveBackupInfo()
      })
      backupInfoPromises.push(backupInfoPromise)
    })
    logger.debug(lt.gettingTableBackupInfo)
    await Promise.all(backupInfoPromises)

    // Finally we get the auto scaling settings for each table
    tableData.map(({ TableName: tableName, region }, idx) => {
      const dynamoDb = new DynamoDB({ ...config, region, endpoint })
      const tableReplicaAutoScalingPromise = new Promise<void>(
        async resolveTableReplicaAutoScaling => {
          const globalSettings: TableAutoScalingDescription =
            await getTableReplicaAutoScaling(dynamoDb, tableName)
          tableData[idx].Replicas = tableData[idx].Replicas?.map(
            ({ RegionName: regionName, ...rest }) => {
              const autoScaling: ReplicaAutoScalingDescription =
                globalSettings?.Replicas?.find(
                  r => r.RegionName === regionName
                ) || {}
              return {
                AutoScaling: autoScaling,
                RegionName: regionName,
                ...rest,
              }
            }
          )
          resolveTableReplicaAutoScaling()
        }
      )
      tableReplicaAutoScalingPromises.push(tableReplicaAutoScalingPromise)
    })

    logger.debug(lt.gettingTableBackupInfo)
    await Promise.all(tableReplicaAutoScalingPromises)

    errorLog.reset()

    resolve(groupBy(tableData, 'region'))
  })
