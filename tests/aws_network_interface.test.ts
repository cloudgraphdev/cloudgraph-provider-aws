import CloudGraph from '@cloudgraph/sdk'
import NetworkInterfaceService from '../src/services/networkInterface'
import SubnetService from '../src/services/subnet'
import services from '../src/enums/services'
import { RawNetworkInterface } from '../src/services/networkInterface/data'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

describe('Network Interface Service Test: ', () => {
  let getDataResult: RawNetworkInterface[]
  let formatResult
  let connections
  let netId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = []
    formatResult = {}
    try {
      const config = { logger: CloudGraph.logger }

      const classInstance = new NetworkInterfaceService(config)
      const subnetService = new SubnetService(config)

      getDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = getDataResult[region].map(networkInterfaceData =>
        classInstance.format({
          service: networkInterfaceData,
          region,
          account,
        })
      )

      const [instance] = getDataResult[region]
      netId = instance.NetworkInterfaceId
      
      connections = classInstance.getConnections({
        service: instance,
        data: [
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
            Description: expect.any(String),
            MacAddress: expect.any(String),
            NetworkInterfaceId: expect.any(String),
            OwnerId: expect.any(String),
            PrivateDnsName: expect.any(String),
            PrivateIpAddress: expect.any(String),
            AvailabilityZone: expect.any(String),
            VpcId: expect.any(String),
            SubnetId: expect.any(String),
            Status: expect.any(String),
            Association: {
              IpOwnerId: expect.any(String),
              PublicDnsName: expect.any(String),
              PublicIp: expect.any(String),
            },
            Attachment: expect.objectContaining({
              DeviceIndex: expect.any(Number),
              InstanceOwnerId: expect.any(String),
              InstanceId: expect.any(String),
              Status: expect.any(String),
              AttachmentId: expect.any(String),
              DeleteOnTermination: expect.any(Boolean),
              AttachTime: expect.any(Date),
            }),
            RequesterManaged: expect.any(Boolean),
            SourceDestCheck: expect.any(Boolean),
            PrivateIpAddresses: expect.arrayContaining([
              expect.objectContaining({
                Primary: expect.any(Boolean),
                PrivateDnsName: expect.any(String),
                PrivateIpAddress: expect.any(String),
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
            subnetId: expect.any(String),
            macAddress: expect.any(String),
            description: expect.any(String),
            availabilityZone: expect.any(String),
            status: expect.any(String),
            vpcId: expect.any(String),
            interfaceType: expect.any(String),
            privateDnsName: expect.any(String),
            attachment: expect.objectContaining({
              attachmentId: expect.any(String),
              status: expect.any(String),
              deleteOnTermination: expect.any(Boolean),
            }),
            privateIps: expect.arrayContaining<string>([]),
            securityGroups: expect.arrayContaining<string>([]),
          }),
        ])
      )
    })
  })

  // TODO: Localstack Pro Tier
  describe('connections', () => {
    test('should verify the connection to subnet', () => {
      const subnetConnections = connections[netId]?.filter(
        connection => connection.resourceType === services.subnet
      )

      expect(subnetConnections).toBeDefined()
      expect(subnetConnections.length).toBe(1)
    })
  })
})
