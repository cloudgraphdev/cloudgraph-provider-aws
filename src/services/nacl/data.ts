import CloudGraph from '@cloudgraph/sdk'
import { AWSError } from 'aws-sdk'
import { Config } from 'aws-sdk/lib/config'
import EC2, {
  DescribeNetworkAclsRequest,
  DescribeNetworkAclsResult,
  NetworkAcl,
} from 'aws-sdk/clients/ec2'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'NetworkACL'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsNetworkAcl extends Omit<NetworkAcl, 'Tags'> {
  Tags?: TagMap
  region: string
}

/**
 * Network ACL
 */
export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsNetworkAcl[] }> =>
  new Promise(async resolve => {
    const naclData = []
    const regionPromises = []

    const listNaclData = async ({
      ec2,
      region,
      token: NextToken = '',
      resolveRegion,
    }): Promise<void> => {
      let args: DescribeNetworkAclsRequest = {}

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeNetworkAcls(
        args,
        (err: AWSError, data: DescribeNetworkAclsResult) => {
          if (err) {
            errorLog.generateAwsErrorLog({
              functionName: 'nacl:describeNetworkAcls',
              err,
            })
          }

          if (isEmpty(data)) {
            return resolveRegion()
          }

          const { NetworkAcls: nacls, NextToken: token } = data

          if (isEmpty(nacls)) {
            return resolveRegion()
          }

          if (token) {
            listNaclData({ region, token, ec2, resolveRegion })
          }

          naclData.push(
            ...nacls.map(({ Tags, ...nacl }) => ({
              ...nacl,
              region,
              Tags: convertAwsTagsToTagMap(Tags as AwsTag[]),
            }))
          )

          if (!token) {
            logger.debug(lt.fetchedNacls(nacls.length))
            resolveRegion()
          }
        }
      )
    }

    regions.split(',').map(region => {
      const ec2 = new EC2({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(resolveRegion =>
        listNaclData({ ec2, region, resolveRegion })
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(naclData, 'region'))
  })
