import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

// import { AWSError } from 'aws-sdk/lib/error'
// import { Config } from 'aws-sdk/lib/config'
import {
  ElasticLoadBalancing,
  DescribeLoadBalancerAttributesOutput,
  DescribeTagsOutput,
  LoadBalancerAttributes,
  LoadBalancerDescription,
  Tag,
} from '@aws-sdk/client-elastic-load-balancing'

import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ELB'
const endpoint = initTestEndpoint(serviceName)

const getElbTags = async (
  elb: ElasticLoadBalancing,
  elbNames: string[]
): Promise<{ LoadBalancerName: string; Tags: Tag[] }[]> =>
  new Promise<{ LoadBalancerName: string; Tags: Tag[] }[]>(resolve => {
    elb.describeTags(
      {
        LoadBalancerNames: elbNames,
      },
      (err: any, data: DescribeTagsOutput) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'elb:describeTags', err)
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
  elb: ElasticLoadBalancing,
  region: string
): Promise<(LoadBalancerDescription & { region: string })[]> =>
  new Promise<(LoadBalancerDescription & { region: string })[]>(async resolve => {
    let loadBalancerData: (LoadBalancerDescription & { region: string })[] = []
    try {
      const data = await elb.describeLoadBalancers({})
      if (!isEmpty(data)) {
        const { LoadBalancerDescriptions: loadBalancerDescriptions = [] } =
              data
            logger.debug(lt.fetchedElbs(loadBalancerDescriptions.length))
            loadBalancerData = loadBalancerDescriptions.map(lbDescription => ({
              ...lbDescription,
              region,
            }))
            resolve(loadBalancerData)
      }
      resolve(loadBalancerData)
    } catch (error) {
      generateAwsErrorLog(serviceName, 'elb:describeLoadBalancers', error)
      resolve(loadBalancerData)
    }
  })

const listElbAttributes = async (
  elb: ElasticLoadBalancing,
  elbName: string
): Promise<(LoadBalancerAttributes & { LoadBalancerName: string }) | unknown> =>
  new Promise<
    (LoadBalancerAttributes & { LoadBalancerName: string }) | unknown
  >(resolve => {
    elb.describeLoadBalancerAttributes(
      {
        LoadBalancerName: elbName,
      },
      (err: any, data: DescribeLoadBalancerAttributesOutput) => {
        if (err) {
          generateAwsErrorLog(serviceName, 'elb:describeLoadBalancerAttributes', err)
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
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: any
}): Promise<{
  [region: string]: RawAwsElb[]
}> =>
  new Promise(async resolve => {
    let elbData: RawAwsElb[] = []

    const regionPromises = regions.split(',').map(region => {
      const elbInstance = new ElasticLoadBalancing({ ...config, region, endpoint })
      return new Promise<void>(async resolveElbData => {
        // Get Load Balancer Data
        elbData = await listElbData(elbInstance, region)
        const elbNames: string[] = elbData.map(elb => elb.LoadBalancerName)

        if (!isEmpty(elbNames)) {
          // Get Tags
          const tagDescriptions = await getElbTags(elbInstance, elbNames)

          // If exists tags, populate elb tags
          if (!isEmpty(tagDescriptions)) {
            elbData = elbData.map(elb => {
              const elbsTags = tagDescriptions.find(
                tagDescription =>
                  tagDescription.LoadBalancerName === elb.LoadBalancerName
              )

              return {
                ...elb,
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

    resolve(groupBy(elbData, 'region'))
  })
