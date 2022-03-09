import { Config } from 'aws-sdk/lib/config'
import GLUE from 'aws-sdk/clients/glue'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import ErrorLog from '../../utils/errorLog'

const serviceName = 'glueRegistry'
const errorLog = new ErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsGlueRegistry extends GLUE.RegistryListItem {
  region: string
  schemas?: GLUE.SchemaListItem[]
}

/**
 * GlueRegistry
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsGlueRegistry[] }> => {
  const result: RawAwsGlueRegistry[] = []

  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    let glueRegistryData: GLUE.RegistryListItem[] = []
    try {
      glueRegistryData = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: new GLUE({ ...config, region, endpoint }),
          fnName: 'listRegistries',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({
        functionName: 'glueRegisty:listRegistries',
        err,
      })
    }
    if (!isEmpty(glueRegistryData))
      for (const registry of glueRegistryData) {
        let glueSchemaData: GLUE.SchemaListItem[]
        try {
          glueSchemaData = await fetchAllPaginatedData({
            getResourcesFn: convertToPromise({
              sdkContext: new GLUE({ ...config, region, endpoint }),
              fnName: 'listSchemas',
            }),
            initialParams: {
              RegistryId: {
                RegistryArn: registry.RegistryArn,
              },
            },
            accessor: '',
          })
        } catch (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'glueRegisty:listSchemas',
            err,
          })
        }
        result.push({ ...registry, schemas: glueSchemaData, region })
      }
    else {
      result.push(...glueRegistryData.map(val => ({ ...val, region })))
    }
  }
  errorLog.reset()
  return groupBy(result, 'region')
}
