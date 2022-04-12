import CloudGraph from '@cloudgraph/sdk'
import CloudFormationClass from '../src/services/cloudFormationStackSet'
import IamRoleService from '../src/services/iamRole'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import { RawAwsCloudFormationStackSet } from '../src/services/cloudFormationStackSet/data'
import services from '../src/enums/services'

describe('Cloud formation Service Test: ', () => {
  let getDataResult
  let formatResult
  let cfConnections
  let cfStackSetId

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const iamRoleService = new IamRoleService({ logger: CloudGraph.logger })
          const cfClass = new CloudFormationClass({ logger: CloudGraph.logger })

          getDataResult = await cfClass.getData({
            credentials,
            regions: region,
          })

          formatResult = getDataResult[region].map(
            (item: RawAwsCloudFormationStackSet) =>
              cfClass.format({ service: item, region })
          )

          // Get IAM Role data
          const securityGroupData = await iamRoleService.getData({
            credentials,
            regions: region,
          })

          const [cfStackSet] = getDataResult[region]
          cfStackSetId = cfStackSet.StackSetId

          cfConnections = cfClass.getConnections({
            service: cfStackSet,
            data: [
              {
                name: services.iamRole,
                data: securityGroupData,
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
            PermissionModel: expect.any(String),
            StackSetId: expect.any(String),
            StackSetName: expect.any(String),
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
            name: expect.any(String),
            permissionModel: expect.any(String),
            region: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to iam roles', () => {
      const iamRoleConnections = cfConnections[
        cfStackSetId
      ]?.filter(
        connection => connection.resourceType === services.iamRole
      )

      expect(iamRoleConnections).toBeDefined()
      expect(iamRoleConnections.length).toBe(1)
    })
  })
})
