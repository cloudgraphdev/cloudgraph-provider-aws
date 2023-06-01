import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DeliveryChannel,
  DeliveryChannelList,
  DescribeDeliveryChannelsResponse,
} from 'aws-sdk/clients/configservice'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import awsLoggerText from '../../properties/logger'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Configuration Delivery Channel'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsConfigurationDeliveryChannel extends DeliveryChannel {
  region: string
}

const listConfigurationDeliveryChannelData = async ({
  ec2,
}: {
  ec2: EC2
}): Promise<DeliveryChannelList> =>
  new Promise<DeliveryChannelList>(resolve => {
    try {
      ec2.describeDeliveryChannels(
        {},
        (err: AWSError, data: DescribeDeliveryChannelsResponse) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ec2:describeDeliveryChannels',
              err,
            })
          }

          if (isEmpty(data)) {
            return resolve([])
          }

          const { DeliveryChannels: channels = [] } = data || {}

          resolve(channels)
        }
      )
    } catch (error) {
      resolve([])
    }
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsConfigurationDeliveryChannel[]
}> =>
  new Promise(async resolve => {
    const configurationDeliveryChannelsResult: RawAwsConfigurationDeliveryChannel[] =
      []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(
        async resolveConfigurationDeliveryChannelData => {
          // Get Configuration Delivery Channel Data
          const configurationDeliveryChannels =
            await listConfigurationDeliveryChannelData({
              ec2,
            })

          if (!isEmpty(configurationDeliveryChannels)) {
            for (const configurationDeliveryChannel of configurationDeliveryChannels) {
              configurationDeliveryChannelsResult.push({
                ...configurationDeliveryChannel,
                region,
              })
            }
          }

          resolveConfigurationDeliveryChannelData()
        }
      )
    })

    await Promise.all(regionPromises)
    logger.debug(
      lt.fetchedCOnfigurationDeliveryChannels(
        configurationDeliveryChannelsResult.length
      )
    )
    errorLog.reset()

    resolve(groupBy(configurationDeliveryChannelsResult, 'region'))
  })
