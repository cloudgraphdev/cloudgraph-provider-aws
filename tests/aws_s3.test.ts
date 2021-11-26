import CloudGraph from '@cloudgraph/sdk'
import S3Service from '../src/services/s3'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

describe('S3 Service Test: ', () => {
  let getDataResult
  let formatResult
  let sourceBucket
  initTestConfig()
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        getDataResult = {}
        formatResult = {}
        sourceBucket = {}
        try {
          const s3Service = new S3Service({
            logger: CloudGraph.logger,
          })

          // Get Route Table data
          const getDataResult = await s3Service.getData({
            credentials,
            regions: region,
          })

          const bucket = getDataResult[region].find(({ Name }) =>
            Name.includes('source')
          )
          sourceBucket = bucket

          // Format s3 data
          formatResult = s3Service.format({
            service: sourceBucket,
            region,
            account,
          })
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
        }
        resolve()
      })
  )

  describe('getData', () => {
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', () => {
      expect(sourceBucket).toEqual(
        expect.objectContaining({
          Id: expect.any(String),
          Name: expect.any(String),
          CreationDate: expect.any(Date),

          AdditionalInfo: expect.objectContaining({
            AccelerationConfig: expect.any(String),
            VersioningInfo: expect.objectContaining({
              Status: expect.any(String),
            }),
            BucketOwnerData: expect.objectContaining({
              DisplayName: expect.any(String),
              ID: expect.any(String),
            }),
            Policy: expect.any(String),
            CorsInfo: expect.arrayContaining([
              expect.objectContaining({
                AllowedHeaders: expect.arrayContaining<String>([]),
                AllowedMethods: expect.arrayContaining<String>([]),
                AllowedOrigins: expect.arrayContaining<String>([]),
                ExposeHeaders: expect.arrayContaining<String>([]),
                MaxAgeSeconds: expect.any(Number),
              }),
            ]),
            AclInfo: {
              Grants: expect.arrayContaining([
                expect.objectContaining({
                  Grantee: expect.objectContaining({
                    Type: expect.any(String),
                  }),
                  Permission: expect.any(String),
                }),
              ]),
              Owner: expect.objectContaining({
                DisplayName: expect.any(String),
                ID: expect.any(String),
              }),
            },
            EncryptionInfo: expect.objectContaining({
              Rules: expect.arrayContaining([
                expect.objectContaining({
                  ApplyServerSideEncryptionByDefault: expect.objectContaining({
                    SSEAlgorithm: expect.any(String),
                    KMSMasterKeyID: expect.any(String),
                  }),
                  BucketKeyEnabled: expect.any(Boolean),
                }),
              ]),
            }),
            ReplicationConfig: expect.objectContaining({
              Role: expect.any(String),
              Rules: expect.arrayContaining([
                expect.objectContaining({
                  ID: expect.any(String),
                  Prefix: expect.any(String),
                  Status: expect.any(String),
                  Destination: expect.objectContaining({
                    Bucket: expect.any(String),
                    StorageClass: expect.any(String),
                  }),
                }),
              ]),
            }),
          }),
          region: expect.any(String),
        })
      )
    })
  })

  describe('format', () => {
    test('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          arn: expect.any(String),
          access: expect.any(String),
          blockPublicAcls: expect.any(String),
          blockPublicPolicy: expect.any(String),
          corsConfiguration: expect.any(String),
          crossRegionReplication: expect.any(String),
          encrypted: expect.any(String),
          ignorePublicAcls: expect.any(String),
          lifecycle: expect.any(String),
          logging: expect.any(String),
          mfa: expect.any(String),
          region: expect.any(String),
          requesterPays: expect.any(String),
          restrictPublicBuckets: expect.any(String),
          size: expect.any(String),
          staticWebsiteHosting: expect.any(String),
          totalNumberOfObjectsInBucket: expect.any(String),
          transferAcceleration: expect.any(String),
          versioning: expect.any(String),
          bucketPolicies: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              policy: expect.objectContaining({
                id: expect.any(String),
                statement: expect.arrayContaining([
                  expect.objectContaining({
                    action: expect.arrayContaining([expect.any(String)]),
                    condition: expect.arrayContaining([
                      expect.objectContaining({
                        key: expect.any(String),
                        operator: expect.any(String),
                        value: expect.arrayContaining([expect.any(String)]),
                      }),
                    ]),
                    effect: expect.any(String),
                    resource: expect.arrayContaining([expect.any(String)]),
                  }),
                ]),
                version: expect.any(String),
              }),
            }),
          ]),
          tags: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              key: expect.any(String),
              value: expect.any(String),
            }),
          ]),
        })
      )
    })
  })
})
