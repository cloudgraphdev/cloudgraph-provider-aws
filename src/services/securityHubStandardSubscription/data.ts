import CloudGraph from '@cloudgraph/sdk'
import SecurityHub, {
  DescribeStandardsRequest,
  DescribeStandardsResponse,
  Standard,
  Standards,
} from 'aws-sdk/clients/securityhub'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import awsLoggerText from '../../properties/logger'

const { logger } = CloudGraph
const lt = { ...awsLoggerText }
const serviceName = 'SecurityHub Standard Subscription'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsSecurityHubStandardSubscription extends Standard {
  region: string
}

const getStandardSubscriptionForRegion = async ({
  securityHub,
}: {
  securityHub: SecurityHub
}): Promise<Standards> =>
  new Promise<Standards>(resolve => {
    const standardList: Standards = []
    const listStandardOpts: DescribeStandardsRequest = {}
    const listAllStandards = (token?: string): void => {
      if (token) {
        listStandardOpts.NextToken = token
      }
      try {
        securityHub.describeStandards(
          listStandardOpts,
          (err: AWSError, data: DescribeStandardsResponse) => {
            const { NextToken: nextToken, Standards: standards = [] } =
              data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'securityHub:describeStandards',
                err,
              })
            }

            standardList.push(...standards)

            if (nextToken) {
              listAllStandards(nextToken)
            } else {
              resolve(standardList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllStandards()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsSecurityHubStandardSubscription[] }> =>
  new Promise(async resolve => {
    const standardData: RawAwsSecurityHubStandardSubscription[] = []
    const regionPromises = []

    regions.split(',').forEach(region => {
      const securityHub = new SecurityHub({ ...config, region, endpoint })

      const regionPromise = new Promise<void>(async resolveRegion => {
        const standards = await getStandardSubscriptionForRegion({
          securityHub,
        })
        if (!isEmpty(standards)) {
          standardData.push(
            ...standards.map(standard => ({
              ...standard,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(
      lt.fetchedSecurityHubStandardSubscriptions(standardData.length)
    )
    errorLog.reset()

    resolve(groupBy(standardData, 'region'))
  })
