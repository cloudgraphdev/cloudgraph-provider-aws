import CloudGraph from '@cloudgraph/sdk'
import APIGW, {
  VpcLink,
  ListOfVpcLink,
  GetVpcLinksRequest,
  VpcLinks,
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
const MAX_VPC_LINKS = 500
const serviceName = 'API Gateway Vpc Link'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export interface RawAwsApiGatewayVpcLink extends VpcLink {
  region: string
}

export const getVpcLinksForRegion = async (
  apiGw: APIGW
): Promise<ListOfVpcLink> =>
  new Promise<ListOfVpcLink>(resolve => {
    const vpcLinkList: ListOfVpcLink = []
    const getVpcLinkOpts: GetVpcLinksRequest = {}
    const listAllVpcLinks = (token?: string): void => {
      getVpcLinkOpts.limit = MAX_VPC_LINKS
      if (token) {
        getVpcLinkOpts.position = token
      }
      try {
        apiGw.getVpcLinks(getVpcLinkOpts, (err: AWSError, data: VpcLinks) => {
          const { position, items = [] } = data || {}
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'apiGw:getVpcLinks',
              err,
            })
          }

          vpcLinkList.push(...items)

          if (position) {
            listAllVpcLinks(position)
          } else {
            resolve(vpcLinkList)
          }
        })
      } catch (error) {
        resolve([])
      }
    }
    listAllVpcLinks()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsApiGatewayVpcLink[] }> =>
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
        const vpcLinkList = await getVpcLinksForRegion(apiGw)
        if (!isEmpty(vpcLinkList)) {
          apiGatewayData.push(
            ...vpcLinkList.map(vpcLink => ({
              ...vpcLink,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedApiGatewayVpcLinks(apiGatewayData.length))

    errorLog.reset()

    resolve(groupBy(apiGatewayData, 'region'))
  })
