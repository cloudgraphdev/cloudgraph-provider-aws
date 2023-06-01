import { AwsGlueDatabase } from '../../types/generated'
import { glueDatabaseArn } from '../../utils/generateArns'
import { RawAwsGlueDatabase } from './data'

/**
 * Glue Database
 */
export default ({
  account,
  region,
  service: database,
}: {
  account: string
  region: string
  service: RawAwsGlueDatabase
}): AwsGlueDatabase => {
  const { Name: name, CatalogId: catalogId, tables = [] } = database

  const arn = glueDatabaseArn({ region, account, name })

  return {
    accountId: account,
    arn,
    id: arn,
    name,
    catalogId,
    region,
    tables: tables.map(({ Name }) => Name),
  }
}
