import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  UsagePlan,
  ListOfUsagePlan,
  GetUsagePlansRequest,
  UsagePlans,
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
const MAX_USAGE_PLANS = 500
const serviceName = 'API Gateway Usage Plan'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export interface RawAwsApiGatewayUsagePlan extends UsagePlan {
  region: string
}

export const getUsagePlansForRegion = async (
  apiGw: APIGW
): Promise<ListOfUsagePlan> =>
  new Promise<ListOfUsagePlan>(resolve => {
    const usagePlanList: ListOfUsagePlan = []
    const getUsagePlanOpts: GetUsagePlansRequest = {}
    const listAllUsagePlans = (token?: string): void => {
      getUsagePlanOpts.limit = MAX_USAGE_PLANS
      if (token) {
        getUsagePlanOpts.position = token
      }
      try {
        apiGw.getUsagePlans(
          getUsagePlanOpts,
          (err: AWSError, data: UsagePlans) => {
            const { position, items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw:getUsagePlans',
                err,
              })
            }

            usagePlanList.push(...items)

            if (position) {
              listAllUsagePlans(position)
            } else {
              resolve(usagePlanList)
            }
          }
        )
      } catch (error) {
        resolve([])
      }
    }
    listAllUsagePlans()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsApiGatewayUsagePlan[] }> =>
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
        const usagePlanList = await getUsagePlansForRegion(apiGw)
        if (!isEmpty(usagePlanList)) {
          apiGatewayData.push(
            ...usagePlanList.map(usagePlan => ({
              ...usagePlan,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedApiGatewayUsagePlans(apiGatewayData.length))

    errorLog.reset()

    resolve(groupBy(apiGatewayData, 'region'))
  })
