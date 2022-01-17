import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import AWS, {
  Organization,
  DescribeOrganizationResponse,
} from 'aws-sdk/clients/organizations'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import { regionMap } from '../../enums/regions'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Organization'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const DEFAULT_REGION = regionMap.usEast1

const getOrganizationData = async ({
  aws,
}: {
  aws: AWS
}): Promise<Organization> =>
  new Promise<Organization>(resolve => {
    let organizationData

    aws.describeOrganization(
      (err: AWSError, data: DescribeOrganizationResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'aws:describeOrganization',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { Organization: organization } = data

          logger.debug(lt.orgFound)

          organizationData = {
            ...organization,
          }
        }

        resolve(organizationData)
      }
    )
  })

/**
 * Organization
 */

export default async ({
  config,
}: {
  config: Config
}): Promise<{
  [region: string]: Organization[]
}> =>
  new Promise(async resolve => {
    const organizationResult: (Organization & { region: string })[] = []

    const aws = new AWS({ ...config, region: DEFAULT_REGION, endpoint })

    // Get Organization Data
    const organization = await getOrganizationData({ aws })

    if (!isEmpty(organization)) {
      organizationResult.push({
        ...organization,
        region: DEFAULT_REGION,
      })
    }
    errorLog.reset()

    resolve(groupBy(organizationResult, 'region'))
  })
