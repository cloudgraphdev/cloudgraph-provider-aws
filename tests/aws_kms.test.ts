import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'

import services from '../src/enums/services'
import KmsClass from '../src/services/kms'
import LambdaClass from '../src/services/lambda'
import { AwsKms as RawAwsKms } from '../src/services/kms/data'
import { account, credentials, region } from '../src/properties/test'
import { AwsKms } from '../src/types/generated'
import { initTestConfig } from '../src/utils'

describe('KMS Service Test: ', () => {
  let getDataResult: RawAwsKms[]
  let formatResult: AwsKms[]
  let initiatorTestData: Array<{
    name: string
    data: { [property: string]: any[] }
  }>
  let initiatorGetConnectionsResult: Array<{
    [property: string]: ServiceConnection[]
  }>
  initTestConfig()
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
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', () => {
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            AWSAccountId: expect.any(String),
            Arn: expect.any(String),
            // Tags: expect.objectContaining({
            //   [expect.any(String)]: expect.any(String)
            // }),
            // Description: expect.any(String),
            KeyId: expect.any(String),
            policy: expect.any(String),
            keyRotationEnabled: expect.any(Boolean),
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
    test('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            arn: expect.any(String),
            creationDate: expect.any(String),
            customerMasterKeySpec: expect.any(String),
            // deletionDate: expect.any(String),
            // description: expect.any(String),
            keyRotationEnabled: expect.any(String),
            enabled: expect.any(String),
            id: expect.any(String),
            keyManager: expect.any(String),
            keyState: expect.any(String),
            origin: expect.any(String),
            policy: expect.objectContaining({
              id: expect.any(String),
              statement: expect.arrayContaining([
                expect.objectContaining({
                  action: expect.arrayContaining([expect.any(String)]),
                  effect: expect.any(String),
                  resource: expect.arrayContaining([expect.any(String)]),
                }),
              ]),
              version: expect.any(String),
            }),
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

  describe('connections', () => {
    test('should verify the connections to lambda', () => {
      const lambdaKmsConnections: ServiceConnection[] = []
      initiatorGetConnectionsResult.map(
        (lambda: { [property: string]: ServiceConnection[] }) => {
          const connections: ServiceConnection[] =
            lambda[Object.keys(lambda)[0]]
          lambdaKmsConnections.push(
            ...connections.filter(c => c.resourceType === services.kms)
          )
        }
      )
      expect(initiatorGetConnectionsResult).toEqual(
        expect.arrayContaining([expect.any(Object)])
      )
    })

    // TODO: Implement when Elasticache service is ready
    test.todo('should verify the connections to elasticache')
  })
})
