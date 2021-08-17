import CloudGraph from '@cloudgraph/sdk'
import EC2Service from '../src/services/ec2'
import SGService from '../src/services/securityGroup'
import EBSService from '../src/services/ebs'
import EIPService from '../src/services/eip'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'

let ec2GetDataResult
let formatResult
let ec2Connections
let instanceId

describe('EC2 Service Test: ', () => {
  initTestConfig()
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        ec2GetDataResult = {}
        formatResult = {}
        try {
          const ec2Service = new EC2Service({ logger: CloudGraph.logger })
          const sgService = new SGService({ logger: CloudGraph.logger })
          const ebsService = new EBSService({ logger: CloudGraph.logger })
          const eipService = new EIPService({ logger: CloudGraph.logger })

          // Get EC2 data
          ec2GetDataResult = await ec2Service.getData({
            credentials,
            regions: region,
          })

          // Format EC2 data
          formatResult = ec2GetDataResult[region].map(elbData =>
            ec2Service.format({ service: elbData, region, account })
          )

          // Get SG data
          const sgData = await sgService.getData({
            credentials,
            regions: region,
          })

          // Get EBS data
          const ebsData = await ebsService.getData({
            credentials,
            regions: region,
          })

          // Get EIP data
          const eipData = await eipService.getData({
            credentials,
            regions: region,
          })

          const [instance] = ec2GetDataResult[region]
          instanceId = instance.InstanceId

          ec2Connections = ec2Service.getConnections({
            service: instance,
            data: [
              {
                name: services.sg,
                data: sgData,
                account,
                region,
              },
              {
                name: services.ebs,
                data: ebsData,
                account,
                region,
              },
              {
                name: services.eip,
                data: eipData,
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

  it('should return a truthy value ', () => {
    expect(ec2GetDataResult).toBeTruthy()
  })

  it('getData: should return data from a region in the correct format', () => {
    expect(ec2GetDataResult[region]).toEqual(
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
        }),
      ])
    )
  })

  it('format: should return data in the correct format matching the schema type', () => {
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
          ephemeralBlockDevice: expect.arrayContaining([
            expect.objectContaining({
              deviceName: expect.any(String),
            }),
          ]),
        }),
      ])
    )
  })

  it('getConnections(sg): should verify the connection to security groups', async () => {
    const sgConnections = ec2Connections[instanceId]?.filter(
      connection => connection.resourceType === services.sg
    )

    expect(sgConnections).toBeDefined()
    expect(sgConnections.length).toBe(1)
  })

  it('getConnections(ebs): should verify the connection to ebs', async () => {
    const ebsConnections = ec2Connections[instanceId]?.filter(
      connection => connection.resourceType === services.ebs
    )

    expect(ebsConnections).toBeDefined()
    expect(ebsConnections.length).toBe(2)
  })

  it('getConnections(eip): should verify the connection to eip', async () => {
    const eipConnections = ec2Connections[instanceId]?.filter(
      connection => connection.resourceType === services.eip
    )

    expect(eipConnections).toBeDefined()
    expect(eipConnections.length).toBe(1)
  })

  it.todo('getConnections(subnet): should verify the connection to subnet')

  it.todo(
    'getConnections(networkInterface): should verify the connection to networkInterface'
  )

  it.todo('getConnections(eks): should verify the connection to eks')

  it.todo('getConnections(eb): should verify the connection to eb')

  it.todo('getConnections(ecs): should verify the connection to ecs')
})
