import { Config } from 'aws-sdk/lib/config'
import ATHENA from 'aws-sdk/clients/athena'
import { isEmpty, groupBy } from 'lodash'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import ErrorLog from '../../utils/errorLog'

const serviceName = 'athena'
const endpoint = initTestEndpoint(serviceName)
const errorLog = new ErrorLog(serviceName)
interface RawAwsAthenaDatabase extends ATHENA.Database {
  metadata: ATHENA.TableMetadata
}
export interface RawAwsAthenaDataCatalog extends ATHENA.DataCatalogSummary {
  region: string
  databases?: RawAwsAthenaDatabase[]
}

/**
 * AthenaDataCatalog
 */

// TODO: fetch dataCatalog arn here (gotta get accountId first) and use to fetch tags
/**
 * new STS(config).getCallerIdentity((err, data) => {
    if (err) {
      return reject(err)
    }
    return resolve({ accountId: data.Account })
  })
 */
export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsAthenaDataCatalog[] }> => {
  const result: RawAwsAthenaDataCatalog[] = []
  const rawDatabases: RawAwsAthenaDatabase[] = []
  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    let athenaDataCatalogData: ATHENA.DataCatalogSummary[]
    try {
      athenaDataCatalogData = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: new ATHENA({ ...config, region, endpoint }),
          fnName: 'listDataCatalogs',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({
        functionName: 'athena:lsitDataCatalogs',
        err,
      })
    }
    if (!isEmpty(athenaDataCatalogData)) {
      for (const catalog of athenaDataCatalogData) {
        let athenaDatabaseData: ATHENA.Database[]
        try {
          athenaDatabaseData = await fetchAllPaginatedData({
            getResourcesFn: convertToPromise({
              sdkContext: new ATHENA({ ...config, region, endpoint }),
              fnName: 'listDatabases',
            }),
            accessor: '',
            initialParams: {
              CatalogName: catalog.CatalogName,
            },
          })
        } catch (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'athena:listDatabases',
            err,
          })
        }
        if (!isEmpty(athenaDatabaseData)) {
          for (const database of athenaDatabaseData) {
            let athenaTableMetadata: ATHENA.TableMetadata
            try {
              athenaTableMetadata = await fetchAllPaginatedData({
                getResourcesFn: convertToPromise({
                  sdkContext: new ATHENA({ ...config, region, endpoint }),
                  fnName: 'listTableMetadata',
                }),
                accessor: '',
                initialParams: {
                  CatalogName: catalog.CatalogName,
                  DatabaseName: database.Name,
                },
              })
            } catch (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'athena:listTableMetadata',
                err,
              })
            }
            rawDatabases.push({ ...database, metadata: athenaTableMetadata })
          }
          result.push({ ...catalog, databases: rawDatabases, region })
        } else {
          result.push({ ...catalog, region })
        }
      }
    }
  }
  return groupBy(result, 'region')
}
