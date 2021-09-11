
import { Kinesis } from 'aws-sdk'
import { Shard, StreamDescription } from 'aws-sdk/clients/kinesis'
import CloudGraph from '@cloudgraph/sdk'
import { groupBy } from 'lodash'
import { Credentials } from '../../types'
import awsLoggerText from '../../properties/logger'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph

export interface RawAwsKinesisStream extends StreamDescription {
  region: string
}

/**
 * Kinesis Stream
 */

const listShards = async (kinesis: Kinesis, dataStreamName: string): Promise<Shard[]> => {
  try {
    const fullResources = []

    let shardsData = await kinesis.listShards({StreamName: dataStreamName}).promise()
    fullResources.push(...shardsData.Shards)
    let nextToken = shardsData.NextToken

    while (nextToken) {
      shardsData = await kinesis.listShards({
        StreamName: dataStreamName,
        NextToken: nextToken
      }).promise()
      fullResources.push(...shardsData.Shards)
      nextToken = shardsData.NextToken
    }

    return fullResources
  } catch (err) {
    logger.error(err)
  }
  return [];
}

const listStreamsData = async (kinesis: Kinesis): Promise<StreamDescription[]> => {
  try {
    const fullResources = []
    const dataStreamNames = await kinesis.listStreams().promise()
    for (const dataStreamName of dataStreamNames.StreamNames) {
      const dataStreams = await kinesis.describeStream({StreamName: dataStreamName}).promise()
      const shards = await listShards(kinesis, dataStreamName)
      dataStreams.StreamDescription.Shards = shards

      fullResources.push(dataStreams.StreamDescription)
    }

    logger.debug(lt.fetchedKinesisStream(fullResources.length))
    return fullResources
  } catch (err) {
    logger.error(err)
  }
  return null;
}

export default async ({
  regions,
  credentials,
}: {
  regions: string
  credentials: Credentials
}): Promise<{
  [region: string]: RawAwsKinesisStream[]
}> => {
  const streamDescriptionsData = []

  for (const region of regions.split(',')) {
    const kinesis = new Kinesis({ region, credentials })
    
    const streamDescriptions = await listStreamsData(kinesis)

    streamDescriptionsData.push(
      ...streamDescriptions.map((streamDescription: StreamDescription) => ({
        ...streamDescription,
        region
      }))
    )
  }

  return groupBy(streamDescriptionsData, 'region')
}
