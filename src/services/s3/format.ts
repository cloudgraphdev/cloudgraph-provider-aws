import cuid from 'cuid'
import isEmpty from 'lodash/isEmpty'

import {
  GetBucketVersioningOutput,
  Policy,
  PolicyStatus,
  PublicAccessBlockConfiguration,
} from 'aws-sdk/clients/s3'

import { AwsS3 } from '../../types/generated'
import t from '../../properties/translations'
import { formatTagsFromMap } from '../../utils/format'
import { s3BucketArn } from '../../utils/generateArns'
import { awsBucketItemsLimit, publicBucketGrant, RawAwsS3 } from './data'

/**
 * S3
 */

export default ({
  service: rawData,
  region,
}: {
  service: RawAwsS3
  account: string
  region: string
}): AwsS3 => {
  const {
    Id: id,
    Name: name,
    Contents: bucketContents = [],
    Tags: tags = {},
    AdditionalInfo: {
      AccelerationConfig: accelerationStatus,
      BucketOwnerData: { DisplayName: bucketOwnerName } = {},
      CorsInfo: corsInfo,
      EncryptionInfo: encryptionInfo,
      Grants: grants,
      LifecycleConfig: lifecycleConfig,
      LoggingInfo: loggingInfo,
      Policy: policy,
      PolicyStatus: policyStatus,
      PublicAccessBlockConfig: publicAccessBlockConfig,
      ReplicationConfig: replicationConfig,
      ReqPaymentConfig: reqPaymentConfig,
      StaticWebsiteInfo: staticWebsiteInfo,
      VersioningInfo: versioningInfo,
    } = {},
  } = rawData

  let size = '0 Kb'
  const total = bucketContents.length

  const greaterThanTotalLimit = total === awsBucketItemsLimit

  if (!isEmpty(bucketContents)) {
    size = `${Math.round(
      bucketContents.reduce((a, b) => a + b.Size, 0) * 0.001
    )} ${t.kb} ${
      greaterThanTotalLimit ? t.bucketSizeDisclaimer(awsBucketItemsLimit) : ''
    }`
  }

  const bucketPolicies: { id: string; policy: Policy }[] = []

  if (!isEmpty(policy)) {
    bucketPolicies.push({ id: cuid(), policy })
  }

  let publicAccessBlockData = {
    blockPublicAcls: t.no,
    ignorePublicAcls: t.no,
    blockPublicPolicy: t.no,
    restrictPublicBuckets: t.no,
  }

  if (!isEmpty(publicAccessBlockConfig)) {
    const {
      BlockPublicAcls,
      IgnorePublicAcls,
      BlockPublicPolicy,
      RestrictPublicBuckets,
    }: PublicAccessBlockConfiguration = publicAccessBlockConfig

    publicAccessBlockData = {
      blockPublicAcls: BlockPublicAcls ? t.yes : t.no,
      ignorePublicAcls: IgnorePublicAcls ? t.yes : t.no,
      blockPublicPolicy: BlockPublicPolicy ? t.yes : t.no,
      restrictPublicBuckets: RestrictPublicBuckets ? t.yes : t.no,
    }
  }

  let versioningAdditions = {
    mfa: t.disabled,
    versioning: t.disabled,
  }

  if (!isEmpty(versioningInfo)) {
    const {
      Status = t.disabled,
      MFADelete = t.disabled,
    }: GetBucketVersioningOutput = versioningInfo
    versioningAdditions = {
      mfa: MFADelete,
      versioning: Status,
    }
  }

  const websiteAdditions = { staticWebsiteHosting: t.disabled }

  if (!isEmpty(staticWebsiteInfo)) {
    websiteAdditions.staticWebsiteHosting = t.enabled
  }

  const loggingAdditions = { logging: t.disabled }

  if (!isEmpty(loggingInfo)) {
    loggingAdditions.logging = t.enabled
  }

  const corsAdditions = { corsConfiguration: t.no }

  if (!isEmpty(corsInfo)) {
    corsAdditions.corsConfiguration = t.yes
  }

  const encryptionAdditions = { encrypted: t.no }

  if (!isEmpty(encryptionInfo)) {
    encryptionAdditions.encrypted = t.yes
  }

  const replicationAdditions = { crossRegionReplication: t.disabled }

  if (!isEmpty(replicationConfig)) {
    replicationAdditions.crossRegionReplication = t.enabled
  }

  const lifecycleAdditions = { lifecycle: t.disabled }

  if (!isEmpty(lifecycleConfig)) {
    lifecycleAdditions.lifecycle = t.enabled
  }

  let access = t.objectsCanBePublic

  if (!isEmpty(policyStatus)) {
    const { IsPublic }: PolicyStatus = policyStatus
    access = IsPublic ? t.public : t.private
  } else if (!isEmpty(grants)) {
    grants.map(({ Grantee: { URI } }) => {
      if (URI === publicBucketGrant) {
        access = t.public
      }
    })
  }

  // // Format S3 Tags
  const s3Tags = formatTagsFromMap(tags)

  const s3 = {
    ...corsAdditions,
    ...encryptionAdditions,
    ...lifecycleAdditions,
    ...loggingAdditions,
    ...publicAccessBlockData,
    ...replicationAdditions,
    ...versioningAdditions,
    ...websiteAdditions,
    id,
    access,
    arn: s3BucketArn({ name }),
    bucketOwnerName,
    bucketPolicies,
    region,
    requesterPays: reqPaymentConfig === 'Requester' ? t.enabled : t.disabled,
    size,
    tags: s3Tags,
    totalNumberOfObjectsInBucket: greaterThanTotalLimit
      ? `${awsBucketItemsLimit}+`
      : `${total}`,
    transferAcceleration: accelerationStatus,
  }
  return s3
}
