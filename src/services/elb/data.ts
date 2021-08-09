import * as Sentry from '@sentry/node'
// import CloudGraph, { Opts } from '@cloudgraph/sdk'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'

import { AWSError } from 'aws-sdk/lib/error'
import ELB, { TagDescription } from 'aws-sdk/clients/elb'

import { Credentials } from '../../types'
import environment from '../../config/environment'
import awsLoggerText from '../../properties/logger'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const endpoint =
  (environment.NODE_ENV === 'test' && environment.LOCALSTACK_AWS_ENDPOINT) ||
  undefined
endpoint && logger.info('ELB getData in test mode!')

const getElbTags = async (elb: ELB, elbNames: string[]) =>
  new Promise<TagDescription[]>(resolve => {
    elb.describeTags(
      {
        LoadBalancerNames: elbNames,
      },
      (err: AWSError, data: any) => {
        if (err) {
          logger.debug(err.message)
          Sentry.captureException(new Error(err.message))
        }

        if (!isEmpty(data)) {
          const { TagDescriptions: tagDescriptions = [] } = data
          const elbTags = tagDescriptions.map(tagDescription => ({
            loadBalancerName: tagDescription.LoadBalancerName,
            tags: tagDescription.Tags,
          }))
          resolve(elbTags)
        }

        resolve([])
      }
    )
  })

const listElbData = async (elb: ELB) =>
  new Promise<any[]>(resolve => {
    elb.describeLoadBalancers((err, data) => {
      if (err) {
        logger.error(err)
        Sentry.captureException(new Error(err.message))
      }

      if (!isEmpty(data)) {
        const { LoadBalancerDescriptions: loadBalancerDescriptions = [] } = data
        logger.info(lt.fetchedElbs(loadBalancerDescriptions.length))
        resolve(loadBalancerDescriptions)
      }

      resolve([])
    })
  })

const listElbAttributes = async (elb: ELB, elbName: string) =>
  new Promise<any>(resolve => {
    elb.describeLoadBalancerAttributes(
      {
        LoadBalancerName: elbName,
      },
      (err, data) => {
        if (err) {
          logger.error(err)
          Sentry.captureException(new Error(err.message))
        }

        if (!isEmpty(data)) {
          const { LoadBalancerAttributes: loadBalancerAttributes = {} } = data
          resolve({
            ...loadBalancerAttributes,
            loadBalancerName: elbName,
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
}) =>
  new Promise(async resolve => {
    let elbData: any & { region: string }[] = []

    const regionPromises = regions.split(',').map(region => {
      const elbInstance = new ELB({ region, credentials, endpoint })
      return new Promise<void>(async resolveElbData => {
        // Get Load Balancer Data
        elbData = await listElbData(elbInstance)

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
                tags: elbsTags?.Tags || {},
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
              (attributes: any) =>
                attributes.loadBalancerName === elb.loadBalancerName
            )

            return {
              ...elb,
              attributes: elbsAttributes,
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
