import CloudGraph from '@cloudgraph/sdk'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'

import IAM, {
  ListServerCertificatesResponse,
  ServerCertificateMetadata,
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
const serviceName = 'IAM Global Information'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export const listServerCertificates = async (
  iam: IAM,
  marker?: string
): Promise<ServerCertificateMetadata[]> =>
  new Promise(resolve => {
    const result: ServerCertificateMetadata[] = []

    iam.listServerCertificates(
      {
        Marker: marker,
      },
      async (err: AWSError, data: ListServerCertificatesResponse) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'iam:listServerCertificates',
            err,
          })
        }
        if (!isEmpty(data)) {
          const {
            ServerCertificateMetadataList: serverCertificate = [],
            Marker,
            IsTruncated,
          } = data

          if (IsTruncated) {
            result.push(...(await listServerCertificates(iam, Marker)))
          }

          resolve(serverCertificate)
        }

        resolve([])
      }
    )
  })

/**
 *  IAM Server Certificate
 */

export default async ({
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: ServerCertificateMetadata[]
}> =>
  new Promise(async resolve => {
    const client = new IAM({
      ...config,
      region: globalRegionName,
      endpoint,
      ...customRetrySettings,
    })

    logger.debug(lt.lookingForIamServerCertificates)

    // Fetch IAM Server Certificates
    const serverCertificates = await listServerCertificates(client)

    errorLog.reset()
    logger.debug(lt.foundServerCertificates(serverCertificates.length))

    resolve({ [globalRegionName]: serverCertificates })
  })
