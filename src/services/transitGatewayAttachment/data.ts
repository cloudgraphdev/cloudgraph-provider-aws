import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import EC2, {
  DescribeTransitGatewayAttachmentsRequest,
  DescribeTransitGatewayAttachmentsResult,
  TransitGatewayAttachmentList,
  TransitGatewayAttachment,
} from 'aws-sdk/clients/ec2'

import { Config } from 'aws-sdk/lib/config'
import { AWSError } from 'aws-sdk/lib/error'
import { AwsTag, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'
import { convertAwsTagsToTagMap } from '../../utils/format'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'TransitGatewayAttachment'
const endpoint = initTestEndpoint(serviceName)

const listTransitGatewayAttachmentsData = async ({
  ec2,
  region,
  nextToken: NextToken = '',
}: {
  ec2: EC2
  region: string
  nextToken?: string
}): Promise<(TransitGatewayAttachment & { region: string })[]> =>
  new Promise<(TransitGatewayAttachment & { region: string })[]>(resolve => {
    let transitGatewayAttachmentData: (TransitGatewayAttachment & {
      region: string
    })[] = []
    const transitGatewayAttachmentList: TransitGatewayAttachmentList = []
    let args: DescribeTransitGatewayAttachmentsRequest = {}

    if (NextToken) {
      args = { ...args, NextToken }
    }

    ec2.describeTransitGatewayAttachments(
      args,
      (err: AWSError, data: DescribeTransitGatewayAttachmentsResult) => {
        if (err) {
          generateAwsErrorLog(
            serviceName,
            'ec2:describeTransitGatewayAttachments',
            err
          )
        }

        if (!isEmpty(data)) {
          const {
            NextToken: nextToken,
            TransitGatewayAttachments: transitGatewayAttachments = [],
          } = data

          transitGatewayAttachmentList.push(...transitGatewayAttachments)

          logger.debug(lt.fetchedTransitGatewayAttachments(transitGatewayAttachments.length))

          if (nextToken) {
            listTransitGatewayAttachmentsData({ ec2, region, nextToken })
          }

          transitGatewayAttachmentData = transitGatewayAttachmentList.map(
            attachment => ({
              ...attachment,
              region,
            })
          )
        }

        resolve(transitGatewayAttachmentData)
      }
    )
  })

/**
 * Transit Gateway Attachment
 */

export interface RawAwsTransitGatewayAttachment
  extends Omit<TransitGatewayAttachment, 'Tags'> {
  Tags?: TagMap
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsTransitGatewayAttachment[]
}> =>
  new Promise(async resolve => {
    let transitGatewayAttachmentsResult: RawAwsTransitGatewayAttachment[] = []

    const regionPromises = regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })

      return new Promise<void>(async resolveTransitGatewayAttachmentData => {
        // Get Transit Gateway Attachment Data
        const transitGateways = await listTransitGatewayAttachmentsData({
          ec2,
          region,
        })

        transitGatewayAttachmentsResult = transitGateways.map(attachment => {
          return {
            ...attachment,
            Tags: convertAwsTagsToTagMap(attachment.Tags as AwsTag[]),
          }
        })

        resolveTransitGatewayAttachmentData()
      })
    })

    await Promise.all(regionPromises)

    resolve(groupBy(transitGatewayAttachmentsResult, 'region'))
  })
