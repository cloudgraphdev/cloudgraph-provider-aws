import CloudGraph from '@cloudgraph/sdk'
import EIPService from '../src/services/eip'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

describe('EIP Service Test: ', () => {
  let getDataResult
  let formatResult
  initTestConfig()
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        getDataResult = {}
        formatResult = {}
        try {
          const eipService = new EIPService({ logger: CloudGraph.logger })

          // Get EIP data
          getDataResult = await eipService.getData({
            credentials,
            regions: region,
          })

          // Format EIP data
          formatResult = getDataResult[region].map(eipData =>
            eipService.format({ service: eipData, region, account })
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
            AllocationId: expect.any(String),
            AssociationId: expect.any(String),
            Domain: expect.any(String),
            InstanceId: expect.any(String),
            NetworkInterfaceId: expect.any(String),
            PublicIp: expect.any(String),
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
            vpc: expect.any(String),
            domain: expect.any(String),
            ec2InstanceAssociationId: expect.any(String),
            instanceId: expect.any(String),
            publicIp: expect.any(String),
            // Optional fields
            // customerOwnedIp: expect.any(String),
            // customerOwnedIpv4Pool: expect.any(String),
            // networkBorderGroup: expect.any(String),
            // networkInterface: expect.any(String),
            // networkInterfaceOwnerId: expect.any(String),
            // publicIpv4Pool: expect.any(String),
            // privateIp: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test.todo('should verify the connection to networkInterface')
  })
})
