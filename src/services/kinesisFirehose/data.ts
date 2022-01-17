import { Firehose } from 'aws-sdk'
import CloudGraph from '@cloudgraph/sdk'
import { groupBy } from 'lodash'
import { Config } from 'aws-sdk/lib/config'
import { DeliveryStreamDescription } from 'aws-sdk/clients/firehose'
import { TagMap } from '../../types'
import awsLoggerText from '../../properties/logger'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { initTestEndpoint } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'ASG'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsKinesisFirehose extends DeliveryStreamDescription {
  region: string
  Tags?: TagMap
}

/**
 * Kinesis Firehose
 */

const Limit = 60
const LIST_TAGS_LIMIT = 50

const listDeliveryStreamData = async (
  kinesis: Firehose
): Promise<DeliveryStreamDescription[]> => {
  try {
    const fullResources = []
    const deliveryStreamNames = await kinesis
      .listDeliveryStreams({ Limit })
      .promise()
    for (const deliveryStreamName of deliveryStreamNames.DeliveryStreamNames) {
      const deliveryStreams = await kinesis
        .describeDeliveryStream({ DeliveryStreamName: deliveryStreamName })
        .promise()
      fullResources.push(deliveryStreams.DeliveryStreamDescription)
    }

    logger.debug(lt.fetchedKinesisFirehose(fullResources.length))

    return fullResources
  } catch (err) {
    errorLog.generateAwsErrorLog({
      functionName: 'kinesisFirehose:describeDeliveryStream',
      err,
    })
  }
  return []
}

const listTagsForDeliveryStream = async (
  kinesis: Firehose,
  deliveryStreamName: string
): Promise<TagMap> => {
  try {
    const tags = await kinesis
      .listTagsForDeliveryStream({
        DeliveryStreamName: deliveryStreamName,
        Limit: LIST_TAGS_LIMIT,
      })
      .promise()

    const awsTags =
      tags.Tags.map(({ Key, Value }) => {
        return {
          Key,
          Value,
        }
      }) || []

    return convertAwsTagsToTagMap(awsTags)
  } catch (err) {
    errorLog.generateAwsErrorLog({
      functionName: 'kinesisFirehose:listTagsForDeliveryStream',
      err,
    })
  }
  return null
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsKinesisFirehose[]
}> => {
  const streamDescriptionsData = []

  for (const region of regions.split(',')) {
    const kinesis = new Firehose({ ...config, region, endpoint })

    const streamDescriptions = await listDeliveryStreamData(kinesis)
    for (const streamDescription of streamDescriptions) {
      const Tags = await listTagsForDeliveryStream(
        kinesis,
        streamDescription.DeliveryStreamName
      )
      const description: RawAwsKinesisFirehose = {
        ...streamDescription,
        region,
        Tags,
      }
      streamDescriptionsData.push(description)
    }
  }
  errorLog.reset()

  return groupBy(streamDescriptionsData, 'region')
}
