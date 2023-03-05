import CloudGraph from '@cloudgraph/sdk'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import AWS from 'aws-sdk'

import { AWSError } from 'aws-sdk/lib/error'
import { Config } from 'aws-sdk/lib/config'
import S3, {
  AccountId,
  Bucket,
  BucketAccelerateStatus,
  BucketLocationConstraint,
  BucketName,
  CORSRules,
  GetBucketAccelerateConfigurationOutput,
  GetBucketAclOutput,
  GetBucketCorsOutput,
  GetBucketEncryptionOutput,
  GetBucketLifecycleConfigurationOutput,
  GetBucketLocationOutput,
  GetBucketLoggingOutput,
  GetBucketPolicyOutput,
  GetBucketPolicyStatusOutput,
  GetBucketReplicationOutput,
  GetBucketRequestPaymentOutput,
  GetBucketTaggingOutput,
  GetBucketVersioningOutput,
  GetBucketWebsiteOutput,
  GetPublicAccessBlockOutput,
  Grants,
  LifecycleRules,
  ListBucketsOutput,
  ListObjectsV2Output,
  LoggingEnabled,
  NotificationConfiguration,
  Object as S3Object,
  Owner,
  Payer,
  Policy,
  PolicyStatus,
  PublicAccessBlockConfiguration,
  ReplicationConfiguration,
  ServerSideEncryptionConfiguration,
  TagSet,
} from 'aws-sdk/clients/s3'

import { TagMap } from '../../types'
import t from '../../properties/translations'
import awsLoggerText from '../../properties/logger'
import { initTestEndpoint } from '../../utils'
import { gets3BucketId } from '../../utils/ids'
import AwsErrorLog from '../../utils/errorLog'
import { convertAwsTagsToTagMap } from '../../utils/format'

const lt = { ...awsLoggerText }
const { logger } = CloudGraph
const serviceName = 'S3'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

// S3 Properties
export const awsBucketItemsLimit = 1000
export const publicBucketGrant =
  'http://acs.amazonaws.com/groups/global/AllUsers'

const getAccountPublicAccessBlock = async ({
  region,
  accountId,
}: {
  region: string,
  accountId: AccountId,
}) =>
  new Promise<PublicAccessBlockConfiguration | any>(resolve => {
    const s3Control = new AWS.S3Control({
      region: region,
    })
    s3Control.getPublicAccessBlock(
      {
        AccountId: accountId,
      },
      (err: AWSError, data: GetPublicAccessBlockOutput) => {
        if (!isEmpty(data)) {
          resolve(data.PublicAccessBlockConfiguration)
        }
        resolve({})
      }
    )
  })

const getBucketAcl = async (s3: S3, name: BucketName) =>
  new Promise<GetBucketAclOutput>(resolve => {
    s3.getBucketAcl(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketAclOutput) => {
        if (!isEmpty(data)) {
          resolve(data)
        }

        resolve({ Owner: {}, Grants: [] })
      }
    )
  })

const getBucketAcceleration = async (s3: S3, name: BucketName) =>
  new Promise<BucketAccelerateStatus | string>(resolve => {
    s3.getBucketAccelerateConfiguration(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketAccelerateConfigurationOutput) => {
        if (!isEmpty(data)) {
          resolve(data.Status)
        }

        resolve(t.disabled)
      }
    )
  })

const getBucketCors = async (s3: S3, name: BucketName) =>
  new Promise<CORSRules | []>(resolve => {
    s3.getBucketCors(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketCorsOutput) => {
        if (!isEmpty(data)) {
          resolve(data.CORSRules)
        }

        resolve([])
      }
    )
  })

const getBucketEncryption = async (s3: S3, name: BucketName) =>
  new Promise<ServerSideEncryptionConfiguration | any>(resolve => {
    s3.getBucketEncryption(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketEncryptionOutput) => {
        if (!isEmpty(data)) {
          resolve(data.ServerSideEncryptionConfiguration)
        }

        resolve({})
      }
    )
  })

const getBucketLifecycleConfiguration = async (s3: S3, name: BucketName) =>
  new Promise<LifecycleRules | []>(resolve => {
    s3.getBucketLifecycleConfiguration(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketLifecycleConfigurationOutput) => {
        if (!isEmpty(data)) {
          resolve(data.Rules)
        }

        resolve([])
      }
    )
  })

const checkIfBucketLocationMatchesCrawlRegion = async (
  s3: S3,
  name: BucketName,
  region: string
) =>
  new Promise<boolean>(resolve => {
    s3.getBucketLocation(
      { Bucket: name },
      (err: AWSError, data: GetBucketLocationOutput) => {
        if (!isEmpty(data)) {
          const foundRegion =
            data.LocationConstraint !== ''
              ? data.LocationConstraint
              : 'us-east-1'
          resolve(foundRegion === region)
        }

        resolve(false)
      }
    )
  })

const getBucketLogging = async (s3: S3, name: BucketName) =>
  new Promise<LoggingEnabled | any>(resolve => {
    s3.getBucketLogging(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketLoggingOutput) => {
        if (!isEmpty(data)) {
          resolve(data.LoggingEnabled)
        }

        resolve({})
      }
    )
  })

// GetBucketPolicy
const getBucketPolicy = async (s3: S3, name: BucketName) =>
  new Promise<Policy>(resolve => {
    s3.getBucketPolicy(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketPolicyOutput) => {
        if (!isEmpty(data)) {
          resolve(data.Policy)
        }
        resolve('')
      }
    )
  })

const getBucketPolicyStatus = async (s3: S3, name: BucketName) =>
  new Promise<PolicyStatus | any>(resolve => {
    s3.getBucketPolicyStatus(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketPolicyStatusOutput) => {
        if (!isEmpty(data)) {
          resolve(data.PolicyStatus)
        }
        resolve({})
      }
    )
  })

const getBucketPublicAccessBlock = async (s3: S3, name: BucketName) =>
  new Promise<PublicAccessBlockConfiguration | any>(resolve => {
    s3.getPublicAccessBlock(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetPublicAccessBlockOutput) => {
        if (!isEmpty(data)) {
          resolve(data.PublicAccessBlockConfiguration)
        }
        resolve({})
      }
    )
  })

const getBucketReplication = async (s3: S3, name: BucketName) =>
  new Promise<ReplicationConfiguration | any>(resolve => {
    s3.getBucketReplication(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketReplicationOutput) => {
        if (!isEmpty(data)) {
          resolve(data.ReplicationConfiguration)
        }

        resolve({})
      }
    )
  })

const getBucketRequestPayment = async (s3: S3, name: BucketName) =>
  new Promise<Payer | ''>(resolve => {
    s3.getBucketRequestPayment(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketRequestPaymentOutput) => {
        if (!isEmpty(data)) {
          resolve(data.Payer)
        }
        resolve('')
      }
    )
  })

const getBucketVersioning = async (s3: S3, name: BucketName) =>
  new Promise<GetBucketVersioningOutput | any>(resolve => {
    s3.getBucketVersioning(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketVersioningOutput) => {
        if (!isEmpty(data)) {
          resolve(data)
        }
        resolve({})
      }
    )
  })

const getBucketTagging = async (s3: S3, name: BucketName) =>
  new Promise<TagSet | []>(resolve => {
    s3.getBucketTagging(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketTaggingOutput) => {
        if (!isEmpty(data)) {
          resolve(data.TagSet)
        }
        resolve([])
      }
    )
  })

const getBucketWebsite = async (s3: S3, name: BucketName) =>
  new Promise<GetBucketWebsiteOutput | any>(resolve => {
    s3.getBucketWebsite(
      {
        Bucket: name,
      },
      (err: AWSError, data: GetBucketWebsiteOutput) => {
        if (!isEmpty(data)) {
          resolve(data)
        }

        resolve({})
      }
    )
  })

const getBucketNotificationConfiguration = async (s3: S3, name: BucketName) =>
  new Promise<NotificationConfiguration | any>(resolve => {
    s3.getBucketNotificationConfiguration(
      {
        Bucket: name,
      },
      (err: AWSError, data: NotificationConfiguration) => {
        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 's3:getBucketNotificationConfiguration',
            err,
          })
        }

        if (!isEmpty(data)) {
          resolve(data)
        }

        resolve({})
      }
    )
  })

const getBucketAdditionalInfo = async (s3: S3, name: BucketName) =>
  new Promise<any>(async resolve => {
    const promises = [
      getBucketAcceleration(s3, name),
      getBucketAcl(s3, name),
      getBucketCors(s3, name),
      getBucketEncryption(s3, name),
      getBucketLifecycleConfiguration(s3, name),
      getBucketLogging(s3, name),
      getBucketPolicy(s3, name),
      getBucketPolicyStatus(s3, name),
      getBucketPublicAccessBlock(s3, name),
      getBucketReplication(s3, name),
      getBucketRequestPayment(s3, name),
      getBucketTagging(s3, name),
      getBucketVersioning(s3, name),
      getBucketWebsite(s3, name),
      getBucketNotificationConfiguration(s3, name),
    ]

    const [
      AccelerationConfig,
      AclInfo,
      CorsInfo,
      EncryptionInfo,
      LifecycleConfig,
      LoggingInfo,
      Policy,
      PolicyStatus,
      PublicAccessBlockConfig,
      ReplicationConfig,
      ReqPaymentConfig,
      Tags,
      VersioningInfo,
      WebsiteInfo,
      NotificationConfig,
    ] = (await Promise.allSettled(promises)).map(
      /** We force the PromiseFulfilledResult interface
       *  because all promises that we input to Promise.allSettled
       *  are always resolved, that way we suppress the compiler error complaining
       *  that Promise.allSettled returns an Array<PromiseFulfilledResult | PromiseRejectedResult>
       *  and that the value property doesn't exist for the PromiseRejectedResult interface
       * */
      i => (i as PromiseFulfilledResult<any>).value
    )

    const { Owner: BucketOwnerData, Grants } = AclInfo

    resolve({
      AccelerationConfig,
      AclInfo,
      BucketOwnerData,
      CorsInfo,
      Grants,
      EncryptionInfo,
      LifecycleConfig,
      LoggingInfo,
      Policy,
      PolicyStatus,
      PublicAccessBlockConfig,
      ReplicationConfig,
      ReqPaymentConfig,
      Tags: convertAwsTagsToTagMap(Tags),
      VersioningInfo,
      StaticWebsiteInfo: WebsiteInfo,
      NotificationConfiguration: NotificationConfig,
    })
  })

const listBucketsForRegion = async (
  s3: S3,
  resolveRegion: () => void
): Promise<{ buckets: Bucket[]; ownerId: Owner }> =>
  new Promise<{ buckets: Bucket[]; ownerId: Owner }>(resolve => {
    s3.listBuckets((err: AWSError, data: ListBucketsOutput) => {
      /**
       * No Data for the region
       */
      if (isEmpty(data)) {
        return resolveRegion()
      }

      if (err) {
        errorLog.generateAwsErrorLog({
          functionName: 's3:listBuckets',
          err,
        })
      }

      const { Buckets: buckets = [], Owner: ownerId } = data

      /**
       * No Buckets Found
       */
      if (isEmpty(buckets)) {
        return resolveRegion()
      }

      resolve({ buckets, ownerId })
    })
  })

const listBucketObjects = async (
  s3: S3,
  name: BucketName
): Promise<S3Object[]> =>
  new Promise<S3Object[]>(resolve => {
    const contents: S3Object[] = []
    /**
     * S3 Buckets can get quite large, so we limit the total number
     * Of objects returned per bucket to 1000
     */
    const opts: any = {
      Bucket: name,
      MaxKeys: awsBucketItemsLimit,
    }
    const listAllObjects = (token?: string): void => {
      if (token) {
        opts.ContinuationToken = token
      }

      s3.listObjectsV2(opts, (err: AWSError, data: ListObjectsV2Output) => {
        const { Contents = [], IsTruncated, NextContinuationToken } = data || {}

        if (err) {
          errorLog.generateAwsErrorLog({
            functionName: 's3:listObjectsV2',
            err,
          })
        }

        contents.push(...Contents)

        if (IsTruncated && contents.length < awsBucketItemsLimit) {
          logger.debug(lt.foundAnotherThousand)
          listAllObjects(NextContinuationToken)
        } else {
          resolve(contents)
        }
      })
    }
    listAllObjects()
  })

/**
 * S3
 */
export interface RawAwsS3 {
  AdditionalInfo?: {
    AccelerationConfig: BucketAccelerateStatus
    BucketOwnerData: Owner
    CorsInfo: CORSRules
    EncryptionInfo?: ServerSideEncryptionConfiguration
    Grants: Grants
    LifecycleConfig: LifecycleRules
    LoggingInfo?: LoggingEnabled
    Policy: Policy
    PolicyStatus?: PolicyStatus
    PublicAccessBlockConfig?: PublicAccessBlockConfiguration
    ReplicationConfig?: ReplicationConfiguration
    ReqPaymentConfig: Payer
    StaticWebsiteInfo?: GetBucketWebsiteOutput
    VersioningInfo?: GetBucketVersioningOutput
    NotificationConfiguration?: NotificationConfiguration
  }
  Tags: TagMap
  Contents?: S3Object[]
  CreationDate: Date
  Id: string
  Name: string
  region: string
  AccountLevelBlockPublicAcls?: boolean
  AccountLevelIgnorePublicAcls?: boolean
  AccountLevelBlockPublicPolicy?: boolean
  AccountLevelRestrictPublicBuckets?: boolean
}

export default async ({
  regions,
  config,
  account,
}: {
  regions: string
  config: Config
  account: string
}): Promise<{
  [region: string]: RawAwsS3[]
}> =>
  new Promise(async resolve => {
    const bucketData: RawAwsS3[] = []
    const regionPromises = []
    const bucketObjectListPromises = []
    const additionalInfoPromises = []

    regions.split(',').map((region: BucketLocationConstraint) => {
      // TODO: temp implementation to add account level public access block to bucket level
      // need to find a better place/way to put the data
      const regionPromise = new Promise<void>(async resolveRegion => {
        const {
          BlockPublicAcls,
          IgnorePublicAcls,
          BlockPublicPolicy,
          RestrictPublicBuckets,
        } = await getAccountPublicAccessBlock({
          region,
          accountId: account,
        });

        const s3 = new S3({
          ...config,
          region,
          endpoint,
          s3ForcePathStyle: true,
        })
        const { buckets } = await listBucketsForRegion(s3, resolveRegion)
        if (!isEmpty(buckets)) {
          // Checks the location restraint (region) for each bucket
          const areBucketsInSameRegionCheckPromise = await Promise.all(
            buckets.map((bucket: Bucket) =>
              checkIfBucketLocationMatchesCrawlRegion(s3, bucket.Name, region)
            )
          )
          buckets.map(async (bucket: Bucket, idx: number) => {
            const isBucketInSameRegion = areBucketsInSameRegionCheckPromise[idx]
            if (isBucketInSameRegion) {
              bucketData.push({
                Id: gets3BucketId(bucket.Name),
                Name: bucket.Name,
                region,
                CreationDate: bucket.CreationDate,
                Tags: {},
                AccountLevelBlockPublicAcls: BlockPublicAcls,
                AccountLevelIgnorePublicAcls: IgnorePublicAcls,
                AccountLevelBlockPublicPolicy: BlockPublicPolicy,
                AccountLevelRestrictPublicBuckets: RestrictPublicBuckets,
              })
            }
          })
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })
    await Promise.all(regionPromises)
    logger.debug(lt.fetchedS3Buckets(bucketData.length))

    bucketData.map(({ Name, region }, idx: number) => {
      const bucketObjectListPromise = new Promise<void>(async resolveBucket => {
        const s3 = new S3({
          ...config,
          region,
          endpoint,
          s3ForcePathStyle: true,
        })
        logger.debug(lt.gettingBucketBasicInfo(Name))
        const bucketObjectList: S3Object[] = await listBucketObjects(s3, Name)

        bucketData[idx].Contents = []
        if (!isEmpty(bucketObjectList)) {
          bucketData[idx].Contents = bucketObjectList
        }
        resolveBucket()
      })
      bucketObjectListPromises.push(bucketObjectListPromise)
    })
    await Promise.all(bucketObjectListPromises)

    bucketData.map(({ Name, region }, idx: number) => {
      const s3 = new S3({
        ...config,
        region,
        endpoint,
        s3ForcePathStyle: true,
      })
      const additionalInfoPromise = new Promise<void>(
        async resolvePublicStatus => {
          logger.debug(lt.gettingBucketAdditionalInfo(Name))
          try {
            const bucketAdditionalData = await getBucketAdditionalInfo(s3, Name)

            if (!isEmpty(bucketAdditionalData)) {
              const { Tags, ...additionalInfo } = bucketAdditionalData
              bucketData[idx].AdditionalInfo = {
                ...bucketData[idx].AdditionalInfo,
                ...additionalInfo,
              }
              bucketData[idx].Tags = Tags
            }
          } catch (error) {
            logger.debug(lt.gettingBucketAdditionalInfoError(Name))
          }

          resolvePublicStatus()
        }
      )
      additionalInfoPromises.push(additionalInfoPromise)
    })
    await Promise.all(additionalInfoPromises)
    errorLog.reset()

    resolve(groupBy(bucketData, 'region'))
  })
