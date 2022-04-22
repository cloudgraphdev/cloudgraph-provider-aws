import SM, {
  SecretListEntry,
  DescribeSecretResponse,
  ReplicationStatusType,
} from 'aws-sdk/clients/secretsmanager'
import { AWSError } from 'aws-sdk/lib/error'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'SecretsManager'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

/**
 * Secrets Manager
 */
export interface RawAwsSecretsManager extends Omit<SecretListEntry, 'Tags'> {
  region: string
  Tags: TagMap
  ReplicationStatus?: ReplicationStatusType[]
}

const getSecretDetails = async (
  sm: SM,
  secretId: string
): Promise<DescribeSecretResponse> =>
  new Promise(resolve => {
    sm.describeSecret(
      {
        SecretId: secretId,
      },
      (err: AWSError, data: DescribeSecretResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'sm:describeSecret',
            err,
          })
        }
        if (!isEmpty(data)) {
          resolve(data)
        }
        resolve({})
      }
    )
  })

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
    const secretsDetailsPromises = []

    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(resolveSecretsManagerData => {
        new SM({ ...config, region, endpoint }).listSecrets(
          {},
          (err: AWSError, data) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'sm:listSecrets',
                err,
              })
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
              ...secrets.map(({ Tags, ...secret }) => ({
                ...secret,
                region,
                Tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
              }))
            )

            resolveSecretsManagerData()
          }
        )
      })
      regionPromises.push(regionPromise)
    })
    await Promise.all(regionPromises)

    smData.map(({ ARN: arn, region }, idx) => {
      const sm = new SM({ ...config, region, endpoint })
      const secretDetailsPromise = new Promise<void>(
        async resolveSecretDetails => {
          const secretDetails: DescribeSecretResponse = await getSecretDetails(
            sm,
            arn
          )
          smData[idx].ReplicationStatus = secretDetails?.ReplicationStatus || []
          resolveSecretDetails()
        }
      )
      secretsDetailsPromises.push(secretDetailsPromise)
    })
    await Promise.all(secretsDetailsPromises)

    errorLog.reset()

    resolve(groupBy(smData, 'region'))
  })
