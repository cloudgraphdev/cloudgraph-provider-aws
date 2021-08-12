import CloudGraph from '@cloudgraph/sdk'
import EC2Service from '../src/services/ec2'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

let ec2GetDataResult
let formatResult

describe('EC2 Service Test: ', () => {
  initTestConfig()
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        ec2GetDataResult = {}
        formatResult = {}
        try {
          const classInstance = new EC2Service({ logger: CloudGraph.logger })
          ec2GetDataResult = await classInstance.getData({
            credentials,
            regions: region,
          })

          formatResult = ec2GetDataResult[region].map(elbData =>
            classInstance.format({ service: elbData, region, account })
          )
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

  it.todo('getConnections(sg): should create the connection to security groups')

  it.todo('getConnections(ebs): should create the connection to ebs')

  it.todo('getConnections(eip): should create the connection to eip')

  it.todo('getConnections(subnet): should create the connection to subnet')

  it.todo(
    'getConnections(networkInterface): should create the connection to networkInterface'
  )

  it.todo('getConnections(eks): should create the connection to eks')

  it.todo('getConnections(eb): should create the connection to eb')

  it.todo('getConnections(ecs): should create the connection to ecs')
})
