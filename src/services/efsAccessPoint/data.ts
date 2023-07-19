import { Config } from 'aws-sdk'
import EFS, {
  DescribeAccessPointsResponse,
  DescribeAccessPointsRequest,
  AccessPointDescription,
} from 'aws-sdk/clients/efs'
import { AWSError } from 'aws-sdk/lib/error'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'EFS Access Point'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsEfsAccessPoint extends AccessPointDescription {
  region: string
}

const listAccessPoint = async ({
  efs,
}: {
  efs: EFS
}): Promise<AccessPointDescription[]> =>
  new Promise<AccessPointDescription[]>(resolve => {
    const accessPointList: AccessPointDescription[] = []
    const args: DescribeAccessPointsRequest = {}
    const listAllAccessPoints = (token?: string): void => {
      if (token) {
        args.NextToken = token
      }

      try {
        efs.describeAccessPoints(
          args,
          (err: AWSError, data: DescribeAccessPointsResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'efs:describeAccessPoints',
                err,
              })
            }

            /**
             * No EFS access point data for this region
             */
            if (isEmpty(data)) {
              return resolve([])
            }

            const { AccessPoints: accessPoints = [], NextToken: nextToken } =
              data

            accessPointList.push(...accessPoints)

            /**
             * Check to see if there are more
             */

            if (nextToken) {
              listAllAccessPoints(nextToken)
            } else {
              resolve(accessPointList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllAccessPoints()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsEfsAccessPoint[]
}> =>
  new Promise(async resolve => {
    const efsAccessPoints: RawAwsEfsAccessPoint[] = []
    const regionPromises = []

    /**
     * Get all the EFS Access points
     */

    regions.split(',').forEach(region => {
      const efs = new EFS({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const accessPointList = await listAccessPoint({ efs })
        if (!isEmpty(accessPointList)) {
          efsAccessPoints.push(
            ...accessPointList.map(accessPoint => ({
              ...accessPoint,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedEfsAccessPoints(efsAccessPoints.length))
    errorLog.reset()

    resolve(groupBy(efsAccessPoints, 'region'))
  })
