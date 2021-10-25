import groupBy from 'lodash/groupBy'

import { SQS } from '@aws-sdk/client-sqs'
import { Opts } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

export type AwsSqs = {
  region: string
  queueUrl: string
  sqsAttributes: {[key: string]: string}
  Tags: {[key: string]: string}
}

const serviceName = 'SQS'
const endpoint = initTestEndpoint(serviceName)

const listSqsQueueUrlsForRegion = async (sqs: SQS): Promise<string[]> => {
  const allQueueUrls = []
  try {
    let listQueuesOutput = await sqs.listQueues({})
    if (listQueuesOutput?.QueueUrls) {
      allQueueUrls.push(...listQueuesOutput.QueueUrls)
    }
    let nextToken = listQueuesOutput.NextToken

    while (nextToken) {
      listQueuesOutput = await sqs
        .listQueues({ NextToken: nextToken })
      if (listQueuesOutput?.QueueUrls) {
        allQueueUrls.push(...listQueuesOutput.QueueUrls)
      }
      nextToken = listQueuesOutput.NextToken
    }

    return allQueueUrls
  } catch (err) {
    generateAwsErrorLog(serviceName, 'sqs:listQueues', err)
  }
  return []
}

const getQueueAttributes = async (
  sqs: SQS,
  queueUrl: string
): Promise<{[key: string]: string}> => {
  try {
    const attributes = await sqs
      .getQueueAttributes({
        QueueUrl: queueUrl,
        AttributeNames: ['All'],
      })
    return attributes?.Attributes ?? {}
  } catch (err) {
    generateAwsErrorLog(serviceName, 'sqs:getQueueAttributes', err)
  }
  return null
}

const getQueueTags = async (sqs: SQS, queueUrl: string): Promise<{[key: string]: string}> => {
  try {
    const tags = await sqs.listQueueTags({ QueueUrl: queueUrl })
    return tags.Tags
  } catch (err) {
    generateAwsErrorLog(serviceName, 'sqs:listQueueTags', err)
  }
  return null
}

export default async ({
  regions,
  config,
}: // opts,
{
  regions: string
  config: any
  opts: Opts
}): Promise<{ [property: string]: AwsSqs[] }> => {
  const sqsList = []

  // get all SQS queueUrls for all regions
  for (const region of regions.split(',')) {
    const sqs = new SQS({ ...config, region, endpoint })
    const queueUrls = await listSqsQueueUrlsForRegion(sqs)

    for (const queueUrl of queueUrls) {
      // get all attributes for each queue using the url
      const sqsAttributes: {[key: string]: string} = await getQueueAttributes(
        sqs,
        queueUrl
      )
      const sqsData: any = {
        queueUrl,
        region,
        sqsAttributes,
      }
      // get all tags for each queue
      const tags: {[key: string]: string} = await getQueueTags(sqs, queueUrl)
      if (!isEmpty(tags)) {
        sqsData.Tags = tags
      }

      sqsList.push(sqsData)
    }
  }
  return groupBy(sqsList, 'region')
}
