import { Config } from 'aws-sdk/lib/config'
import SAGEMAKER from 'aws-sdk/clients/sagemaker'
import { groupBy, isEmpty } from 'lodash'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const serviceName = 'sageMakerNotebookInstance'
const endpoint = initTestEndpoint(serviceName)
const errorLog = new AwsErrorLog(serviceName)
export interface RawAwsSageMakerNotebookInstance
  extends SAGEMAKER.DescribeNotebookInstanceOutput {
  region: string
}

/**
 * SageMakerNotebookInstance
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{[region: string]: RawAwsSageMakerNotebookInstance[]}> => {
  const result: RawAwsSageMakerNotebookInstance[] = []

  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    const client = new SAGEMAKER({ ...config, region, endpoint })
    let sageMakerNotebookInstanceData: SAGEMAKER.NotebookInstanceSummary[]
    try {
      sageMakerNotebookInstanceData = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: client,
          fnName: 'listNotebookInstances',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({ functionName: 'listNotebookInstances', err })
    }
    if (!isEmpty(sageMakerNotebookInstanceData)) {
      for (const notebook of sageMakerNotebookInstanceData) {
        try {
          const notebookData = await client.describeNotebookInstance({ NotebookInstanceName: notebook.NotebookInstanceName}).promise()
          result.push({ ...notebookData, region })
        } catch (err) {
          errorLog.generateAwsErrorLog({ functionName: 'describeNotebookInstance', err })
        }
      }
    }
  }

  errorLog.reset()
  return groupBy(result, 'region')
}
