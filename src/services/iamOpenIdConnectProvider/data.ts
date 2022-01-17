import CloudGraph from '@cloudgraph/sdk'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'

import IAM, {
  ListOpenIDConnectProvidersResponse,
  OpenIDConnectProviderListEntry,
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
const serviceName = 'IAM OpenId Connect Provider'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export const listOpenIdConnectProviders = async (
  iam: IAM
): Promise<OpenIDConnectProviderListEntry[]> =>
  new Promise(resolve => {
    iam.listOpenIDConnectProviders(
      async (err: AWSError, data: ListOpenIDConnectProvidersResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listOpenIDConnectProviders',
            err,
          })
        }
        if (!isEmpty(data)) {
          const { OpenIDConnectProviderList: openIdProviders = [] } = data

          resolve(openIdProviders)
        }

        resolve([])
      }
    )
  })

/**
 * IAM OpenId Connect Provider
 */

export default async ({
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: OpenIDConnectProviderListEntry[]
}> =>
  new Promise(async resolve => {
    const client = new IAM({
      ...config,
      region: globalRegionName,
      endpoint,
      ...customRetrySettings,
    })

    logger.debug(lt.lookingForIamOpenIdProviders)

    // Fetch IAM Open Id Connect Providers
    const openIdConnectProviders = await listOpenIdConnectProviders(client)

    errorLog.reset()
    logger.debug(lt.foundOpenIdProviders(openIdConnectProviders.length))

    resolve({ [globalRegionName]: openIdConnectProviders })
  })
