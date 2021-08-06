// file: kms.test.ts
import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'

import Lambda, { CreateFunctionRequest } from 'aws-sdk/clients/lambda'
import KMS, { CreateKeyRequest } from 'aws-sdk/clients/kms'
import environment from '../src/config/environment'
import services from '../src/enums/services'
import KmsClass from '../src/services/kms'
import LambdaClass from '../src/services/lambda'
import { AwsKms } from '../src/services/kms/data'
import { account, credentials, endpoint, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

initTestConfig()

const kms = new KMS({
  region,
  credentials,
  endpoint,
})
const lambda = new Lambda({
  region,
  credentials,
  endpoint: environment.LOCALSTACK_AWS_ENDPOINT,
})
const kmsKeyMock: CreateKeyRequest = {
  CustomerMasterKeySpec: 'SYMMETRIC_DEFAULT',
  Policy: `{
    "Version": "2012-10-17",
    "Id": "key-default-1",
    "Statement": [
        {
            "Sid": "Enable IAM User Permissions",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::632941798677:root"
            },
            "Action": "kms:*",
            "Resource": "*"
        }
    ]
  }`,
  Tags: [
    {
      TagValue: 'ExampleUser',
      TagKey: 'CreatedBy',
    },
  ],
}
const lambdaFunctionMock: CreateFunctionRequest = {
  Code: {},
  Description: 'OK',
  FunctionName: 'YEET',
  Handler: 'index.handler',
  MemorySize: 128,
  Role: 'YEET',
  Runtime: 'nodejs14.x',
  Tags: {
    TagValue: 'ExampleUser',
    TagKey: 'CreatedBy',
  },
  Timeout: 3,
}

let keyId: string
let lambdaFunctionName: string
let getDataResult
let formatResult
let initiatorTestData
let initiatorGetConnectionsResult: ServiceConnection[]
beforeAll(
  async () =>
    new Promise<void>(async resolve => {
      try {
        const kmsKeyData = await kms.createKey(kmsKeyMock).promise()
        keyId = kmsKeyData.KeyMetadata.KeyId
        lambdaFunctionMock.KMSKeyArn = kmsKeyData.KeyMetadata.Arn
        const lambdaFunctionData = await lambda
          .createFunction(lambdaFunctionMock)
          .promise()
        lambdaFunctionName = lambdaFunctionData.FunctionName
        await lambda
          .updateFunctionConfiguration({
            FunctionName: lambdaFunctionName,
            KMSKeyArn: kmsKeyData.KeyMetadata.Arn,
          })
          .promise()
        const kmsClass = new KmsClass({ logger: CloudGraph.logger })
        const lambdaClass = new LambdaClass({ logger: CloudGraph.logger })
        getDataResult = await kmsClass.getData({
          credentials,
          regions: region,
        })
        formatResult = getDataResult[region].map((item: AwsKms) =>
          kmsClass.format({ service: item, region, account })
        )
        initiatorTestData = [
          {
            name: services.lambda,
            data: await lambdaClass.getData({
              credentials,
              regions: region,
            }),
          },
          {
            name: services.kms,
            data: getDataResult,
          },
        ]
        initiatorGetConnectionsResult = initiatorTestData[0].data[region].map(
          item =>
            lambdaClass.getConnections({
              service: item,
              data: initiatorTestData,
              account,
              region,
            })
        )
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
      }
      resolve()
    })
)

describe('getData', () => {
  it('should return a truthy value ', () => {
    expect(getDataResult).toBeTruthy()
  })

  it('should return data from a region in the correct format', () => {
    expect(getDataResult[region]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          AWSAccountId: expect.any(String),
          Arn: expect.any(String),
          tags: expect.arrayContaining([
            expect.objectContaining({
              key: expect.any(String),
              value: expect.any(String),
            }),
          ]),
          // Description: expect.any(String),
          KeyId: expect.any(String),
          policy: expect.any(String),
          enableKeyRotation: expect.any(Boolean),
          KeyUsage: expect.any(String),
          Enabled: expect.any(Boolean),
          KeyState: expect.any(String),
          CustomerMasterKeySpec: expect.any(String),
          CreationDate: expect.any(Date),
          KeyManager: expect.any(String),
          Origin: expect.any(String),
          // DeletionDate: expect.any(String),
          // ValidTo: expect.any(String),
          region: expect.any(String),
        }),
      ])
    )
  })
})

describe('format', () => {
  it('should return data in wthe correct format matching the schema type', () => {
    expect(formatResult).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          arn: expect.any(String),
          creationDate: expect.any(String),
          customerMasterKeySpec: expect.any(String),
          // deletionDate: expect.any(String),
          // description: expect.any(String),
          enableKeyRotation: expect.any(String),
          enabled: expect.any(String),
          id: expect.any(String),
          keyManager: expect.any(String),
          keyState: expect.any(String),
          origin: expect.any(String),
          policy: expect.any(String),
          tags: expect.arrayContaining([
            expect.objectContaining({
              key: expect.any(String),
              value: expect.any(String),
            }),
          ]),
          usage: expect.any(String),
          // validTo: expect.any(String),
        }),
      ])
    )
  })
})

describe('initiator(lambda)', () => {
  it('should create the connection to kms', () => {
    const lambdaKmsConnections: ServiceConnection[] =
      initiatorGetConnectionsResult
        ?.find(l => lambdaFunctionName in l)
        [lambdaFunctionName].find(
          (c: ServiceConnection) =>
            c.resourceType === services.kms && c.id === keyId
        ) || undefined
    expect(lambdaKmsConnections).toBeTruthy()
  })
})

// TODO: Implement when Elasticache service is ready
it.todo('initiator(elasticache): should create the connection to kms')

afterAll(
  async () =>
    new Promise<void>(async resolve => {
      lambda.deleteFunction({ FunctionName: lambdaFunctionName }, () =>
        kms.scheduleKeyDeletion({ KeyId: keyId, PendingWindowInDays: 1 }, () =>
          resolve()
        )
      )
    })
)
