import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeCustomerGatewaysResult,
  CustomerGateway,
} from 'aws-sdk/clients/ec2'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { AwsTag, TagMap } from '../../types'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'CustomerGateway'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const listCustomerGatewaysData = async ({
  ec2,
  region,
}: {
  ec2: EC2
  region: string
  nextToken?: string
}): Promise<(CustomerGateway & { region: string })[]> =>
  new Promise<(CustomerGateway & { region: string })[]>(resolve => {
    let customerGatewayData: (CustomerGateway & { region: string })[] = []

    ec2.describeCustomerGateways(
      {},
      (err: AWSError, data: DescribeCustomerGatewaysResult) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'ec2:describeCustomerGateways',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { CustomerGateways: customerGateways = [] } = data

          logger.debug(lt.fetchedCustomerGateways(customerGateways.length))

          customerGatewayData = customerGateways.map(gateway => ({
            ...gateway,
            region,
          }))
        }

        resolve(customerGatewayData)
      }
    )
  })

/**
 * Customer Gateway
 */

export interface RawAwsCustomerGateway extends Omit<CustomerGateway, 'Tags'> {
  region: string
  Tags?: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsCustomerGateway[]
}> =>
  new Promise(async resolve => {
    const customerGatewaysResult: RawAwsCustomerGateway[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveCustomerGatewayData => {
        // Get Customer Gateway Data
        const customerGateways = await listCustomerGatewaysData({ ec2, region })

        if (!isEmpty(customerGateways)) {
          for (const customer of customerGateways) {
            customerGatewaysResult.push({
              ...customer,
              region,
              Tags: convertAwsTagsToTagMap(customer.Tags as AwsTag[]),
            })
          }
        }

        resolveCustomerGatewayData()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(customerGatewaysResult, 'region'))
  })
