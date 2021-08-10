import * as Sentry from '@sentry/node'

import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'
import ELB, {
  DescribeAccessPointsOutput,
  DescribeLoadBalancerAttributesOutput,
  DescribeTagsOutput,
  LoadBalancerAttributes,
  LoadBalancerDescription,
  TagList,
} from 'aws-sdk/clients/elb'

import { Credentials } from '../../types'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const endpoint = initTestEndpoint('ELB')

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
          logger.debug(err.message)
          Sentry.captureException(new Error(err.message))
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
  elb: ELB,
  region: string
): Promise<LoadBalancerDescription[]> =>
  new Promise<(LoadBalancerDescription & { region: string })[]>(resolve => {
    let loadBalancerData: (LoadBalancerDescription & { region: string })[] = []
    elb.describeLoadBalancers(
      (err: AWSError, data: DescribeAccessPointsOutput) => {
        if (err) {
          logger.error(err)
          Sentry.captureException(new Error(err.message))
        }
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
          logger.error(err)
          Sentry.captureException(new Error(err.message))
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

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: (LoadBalancerDescription & {
    Tags?: TagList
    Attributes?: LoadBalancerAttributes
  })[]
}> =>
  new Promise(async resolve => {
    let elbData: (LoadBalancerDescription & {
      Tags?: TagList
      Attributes?: LoadBalancerAttributes
    })[] = []

    const regionPromises = regions.split(',').map(region => {
      const elbInstance = new ELB({ region, credentials, endpoint })
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
                Tags: elbsTags?.Tags,
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
