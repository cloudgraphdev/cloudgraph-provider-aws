import CloudGraph from '@cloudgraph/sdk'

import AppSyncClass from '../src/services/appSync'
import { RawAwsAsg } from '../src/services/asg/data'
import { initTestConfig } from '../src/utils'
import { account, credentials, region } from '../src/properties/test'
import AwsCognitoUserPool from '../src/services/cognitoUserPool'
import DynamoDb from '../src/services/dynamodb'
import Lambda from '../src/services/lambda'
import RDSCluster from '../src/services/rdsCluster'
import services from '../src/enums/services'

describe.skip('AppSync Service Test: ', () => {
  let getDataResult
  let formatResult
  let appSyncConnections
  let appSyncId

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const cognitoUserPoolService = new AwsCognitoUserPool({
            logger: CloudGraph.logger,
          })
          const dynamoDbService = new DynamoDb({
            logger: CloudGraph.logger,
          })
          const lambdaService = new Lambda({
            logger: CloudGraph.logger,
          })
          const rdsClusterService = new RDSCluster({
            logger: CloudGraph.logger,
          })
          const appSyncClass = new AppSyncClass({ logger: CloudGraph.logger })

          getDataResult = await appSyncClass.getData({
            credentials,
            regions: region,
          })
          formatResult = getDataResult[region].map((item: RawAwsAsg) =>
            appSyncClass.format({ service: item, region })
          )

          const [appSync] = getDataResult[region]
          appSyncId = appSync.apiId

          // Get Cognito User Pool data
          const cognitoUserPoolData = await cognitoUserPoolService.getData({
            credentials,
            regions: region,
          })

          // Get Dynamodb data
          const dynamoDbData = await dynamoDbService.getData({
            credentials,
            regions: region,
          })

          // Get lambda functions data
          const lambdaData = await lambdaService.getData({
            credentials,
            regions: region,
          })

          // Get rds cluster data
          const rdsClusterData = await rdsClusterService.getData({
            credentials,
            regions: region,
          })

          appSyncConnections = appSyncClass.getConnections({
            service: appSync,
            data: [
              {
                name: services.cognitoUserPool,
                data: cognitoUserPoolData,
                account,
                region,
              },
              {
                name: services.dynamodb,
                data: dynamoDbData,
                account,
                region,
              },
              {
                name: services.lambda,
                data: lambdaData,
                account,
                region,
              },
              {
                name: services.rdsCluster,
                data: rdsClusterData,
                account,
                region,
              },
            ],
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
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            apiId: expect.any(String),
            arn: expect.any(String),
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
            id: expect.any(String),
            arn: expect.any(String),
            name: expect.any(String),
            region: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to cognito user pool', () => {
      const cognitoUserPoolConnections = appSyncConnections[appSyncId]?.filter(
        connection => connection.resourceType === services.cognitoUserPool
      )

      expect(cognitoUserPoolConnections).toBeDefined()
      expect(cognitoUserPoolConnections.length).toBe(1)
    })

    test('should verify the connection to dynamodb', () => {
      const dynamodbConnections = appSyncConnections[appSyncId]?.filter(
        connection => connection.resourceType === services.dynamodb
      )

      expect(dynamodbConnections).toBeDefined()
      expect(dynamodbConnections.length).toBe(2)
    })

    test('should verify the connection to lambda funtions', () => {
      const lambdaConnections = appSyncConnections[appSyncId]?.filter(
        connection => connection.resourceType === services.lambda
      )

      expect(lambdaConnections).toBeDefined()
      expect(lambdaConnections.length).toBe(1)
    })

    test('should verify the connection to rds clusters', () => {
      const rdsClusterConnections = appSyncConnections[appSyncId]?.filter(
        connection => connection.resourceType === services.rdsCluster
      )

      expect(rdsClusterConnections).toBeDefined()
      expect(rdsClusterConnections.length).toBe(1)
    })
  })
})
