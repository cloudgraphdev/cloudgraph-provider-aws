import * as Sentry from '@sentry/node'

import groupBy from 'lodash/groupBy'

import SQS, { QueueAttributeMap, TagMap } from 'aws-sdk/clients/sqs'
import { Opts } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { Credentials } from '../../types'

export type AwsSqs = {
    region: string
    queueUrl: string
    sqsAttributes: QueueAttributeMap
    tags: TagMap
  }

const listSqsQueueUrlsForRegion = async (sqs: SQS): Promise<string[]> => {
  const allQueueUrls = []
  try {
    let listQueuesOutput = await sqs.listQueues().promise()
    allQueueUrls.push(...listQueuesOutput.QueueUrls)

    let nextToken = listQueuesOutput.NextToken

    while (nextToken) {
      listQueuesOutput = await sqs.listQueues({NextToken: nextToken}).promise()
      allQueueUrls.push(...listQueuesOutput.QueueUrls)
      nextToken = listQueuesOutput.NextToken
    }

    return allQueueUrls
  } catch (err) {
    Sentry.captureException(new Error(err.message))
  }
  return []
}

const getQueueAttributes = async (
  sqs: SQS,
  queueUrl: string
): Promise<QueueAttributeMap> => {
  try {
    const attributes = await sqs.getQueueAttributes({
      QueueUrl: queueUrl,
      AttributeNames: ['All'],
    }).promise()
    return attributes.Attributes
  } catch (err) {
    Sentry.captureException(new Error(err.message))
  }
  return null
}

const getQueueTags = async (
  sqs: SQS,
  queueUrl: string
): Promise<TagMap> => {
  try {
    const tags = await sqs.listQueueTags({ QueueUrl: queueUrl }).promise()
    return tags.Tags
  } catch (err) {
    Sentry.captureException(new Error(err.message))
  }
  return null
}

export default async ({
  regions,
  credentials,
}: // opts,
{
  regions: string
  credentials: Credentials
  opts: Opts
}): Promise<{ [property: string]: AwsSqs[] }>=> {
  const sqsList = []
  
  // get all SQS queueUrls for all regions
  for (const region of regions.split(',')) {
    const sqs = new SQS({ region, credentials })
    const queueUrls = await listSqsQueueUrlsForRegion(sqs)
  
    for (const queueUrl of queueUrls) {

      // get all attributes for each queue using the url
      const sqsAttributes: QueueAttributeMap = await getQueueAttributes(sqs, queueUrl)
      const sqsData: any = {
        queueUrl,
        region,
        sqsAttributes,
      }
      // get all tags for each queue
      const tags: TagMap = await getQueueTags(sqs, queueUrl)
      if (!isEmpty(tags)) {
        sqsData.tags = tags
      }

      sqsList.push(sqsData)
    }
  }
  return groupBy(sqsList, 'region')
}
