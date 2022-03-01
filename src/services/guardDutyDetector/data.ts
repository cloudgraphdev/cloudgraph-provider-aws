import { Config } from 'aws-sdk/lib/config'
import GUARDDUTY from 'aws-sdk/clients/guardduty'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import ErrorLog from '../../utils/errorLog'

const serviceName = 'guardDuty'
const errorLog = new ErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsGuardDutyDetector extends GUARDDUTY.GetDetectorResponse {
  id: string
  region: string
  members: GUARDDUTY.Members
}

/**
 * GuardDutyDetector
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsGuardDutyDetector[] }> => {
  const result: RawAwsGuardDutyDetector[] = []

  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    let guardDutyDetectorList: GUARDDUTY.DetectorId[]
    const client = new GUARDDUTY({ ...config, region, endpoint })
    try {
      guardDutyDetectorList = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: client,
          fnName: 'listDetectors',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({ functionName: 'listDetectors', err })
    }

    if (!isEmpty(guardDutyDetectorList)) {
      for (const detector of guardDutyDetectorList) {
        let detectorData: GUARDDUTY.GetDetectorResponse
        let members: GUARDDUTY.Members
        try {
          detectorData = await client
            .getDetector({ DetectorId: detector })
            .promise()
          members = await fetchAllPaginatedData({
            getResourcesFn: convertToPromise({
              sdkContext: client,
              fnName: 'listMembers',
            }),
            accessor: '',
            initialParams: {
              DetectorId: detector,
            },
          })
        } catch (err) {
          errorLog.generateAwsErrorLog({ functionName: 'getDetector', err })
        }
        result.push({
          id: detector,
          ...detectorData,
          members,
          region,
        })
      }
    }
  }

  errorLog.reset()
  return groupBy(result, 'region')
}
