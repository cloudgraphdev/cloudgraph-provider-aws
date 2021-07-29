import * as Sentry from '@sentry/node'

import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import upperFirst from 'lodash/upperFirst'

import EC2 from 'aws-sdk/clients/ec2'
import { AWSError } from 'aws-sdk/lib/error'
import { DescribeVpcsResult } from 'aws-sdk/clients/ec2'
import {Opts} from 'cloud-graph-sdk'

import CloudGraph from 'cloud-graph-sdk';
import { Credentials } from '../../types'
import { awsLoggerText } from '../../properties/logger'

const lt = { ...awsLoggerText }
const logger = CloudGraph.logger;
const endpoint =
  (process.env.NODE_ENV === 'test' && process.env.LOCALSTACK_AWS_ENDPOINT) ||
  undefined;
endpoint && logger.log('IGW getData in test mode!');

/**
 * VPC
 */

export default async ({
  regions,
  credentials,
  opts
}: {
  regions: string
  credentials: Credentials
  opts: Opts
}) =>
  new Promise(async resolve => {
    const vpcData = []
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
    }) => {
      let args: any = {}

      if (NextToken) {
        args = { ...args, NextToken }
      }

      return ec2.describeVpcs(
        args,
        (err: AWSError, data: DescribeVpcsResult) => {
          if (err) {
            logger.error(err)
            Sentry.captureException(new Error(err.message))
          }

          /**
           * No Vpc data for this region
           */
          if (isEmpty(data)) {
            return resolveRegion()
          }

          const { Vpcs: vpcs, NextToken: token } = data

          logger.info(lt.fetchedVpcs(vpcs.length))

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
           * Add the found Vpcs to the vpcData
           */

          vpcData.push(
            ...vpcs.map(vpc => {
              const result = { ...vpc, region }

              let tagsInObjForm = {}

              vpc.Tags.map(({ Key, Value }) => {
                tagsInObjForm[Key] = Value
              })

              return { ...result, Tags: tagsInObjForm }
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
      const ec2 = new EC2({ region, credentials, endpoint })
      const regionPromise = new Promise<void>(resolveRegion =>
        listVpcData({ ec2, region, resolveRegion })
      )
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)

    /**
     * Step 2) For each VPC get Enable DNS Support/Hostnames configuration
     */

    const fetchVpcAttribute = Attribute =>
      vpcData.map(({ region, VpcId }, idx) => {
        const ec2 = new EC2({ region, credentials, endpoint })

        const additionalAttrPromise = new Promise<void>(resolveAdditionalAttr =>
          ec2.describeVpcAttribute(
            { VpcId, Attribute: Attribute },
            (err, data) => {
              if (err) {
                logger.error(err)
                Sentry.captureException(new Error(err.message))
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
            }
          )
        )

        additionalAttrPromises.push(additionalAttrPromise)
      })

    logger.info(lt.fetchingVpcDnsSupportData)
    fetchVpcAttribute('enableDnsSupport')
    await Promise.all(additionalAttrPromises)

    logger.info(lt.fetchingVpcDnsHostnamesData)
    fetchVpcAttribute('enableDnsHostnames')
    await Promise.all(additionalAttrPromises)

    resolve(groupBy(vpcData, 'region'))
  })
