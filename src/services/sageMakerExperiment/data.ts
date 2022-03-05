import { Config } from 'aws-sdk/lib/config'
import SAGEMAKER from 'aws-sdk/clients/sagemaker'
import groupBy from 'lodash/groupBy'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import ErrorLog from '../../utils/errorLog'
import { isEmpty } from 'lodash'

const serviceName = 'sageMakerExperiment'
const errorLog = new ErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsSageMakerExperiment extends SAGEMAKER.ExperimentSummary {
  region: string
}

/**
 * SageMakerExperiment
 */

// TODO: Create connections using sourceArn and sourceType to other services (other sage maker services it seems)
export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsSageMakerExperiment[] }> => {
  const result: RawAwsSageMakerExperiment[] = []

  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    let sageMakerExperimentData: SAGEMAKER.ExperimentSummary[] = []
    try {
      sageMakerExperimentData = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: new SAGEMAKER({ ...config, region, endpoint }),
          fnName: 'listExperiments',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({
        functionName: 'listExperiments',
        err,
      })
    }

    if (!isEmpty(sageMakerExperimentData))
      result.push(...sageMakerExperimentData.map(val => ({ ...val, region })))
  }

  return groupBy(result, 'region')
}
