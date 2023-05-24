import {
  DescribeConfigurationSettingsCommand,
  DescribeConfigurationSettingsMessage,
  DescribeEnvironmentResourcesCommand,
  DescribeEnvironmentResourcesMessage,
  DescribeEnvironmentsCommand,
  ElasticBeanstalkClient,
} from '@aws-sdk/client-elastic-beanstalk'
import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import {
  ConfigurationSettingsDescription,
  DescribeEnvironmentsMessage,
  EnvironmentDescription,
  EnvironmentResourceDescription,
} from 'aws-sdk/clients/elasticbeanstalk'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { TagMap } from '../../types'
import AwsErrorLog from '../../utils/errorLog'
import { settleAllPromises } from '../../utils/index'
import { getResourceTags } from '../elasticBeanstalkApplication/data'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ElasticBeanstalkEnv'
const errorLog = new AwsErrorLog(serviceName)
const MAX_ITEMS = 1000

export interface RawAwsElasticBeanstalkEnv extends EnvironmentDescription {
  resources?: EnvironmentResourceDescription
  settings?: ConfigurationSettingsDescription[]
  Tags?: TagMap
}

const listEnvironments = async (
  eb: ElasticBeanstalkClient
): Promise<EnvironmentDescription[]> =>
  new Promise(async resolve => {
    const environments: EnvironmentDescription[] = []

    const input: DescribeEnvironmentsMessage = {
      MaxRecords: MAX_ITEMS,
    }

    const listAllEnvironments = (token?: string): void => {
      if (token) {
        input.NextToken = token
      }
      const command = new DescribeEnvironmentsCommand(input)
      eb.send(command)
        .then(data => {
          if (isEmpty(data)) {
            return resolve([])
          }

          const { Environments = [], NextToken: nextToken } = data || {}

          environments.push(...Environments)

          if (nextToken) {
            logger.debug(lt.foundAnotherThousand)
            listAllEnvironments(nextToken)
          } else {
            resolve(environments)
          }
        })
        .catch(err => {
          errorLog.generateAwsErrorLog({
            functionName: 'elasticBeanstalk:describeEnvironments',
            err,
          })
          resolve([])
        })
    }
    listAllEnvironments()
  })

const getConfigSettingsForEnv = async (
  eb: ElasticBeanstalkClient,
  ApplicationName: string,
  EnvironmentName: string
): Promise<ConfigurationSettingsDescription[]> =>
  new Promise(resolve => {
    const input: DescribeConfigurationSettingsMessage = {
      ApplicationName,
      EnvironmentName,
    }
    const command = new DescribeConfigurationSettingsCommand(input)
    eb.send(command)
      .then(data => {
        if (isEmpty(data)) {
          return resolve([])
        }

        const { ConfigurationSettings: settings = [] } = data || {}
        resolve(settings)
      })
      .catch(err => {
        errorLog.generateAwsErrorLog({
          functionName: 'elasticBeanstalk:describeConfigurationSettings',
          err,
        })
        resolve([])
      })
  })

const getResourcesForEnv = async (
  eb: ElasticBeanstalkClient,
  EnvironmentName: string
): Promise<EnvironmentResourceDescription> =>
  new Promise(resolve => {
    const input: DescribeEnvironmentResourcesMessage = {
      EnvironmentName,
    }
    const command = new DescribeEnvironmentResourcesCommand(input)
    eb.send(command)
      .then(data => {
        if (isEmpty(data)) {
          return resolve({})
        }

        const { EnvironmentResources: resources = {} } = data || {}
        resolve(resources)
      })
      .catch(err => {
        errorLog.generateAwsErrorLog({
          functionName: 'elasticBeanstalk:describeEnvironmentResources',
          err,
        })
        resolve({})
      })
  })

const getEnvironments = async (
  eb: ElasticBeanstalkClient
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
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [property: string]: RawAwsElasticBeanstalkEnv[]
}> =>
  new Promise(async resolve => {
    const { credentials } = config
    let numberOfEnvs = 0
    const output: {
      [property: string]: RawAwsElasticBeanstalkEnv[]
    } = {}

    // First we get all applications for all regions
    await Promise.all(
      regions.split(',').map(region => {
        const eb = new ElasticBeanstalkClient({
          credentials,
          region,
        })
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
