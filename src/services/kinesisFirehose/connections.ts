import {
  DeliveryStreamDescription,
  DestinationDescription,
} from 'aws-sdk/clients/firehose'
import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { TagMap } from '../../types'
import services from '../../enums/services'
import { RawAwsS3 } from '../s3/data'
import { s3BucketArn } from '../../utils/generateArns'
import { globalRegionName } from '../../enums/regions'
import { RawAwsIamRole } from '../iamRole/data'

/**
 * Kinesis Firehose
 */

export default ({
  service: firehose,
  data,
  region,
}: {
  data: { name: string; data: { [property: string]: any[] } }[]
  service: DeliveryStreamDescription & {
    region: string
    Tags?: TagMap
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    DeliveryStreamARN: id,
    Destinations: destinations = [],
    Source = {},
  } = firehose

  const kinesisStreamSourceARN =
    firehose.Source?.KinesisStreamSourceDescription?.KinesisStreamARN

  /**
   * Find Kinesis Stream
   * related to this Kinesis Firehose
   */

  if (kinesisStreamSourceARN) {
    const kinesisStreams = data.find(
      ({ name }) => name === services.kinesisStream
    )

    if (kinesisStreams?.data?.[region]) {
      const kinesisStreamInRegion = kinesisStreams.data[region].filter(
        kinesisStream => kinesisStream.StreamARN === kinesisStreamSourceARN
      )

      if (!isEmpty(kinesisStreamInRegion)) {
        for (const kinesisStream of kinesisStreamInRegion) {
          const kinesisStreamId = kinesisStream.StreamARN

          connections.push({
            id: kinesisStreamId,
            resourceType: services.kinesisStream,
            relation: 'child',
            field: 'kinesisStream',
          })
        }
      }
    }
  }

  if (!isEmpty(destinations)) {
    destinations.map((destination: DestinationDescription) => {
      const { ExtendedS3DestinationDescription, S3DestinationDescription } =
        destination
      const s3DestinationDescription =
        ExtendedS3DestinationDescription || S3DestinationDescription
      if (s3DestinationDescription) {
        const s3Buckets = data.find(({ name }) => name === services.s3)

        if (s3Buckets?.data?.[region]) {
          const s3BucketsInRegion: RawAwsS3[] = s3Buckets.data[region].filter(
            ({ Name }) =>
              s3BucketArn({ name: Name }) === s3DestinationDescription.BucketARN
          )

          if (!isEmpty(s3BucketsInRegion)) {
            for (const s3Bucket of s3BucketsInRegion) {
              connections.push({
                id: s3Bucket.Id,
                resourceType: services.s3,
                relation: 'child',
                field: 's3',
              })
            }
          }
        }
      }
      // TODO Redshift, Elasticsearch, Splunk, HttpEndpoint
    })
  }

  /**
   * Find related IAM Roles
   */
  const roles: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.iamRole)
  if (
    roles?.data?.[globalRegionName] &&
    Source?.KinesisStreamSourceDescription?.RoleARN
  ) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      role => role.Arn === Source.KinesisStreamSourceDescription.RoleARN
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { Arn: roleId } = instance

        connections.push({
          id: roleId,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRole',
        })
      }
    }
  }

  const kinesisFirehoseResult = {
    [id]: connections,
  }
  return kinesisFirehoseResult
}
