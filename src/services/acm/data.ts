import CloudGraph from '@cloudgraph/sdk'
import ACM, { CertificateSummary, ListCertificatesRequest, ListCertificatesResponse, ListTagsForCertificateRequest, ListTagsForCertificateResponse, Tag } from 'aws-sdk/clients/acm'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'
import { TagMap } from '../../types'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_CERTIFICATES = 500
const serviceName = 'ACM'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export const getCertificatesForRegion = async (
  acm: ACM
): Promise<CertificateSummary[]> =>
  new Promise(async resolve => {
    const certificateSummaryList: CertificateSummary[] = []
    const listCertificatesOpts: ListCertificatesRequest = {}
    const listAllCertificates = (token?: string): void => {
      listCertificatesOpts.MaxItems = MAX_CERTIFICATES
      if (token) {
        listCertificatesOpts.NextToken = token
      }
      try {
        acm.listCertificates(
          listCertificatesOpts,
          (err: AWSError, data: ListCertificatesResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'acm:listCertificates',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { NextToken: nextToken, CertificateSummaryList: items = [] } = data || {}

            if (isEmpty(items)) {
              return resolve([])
            }

            logger.debug(lt.fetchedAcmCertificates(items.length))

            certificateSummaryList.push(...items)

            if (nextToken) {
              listAllCertificates(nextToken)
            } else {
              resolve(certificateSummaryList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllCertificates()
  })

const getTagsForCertificate = (
  acm: ACM,
  certificateArn: string
): Promise<{ certificateArn: string; tags: Tag[] }> =>
  new Promise<{ certificateArn: string; tags: Tag[] }>(resolve => {
    const args: ListTagsForCertificateRequest = { CertificateArn: certificateArn }
    const listTags = (): void => {
      try {
        acm.listTagsForCertificate(
          args,
          (err: AWSError, data: ListTagsForCertificateResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'acm:listTagsForCertificate',
                err,
              })
            }
            if (isEmpty(data)) {
              return resolve({
                certificateArn,
                tags: [],
              })
            }
            const { Tags: tags = [] } = data || {}

            resolve({ certificateArn, tags })
          }
        );
  
      } catch (error) {
        resolve({
          certificateArn,
          tags: [],
        })
      }
    }
    listTags();
  })

export interface RawAwsAcm extends CertificateSummary {
  region: string
  Tags: TagMap
  account
}

export default async ({
  regions,
  config,
  account,
}: {
  account: string
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsAcm[]
}> =>
  new Promise(async resolve => {
    const acmResult: RawAwsAcm[] = []

    const regionPromises = regions.split(',').map(region => {
      const acm = new ACM({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })

      return new Promise<void>(async resolveAcmData => {
        // Get ACM certificate summaries
        const certificates = await getCertificatesForRegion(acm)

        const tagsPromises = certificates.map(
          ({ CertificateArn: certificateArn }) => getTagsForCertificate(acm, certificateArn)
        )

        const tagsData = await Promise.all(tagsPromises)

        if (!isEmpty(certificates)) {
          for (const certificate of certificates) {
            acmResult.push({
              ...certificate,
              Tags: tagsData?.find(t => t.certificateArn === certificate.CertificateArn)
                ?.tags.reduce((tagMap, {Key, Value}) => {
                  tagMap[Key] = Value;
                  return tagMap;
                }, {}),
              region,
              account,
            })
          }
        }

        resolveAcmData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(acmResult, 'region'))
  })
