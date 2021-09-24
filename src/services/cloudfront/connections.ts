import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsS3 } from '../s3/data'
import { RawAwsElb } from '../elb/data'
import { RawAwsCloudfront } from './data'

/**
 * Cloudfront
 */

export default ({
  service: cloudfront,
  data
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsCloudfront
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    summary: { Id: id },
    config: {
      Origins: { Items: originData = [] },
    },
  } = cloudfront

  if (!isEmpty(originData)) {
    originData.map(({ DomainName: domainName = '' }) => {
      const s3Match = domainName.match(/^(.*?)\.s3(?:.*)/)
      const elbMatch = domainName.match(/^(.*?)\.(?:.*?)\.elb.amazonaws.com/)

      if (s3Match) {
        /**
         * Find S3 Buckets
         * related to this Cloudfront distribution
         */
        const bucketName = s3Match[1]
        const s3Buckets: {
          name: string
          data: { [property: string]: RawAwsS3[] }
        } = data.find(({ name }) => name === services.s3)

        if (s3Buckets?.data) {
          const allBuckets = Object.values(s3Buckets.data).flat()
          const s3bucketsInRegion: RawAwsS3[] = allBuckets.filter(
            ({ Name }: RawAwsS3) => Name === bucketName
          )

          if (!isEmpty(s3bucketsInRegion)) {
            for (const bucket of s3bucketsInRegion) {
              connections.push({
                id: bucket.Id,
                resourceType: services.s3,
                relation: 'child',
                field: 's3',
              })
            }
          }
        }
      }

      if (elbMatch) {
        /**
         * Find ELBs
         * related to this Cloudfront distribution
         */
        const elbs: {
          name: string
          data: { [property: string]: RawAwsElb[] }
        } = data.find(({ name }) => name === services.elb)

        if (elbs.data) {
          const allElbs = Object.values(elbs.data).flat()
          const elbsInRegion: RawAwsElb[] = allElbs.filter(
            ({ LoadBalancerName }: RawAwsElb) =>
              elbMatch[0].includes(LoadBalancerName)
          )

          if (!isEmpty(elbsInRegion)) {
            for (const elb of elbsInRegion) {
              connections.push({
                id: elb.LoadBalancerName,
                resourceType: services.elb,
                relation: 'child',
                field: 'elb',
              })
            }
          }
        }
      }
    })
  }

  const cloudfrontResult = {
    [id]: connections,
  }
  return cloudfrontResult
}
