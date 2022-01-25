import { Config } from 'aws-sdk/lib/config'
import Kinesis, { Shard, StreamDescription } from 'aws-sdk/clients/kinesis'
import CloudGraph from '@cloudgraph/sdk'
import { groupBy } from 'lodash'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'Kinesis'
const errorLog = new AwsErrorLog(serviceName)
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
      .promise()
    fullResources.push(...shardsData.Shards)
    let nextToken = shardsData.NextToken

    while (nextToken) {
      shardsData = await kinesis
        .listShards({
          StreamName: dataStreamName,
          NextToken: nextToken,
        })
        .promise()
      fullResources.push(...shardsData.Shards)
      nextToken = shardsData.NextToken
    }

    return fullResources
  } catch (err) {
    errorLog.generateAwsErrorLog({
      functionName: 'kinesis:listShards',
      err,
    })
  }
  return []
}

const listStreamsData = async (
  kinesis: Kinesis
): Promise<StreamDescription[]> => {
  try {
    const fullResources = []
    const dataStreamNames = await kinesis.listStreams().promise()
    for (const dataStreamName of dataStreamNames.StreamNames) {
      const dataStreams = await kinesis
        .describeStream({ StreamName: dataStreamName })
        .promise()
      const shards = await listShards(kinesis, dataStreamName)
      dataStreams.StreamDescription.Shards = shards

      fullResources.push(dataStreams.StreamDescription)
    }

    logger.debug(lt.fetchedKinesisStream(fullResources.length))
    return fullResources
  } catch (err) {
    errorLog.generateAwsErrorLog({
      functionName: 'kinesis:describeStream',
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
  [region: string]: RawAwsKinesisStream[]
}> => {
  const streamDescriptionsData = []

  for (const region of regions.split(',')) {
    const kinesis = new Kinesis({ ...config, region, endpoint })

    const streamDescriptions = (await listStreamsData(kinesis)) ?? []

    streamDescriptionsData.push(
      ...streamDescriptions.map((streamDescription: StreamDescription) => ({
        ...streamDescription,
        region,
      }))
    )
  }
  errorLog.reset()

  return groupBy(streamDescriptionsData, 'region')
}
