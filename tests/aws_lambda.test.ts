import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'

import LambdaClass from '../src/services/lambda'
import VpcClass from '../src/services/vpc'
import SecurityGroupClass from '../src/services/securityGroup'
import SubnetClass from '../src/services/subnet'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import { RawAwsLambdaFunction } from '../src/services/lambda/data'
import { AwsLambda } from '../src/types/generated'
import services from '../src/enums/services'

describe('Lambda Service Test: ', () => {
  let getDataResult: RawAwsLambdaFunction[]
  let formatResult: AwsLambda[]
  let initiatorTestData: Array<{
    name: string
    data: { [property: string]: any[] }
  }>
  let initiatorGetConnectionsResult: Array<{
    [property: string]: ServiceConnection[]
  }>
  let lambdaConnections: ServiceConnection[]
  let lambdaId: string
  initTestConfig()
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const lambdaClass = new LambdaClass({ logger: CloudGraph.logger })
          const vpcClass = new VpcClass({ logger: CloudGraph.logger })
          const sgClass = new SecurityGroupClass({ logger: CloudGraph.logger })
          const subnetClass = new SubnetClass({ logger: CloudGraph.logger })
          getDataResult = await lambdaClass.getData({
            credentials,
            regions: region,
          })
          formatResult = getDataResult[region].map(
            (item: RawAwsLambdaFunction) =>
              lambdaClass.format({ service: item, region, account })
          )
          initiatorTestData = [
            {
              name: services.lambda,
              data: getDataResult,
            },
            {
              name: services.vpc,
              data: await vpcClass.getData({
                credentials,
                regions: region,
              }),
            },
            {
              name: services.sg,
              data: await sgClass.getData({
                credentials,
                regions: region,
              }),
            },
            {
              name: services.subnet,
              data: await subnetClass.getData({
                credentials,
                regions: region,
              }),
            },
          ]
          initiatorGetConnectionsResult = initiatorTestData[1].data[region].map(
            vpc =>
              vpcClass.getConnections({
                service: vpc,
                data: initiatorTestData,
                account,
                region,
              })
          )
          lambdaId = getDataResult[region][0].FunctionArn
          lambdaConnections = lambdaClass.getConnections({
            service: getDataResult[region][0],
            data: initiatorTestData,
            account,
            region,
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
            // Runtime: expect.any(String),
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
    test('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            arn: expect.any(String),
            description: expect.any(String),
            handler: expect.any(String),
            // kmsKeyArn: expect.any(String),
            lastModified: expect.any(String),
            memorySize: expect.any(Number),
            reservedConcurrentExecutions: expect.any(Number),
            role: expect.any(String),
            // runtime: expect.any(String),
            sourceCodeSize: expect.any(String),
            timeout: expect.any(Number),
            tracingConfig: expect.any(String),
            version: expect.any(String),
            // environmentVariables,
            // tags,
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connections to vpc', () => {
      const vpcLambdaConnections: ServiceConnection[] = []
      initiatorGetConnectionsResult.map(
        (vpc: { [property: string]: ServiceConnection[] }) => {
          const connections: ServiceConnection[] = vpc[Object.keys(vpc)[0]]
          vpcLambdaConnections.push(
            ...connections.filter(c => c.resourceType === services.lambda)
          )
        }
      )
      expect(initiatorGetConnectionsResult).toEqual(
        expect.arrayContaining([expect.any(Object)])
      )
    })
    test('should verify the connection to subnet', () => {
      const subnetConnections = lambdaConnections[lambdaId]?.filter(
        connection => connection.resourceType === services.subnet
      )

      expect(subnetConnections).toBeDefined()
      expect(subnetConnections.length).toBe(1)
    })
  })
})
