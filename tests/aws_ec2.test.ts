import CloudGraph from '@cloudgraph/sdk'
import EBSService from '../src/services/ebs'
import EC2Service from '../src/services/ec2'
import EIPService from '../src/services/eip'
import SubnetService from '../src/services/subnet'
import SGService from '../src/services/securityGroup'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'

describe('EC2 Service Test: ', () => {
  let getDataResult
  let formatResult
  let ec2Connections
  let instanceId
  initTestConfig()
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        getDataResult = {}
        formatResult = {}
        try {
          const ebsService = new EBSService({ logger: CloudGraph.logger })
          const ec2Service = new EC2Service({ logger: CloudGraph.logger })
          const eipService = new EIPService({ logger: CloudGraph.logger })
          const sgService = new SGService({ logger: CloudGraph.logger })
          const subnetService = new SubnetService({ logger: CloudGraph.logger })

          // Get EC2 data
          getDataResult = await ec2Service.getData({
            credentials,
            regions: region,
          })

          // Format EC2 data
          formatResult = getDataResult[region].map(elbData =>
            ec2Service.format({ service: elbData, region, account })
          )

          const [instance] = getDataResult[region]
          instanceId = instance.InstanceId

          ec2Connections = ec2Service.getConnections({
            service: instance,
            data: [
              {
                name: services.sg,
                data: await sgService.getData({
                  credentials,
                  regions: region,
                }),
                account,
                region,
              },
              {
                name: services.ebs,
                data: await ebsService.getData({
                  credentials,
                  regions: region,
                }),
                account,
                region,
              },
              {
                name: services.eip,
                data: await eipService.getData({
                  credentials,
                  regions: region,
                }),
                account,
                region,
              },
              {
                name: services.subnet,
                data: await subnetService.getData({
                  credentials,
                  regions: region,
                }),
                account,
                region,
              },
            ],
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
            InstanceId: expect.any(String),
            ImageId: expect.any(String),
            PublicDnsName: expect.any(String),
            PrivateDnsName: expect.any(String),
            Placement: expect.objectContaining({
              Tenancy: expect.any(String),
              AvailabilityZone: expect.any(String),
              GroupName: expect.any(String),
            }),
            Monitoring: expect.objectContaining({
              State: expect.any(String),
            }),
            State: expect.objectContaining({
              Name: expect.any(String),
            }),
            EbsOptimized: expect.any(Boolean),
            InstanceType: expect.any(String),
            SourceDestCheck: expect.any(Boolean),
            region: expect.any(String),
            cloudWatchMetricData: expect.objectContaining({
              last6Hours: expect.any(Object),
              last24Hours: expect.any(Object),
              lastWeek: expect.any(Object),
              lastMonth: expect.any(Object)
            })
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
            ami: expect.any(String),
            tenancy: expect.any(String),
            publicDns: expect.any(String),
            privateDns: expect.any(String),
            monitoring: expect.any(String),
            hibernation: expect.any(String),
            ebsOptimized: expect.any(String),
            instanceType: expect.any(String),
            instanceState: expect.any(String),
            availabilityZone: expect.any(String),
            iamInstanceProfile: expect.any(String),
            deletionProtection: expect.any(String),
            primaryNetworkInterface: expect.any(String),
            cpuCoreCount: expect.any(Number),
            cpuThreadsPerCore: expect.any(Number),
            metadataOptions: expect.objectContaining({
              state: expect.any(String),
              httpTokens: expect.any(String),
              httpPutResponseHopLimit: expect.any(Number),
              httpEndpoint: expect.any(String),
            }),
            ephemeralBlockDevices: expect.arrayContaining([
              expect.objectContaining({
                deviceName: expect.any(String),
              }),
            ]),
            cloudWatchMetricData: expect.objectContaining({
              last6Hours: expect.any(Object),
              last24Hours: expect.any(Object),
              lastWeek: expect.any(Object),
              lastMonth: expect.any(Object)
            }),
            platformDetails: expect.any(String),
            instanceLifecycle: expect.any(String),
            publicIpAddress: expect.any(String),
            launchTime: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to security groups', async () => {
      const sgConnections = ec2Connections[instanceId]?.filter(
        connection => connection.resourceType === services.sg
      )

      expect(sgConnections).toBeDefined()
      expect(sgConnections.length).toBe(1)
    })

    test('should verify the connection to ebs', async () => {
      const ebsConnections = ec2Connections[instanceId]?.filter(
        connection => connection.resourceType === services.ebs
      )

      expect(ebsConnections).toBeDefined()
      expect(ebsConnections.length).toBe(2)
    })

    test('should verify the connection to eip', async () => {
      const eipConnections = ec2Connections[instanceId]?.filter(
        connection => connection.resourceType === services.eip
      )

      expect(eipConnections).toBeDefined()
      expect(eipConnections.length).toBe(1)
    })

    test('should verify the connection to networkInterface', () => {
      const eipConnections = ec2Connections[instanceId]?.filter(
        connection => connection.resourceType === services.networkInterface
      )

      expect(eipConnections).toBeDefined()
      expect(eipConnections.length).toBe(1)
    })

    test('should verify the connection to subnet', () => {
      const subnetConnections = ec2Connections[instanceId]?.filter(
        connection => connection.resourceType === services.subnet
      )

      expect(subnetConnections).toBeDefined()
      expect(subnetConnections.length).toBe(1)
    })

    test.todo('should verify the connection to eks')

    test.todo('should verify the connection to eb')

    test.todo('should verify the connection to ecs')
  })
})
