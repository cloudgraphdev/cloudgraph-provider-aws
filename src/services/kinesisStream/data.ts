// import { Config } from 'aws-sdk/lib/config'
import { Kinesis, Shard, StreamDescription } from '@aws-sdk/client-kinesis'
import CloudGraph from '@cloudgraph/sdk'
import { groupBy } from 'lodash'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint, generateAwsErrorLog } from '../../utils'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Kinesis'
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsKinesisStream extends StreamDescription {
  region: string
}

/**
 * Kinesis Stream
 */

const listShards = async (
  kinesis: Kinesis,
  dataStreamName: string
): Promise<Shard[]> => {
  try {
    const fullResources = []

    let shardsData = await kinesis
      .listShards({ StreamName: dataStreamName })
    fullResources.push(...shardsData.Shards)
    let nextToken = shardsData.NextToken

    while (nextToken) {
      shardsData = await kinesis
        .listShards({
          StreamName: dataStreamName,
          NextToken: nextToken,
        })
      fullResources.push(...shardsData.Shards)
      nextToken = shardsData.NextToken
    }

    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'kinesis:listShards', err)
  }
  return []
}

const listStreamsData = async (
  kinesis: Kinesis
): Promise<StreamDescription[]> => {
  try {
    const fullResources = []
    const dataStreamNames = await kinesis.listStreams({})
    for (const dataStreamName of dataStreamNames.StreamNames) {
      const dataStreams = await kinesis
        .describeStream({ StreamName: dataStreamName })
      const shards = await listShards(kinesis, dataStreamName)
      dataStreams.StreamDescription.Shards = shards

      fullResources.push(dataStreams.StreamDescription)
    }

    logger.debug(lt.fetchedKinesisStream(fullResources.length))
    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'kinesis:describeStream', err)
  }
  return null
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: any
}): Promise<{
  [region: string]: RawAwsKinesisStream[]
}> => {
  const streamDescriptionsData = []

  for (const region of regions.split(',')) {
    const kinesis = new Kinesis({ ...config, region, endpoint })

    const streamDescriptions = await listStreamsData(kinesis)

    streamDescriptionsData.push(
      ...streamDescriptions.map((streamDescription: StreamDescription) => ({
        ...streamDescription,
        region,
      }))
    )
  }

  return groupBy(streamDescriptionsData, 'region')
}
