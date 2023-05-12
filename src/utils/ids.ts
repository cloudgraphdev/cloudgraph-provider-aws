import { isEmpty } from 'lodash'
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
  identifier,
}: {
  hostedZoneId: string
  name: string
  type: string
  identifier: string
}): string =>
  !isEmpty(identifier)
    ? `${hostedZoneId}_${name}_${type}_${identifier}`
    : `${hostedZoneId}_${name}_${type}`

export const gets3BucketId = (id: string): string =>
  `${id}-${kebabCase(resources.s3Bucket)}`

export const getIamId = ({
  resourceId,
  resourceName,
  resourceType,
}: {
  resourceId: string
  resourceName: string
  resourceType: string
}): string => `${resourceName}-${resourceId}-${kebabCase(resourceType)}`

export const getIamGlobalId = ({
  accountId,
  region,
  resourceType,
}: {
  accountId: string
  region: string
  resourceType: string
}): string =>
  `iam:region:${region}-account:${accountId}-${kebabCase(resourceType)}`
