import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeTransitGatewaysRequest,
  DescribeTransitGatewaysResult,
  DescribeTransitGatewayVpcAttachmentsRequest,
  DescribeTransitGatewayVpcAttachmentsResult,
  TransitGatewayVpcAttachmentList,
  TransitGateway,
  TransitGatewayList,
} from 'aws-sdk/clients/ec2'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'
import { TagMap } from '../../types'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'TransitGateway'
const endpoint = initTestEndpoint(serviceName)

const getTransitGatewayVpcAttachments = async ({
  ec2,
  nextToken: NextToken = '',
}: {
  ec2: EC2
  nextToken?: string
}): Promise<TransitGatewayVpcAttachmentList> =>
  new Promise<TransitGatewayVpcAttachmentList>(resolve => {

    let transitGatewayVpcAttachmentList : TransitGatewayVpcAttachmentList = []
    let args: DescribeTransitGatewayVpcAttachmentsRequest = {}

    if (NextToken) {
      args = { ...args, NextToken }
    }

    ec2.describeTransitGatewayVpcAttachments(
      args,
      (err: AWSError, data: DescribeTransitGatewayVpcAttachmentsResult) => {

        if (err) {
          generateAwsErrorLog(
            serviceName,
            'ec2:describeTransitGatewayVpcAttachments',
            err
          )
        }

        if (!isEmpty(data)) {
          const {
            NextToken: nextToken,
            TransitGatewayVpcAttachments: transitGatewayVpcAttachments = [],
          } = data

          logger.debug(
            lt.fetchedTransitGatewayVpcAttachments(
              transitGatewayVpcAttachments.length
            )
          )

          transitGatewayVpcAttachmentList.push(...transitGatewayVpcAttachments)

          if (nextToken) {
            getTransitGatewayVpcAttachments({ ec2, nextToken })
          }
          
        }

        resolve(transitGatewayVpcAttachmentList)
      }
    )
  })

const listTransitGatewaysData = async ({
  ec2,
  region,
  nextToken: NextToken = '',
}: {
  ec2: EC2
  region: string
  nextToken?: string
}): Promise<(TransitGateway & { region: string })[]> =>
  new Promise<(TransitGateway & { region: string })[]>(resolve => {

    let transitGatewayData: (TransitGateway & { region: string })[] = []
    let transitGatewayList: TransitGatewayList = []
    let args: DescribeTransitGatewaysRequest = {}

    if (NextToken) {
      args = { ...args, NextToken }
    }

    ec2.describeTransitGateways(
      args,
      (err: AWSError, data: DescribeTransitGatewaysResult) => {

        if (err) {
          generateAwsErrorLog(serviceName, 'ec2:describeTransitGateways', err)
        }

        if (!isEmpty(data)) {
          const {
            NextToken: nextToken,
            TransitGateways: transitGateways = [],
          } = data

          transitGatewayList.push(...transitGateways)

          logger.info(lt.fetchedTransitGateways(transitGateways.length))

          if (nextToken) {
            region = 'us-west-2'
            listTransitGatewaysData({ ec2, region, nextToken })
          }

          transitGatewayData = transitGatewayList.map(gateway => ({
            ...gateway,
            region,
          }))
  
        }

        resolve(transitGatewayData)
      }
    )
  })

/**
 * Transit Gateway
 */

export interface RawAwsTransitGateway extends TransitGateway {
  VpcAttachments?: TransitGatewayVpcAttachmentList
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsTransitGateway[]
}> =>
  new Promise(async resolve => {

    let transitGateways: RawAwsTransitGateway[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveTransitGatewayData => {
        // Get Transit Gateway Data
        transitGateways = await listTransitGatewaysData({ ec2, region })
    
        // Get Transit Gateway Vpc Attachments
        let vpcAttachments = await getTransitGatewayVpcAttachments({ ec2 })
        if (!isEmpty(vpcAttachments)) {
          transitGateways = transitGateways.map(gateway => {
            const transitGatewayVpcAttachments = vpcAttachments.filter(
              vpcAttachment =>
                vpcAttachment.TransitGatewayId === gateway.TransitGatewayId
            )

            return {
              ...gateway,
              VpcAttachments: transitGatewayVpcAttachments,
            }
          })
        }

        resolveTransitGatewayData()
      })
    })

    logger.debug(lt.fetchingEip)
    await Promise.all(regionPromises)

    resolve(groupBy(transitGateways, 'region'))
  })
