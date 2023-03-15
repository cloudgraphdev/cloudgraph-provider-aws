import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import upperFirst from 'lodash/upperFirst'

import { Request } from 'aws-sdk/lib/request'
import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import EC2, {
  DescribeVpcsRequest,
  DescribeVpcsResult,
  FlowLog,
  Vpc,
} from 'aws-sdk/clients/ec2'
import CloudGraph from '@cloudgraph/sdk'

import { AwsTag, TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'VPC'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

/**
 * VPC
 */
export interface RawAwsVpc extends Omit<Vpc, 'Tags'> {
  enableDnsHostnames?: boolean
  enableDnsSupport?: boolean
  region: string
  Tags: TagMap
  flowLogs: any
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsVpc[] }> =>
  new Promise(async resolve => {
    const vpcData: RawAwsVpc[] = []
    const regionPromises = []
    const additionalAttrPromises = []

    /**
     * Step 1) Get all the VPC data for each region
     */

    const listVpcData = async ({
      ec2,
      region,
      token: NextToken = '',
      resolveRegion,
    }: {
      ec2: EC2
      region: string
      token?: string
      resolveRegion: () => void
    }): Promise<Request<DescribeVpcsResult, AWSError>> => {
      let args: DescribeVpcsRequest = {}

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeVpcs(
        args,
        async (err: AWSError, data: DescribeVpcsResult) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'ec2:describeVpcs',
              err,
            })
          }

          /**
           * No Vpc data for this region
           */
          if (isEmpty(data)) {
            return resolveRegion()
          }

          const { Vpcs: vpcs, NextToken: token } = data

          logger.debug(lt.fetchedVpcs(vpcs.length))

          /**
           * No Vpcs Found
           */
          if (isEmpty(vpcs)) {
            return resolveRegion()
          }

          /**
           * Check to see if there are more
           */
          if (token) {
            listVpcData({ region, token, ec2, resolveRegion })
          }
          /**
           * Get flow log data for the vpcs in the region
           */
          const vpcIds = vpcs.map(({ VpcId }) => VpcId)
          const flowLogsResult: FlowLog[] = []
          try {
            let nextTokenWatcher = true
            while (nextTokenWatcher) {
              const flowLogs = await ec2
                .describeFlowLogs({
                  Filter: [{ Name: 'resource-id', Values: vpcIds }],
                  MaxResults: 100,
                })
                .promise()
              if (flowLogs?.FlowLogs) {
                for (const flowLog of flowLogs.FlowLogs) {
                  flowLogsResult.push(flowLog)
                }
              }
              if (!flowLogs.NextToken) {
                nextTokenWatcher = false
              }
            }
          } catch (e) {
            logger.debug('There was an issue getting vpc flow log data')
            logger.debug(e)
          }
          /**
           * Add the found Vpcs to the vpcData
           */
          vpcData.push(
            ...vpcs.map(vpc => {
              const vpcFlowLogSet = flowLogsResult.filter(
                flowLog => flowLog.ResourceId === vpc.VpcId
              )
              const flowLogTags = []
              for (const flowLog of vpcFlowLogSet) {
                flowLogTags.push(...flowLog.Tags)
              }
              return {
                ...vpc,
                region,
                Tags: convertAwsTagsToTagMap(
                  vpc.Tags.concat(flowLogTags) as AwsTag[]
                ),
                flowLogs: flowLogsResult.find(
                  flowLog => flowLog.ResourceId === vpc.VpcId
                ),
              }
            })
          )

          /**
           * If this is the last page of data then return
           */

          if (!token) {
            resolveRegion()
          }
        }
      )
    }

    regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(resolveRegion =>
        listVpcData({ ec2, region, resolveRegion })
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    /**
     * Step 2) For each VPC get Enable DNS Support/Hostnames configuration
     */

    const fetchVpcAttribute = (Attribute): void[] =>
      vpcData.map(({ region, VpcId }, idx): void => {
        const ec2 = new EC2({ ...config, region, endpoint })

        const additionalAttrPromise = new Promise<void>(resolveAdditionalAttr =>
          ec2.describeVpcAttribute({ VpcId, Attribute }, (err, data) => {
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'ec2:describeVpcAttribute',
                err,
              })
            }

            /**
             * No attribute
             */

            if (isEmpty(data)) {
              return resolveAdditionalAttr()
            }

            /**
             * Add the attribute to the VPC
             */

            vpcData[idx][upperFirst(Attribute)] = get(
              data[upperFirst(Attribute)],
              'Value'
            )

            resolveAdditionalAttr()
          })
        )

        additionalAttrPromises.push(additionalAttrPromise)
      })
    logger.debug(lt.fetchingVpcDnsSupportData)
    fetchVpcAttribute('enableDnsSupport')
    await Promise.all(additionalAttrPromises)

    logger.debug(lt.fetchingVpcDnsHostnamesData)
    fetchVpcAttribute('enableDnsHostnames')
    await Promise.all(additionalAttrPromises)
    errorLog.reset()

    resolve(groupBy(vpcData, 'region'))
  })
