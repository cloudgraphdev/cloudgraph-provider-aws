import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import AWS, {
  Organization,
  DescribeOrganizationResponse,
} from 'aws-sdk/clients/organizations'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Organization'
const endpoint = initTestEndpoint(serviceName)

const getOrganizationData = async ({
  aws,
  region,
}: {
  aws: AWS
  region: string
}): Promise<Organization> =>
  new Promise<Organization>(resolve => {
    let organizationData

    aws.describeOrganization(
      (err: AWSError, data: DescribeOrganizationResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'aws:describeOrganization', err)
        }

        if (!isEmpty(data)) {
          const { Organization: organization } = data

          logger.debug(lt.orgFound)

          organizationData = {
            ...organization,
            region,
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
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: Organization[]
}> =>
  new Promise(async resolve => {
    const organizationResult: (Organization & { region: string })[] = []

    const regionPromises = regions.split(',').map(region => {
      const aws = new AWS({ ...config, region, endpoint })

      return new Promise<void>(async resolveOrganizationData => {
        // Get Organization Data
        const organization = await getOrganizationData({ aws, region })

        if (!isEmpty(organization)) {
          organizationResult.push({
            ...organization,
            region,
          })
        }

        resolveOrganizationData()
      })
    })

    await Promise.all(regionPromises)

    resolve(groupBy(organizationResult, 'region'))
  })
