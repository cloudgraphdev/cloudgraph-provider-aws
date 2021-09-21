import kebabCase from 'lodash/kebabCase'
import last from 'lodash/last'
import resources from '../enums/resources'

// i.e. "Id": "/hostedzone/Z0340076V9U7PUPIWZTE"
export const getHostedZoneId = (hostedZoneId: string): string =>
  last(hostedZoneId.split('/'))

export const getRecordId = ({
  hostedZoneId,
  name,
  type,
}: {
  hostedZoneId: string
  name: string
  type: string
}): string =>
  `${hostedZoneId}_${name}-${type}-${kebabCase(resources.route53ZRecord)}`

export const gets3BucketId = (id: string): string =>
  `${id}-${kebabCase(resources.s3Bucket)}`
