import { Config } from 'aws-sdk/lib/config'
import SAGEMAKER from 'aws-sdk/clients/sagemaker'
import { groupBy, isEmpty } from 'lodash'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import ErrorLog from '../../utils/errorLog'

const serviceName = 'sageMakerProject'
const errorLog = new ErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsSageMakerProject extends SAGEMAKER.ProjectSummary {
  region: string
}

/**
 * SageMakerProject
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsSageMakerProject[] }> => {
  const result: RawAwsSageMakerProject[] = []

  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    let sageMakerProjectData: SAGEMAKER.ProjectSummary[] = []
    try {
      sageMakerProjectData = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: new SAGEMAKER({ ...config, region, endpoint }),
          fnName: 'listProjects',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({
        functionName: 'sageMakerProject:listProjects',
        err,
      })
    }

    if (!isEmpty(sageMakerProjectData))
      result.push(...sageMakerProjectData.map(val => ({ ...val, region })))
  }
  errorLog.reset()
  return groupBy(result, 'region')
}
