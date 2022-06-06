// import { formatTagsFromMap } from '../../utils/format' // TODO: Build this
import { generateUniqueId } from '@cloudgraph/sdk'
import { TableMetadata, Column } from 'aws-sdk/clients/athena'
import { AwsAthenaDataCatalog } from '../../types/generated'
import { RawAwsAthenaDataCatalog } from './data'
import { athenaDataCatalogArn } from '../../utils/generateArns'

/**
 * AthenaDataCatalog
 */
const formatColumns = (column: Column) => {
  return {
    id: generateUniqueId({
      ...column,
    }),
    name: column.Name,
    type: column.Type,
    comment: column.Comment,
  }
}
const formatMetadata = (metadata: TableMetadata) => {
  return {
    name: metadata.Name,
    createTime: metadata.CreateTime?.toISOString(),
    lastAccessTime: metadata.LastAccessTime?.toISOString(),
    tableType: metadata.TableType,
    columns: metadata.Columns?.map(formatColumns),
    partitionKeys: metadata.PartitionKeys?.map(formatColumns),
    parameters: Object.keys(metadata.Parameters ?? {}).map(key => ({
      id: generateUniqueId({
        ...metadata,
      }),
      key,
      value: metadata.Parameters[key],
    })),
  }
}
export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsAthenaDataCatalog
  region: string
}): AwsAthenaDataCatalog => {
  const { CatalogName: catalogName, Type: type, databases = [] } = rawData
  const formattedDatabases = databases.map(val => ({
    id: generateUniqueId({
      catalogName,
      ...val,
    }),
    name: val.Name,
    description: val.Description,
    parameters: Object.keys(val.Parameters ?? {}).map(key => ({
      id: generateUniqueId({
        catalogName,
        key,
        value: val.Parameters[key],
      }),
      key,
      value: val.Parameters[key],
    })),
    metadata: formatMetadata(val.metadata),
  }))
  const arn = athenaDataCatalogArn({ region, account, name: catalogName })
  return {
    id: arn,
    arn,
    region,
    accountId: account,
    catalogName,
    type,
    databases: formattedDatabases,
  }
}
