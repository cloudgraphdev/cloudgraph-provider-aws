import { Config } from 'aws-sdk/lib/config'
import { PromiseResult } from 'aws-sdk/lib/request'
import { AWSError } from 'aws-sdk/lib/error'
import MWAA, { GetEnvironmentOutput } from 'aws-sdk/clients/mwaa'
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
}): Promise<{ [region: string]: RawAwsManagedAirflow[] }> => {
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
      const promises: Promise<PromiseResult<GetEnvironmentOutput, AWSError>>[] =
        []
      envNames.forEach(async name => {
        try {
          promises.push(client.getEnvironment({ Name: name }).promise())
        } catch (err) {
          errorLog.generateAwsErrorLog({ functionName: 'getEnvironments', err })
        }
      })
      await Promise.all(promises)
        .then(envs =>
          envs.forEach(val => result.push({ ...val.Environment, region }))
        )
        .catch(err =>
          errorLog.generateAwsErrorLog({
            functionName: 'getEnvironments',
            err,
          })
        )
    }
  }
  errorLog.reset()
  return groupBy(result, 'region')
}
