import SM, {
  SecretListEntry
} from 'aws-sdk/clients/secretsmanager'
import { AWSError } from 'aws-sdk/lib/error'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'SecretsManager'
const endpoint = initTestEndpoint(serviceName)

/**
 * Secrets Manager
 */
export interface RawAwsSecretsManager extends Omit<SecretListEntry, 'Tags'> {
  region: string
  Tags: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsSecretsManager[] }> =>
  new Promise(async resolve => {
    const smData: RawAwsSecretsManager[] = []
    const regionPromises = []

    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(resolveSecretsManagerData => {
        new SM({ ...config, region, endpoint }).listSecrets({}, (err: AWSError, data) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'sm:listSecrets', err)
          }

          if (isEmpty(data)) {
            return resolveSecretsManagerData()
          }

          const { SecretList: secrets = [] } = data

          if (isEmpty(secrets)) {
            return resolveSecretsManagerData()
          }

          logger.debug(lt.fetchedSecretsManager(secrets.length))

          smData.push(
            ...secrets.map(({Tags, ...secret}) => ({
              ...secret,
              region,
              Tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
            }))
          )

          resolveSecretsManagerData()
        })
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    resolve(groupBy(smData, 'region'))
  })