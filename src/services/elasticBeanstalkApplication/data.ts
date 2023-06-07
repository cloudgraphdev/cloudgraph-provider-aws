import {
  DescribeApplicationsCommand,
  ElasticBeanstalkClient,
  ListTagsForResourceCommand,
} from '@aws-sdk/client-elastic-beanstalk'
import CloudGraph from '@cloudgraph/sdk'
import { Config } from 'aws-sdk'
import { ApplicationDescription } from 'aws-sdk/clients/elasticbeanstalk'
import { groupBy } from 'lodash'
import isEmpty from 'lodash/isEmpty'
import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { settleAllPromises } from '../../utils/index'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ElasticBeanstalkApp'
const errorLog = new AwsErrorLog(serviceName)

export interface RawAwsElasticBeanstalkApp extends ApplicationDescription {
  region: string
  Tags?: TagMap
}

const listApplications = async (
  eb: ElasticBeanstalkClient
): Promise<ApplicationDescription[]> =>
  new Promise(async resolve => {
    const command = new DescribeApplicationsCommand({})
    eb.send(command)
      .then(data => {
        if (isEmpty(data)) {
          return resolve([])
        }
        const { Applications = [] } = data || {}
        if (isEmpty(Applications)) {
          return resolve([])
        }
        resolve(Applications)
      })
      .catch(err => {
        errorLog.generateAwsErrorLog({
          functionName: 'elasticBeanstalk:describeApplications',
          err,
        })
        resolve([])
      })
  })

export const getResourceTags = async (
  eb: ElasticBeanstalkClient,
  resourceArn: string
): Promise<TagMap> =>
  new Promise(resolveTags => {
    const command = new ListTagsForResourceCommand({ ResourceArn: resourceArn })
    eb.send(command)
      .then(data => {
        if (isEmpty(data)) {
          return resolveTags({})
        }
        const { ResourceTags: tags } = data || {}
        if (isEmpty(tags)) {
          return resolveTags({})
        }
        resolveTags(convertAwsTagsToTagMap(tags as AwsTag[]))
      })
      .catch(err => {
        errorLog.generateAwsErrorLog({
          functionName: 'elasticBeanstalk:listTagsForResource',
          err,
        })
        resolveTags({})
      })
  })

const getApplications = async (
  eb: ElasticBeanstalkClient
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
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsElasticBeanstalkApp[] }> =>
  new Promise(async resolve => {
    const { credentials } = config
    let numberOfApps = 0
    const appsData: RawAwsElasticBeanstalkApp[] = []

    const regionPromises = regions.split(',').map(region => {
      const eb = new ElasticBeanstalkClient({
        credentials,
        region,
      })
      return new Promise<void>(async resolveRegion => {
        const apps = (await getApplications(eb)) || []
        if (!isEmpty(apps)) {
          appsData.push(...apps.map(val => ({ ...val, region })))
          numberOfApps += apps.length
        }
        resolveRegion()
      })
    })

    await Promise.all(regionPromises)
    errorLog.reset()
    logger.debug(lt.fetchedElasticBeanstalkApps(numberOfApps))
    resolve(groupBy(appsData, 'region'))
  })
