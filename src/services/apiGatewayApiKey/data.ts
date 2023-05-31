import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  ApiKey,
  ListOfApiKey,
  GetApiKeysRequest,
  ApiKeys,
} from 'aws-sdk/clients/apigateway'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const MAX_API_KEYS = 500
const serviceName = 'API Gateway Api Key'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export interface RawAwsApiGatewayApiKey extends ApiKey {
  region: string
}

export const getApiKeysForRegion = async (
  apiGw: APIGW
): Promise<ListOfApiKey> =>
  new Promise<ListOfApiKey>(resolve => {
    const apiKeyList: ListOfApiKey = []
    const getApiKeyOpts: GetApiKeysRequest = {}
    const listAllApiKeys = (token?: string): void => {
      getApiKeyOpts.limit = MAX_API_KEYS
      if (token) {
        getApiKeyOpts.position = token
      }
      try {
        apiGw.getApiKeys(getApiKeyOpts, (err: AWSError, data: ApiKeys) => {
          const { position, items = [] } = data || {}
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'apiGw:getApiKeys',
              err,
            })
          }

          apiKeyList.push(...items)

          if (position) {
            listAllApiKeys(position)
          } else {
            resolve(apiKeyList)
          }
        })
      } catch (error) {
        resolve([])
      }
    }
    listAllApiKeys()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsApiGatewayApiKey[] }> =>
  new Promise(async resolve => {
    const apiGatewayData = []
    const regionPromises = []

    regions.split(',').forEach(region => {
      const apiGw = new APIGW({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const apiKeyList = await getApiKeysForRegion(apiGw)
        if (!isEmpty(apiKeyList)) {
          apiGatewayData.push(
            ...apiKeyList.map(apiKey => ({
              ...apiKey,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedApiGatewayApiKeys(apiGatewayData.length))

    errorLog.reset()

    resolve(groupBy(apiGatewayData, 'region'))
  })
