import SNS, {
  Topic,
  ListTopicsInput,
  ListTopicsResponse,
  TopicAttributesMap,
  GetTopicAttributesResponse,
  ListTagsForResourceResponse,
  Subscription,
  SubscriptionsList,
  ListSubscriptionsByTopicInput,
  ListSubscriptionsByTopicResponse,
} from 'aws-sdk/clients/sns'
import { AWSError } from 'aws-sdk/lib/error'
import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import awsLoggerText from '../../properties/logger'
import { AwsTag, TagMap } from '../../types'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'SNS'
const endpoint = initTestEndpoint(serviceName)

/**
 * SNS
 */
export interface RawAwsSns extends Topic {
  Policy?: string
  DeliveryPolicy?: string
  DisplayName?: string
  KmsMasterKeyId?: string
  region: string
  subscriptions?: Subscription[]
  Tags?: TagMap
}

const listSnsTopicArnsForRegion = async ({ sns, resolveRegion }) =>
  new Promise<Topic[]>(resolve => {
    const topicArnList: Topic[] = []
    const listTopicArnNameOpts: ListTopicsInput = {}
    const listTopicArns = (nextToken?: string) => {
      if (nextToken) {
        listTopicArnNameOpts.NextToken = nextToken
      }
      sns.listTopics(
        listTopicArnNameOpts,
        (err: AWSError, listTopicArnsOutput: ListTopicsResponse) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'sns:listTopics', err)
          }
          /**
           * No SNS data for this region
           */
          if (isEmpty(listTopicArnsOutput)) {
            return resolveRegion()
          }

          const { Topics, NextToken: nextToken } = listTopicArnsOutput

          /**
           * No SNS Topics for this region
           */
          if (isEmpty(Topics)) {
            return resolveRegion()
          }
          topicArnList.push(...Topics)

          if (nextToken) {
            listTopicArns(nextToken)
          }

          resolve(topicArnList)
        }
      )
    }
    listTopicArns()
  })

const getTopicAttributes = async (
  sns: SNS,
  arn: string
): Promise<TopicAttributesMap> =>
  new Promise(resolve => {
    sns.getTopicAttributes(
      { TopicArn: arn },
      (err: AWSError, topicAttributesData: GetTopicAttributesResponse) => {
        if (err || !topicAttributesData) {
          generateAwsErrorLog(serviceName, 'sns:getTopicAttributes', err)
        }
        const { Attributes = {} } = topicAttributesData || {}
        resolve(Attributes)
      }
    )
  })
  
const getTopicTags = async (sns: SNS, arn: string): Promise<TagMap> =>
  new Promise(resolveTags => {
    try {
      sns.listTagsForResource(
        { ResourceArn: arn },
        (err: AWSError, data: ListTagsForResourceResponse) => {
          if (err) {
            generateAwsErrorLog(serviceName, 'sns:listTagsForResource', err)
            return resolveTags({})
          }

          const { Tags = [] } = data || {}
          resolveTags(convertAwsTagsToTagMap(Tags as AwsTag[]))
        }
      )
    } catch (error) {
      resolveTags({})
    }
  })

const getTopicSubscriptions = async (
  sns: SNS,
  arn: string
): Promise<SubscriptionsList> =>
  new Promise(resolveSubscriptions => {
    const subscriptions: SubscriptionsList = []
    const listSubscriptionsOpts: ListSubscriptionsByTopicInput = {
      TopicArn: arn,
    }
    const listAllTags = (token?: string) => {
      if (token) {
        listSubscriptionsOpts.NextToken = token
      }
      try {
        sns.listSubscriptionsByTopic(
          listSubscriptionsOpts,
          (err: AWSError, data: ListSubscriptionsByTopicResponse) => {
            const { Subscriptions, NextToken } = data || {}
            if (err) {
              generateAwsErrorLog(serviceName, 'sns:listSubscriptionsByTopic', err)
            }

            subscriptions.push(...Subscriptions)

            if (NextToken) {
              logger.debug(lt.foundAnotherThousand)
              listAllTags(NextToken)
            }

            resolveSubscriptions(subscriptions)
          }
        )
      } catch (error) {
        resolveSubscriptions([])
      }
    }
    listAllTags()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsSns[] }> =>
  new Promise(async resolve => {
    const snsData: RawAwsSns[] = []
    const regionPromises = []
    const topicPromises = []
    const tagsPromises = []
    const subscriptionsPromises = []

    // First we get all sns topics arn for all regions
    regions.split(',').map(region => {
      const sns = new SNS({ ...config, region, endpoint })
      const regionPromise = new Promise<void>(async resolveRegion => {
        const snsTopicArnList = await listSnsTopicArnsForRegion({
          sns,
          resolveRegion,
        })
        snsData.push(
          ...snsTopicArnList.map((topic: Topic) => ({
            ...topic,
            region,
          }))
        )
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })
    await Promise.all(regionPromises)
    logger.debug(lt.fetchedSNSTopics(snsData.length))

    // Then we get all attributes for each topic using the arn
    snsData.map(({ TopicArn: arn, region }, idx) => {
      const sns = new SNS({ ...config, region, endpoint })
      const topicPromise = new Promise<void>(async resolveTopic => {
        const snsAttributes: TopicAttributesMap = await getTopicAttributes(
          sns,
          arn
        )
        snsData[idx] = {
          ...snsData[idx],
          ...snsAttributes,
        }
        resolveTopic()
      })
      topicPromises.push(topicPromise)
    })
    logger.debug(lt.gettingSNSTopicAttributes)
    await Promise.all(topicPromises)

    // Afterwards we get all tags for each topic
    snsData.map(({ TopicArn: arn, region }, idx) => {
      const sns = new SNS({ ...config, region, endpoint })
      const tagsPromise = new Promise<void>(async resolveTags => {
        snsData[idx].Tags = await getTopicTags(sns, arn)
        resolveTags()
      })
      tagsPromises.push(tagsPromise)
    })
    logger.debug(lt.gettingSNSTopicTags)
    await Promise.all(tagsPromises)

    // Then we get all subscriptions for each topic
    snsData.map(({ TopicArn: arn, region }, idx) => {
      const sns = new SNS({ ...config, region, endpoint })
      const listSubscriptionsPromise = new Promise<void>(
        async resolveSubscriptions => {
          const subscriptionList: SubscriptionsList = await getTopicSubscriptions(
            sns,
            arn
          )
          snsData[idx].subscriptions = subscriptionList
          resolveSubscriptions()
        }
      )
      subscriptionsPromises.push(listSubscriptionsPromise)
    })
    logger.debug(lt.gettingSNSTopicSubscriptions)
    await Promise.all(subscriptionsPromises)

    resolve(groupBy(snsData, 'region'))
  })