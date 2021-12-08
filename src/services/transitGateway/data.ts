import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeTransitGatewaysRequest,
  DescribeTransitGatewaysResult,
  DescribeTransitGatewayVpcAttachmentsRequest,
  DescribeTransitGatewayVpcAttachmentsResult,
  TransitGatewayVpcAttachmentList,
  TransitGatewayVpcAttachment,
  TransitGateway,
  TransitGatewayList,
} from 'aws-sdk/clients/ec2'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import { AwsTag, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'
import { convertAwsTagsToTagMap } from '../../utils/format'

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
    const transitGatewayVpcAttachmentList: TransitGatewayVpcAttachmentList = []
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
    const transitGatewayList: TransitGatewayList = []
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

export interface RawAwsTransitGatewayVpcAttachment
  extends Omit<TransitGatewayVpcAttachment, 'Tags'> {
  Tags?: TagMap
}

export interface RawAwsTransitGateway extends Omit<TransitGateway, 'Tags'> {
  Tags?: TagMap
  VpcAttachments?: RawAwsTransitGatewayVpcAttachment[]
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
    let transitGatewaysResult: RawAwsTransitGateway[] = []
    let vpcAttachmentsResult: RawAwsTransitGatewayVpcAttachment[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveTransitGatewayData => {
        // Get Transit Gateway Data
        const transitGateways = await listTransitGatewaysData({ ec2, region })

        // Get Transit Gateway Vpc Attachments
        const vpcAttachments = await getTransitGatewayVpcAttachments({ ec2 })

        transitGatewaysResult = transitGateways.map(gateway => {
          if (!isEmpty(vpcAttachments)) {
            const transitGatewayVpcAttachments = vpcAttachments.filter(
              vpcAttachment =>
                vpcAttachment.TransitGatewayId === gateway.TransitGatewayId
            )

            if (!isEmpty(transitGatewayVpcAttachments)) {
              vpcAttachmentsResult = transitGatewayVpcAttachments.map(vpc => {
                return {
                  ...vpc,
                  Tags: convertAwsTagsToTagMap(vpc.Tags as AwsTag[]),
                }
              })
            }
          }

          return {
            ...gateway,
            Tags: convertAwsTagsToTagMap(gateway.Tags as AwsTag[]),
            VpcAttachments: vpcAttachmentsResult,
          }
        })

        resolveTransitGatewayData()
      })
    })

    await Promise.all(regionPromises)

    resolve(groupBy(transitGatewaysResult, 'region'))
  })
