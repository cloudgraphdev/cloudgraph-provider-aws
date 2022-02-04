import CloudGraph from '@cloudgraph/sdk'
import ConfigurationRecorder from '../src/services/configurationRecorder'
import IamRole from '../src/services/iamRole'
import services from '../src/enums/services'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import { configurationRecorderArn } from '../src/utils/generateArns'

// Localstack Pro Tier
describe.skip('Configuration Recorder Service Test: ', () => {
  let getDataResult
  let formatResult
  let configRecorderConnections
  let configRecorderId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const iamRoleSrevice = new IamRole({ logger: CloudGraph.logger })
      const classInstance = new ConfigurationRecorder({
        logger: CloudGraph.logger,
      })

      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(config =>
        classInstance.format({ service: config, region, account })
      )

      const [configRecorder] = getDataResult[region]
      configRecorderId = configurationRecorderArn({
        region,
        account,
        name: configRecorder.name,
      })

      // Get IAM Role data
      const iamRoleData = await iamRoleSrevice.getData({
        credentials,
        regions: region,
      })

      configRecorderConnections = classInstance.getConnections({
        service: configRecorder,
        data: [
          {
            name: services.iamRole,
            data: iamRoleData,
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
    return Promise.resolve()
  })

  describe('getData', () => {
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', async () => {
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            roleARN: expect.any(String),
            recordingGroup: expect.objectContaining({
              allSupported: expect.any(Boolean),
              includeGlobalResourceTypes: expect.any(Boolean),
              resourceTypes: expect.any(Array),
            }),
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
            region: expect.any(String),
            name: expect.any(String),
            roleARN: expect.any(String),
            recordingGroup: expect.objectContaining({
              allSupported: expect.any(Boolean),
              includeGlobalResourceTypes: expect.any(Boolean),
              resourceTypes: expect.any(Array),
            }),
            status: expect.objectContaining({
              name: expect.any(String),
              lastStatus: expect.any(String),
              recording: expect.any(Boolean),
              lastStatusChangeTime: expect.any(String),
              lastStartTime: expect.any(String),
              lastStopTime: expect.any(String),
            }),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to IAM Role', () => {
      const iamRoleConnections = configRecorderConnections[
        configRecorderId
      ]?.filter(connection => connection.resourceType === services.routeTable)

      expect(iamRoleConnections).toBeDefined()
      expect(iamRoleConnections.length).toBe(0)
    })
  })
})
