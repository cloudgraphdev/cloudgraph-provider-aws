import { Config } from 'aws-sdk/lib/config'
import GLUE from 'aws-sdk/clients/glue'
import { groupBy, isEmpty } from 'lodash'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import ErrorLog from '../../utils/errorLog'

const serviceName = 'glueJob'
const errorLog = new ErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsGlueJob extends GLUE.Job {
  region: string
}

/**
 * GlueJob
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsGlueJob[] }> => {
  const result: RawAwsGlueJob[] = []

  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    let glueJobData: GLUE.Job[] = []
    try {
      glueJobData =
        (await fetchAllPaginatedData({
          getResourcesFn: convertToPromise({
            sdkContext: new GLUE({ ...config, region, endpoint }),
            fnName: 'getJobs',
          }),
          accessor: '',
        })) ?? []
    } catch (err) {
      errorLog.generateAwsErrorLog({
        functionName: 'glueJob:getJobs',
        err,
      })
    }

    if (!isEmpty(glueJobData))
      result.push(...glueJobData.map(val => ({ ...val, region })))
  }
  errorLog.reset()
  return groupBy(result, 'region')
}
