import CloudGraph from '@cloudgraph/sdk'

import ALBService from '../src/services/alb'
import SGService from '../src/services/securityGroup'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'

// TODO: Test when Localstack PRO is enabled
describe.skip('ALB Service Test: ', () => {
  let getDataResult
  let formatResult
  let albConnections
  let loadBalancerId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const sgService = new SGService({ logger: CloudGraph.logger })
      const albService = new ALBService({ logger: CloudGraph.logger })
      getDataResult = await albService.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(albData =>
        albService.format({ service: albData, region, account })
      )

      // Get SG data
      const sgData = await sgService.getData({
        credentials,
        regions: region,
      })

      const [loadBalancer] = getDataResult[region]
      loadBalancerId = loadBalancer.LoadBalancerArn

      albConnections = albService.getConnections({
        service: getDataResult,
        data: [
          {
            name: services.sg,
            data: sgData,
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
            Size: expect.any(Number),
            State: expect.any(String),
            VolumeId: expect.any(String),
            VolumeType: expect.any(String),
            AvailabilityZone: expect.any(String),
            SnapshotId: expect.any(String),
            Encrypted: expect.any(Boolean),
            Attachments: expect.arrayContaining([
              expect.objectContaining({
                Device: expect.any(String),
                InstanceId: expect.any(String),
                State: expect.any(String),
                VolumeId: expect.any(String),
                DeleteOnTermination: expect.any(Boolean),
              }),
            ]),
            Tags: expect.arrayContaining([
              expect.objectContaining({
                Key: expect.any(String),
                Value: expect.any(String),
              }),
            ]),
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
            attachments: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                attachmentInformation: expect.any(String),
                attachedTime: expect.any(String),
                deleteOnTermination: expect.any(Boolean),
              }),
            ]),
            size: expect.any(String),
            state: expect.any(String),
            created: expect.any(String),
            snapshot: expect.any(String),
            encrypted: expect.any(Boolean),
            isBootDisk: expect.any(Boolean),
            volumeType: expect.any(String),
            availabilityZone: expect.any(String),
            tags: expect.arrayContaining([
              expect.objectContaining({
                key: expect.any(String),
                value: expect.any(String),
              }),
            ]),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to sg', () => {
      const sgConnections = albConnections[loadBalancerId]?.filter(
        connection => connection.resourceType === services.sg
      )

      expect(sgConnections).toBeDefined()
      expect(sgConnections.length).toBe(1)
    })

    // TODO: Implement when EC2 service is ready
    test('should verify the connection to ec2', () => {
      const ec2Connections = albConnections[loadBalancerId]?.filter(
        connection => connection.resourceType === services.ec2Instance
      )

      expect(ec2Connections).toBeDefined()
      expect(ec2Connections.length).toBe(1)
    })

    // TODO: Implement when Subnet service is ready
    test.todo('should verify the connection to subnet')

    // TODO: Implement when Route53 service is ready
    test.todo('should verify the connection to route53')
  })
})
