import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'

import IAM, {
  GetAccountPasswordPolicyResponse,
  ListOpenIDConnectProvidersResponse,
  ListSAMLProvidersResponse,
  ListServerCertificatesResponse,
  OpenIDConnectProviderListEntry,
  PasswordPolicy,
  SAMLProviderListEntry,
  ServerCertificateMetadata,
} from 'aws-sdk/clients/iam'
import { Config } from 'aws-sdk/lib/config'

import awsLoggerText from '../../properties/logger'
import {
  initTestEndpoint,
  generateAwsErrorLog,
  setAwsRetryOptions,
} from '../../utils'
import { globalRegionName } from '../../enums/regions'

import {
  IAM_CUSTOM_DELAY,
  MAX_FAILED_AWS_REQUEST_RETRIES,
} from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'IAM Global Information'
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  maxRetries: MAX_FAILED_AWS_REQUEST_RETRIES,
  baseDelay: IAM_CUSTOM_DELAY,
})

export interface RawAwsIamGlobal {
  PasswordPolicy: PasswordPolicy
  ServerCertificates: ServerCertificateMetadata[]
  OpenIdConnectProviders: OpenIDConnectProviderListEntry[]
  SAMLProviders: SAMLProviderListEntry[]
  region: string
}

export const getPasswordPolicy = async (
  iam: IAM
): Promise<PasswordPolicy | null> =>
  new Promise(resolve => {
    iam.getAccountPasswordPolicy(
      async (err: AWSError, data: GetAccountPasswordPolicyResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:getAccountPasswordPolicy', err)
        }
        if (!isEmpty(data)) {
          const { PasswordPolicy: passwordPolicy } = data

          resolve(passwordPolicy)
        }

        resolve(null)
      }
    )
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
          generateAwsErrorLog(serviceName, 'iam:listServerCertificates', err)
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

export const listOpenIdConnectProviders = async (
  iam: IAM
): Promise<OpenIDConnectProviderListEntry[]> =>
  new Promise(resolve => {
    iam.listOpenIDConnectProviders(
      async (err: AWSError, data: ListOpenIDConnectProvidersResponse) => {
        if (err) {
          generateAwsErrorLog(
            serviceName,
            'iam:listOpenIDConnectProviders',
            err
          )
        }
        if (!isEmpty(data)) {
          const { OpenIDConnectProviderList: openIdProviders = [] } = data

          resolve(openIdProviders)
        }

        resolve([])
      }
    )
  })

export const listSAMLProviders = async (
  iam: IAM
): Promise<SAMLProviderListEntry[]> =>
  new Promise(resolve => {
    iam.listSAMLProviders(
      async (err: AWSError, data: ListSAMLProvidersResponse) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'iam:listSAMLProviders', err)
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
 * IAM Global Information
 */

export default async ({
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsIamGlobal[]
}> =>
  new Promise(async resolve => {
    const accountData: RawAwsIamGlobal[] = []

    const client = new IAM({
      ...config,
      region: globalRegionName,
      endpoint,
      ...customRetrySettings,
    })

    logger.debug(lt.fetchingIamData)

    // Fetch IAM Password Policy
    const passwordPolicy = await getPasswordPolicy(client)

    // Fetch IAM Server Certificates

    const serverCertificates = await listServerCertificates(client)

    // Fetch IAM Open Id Connect Providers
    const openIdConnectProviders = await listOpenIdConnectProviders(client)

    // Fetch IAM SAML Providers
    const SAMLProviders = await listSAMLProviders(client)

    logger.debug(lt.doneFetchingIamData)

    accountData.push({
      PasswordPolicy: passwordPolicy,
      ServerCertificates: serverCertificates,
      OpenIdConnectProviders: openIdConnectProviders,
      SAMLProviders,
      region: globalRegionName,
    })

    resolve(groupBy(accountData, 'region'))
  })
