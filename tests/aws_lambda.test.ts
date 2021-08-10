// file: aws_lambda.test.ts
import CloudGraph from '@cloudgraph/sdk'

import Lambda, { CreateFunctionRequest } from 'aws-sdk/clients/lambda'
import LambdaClass from '../src/services/lambda'
import AwsLambdaFunction from '../src/services/lambda/index'
import { account, credentials, endpoint, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

initTestConfig()
const lambda = new Lambda({
  region,
  credentials,
  endpoint,
})
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
  VpcConfig: { SecurityGroupIds: [] },
}

// TODO: Will be better implemented using a terraform integration
let lambdaFunctionName: string
let getDataResult
let formatResult
beforeAll(
  async () =>
    new Promise<void>(async resolve => {
      try {
        const lambdaFunctionData = await lambda
          .createFunction(lambdaFunctionMock)
          .promise()
        lambdaFunctionName = lambdaFunctionData.FunctionName
        const lambdaClass = new LambdaClass({ logger: CloudGraph.logger })
        getDataResult = await lambdaClass.getData({
          credentials,
          regions: region,
        })
        formatResult = getDataResult[region].map((item: AwsLambdaFunction) =>
          lambdaClass.format({ service: item, region, account })
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
          // CodeSha256: expect.any(String),
          // CodeSize: expect.any(Number),
          Description: expect.any(String),
          // FileSystemConfigs: expect.objectContaining({
          //   Arn: expect.any(String),
          //   LocalMountPath: expect.any(String),
          // }),
          FunctionArn: expect.any(String),
          FunctionName: expect.any(String),
          Handler: expect.any(String),
          // KMSKeyArn: expect.any(String),
          LastModified: expect.any(String),
          LastUpdateStatus: expect.any(String),
          // LastUpdateStatusReason: expect.any(String),
          // LastUpdateStatusReasonCode: expect.any(String),
          // MasterArn: expect.any(String),
          MemorySize: expect.any(Number),
          PackageType: expect.any(String),
          RevisionId: expect.any(String),
          Role: expect.any(String),
          Runtime: expect.any(String),
          // SigningProfileVersionArn: expect.any(String),
          // SigningJobArn: expect.any(String),
          State: expect.any(String),
          // StateReason: expect.any(String),
          // StateReasonCode: expect.any(String),
          Timeout: expect.any(Number),
          TracingConfig: expect.objectContaining({
            Mode: expect.any(String),
          }),
          Version: expect.any(String),
          // VpcConfig: expect.objectContaining({
          //   SubnetIds: expect.arrayContaining([expect.any(String)]),
          //   SecurityGroupIds: expect.arrayContaining([expect.any(String)]),
          //   VpcId: expect.any(String),
          // }),
          region: expect.any(String),
          reservedConcurrentExecutions: expect.any(Number),
          // tags: expect.arrayContaining([
          //   expect.objectContaining({
          //     key: expect.any(String),
          //     value: expect.any(String),
          //   }),
          // ]),
        }),
      ])
    )
  })
})

describe('format', () => {
  it('should return data in wthe correct format matching the schema type', () => {
    expect(formatResult).toEqual(
      expect.arrayContaining([expect.objectContaining({
        arn: expect.any(String),
        description: expect.any(String),
        handler: expect.any(String),
        // kmsKeyArn: expect.any(String),
        lastModified: expect.any(String),
        memorySize: expect.any(Number),
        reservedConcurrentExecutions: expect.any(String),
        role: expect.any(String),
        runtime: expect.any(String),
        sourceCodeSize: expect.any(String),
        timeout: expect.any(Number),
        tracingConfig: expect.any(String),
        version: expect.any(String),
        // environmentVariables,
        // tags,
      })])
    )
  })
})

afterAll(
  async () =>
    new Promise<void>(async resolve => {
      lambda.deleteFunction({ FunctionName: lambdaFunctionName }, () =>
        resolve()
      )
    })
)
