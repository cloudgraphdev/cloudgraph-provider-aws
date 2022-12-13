import CloudGraph from '@cloudgraph/sdk'
import SecurityHub, { DescribeHubResponse } from 'aws-sdk/clients/securityhub'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import awsLoggerText from '../../properties/logger'

const { logger } = CloudGraph
const lt = { ...awsLoggerText }
const serviceName = 'SecurityHub'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsSecurityHub {
  HubArn: string;
  SubscribedAt: string;
  AutoEnableControls?: boolean;
  region: string;
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsSecurityHub[] }> =>
  new Promise(async resolve => {
    const hubData: RawAwsSecurityHub[] = []

    const regionPromises = regions.split(',').map(region => {
      const securityHub = new SecurityHub({ ...config, region, endpoint })
      return new Promise<void>(resolveRegion =>
        securityHub.describeHub(
          {},
          (err: AWSError, data: DescribeHubResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'securityHub:describeHub',
                err,
              })
            }

            if (isEmpty(data) || !data) {
              logger.debug(lt.securityHubNotFound(region))
              return resolveRegion()
            }

            logger.debug(lt.fetchedSecurityHub(region))
            hubData.push({
              HubArn: data.HubArn,
              SubscribedAt: data.SubscribedAt,
              AutoEnableControls: data.AutoEnableControls,
              region,
            })
            resolveRegion()
          }
        )
      )
    })

    logger.debug(lt.fetchingSecurityHub)
    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(hubData, 'region'))
  })
