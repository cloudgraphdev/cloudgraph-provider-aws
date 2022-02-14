import { Config } from 'aws-sdk/lib/config'
import MWAA from 'aws-sdk/clients/mwaa'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import ErrorLog from '../../utils/errorLog'

const serviceName = 'managedAirflow'
const errorLog = new ErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsManagedAirflow extends MWAA.Environment {
  region: string
}

/**
 * ManagedAirflow
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsManagedAirflow[]}> => {
  const result: RawAwsManagedAirflow[] = []

  const activeRegions = regions.split(',')
  for (const region of activeRegions) {
    const client = new MWAA({ ...config, region, endpoint })
    let envNames: string[]
    try {
      envNames = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: client,
          fnName: 'listEnvironments',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({ functionName: 'listEnvironments', err })
    }
    if (!isEmpty(envNames)) {
        envNames.forEach(async name => {
          try {
            const env = await client.getEnvironment({ Name: name }).promise()
            result.push({ ...env.Environment, region })
          } catch (err) {
            errorLog.generateAwsErrorLog({ functionName: 'getEnvironments', err })
          }
        })
    }
  }
  errorLog.reset()
  return groupBy(result, 'region')
}
