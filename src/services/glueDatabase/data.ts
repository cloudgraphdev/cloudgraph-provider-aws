import {
  Database,
  GetDatabasesCommand,
  GetDatabasesRequest,
  GetTablesCommand,
  GetTablesRequest,
  GlueClient,
  Table,
} from '@aws-sdk/client-glue'
import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import { groupBy } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Glue Database'
const errorLog = new AwsErrorLog(serviceName)
const MAX_ITEMS = 50

export interface RawAwsGlueDatabase extends Database {
  region: string
  tables?: Table[]
}

const listDatabases = async (glue: GlueClient): Promise<Database[]> =>
  new Promise(async resolve => {
    const databases: Database[] = []

    const input: GetDatabasesRequest = {
      MaxResults: MAX_ITEMS,
    }

    const listAllDatabases = (token?: string): void => {
      if (token) {
        input.NextToken = token
      }
      const command = new GetDatabasesCommand(input)
      glue
        .send(command)
        .then(data => {
          if (isEmpty(data)) {
            return resolve([])
          }

          const { DatabaseList = [], NextToken: nextToken } = data || {}

          databases.push(...DatabaseList)

          if (nextToken) {
            logger.debug(lt.foundAnotherThousand)
            listAllDatabases(nextToken)
          } else {
            resolve(databases)
          }
        })
        .catch(err => {
          errorLog.generateAwsErrorLog({
            functionName: 'glue:getDatabases',
            err,
          })
          resolve([])
        })
    }
    listAllDatabases()
  })

const getTables = async ({
  glue,
  databaseName,
}: {
  glue: GlueClient
  databaseName: string
}): Promise<Table[]> =>
  new Promise<Table[]>(resolve => {
    const tables: Table[] = []
    const input: GetTablesRequest = { DatabaseName: databaseName }
    const listAllTables = (token?: string): void => {
      if (token) {
        input.NextToken = token
      }
      const command = new GetTablesCommand(input)
      glue
        .send(command)
        .then(data => {
          if (isEmpty(data)) {
            return resolve([])
          }

          const { TableList = [], NextToken: nextToken } = data || {}

          tables.push(...TableList)

          if (nextToken) {
            logger.debug(lt.foundAnotherThousand)
            listAllTables(nextToken)
          } else {
            resolve(tables)
          }
        })
        .catch(err => {
          errorLog.generateAwsErrorLog({
            functionName: 'glue:getTables',
            err,
          })
          resolve([])
        })
    }
    listAllTables()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsGlueDatabase[] }> =>
  new Promise(async resolve => {
    const { credentials } = config
    const glueDatabaseData: RawAwsGlueDatabase[] = []
    const tablesPromises = []

    const regionPromises = regions.split(',').map(region => {
      const glue = new GlueClient({
        credentials,
        region,
      })

      return new Promise<void>(async resolveRegion => {
        const databases = (await listDatabases(glue)) || []
        if (!isEmpty(databases))
          glueDatabaseData.push(...databases.map(val => ({ ...val, region })))
        resolveRegion()
      })
    })

    await Promise.all(regionPromises)

    // get all tables for each database
    glueDatabaseData.forEach(({ Name, region }, idx) => {
      const glue = new GlueClient({
        credentials,
        region,
      })
      const tablePromise = new Promise<void>(async resolveTable => {
        glueDatabaseData[idx].tables = await getTables({
          glue,
          databaseName: Name,
        })
        resolveTable()
      })
      tablesPromises.push(tablePromise)
    })

    await Promise.all(tablesPromises)

    errorLog.reset()

    resolve(groupBy(glueDatabaseData, 'region'))
  })
