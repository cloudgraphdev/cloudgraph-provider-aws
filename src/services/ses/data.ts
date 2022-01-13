import SES, {
  ListIdentitiesResponse,
  IdentityVerificationAttributes,
  GetIdentityVerificationAttributesResponse,
} from 'aws-sdk/clients/ses'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'

import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'SES'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

/**
 * SES
 */
export interface RawAwsSes extends IdentityVerificationAttributes {
  Identity: string
  region: string
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsSes[] }> =>
  new Promise(async resolve => {
    const sesData: RawAwsSes[] = []
    const regionPromises = []
    const identityVerificationPromises = []

    regions.split(',').map(region => {
      const regionPromise = new Promise<void>(resolveRegion => {
        const ses = new SES({ ...config, region, endpoint })

        ses.listIdentities(
          {},
          (err: AWSError, data: ListIdentitiesResponse) => {
            /**
             * No Data for the region
             */
            if (isEmpty(data)) {
              return resolveRegion()
            }

            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ses:listIdentities',
                err,
              })
            }

            const { Identities }: { Identities: string[] } = data

            /**
             * No Identities Found
             */

            if (isEmpty(Identities)) {
              return resolveRegion()
            }

            logger.debug(lt.fetchedSesIdentities(Identities.length))

            const identityVerificationPromise = new Promise<void>(
              resolveIdVer => {
                ses.getIdentityVerificationAttributes(
                  { Identities },
                  (
                    err: AWSError,
                    {
                      VerificationAttributes: identities,
                    }: GetIdentityVerificationAttributesResponse
                  ) => {
                    if (err) {
                      errorLog.generateAwsErrorLog({
                        functionName: 'ses:getIdentityVerificationAttributes',
                        err,
                      })
                    }

                    if (!isEmpty(identities)) {
                      sesData.push(
                        ...Identities.map(Identity => ({
                          Identity,
                          ...identities[Identity],
                          region,
                        }))
                      )
                    }

                    resolveIdVer()
                    resolveRegion()
                  }
                )
              }
            )
            identityVerificationPromises.push(identityVerificationPromise)
          }
        )
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    await Promise.all(identityVerificationPromises)
    errorLog.reset()

    resolve(groupBy(sesData, 'region'))
  })
