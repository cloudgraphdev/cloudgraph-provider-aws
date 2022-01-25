import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import ELB, {
  DescribeAccessPointsOutput,
  DescribeLoadBalancerAttributesOutput,
  DescribeTagsOutput,
  LoadBalancerAttributes,
  LoadBalancerDescription,
  TagList,
} from 'aws-sdk/clients/elb'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ELB'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const getElbTags = async (
  elb: ELB,
  elbNames: string[]
): Promise<{ LoadBalancerName: string; Tags: TagList }[]> =>
  new Promise<{ LoadBalancerName: string; Tags: TagList }[]>(resolve => {
    elb.describeTags(
      {
        LoadBalancerNames: elbNames,
      },
      (err: AWSError, data: DescribeTagsOutput) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elb:describeTags',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { TagDescriptions: tagDescriptions = [] } = data
          const elbTags = tagDescriptions.map(tagDescription => ({
            LoadBalancerName: tagDescription.LoadBalancerName,
            Tags: tagDescription.Tags,
          }))
          resolve(elbTags)
        }

        resolve([])
      }
    )
  })

const listElbData = async (
  elb: ELB
): Promise<LoadBalancerDescription[]> =>
  new Promise<LoadBalancerDescription[]>(resolve => {
    let loadBalancerData: LoadBalancerDescription[] = []
    elb.describeLoadBalancers(
      (err: AWSError, data: DescribeAccessPointsOutput) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elb:describeLoadBalancers',
            err,
          })
        }
        if (!isEmpty(data)) {
          const { LoadBalancerDescriptions: loadBalancerDescriptions = [] } =
            data
          logger.debug(lt.fetchedElbs(loadBalancerDescriptions.length))
          loadBalancerData = loadBalancerDescriptions.map(lbDescription => ({
            ...lbDescription,
          }))
          resolve(loadBalancerData)
        }

        resolve(loadBalancerData)
      }
    )
  })

const listElbAttributes = async (
  elb: ELB,
  elbName: string
): Promise<(LoadBalancerAttributes & { LoadBalancerName: string }) | unknown> =>
  new Promise<
    (LoadBalancerAttributes & { LoadBalancerName: string }) | unknown
  >(resolve => {
    elb.describeLoadBalancerAttributes(
      {
        LoadBalancerName: elbName,
      },
      (err: AWSError, data: DescribeLoadBalancerAttributesOutput) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elb:describeLoadBalancerAttributes',
            err,
          })
        }

        if (!isEmpty(data)) {
          const { LoadBalancerAttributes: loadBalancerAttributes = {} } = data
          resolve({
            ...loadBalancerAttributes,
            LoadBalancerName: elbName,
          })
        }

        resolve({})
      }
    )
  })

/**
 * ELB
 */
export interface RawAwsElb extends LoadBalancerDescription {
  Attributes?: LoadBalancerAttributes
  Tags?: { [key: string]: any }
  region: string
  account: string
}

export default async ({
  regions,
  config,
  account
}: {
  regions: string
  account: string
  config: Config
}): Promise<{
  [region: string]: RawAwsElb[]
}> =>
  new Promise(async resolve => {
    let elbData: RawAwsElb[] = []

    const regionPromises = regions.split(',').map(region => {
      const elbInstance = new ELB({ ...config, region, endpoint })
      return new Promise<void>(async resolveElbData => {
        // Get Load Balancer Data
        const elbDescriptionData = await listElbData(elbInstance)
        const elbNames: string[] = elbDescriptionData.map(elb => elb.LoadBalancerName)

        if (!isEmpty(elbNames)) {
          // Get Tags
          const tagDescriptions = await getElbTags(elbInstance, elbNames)

          // If exists tags, populate elb tags
          if (!isEmpty(tagDescriptions)) {
            elbData = elbDescriptionData.map(elb => {
              const elbsTags = tagDescriptions.find(
                tagDescription =>
                  tagDescription.LoadBalancerName === elb.LoadBalancerName
              )

              return {
                ...elb,
                account,
                region,
                Tags: (elbsTags?.Tags || [])
                  .map(({ Key, Value }) => ({ [Key]: Value }))
                  .reduce((acc, curr) => ({ ...acc, ...curr }), {}),
              }
            })
          }
        }

        // Get Load Balancer Attributes
        const elbAttributes = await Promise.all(
          elbNames.map(elbName => listElbAttributes(elbInstance, elbName))
        )

        // If exists attributes, populate elb attributes
        if (!isEmpty(elbAttributes)) {
          elbData = elbData.map(elb => {
            const elbsAttributes = elbAttributes.find(
              (
                attributes: LoadBalancerAttributes & {
                  LoadBalancerName: string
                }
              ) => attributes.LoadBalancerName === elb.LoadBalancerName
            )

            return {
              ...elb,
              Attributes: elbsAttributes,
            }
          })
        }

        resolveElbData()
      })
    })

    logger.debug(lt.fetchingEip)
    await Promise.all(regionPromises)
    errorLog.reset()

    resolve(groupBy(elbData, 'region'))
  })
