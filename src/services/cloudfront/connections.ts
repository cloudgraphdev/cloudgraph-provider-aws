import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsS3 } from '../s3/data'
import { RawAwsElb } from '../elb/data'
import { RawAwsCloudfront } from './data'
import { elbArn } from '../../utils/generateArns'
import { RawAwsWafV2WebAcl } from '../wafV2WebAcl/data'

/**
 * Cloudfront
 */

export default ({
  service: cloudfront,
  data,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsCloudfront
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    summary: { Id: id, WebACLId },
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

        if (elbs?.data) {
          const allElbs = Object.values(elbs.data).flat()
          const elbsInRegion: RawAwsElb[] = allElbs.filter(
            ({ LoadBalancerName }: RawAwsElb) =>
              elbMatch[0].includes(LoadBalancerName)
          )

          if (!isEmpty(elbsInRegion)) {
            for (const elb of elbsInRegion) {
              const arn = elbArn({
                region: elb.region,
                account: elb.account,
                name: elb.LoadBalancerName,
              })
              connections.push({
                id: arn,
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

  /**
   * Find wafV2WebAcls
   * related to this Cloudfront distribution
   */
  const acls: {
    name: string
    data: { [property: string]: RawAwsWafV2WebAcl[] }
  } = data.find(({ name }) => name === services.wafV2WebAcl)

  if (acls?.data) {
    const allAcls = Object.values(acls.data).flat()
    const dataInRegion: RawAwsWafV2WebAcl[] = allAcls.filter(
      ({ ARN }: RawAwsWafV2WebAcl) => ARN === WebACLId
    )

    if (!isEmpty(dataInRegion)) {
      for (const acl of dataInRegion) {
        connections.push({
          id: acl.Id,
          resourceType: services.wafV2WebAcl,
          relation: 'child',
          field: 'webAcl',
        })
      }
    }
  }

  const cloudfrontResult = {
    [id]: connections,
  }
  return cloudfrontResult
}
