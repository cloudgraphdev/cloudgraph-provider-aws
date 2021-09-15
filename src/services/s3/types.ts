// import { Element } from '../../../../shared/visualServiceDiscovery/types'
// import {
//   BucketAccelerateStatus,
//   CORSRules,
//   GetBucketAclOutput,
//   GetBucketVersioningOutput,
//   GetBucketWebsiteOutput,
//   Grants,
//   LifecycleRules,
//   LoggingEnabled,
//   Object as S3Object,
//   Owner,
//   Payer,
//   Policy,
//   PolicyStatus,
//   PublicAccessBlockConfiguration,
//   ReplicationConfiguration,
//   ServerSideEncryptionConfiguration,
//   TagSet,
// } from 'aws-sdk/clients/s3'
// import { TagMap } from '../../types'

// export interface AdditionalBucketInfo {
//   accelerationConfig: BucketAccelerateStatus | string
//   bucketOwnerData: Owner
//   corsInfo: CORSRules
//   encryptionInfo: ServerSideEncryptionConfiguration | {}
//   grants: Grants
//   lifecycleConfig: LifecycleRules
//   loggingInfo: LoggingEnabled | {}
//   policy: Policy
//   policyStatus: PolicyStatus | {}
//   publicAccessBlockConfig: PublicAccessBlockConfiguration | {}
//   replicationConfig: ReplicationConfiguration | {}
//   reqPaymentConfig: Payer
//   staticWebsiteInfo: GetBucketWebsiteOutput | {}
//   tags: TagMap
//   versioningInfo: GetBucketVersioningOutput | {}
// }
// export interface S3BucketOutput {
//   additionalInfo?: AdditionalBucketInfo
//   contents?: S3Object[]
//   creationDate: Date
//   id: string
//   name: string
//   region: string
// }

// export interface S3DataOutput {
//   [property: string]: S3BucketOutput[]
// }

// export interface S3BucketDisplayData {
//   access: string
//   arn: string
//   blockPublicAcls: string
//   blockPublicPolicy: string
//   bucketOwnerName: string
//   bucketPolicies: Array<{ policy: Policy }>
//   corsConfiguration: string
//   crossRegionReplication: string
//   encrypted: string
//   ignorePublicAcls: string
//   lifecycle: string
//   logging: string
//   mfa: string
//   region: string
//   requesterPays: string
//   restrictPublicBuckets: string
//   size: string
//   staticWebsiteHosting: string
//   tags: TagMap
//   totalNumberOfObjectsInBucket: string
//   transferAcceleration: string
//   versioning: string
// }

// export interface S3Bucket extends Element {
//   displayData: S3BucketDisplayData
// }

// export type getBucketAdditionalInfoPromiseArray = [
//   accelerationConfig: Promise<GetBucketAclOutput | {}>,
//   aclInfo: Promise<GetBucketAclOutput>,
//   corsInfo: Promise<CORSRules>,
//   encryptionInfo: Promise<ServerSideEncryptionConfiguration | {}>,
//   lifecycleConfig: Promise<LifecycleRules>,
//   loggingInfo: Promise<LoggingEnabled | {}>,
//   policy: Promise<Policy>,
//   policyStatus: Promise<PolicyStatus | {}>,
//   publicAccessBlockConfig: Promise<PublicAccessBlockConfiguration | {}>,
//   replicationConfig: Promise<ReplicationConfiguration | {}>,
//   reqPaymentConfig: Promise<Payer>,
//   tags: Promise<TagSet>,
//   versioningInfo: Promise<GetBucketVersioningOutput | {}>,
//   websiteInfo: Promise<GetBucketWebsiteOutput | {}>
// ]
