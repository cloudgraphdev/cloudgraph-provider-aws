import cuid from 'cuid'
import isEmpty from 'lodash/isEmpty'

import {
  GetBucketVersioningOutput,
  NotificationConfiguration,
  Policy,
  PolicyStatus,
  PublicAccessBlockConfiguration,
} from 'aws-sdk/clients/s3'

import { AwsS3 } from '../../types/generated'
import t from '../../properties/translations'
import { formatTagsFromMap, formatIamJsonPolicy } from '../../utils/format'
import { s3BucketArn } from '../../utils/generateArns'
import { awsBucketItemsLimit, publicBucketGrant, RawAwsS3 } from './data'

/**
 * S3
 */

export default ({
  service: rawData,
  account,
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
      BucketOwnerData: { DisplayName: bucketOwnerName },
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
      NotificationConfiguration: notificationConfiguration,
    } = {
      AccelerationConfig: '',
      BucketOwnerData: { DisplayName: '' },
      CorsInfo: [],
      EncryptionInfo: {},
      Grants: [],
      LifecycleConfig: [],
      LoggingInfo: {},
      Policy: '',
      PolicyStatus: {},
      PublicAccessBlockConfig: {},
      ReplicationConfig: {},
      ReqPaymentConfig: '',
      StaticWebsiteInfo: {},
      VersioningInfo: {},
      NotificationConfiguration: {},
    },
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
    grants.map(({ Grantee }) => {
      if (Grantee?.URI === publicBucketGrant) {
        access = t.public
      }
    })
  }

  let notificationConfigurationData = {
    topicConfigurations: [],
    queueConfigurations: [],
    lambdaFunctionConfigurations: [],
  }

  if (!isEmpty(notificationConfiguration)) {
    const {
      TopicConfigurations: topicConfigurations = [],
      QueueConfigurations: queueConfigurations = [],
      LambdaFunctionConfigurations: lambdaFunctionConfigurations = [],
    }: NotificationConfiguration = notificationConfiguration
    notificationConfigurationData = {
      topicConfigurations: topicConfigurations?.map(tc => ({
        id: tc.Id || cuid(),
        topicArn: tc.TopicArn,
        events: tc.Events || [],
        filterRules: tc.Filter?.Key?.FilterRules?.map(r => ({
          id: cuid(),
          name: r.Name,
          value: r.Value,  
        })) || [],
      })) || [],
      queueConfigurations: queueConfigurations?.map(qc => ({
        id: qc.Id || cuid(),
        queueArn: qc.QueueArn,
        events: qc.Events || [],
        filterRules: qc.Filter?.Key?.FilterRules?.map(r => ({
          id: cuid(),
          name: r.Name,
          value: r.Value,  
        })) || [],
      })) || [],
      lambdaFunctionConfigurations: lambdaFunctionConfigurations?.map(lc => ({
        id: lc.Id || cuid(),
        lambdaFunctionArn: lc.LambdaFunctionArn,
        events: lc.Events || [],
        filterRules: lc.Filter?.Key?.FilterRules?.map(r => ({
          id: cuid(),
          name: r.Name,
          value: r.Value,  
        })) || [],
      })) || [],
    }
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
    accountId: account,
    arn: s3BucketArn({ name }),
    bucketOwnerName,
    policy: formatIamJsonPolicy(policy),
    rawPolicy: policy,
    region,
    requesterPays: reqPaymentConfig === 'Requester' ? t.enabled : t.disabled,
    size,
    tags: s3Tags,
    totalNumberOfObjectsInBucket: greaterThanTotalLimit
      ? `${awsBucketItemsLimit}+`
      : `${total}`,
    transferAcceleration: accelerationStatus,
    notificationConfiguration: notificationConfigurationData,
    aclGrants: grants?.map(g => ({
      id: cuid(),
      granteeType: g.Grantee?.Type,
      granteeUri: g.Grantee?.URI,
      permission: g.Permission,
    })) || [],
  }
  return s3
}
