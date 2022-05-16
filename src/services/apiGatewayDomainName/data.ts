import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  ApiMapping,
  DomainName,
  GetDomainNamesRequest,
  GetDomainNamesResponse,
  GetApiMappingsRequest,
  GetApiMappingsResponse,
} from 'aws-sdk/clients/apigatewayv2'
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
const MAX_DOMAIN_NAMES = '500'
const serviceName = 'API Gateway Domain Name'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export const getDomainNamesForRegion = async (
  apiGw: APIGW
): Promise<DomainName[]> =>
  new Promise(async resolve => {
    const domainNameList: DomainName[] = []
    const getDomainNamesOpts: GetDomainNamesRequest = {}
    const listAllDomainNames = (token?: string): void => {
      getDomainNamesOpts.MaxResults = MAX_DOMAIN_NAMES
      if (token) {
        getDomainNamesOpts.NextToken = token
      }
      try {
        apiGw.getDomainNames(
          getDomainNamesOpts,
          (err: AWSError, data: GetDomainNamesResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw:getDomainNames',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve([])
            }

            const { NextToken: nextToken, Items: items = [] } = data || {}

            if (isEmpty(items)) {
              return resolve([])
            }

            logger.debug(lt.fetchedApiGwDomainNames(items.length))

            domainNameList.push(...items)

            if (nextToken) {
              listAllDomainNames(nextToken)
            } else {
              resolve(domainNameList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllDomainNames()
  })

const getAPIMappings = (
  apiGw: APIGW,
  domainName: string
): Promise<{ domainName: string; apiMappings: ApiMapping[] }> =>
  new Promise<{ domainName: string; apiMappings: ApiMapping[] }>(resolve => {
    const apiMappingList: ApiMapping[] = []
    const args: GetApiMappingsRequest = { DomainName: domainName }
    const listAllAPIMappings = (token?: string): void => {
      if (token) {
        args.NextToken = token
      }
      try {
        apiGw.getApiMappings(
          args,
          (err: AWSError, data: GetApiMappingsResponse) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw:getApiMappings',
                err,
              })
            }

            if (isEmpty(data)) {
              return resolve({
                domainName,
                apiMappings: [],
              })
            }

            const { NextToken: nextToken, Items: apiMappings = [] } = data || {}

            if (isEmpty(apiMappings)) {
              return resolve({
                domainName,
                apiMappings: [],
              })
            }

            apiMappingList.push(...apiMappings)

            if (nextToken) {
              listAllAPIMappings(nextToken)
            } else {
              resolve({ domainName, apiMappings: apiMappingList })
            }
          }
        )
      } catch (error) {
        resolve({
          domainName,
          apiMappings: [],
        })
      }
    }
    listAllAPIMappings()
  })

export interface RawAwsApiGatewayDomainName extends Omit<DomainName, 'tags'> {
  region: string
  Tags: TagMap
  ApiMappings: ApiMapping[]
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
  [region: string]: RawAwsApiGatewayDomainName[]
}> =>
  new Promise(async resolve => {
    const domainNamesResult: RawAwsApiGatewayDomainName[] = []

    const regionPromises = regions.split(',').map(region => {
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })

      return new Promise<void>(async resolveTransitGatewayData => {
        // Get Custom Domains Data
        const customDomains = await getDomainNamesForRegion(apiGw)

        const mappingPromises = customDomains.map(
          ({ DomainName: domainName }) => getAPIMappings(apiGw, domainName)
        )

        const mappingData = await Promise.all(mappingPromises)

        if (!isEmpty(customDomains)) {
          for (const domain of customDomains) {
            domainNamesResult.push({
              ...domain,
              ApiMappings:
                mappingData?.find(m => m.domainName === domain.DomainName)
                  ?.apiMappings || [],
              region,
              Tags: domain.Tags,
              account,
            })
          }
        }

        resolveTransitGatewayData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(domainNamesResult, 'region'))
  })
