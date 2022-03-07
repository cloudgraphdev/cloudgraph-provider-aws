import { Config } from 'aws-sdk/lib/config'
import SSM from 'aws-sdk/clients/ssm'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const serviceName = 'systemsManagerInstance'
const endpoint = initTestEndpoint(serviceName)
const errorLog = new AwsErrorLog(serviceName)

export interface RawAwsSystemsManagerInstance
  extends SSM.InstanceInformation {
  region: string
  complianceItems: SSM.ComplianceItem[]
}

/**
 * SystemsManagerInstance
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{[region: string]: RawAwsSystemsManagerInstance[]}> => {
  const result: RawAwsSystemsManagerInstance[] = []

  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    const client = new SSM({ ...config, region, endpoint })
    let systemsManagerInstanceData: SSM.InstanceInformation[]
    try {
      systemsManagerInstanceData = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: client,
          fnName: 'describeInstanceInformation',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({ functionName: 'describeInstanceInformation', err })
    }
    if (!isEmpty(systemsManagerInstanceData)) {
      for (const instance of systemsManagerInstanceData) {
        let systemsManagerComplianceInfo: SSM.ComplianceItem[]
        try {
          systemsManagerComplianceInfo = await fetchAllPaginatedData({
            getResourcesFn: convertToPromise({
              sdkContext: client,
              fnName: 'listComplianceItems',
            }),
            initialParams: {
              ResourceIds: [instance.InstanceId]
            },
            accessor: '',
          })
        } catch (err) {
          errorLog.generateAwsErrorLog({ functionName: 'listComplianceItems', err })
        }
        result.push({ ...instance, complianceItems: systemsManagerComplianceInfo, region })
      }
    }
  }

  errorLog.reset()
  return groupBy(result, 'region')
}
