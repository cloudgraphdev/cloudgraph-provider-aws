import CloudGraph from '@cloudgraph/sdk'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'

import IAM, {
  ListSAMLProvidersResponse,
  SAMLProviderListEntry,
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
const serviceName = 'IAM SAML Provider'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export const listSAMLProviders = async (
  iam: IAM
): Promise<SAMLProviderListEntry[]> =>
  new Promise(resolve => {
    iam.listSAMLProviders(
      async (err: AWSError, data: ListSAMLProvidersResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listSAMLProviders',
            err,
          })
        }
        if (!isEmpty(data)) {
          const { SAMLProviderList = [] } = data

          resolve(SAMLProviderList)
        }

        resolve([])
      }
    )
  })

/**
 * IAM SAML Provider
 */

export default async ({
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: SAMLProviderListEntry[]
}> =>
  new Promise(async resolve => {
    const client = new IAM({
      ...config,
      region: globalRegionName,
      endpoint,
      ...customRetrySettings,
    })

    logger.debug(lt.lookingForIamSamlProviders)

    // Fetch IAM SAML Providers
    const SAMLProviders = await listSAMLProviders(client)

    errorLog.reset()
    logger.debug(lt.foundSamlProviders(SAMLProviders.length))

    resolve({ [globalRegionName]: SAMLProviders })
  })
