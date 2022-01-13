import CloudGraph from '@cloudgraph/sdk'
import { AWSError } from 'aws-sdk'
import ElasticBeanstalk, {
  ConfigurationSettingsDescription,
  ConfigurationSettingsDescriptions,
  DescribeEnvironmentsMessage,
  EnvironmentDescription,
  EnvironmentDescriptionsMessage,
  EnvironmentResourceDescription,
  EnvironmentResourceDescriptionsMessage,
} from 'aws-sdk/clients/elasticbeanstalk'
import isEmpty from 'lodash/isEmpty'

import { Credentials, TagMap } from '../../types'
import { settleAllPromises } from '../../utils/index'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { getResourceTags } from '../elasticBeanstalkApplication/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ElasticBeanstalkEnv'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const MAX_ITEMS = 1000

export interface RawAwsElasticBeanstalkEnv extends EnvironmentDescription {
  resources?: EnvironmentResourceDescription
  settings?: ConfigurationSettingsDescription[]
  Tags?: TagMap
}

const listEnvironments = async (
  eb: ElasticBeanstalk
): Promise<EnvironmentDescription[]> =>
  new Promise(async resolve => {
    const environments: EnvironmentDescription[] = []

    const listAllEnvironmentsOpts: DescribeEnvironmentsMessage = {
      MaxRecords: MAX_ITEMS,
    }
    const listAllEnvironments = (token?: string): void => {
      if (token) {
        listAllEnvironmentsOpts.NextToken = token
      }
      try {
        eb.describeEnvironments(
          listAllEnvironmentsOpts,
          (err: AWSError, data: EnvironmentDescriptionsMessage) => {
            const { Environments = [], NextToken: nextToken } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'elasticBeanstalk:describeEnvironments',
                err,
              })
            }

            environments.push(...Environments)

            if (nextToken) {
              logger.debug(lt.foundAnotherThousand)
              listAllEnvironments(nextToken)
            } else {
              resolve(environments)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllEnvironments()
  })

const getConfigSettingsForEnv = async (
  eb: ElasticBeanstalk,
  ApplicationName: string,
  EnvironmentName: string
): Promise<ConfigurationSettingsDescription[]> =>
  new Promise(resolve => {
    eb.describeConfigurationSettings(
      {
        ApplicationName,
        EnvironmentName,
      },
      (err: AWSError, data: ConfigurationSettingsDescriptions) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elasticBeanstalk:describeConfigurationSettings',
            err,
          })
        }
        const { ConfigurationSettings: settings = [] } = data || {}
        resolve(settings)
      }
    )
  })

const getResourcesForEnv = async (
  eb: ElasticBeanstalk,
  EnvironmentName: string
): Promise<EnvironmentResourceDescription> =>
  new Promise(resolve => {
    eb.describeEnvironmentResources(
      {
        EnvironmentName,
      },
      (err: AWSError, data: EnvironmentResourceDescriptionsMessage) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elasticBeanstalk:describeEnvironmentResources',
            err,
          })
        }
        const { EnvironmentResources: resources = {} } = data || {}
        resolve(resources)
      }
    )
  })

const getEnvironments = async (
  eb: ElasticBeanstalk
): Promise<RawAwsElasticBeanstalkEnv[]> => {
  const envs = await listEnvironments(eb)
  if (!isEmpty(envs)) {
    // We wait for all env promises to settle
    return settleAllPromises(
      // We use the list of envs that we got before to fetch the rest of the needed data
      envs.map(async (env: EnvironmentDescription) => {
        const {
          ApplicationName: appName,
          EnvironmentName: envName,
          EnvironmentArn: envArn,
        } = env
        const promises: [
          Promise<EnvironmentResourceDescription>,
          Promise<ConfigurationSettingsDescription[]>,
          Promise<TagMap>
        ] = [
          getResourcesForEnv(eb, envName),
          getConfigSettingsForEnv(eb, appName, envName),
          getResourceTags(eb, envArn),
        ]
        // We wait for all data to be fetched and settled
        const [resources, settings, Tags] = await settleAllPromises(promises)
        return { ...env, resources, settings, Tags }
      })
    )
  }
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [property: string]: RawAwsElasticBeanstalkEnv[]
}> =>
  new Promise(async resolve => {
    let numberOfEnvs = 0
    const output: {
      [property: string]: RawAwsElasticBeanstalkEnv[]
    } = {}

    // First we get all applications for all regions
    await Promise.all(
      regions.split(',').map(region => {
        const eb = new ElasticBeanstalk({ region, credentials, endpoint })
        output[region] = []
        return new Promise<void>(async resolveRegion => {
          const envs = (await getEnvironments(eb)) || []
          output[region] = envs
          numberOfEnvs += envs.length
          resolveRegion()
        })
      })
    )
    errorLog.reset()
    logger.debug(lt.fetchedElasticBeanstalkEnvs(numberOfEnvs))
    resolve(output)
  })
