import CloudGraph from '@cloudgraph/sdk'
import { AWSError } from 'aws-sdk'
import ElasticBeanstalk, {
  ApplicationDescription,
  ApplicationDescriptionsMessage,
  ResourceTagsDescriptionMessage,
} from 'aws-sdk/clients/elasticbeanstalk'
import isEmpty from 'lodash/isEmpty'

import { AwsTag, Credentials, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { settleAllPromises } from '../../utils/index'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ElasticBeanstalkApp'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsElasticBeanstalkApp extends ApplicationDescription {
  Tags?: TagMap
}

const listApplications = async (
  eb: ElasticBeanstalk
): Promise<ApplicationDescription[]> =>
  new Promise(async resolve => {
    eb.describeApplications(
      {},
      (err: AWSError, data: ApplicationDescriptionsMessage) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elasticBeanstalk:describeApplications',
            err,
          })
        }
        /**
         * No EB Applications for this region
         */
        if (isEmpty(data)) {
          return resolve([])
        }
        const { Applications = [] } = data || {}
        if (isEmpty(Applications)) {
          return resolve([])
        }
        resolve(Applications)
      }
    )
  })

export const getResourceTags = async (
  eb: ElasticBeanstalk,
  resourceArn: string
): Promise<TagMap> =>
  new Promise(resolveTags => {
    eb.listTagsForResource(
      {
        ResourceArn: resourceArn,
      },
      (err: AWSError, data: ResourceTagsDescriptionMessage) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 'elasticBeanstalk:listTagsForResource',
            err,
          })
        }
        /**
         * No EB Applications for this region
         */
        if (isEmpty(data)) {
          return resolveTags({})
        }
        const { ResourceTags: tags } = data || {}
        if (isEmpty(tags)) {
          return resolveTags({})
        }
        resolveTags(convertAwsTagsToTagMap(tags as AwsTag[]))
      }
    )
  })

const getApplications = async (
  eb: ElasticBeanstalk
): Promise<RawAwsElasticBeanstalkApp[]> => {
  const apps = await listApplications(eb)
  if (!isEmpty(apps)) {
    return settleAllPromises(
      apps.map(async (app: ApplicationDescription) => ({
        ...app,
        Tags: await getResourceTags(eb, app.ApplicationArn),
      }))
    )
  }
  return []
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{ [property: string]: RawAwsElasticBeanstalkApp[] }> =>
  new Promise(async resolve => {
    let numberOfApps = 0
    const output: { [property: string]: RawAwsElasticBeanstalkApp[] } = {}

    // First we get all applications for all regions
    await Promise.all(
      regions.split(',').map(region => {
        const eb = new ElasticBeanstalk({ region, credentials, endpoint })
        output[region] = []
        return new Promise<void>(async resolveRegion => {
          const apps = (await getApplications(eb)) || []
          output[region] = apps
          numberOfApps += apps.length
          resolveRegion()
        })
      })
    )
    errorLog.reset()
    logger.debug(lt.fetchedElasticBeanstalkApps(numberOfApps))
    resolve(output)
  })
