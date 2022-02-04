import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeConfigurationRecordersResponse,
  ConfigurationRecorder,
  DescribeConfigurationRecorderStatusResponse,
  ConfigurationRecorderStatus,
} from 'aws-sdk/clients/configservice'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Configuration Recorder'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listConfigurationRecorderData = async ({
  ec2,
  region,
}: {
  ec2: EC2
  region: string
}): Promise<(ConfigurationRecorder & { region: string })[]> =>
  new Promise<(ConfigurationRecorder & { region: string })[]>(resolve => {
    let configurationRecordersData: (ConfigurationRecorder & {
      region: string
    })[] = []

    ec2.describeConfigurationRecorders(
      {},
      (err: AWSError, data: DescribeConfigurationRecordersResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'ec2:describeConfigurationRecorders',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { ConfigurationRecorders: configurationRecorders = [] } = data

          logger.debug(
            lt.fetchedConfigurationRecorders(configurationRecorders.length)
          )

          configurationRecordersData = configurationRecorders.map(config => ({
            ...config,
            region,
          }))
        }

        resolve(configurationRecordersData)
      }
    )
  })

const getConfigurationRecorderStatus = async (
  ec2: EC2,
  configNames: string[]
): Promise<ConfigurationRecorderStatus[]> =>
  new Promise(resolve => {
    ec2.describeConfigurationRecorderStatus(
      {
        ConfigurationRecorderNames: configNames,
      },
      (err: AWSError, data: DescribeConfigurationRecorderStatusResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'ec2:describeConfigurationRecorderStatus',
            err,
          })
        }
        if (!isEmpty(data)) {
          const {
            ConfigurationRecordersStatus: configurationRecordersStatus = [],
          } = data
          logger.debug(
            lt.fetchedConfigurationRecorders(
              configurationRecordersStatus.length
            )
          )
          resolve(configurationRecordersStatus)
        }
        resolve([])
      }
    )
  })

/**
 * Configuration Recorder
 */

export interface RawAwsConfigurationRecorder extends ConfigurationRecorder {
  region: string
  Status?: ConfigurationRecorderStatus
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsConfigurationRecorder[]
}> =>
  new Promise(async resolve => {
    let configurationRecordersResult: RawAwsConfigurationRecorder[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveConfigurationRecorderData => {
        // Get Configuration Recorder Data
        const configurationRecorders = await listConfigurationRecorderData({
          ec2,
          region,
        })

        if (!isEmpty(configurationRecorders)) {
          for (const configurationRecorder of configurationRecorders) {
            configurationRecordersResult.push({
              ...configurationRecorder,
              region,
            })
          }

          const configNames: string[] = configurationRecorders.map(
            configRecorder => configRecorder.name
          )

          if (!isEmpty(configNames)) {
            // Get Configuration Recorder Status
            const configStatus = await getConfigurationRecorderStatus(
              ec2,
              configNames
            )

            // If exists configuration recorder status, populate configuration recorders
            if (!isEmpty(configStatus)) {
              configurationRecordersResult = configurationRecordersResult.map(
                configRecorder => {
                  const configRecorderStatus = configStatus.find(
                    (
                      status: ConfigurationRecorder & {
                        name: string
                      }
                    ) => status.name === configRecorder.name
                  )

                  return {
                    ...configRecorder,
                    Status: configRecorderStatus,
                  }
                }
              )
            }
          }
        }

        resolveConfigurationRecorderData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(configurationRecordersResult, 'region'))
  })
