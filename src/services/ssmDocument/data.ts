import CloudGraph from '@cloudgraph/sdk'
import SSM, { DocumentIdentifier, ListDocumentsRequest, ListDocumentsResult } from 'aws-sdk/clients/ssm'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_ACTIVATIONS = 50
const serviceName = 'ssmDocuments'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

/**
 * SSM Documents
 */

export const getDocumentsForRegion = async (
  ssm: SSM
): Promise<DocumentIdentifier[]> =>
  new Promise(async resolve => {
    const documentList: DocumentIdentifier[] = []

    const listCertificatesOpts: ListDocumentsRequest = {}
    const listAllDocuments = (token?: string): void => {
      listCertificatesOpts.MaxResults = MAX_ACTIVATIONS
      if (token) {
        listCertificatesOpts.NextToken = token
      }
      try {
        ssm.listDocuments(
          listCertificatesOpts,
          (err: AWSError, data: ListDocumentsResult) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ssm:listDocuments',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { NextToken: nextToken, DocumentIdentifiers: items = [] } = data || {}

            if (isEmpty(items)) {
              return resolve([])
            }

            logger.debug(lt.fetchedSsmDocuments(items.length))

            documentList.push(...items)

            if (nextToken) {
              listAllDocuments(nextToken)
            } else {
              resolve(documentList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllDocuments()
  })

export interface RawAwsSsmDocument extends Omit<DocumentIdentifier, 'Tags'> {
  region: string
  account
  Tags: TagMap
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
  [region: string]: RawAwsSsmDocument[]
}> =>
  new Promise(async resolve => {
    const documentsResult: RawAwsSsmDocument[] = []

    const regionPromises = regions.split(',').map(region => {
      const ssm = new SSM({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })

      return new Promise<void>(async resolveSsmDocumentsData => {
        // Get SSM Documents
        const documents = await getDocumentsForRegion(ssm)

        if (!isEmpty(documents)) {
          documentsResult.push(
            ...documents.map(({Tags, ...document}) => ({
              ...document,
              region,
              account,
              Tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
            }))
          )
        }

        resolveSsmDocumentsData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(documentsResult, 'region'))
  })
