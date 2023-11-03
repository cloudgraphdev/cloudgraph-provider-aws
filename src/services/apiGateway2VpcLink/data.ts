import CloudGraph from '@cloudgraph/sdk'
import APIGW2, { VpcLink } from 'aws-sdk/clients/apigatewayv2'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, setAwsRetryOptions } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import { API_GATEWAY_CUSTOM_DELAY } from '../../config/constants'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'VPC Link'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)
const customRetrySettings = setAwsRetryOptions({
  baseDelay: API_GATEWAY_CUSTOM_DELAY,
})

export interface RawAwsVpcLink extends Omit<VpcLink, 'Tags'> {
  Tags: TagMap
  region: string
}

export const getVpcLinksForRegion = async (
  apiGw2: APIGW2
): Promise<APIGW2.VpcLink[]> =>
  new Promise<APIGW2.VpcLink[]>(resolve => {
    const vpcLinksList: APIGW2.VpcLink[] = []
    const getVpcLinksOpts: APIGW2.GetVpcLinksRequest = {}
    const listAllVpcLinks = (token?: string): void => {
      if (token) {
        getVpcLinksOpts.NextToken = token
      }
      try {
        apiGw2.getVpcLinks(
          getVpcLinksOpts,
          (err: AWSError, data: APIGW2.GetVpcLinksResponse) => {
            const { NextToken, Items: items = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'apiGw2:getVpcLinks',
                err,
              })
            }

            vpcLinksList.push(...items)

            if (NextToken) {
              listAllVpcLinks(NextToken)
            } else {
              resolve(vpcLinksList)
            }
          }
        )
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
}): Promise<{ [property: string]: RawAwsVpcLink[] }> =>
  new Promise(async resolve => {
    const vpcLinksData: RawAwsVpcLink[] = []
    const regionPromises = []

    regions.split(',').forEach(region => {
      const apiGw2 = new APIGW2({
        ...config,
        region,
        endpoint,
        ...customRetrySettings,
      })

      const regionPromise = new Promise<void>(async resolveRegion => {
        const vpcLinksList = await getVpcLinksForRegion(apiGw2)

        if (!isEmpty(vpcLinksList)) {
          vpcLinksData.push(
            ...vpcLinksList.map(vpcLink => ({
              ...vpcLink,
              region,
              Tags: {},
            }))
          )
        }

        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedVpcLinks(vpcLinksData.length))

    errorLog.reset()

    resolve(groupBy(vpcLinksData, 'region'))
  })
