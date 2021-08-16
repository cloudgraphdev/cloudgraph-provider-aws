// file: kms.test.ts
import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'
import services from '../src/enums/services'
import KmsClass from '../src/services/kms'
import LambdaClass from '../src/services/lambda'
import { AwsKms } from '../src/services/kms/data'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

initTestConfig()

let getDataResult
let formatResult
let initiatorTestData
let initiatorGetConnectionsResult: ServiceConnection[]
beforeAll(
  async () =>
    new Promise<void>(async resolve => {
      try {
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
          // KeyUsage: expect.any(String),
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
  it('should return data in the correct format matching the schema type', () => {
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
          // usage: expect.any(String),
          // validTo: expect.any(String),
        }),
      ])
    )
  })
})

describe('initiator(lambda)', () => {
  it('should create the connection to kms', () => {
    expect(initiatorGetConnectionsResult[0]).toEqual(
      expect.objectContaining({
        lambda_function_name: expect.any(Array)
      })
    )
  })
})

// TODO: Implement when Elasticache service is ready
it.todo('initiator(elasticache): should create the connection to kms')
