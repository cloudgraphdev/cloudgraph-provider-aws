import CloudGraph from '@cloudgraph/sdk'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'

import IAM, {
  GetAccountPasswordPolicyResponse,
  PasswordPolicy,
} from 'aws-sdk/clients/iam'
import { Config } from 'aws-sdk/lib/config'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { globalRegionName } from '../../enums/regions'

import {
  IAM_CUSTOM_DELAY,
  MAX_FAILED_AWS_REQUEST_RETRIES,
} from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'IAM Password Policy'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export const getPasswordPolicy = async (
  iam: IAM
): Promise<PasswordPolicy | null> =>
  new Promise(resolve => {
    iam.getAccountPasswordPolicy(
      async (err: AWSError, data: GetAccountPasswordPolicyResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:getAccountPasswordPolicy',
            err,
          })
        }
        if (!isEmpty(data)) {
          const { PasswordPolicy: passwordPolicy } = data

          resolve(passwordPolicy)
        }

        resolve(null)
      }
    )
  })

/**
 * IAM Password Policy
 */

export default async ({
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: PasswordPolicy[]
}> =>
  new Promise(async resolve => {
    const client = new IAM({
      ...config,
      region: globalRegionName,
      endpoint,
      ...customRetrySettings,
    })

    logger.debug(lt.fetchingIamPasswordPolicy)

    // Fetch IAM Password Policy
    const passwordPolicy = await getPasswordPolicy(client)

    errorLog.reset()
    logger.debug(lt.doneFetchingIamPasswordPolicy)

    resolve({ [globalRegionName]: passwordPolicy ? [passwordPolicy] : [] })
  })
