import CloudGraph from '@cloudgraph/sdk'
import ELBService from '../src/services/elb'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

initTestConfig()

let elbGetDataResult
let formatResult
let elbConnections

// TODO: Test when Localstack PRO is enabled
describe.skip('ELB Service Test: ', () => {
  beforeAll(async () => {
    elbGetDataResult = {}
    formatResult = {}
    try {
      const classInstance = new ELBService({ logger: CloudGraph.logger })
      elbGetDataResult = await classInstance.getData({
        credentials,
        regions: region,
      })

      formatResult = elbGetDataResult[region].map(elbData =>
        classInstance.format({ service: elbData, region, account })
      )

      elbConnections = classInstance.getConnections({
        service: elbGetDataResult,
        data: {},
        region,
        account,
      })
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
    return Promise.resolve()
  })

  it('should return a truthy value ', () => {
    expect(elbGetDataResult).toBeTruthy()
  })

  it('getData: should return data from a region in the correct format', async () => {
    expect(elbGetDataResult[region]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          LoadBalancerName: expect.any(String),
          CanonicalHostedZoneNameID: expect.any(String),
          DNSName: expect.any(String),
          CreatedTime: expect.any(Date),
          Scheme: expect.any(String),
          VPCId: expect.any(String),

          Subnets: expect.arrayContaining<string>([]),
          SecurityGroups: expect.arrayContaining<string>([]),
          Instances: expect.arrayContaining([]),

          SourceSecurityGroup: expect.objectContaining({
            OwnerAlias: expect.any(String),
            GroupName: expect.any(String),
          }),

          HealthCheck: expect.objectContaining({
            Target: expect.any(String),
            Interval: expect.any(Number),
            Timeout: expect.any(Number),
            HealthyThreshold: expect.any(Number),
            UnhealthyThreshold: expect.any(Number),
          }),
          Attributes: expect.objectContaining({
            AccessLog: expect.any(Object),
            CrossZoneLoadBalancing: expect.any(Object),
            ConnectionSettings: expect.any(Object),
            ConnectionDraining: expect.any(Object),
          }),
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

  it('format: should return data in the correct format matching the schema type', () => {
    expect(formatResult).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          arn: expect.any(String),
          dnsName: expect.any(String),
          createdAt: expect.any(String),
          hostedZone: expect.any(String),
          type: expect.any(String),
          scheme: expect.any(String),
          vpcId: expect.any(String),
          accessLogs: expect.any(String),
          crossZoneLoadBalancing: expect.any(String),
          idleTimeout: expect.any(String),
          subnets: expect.arrayContaining<string>([]),
          securityGroupsIds: expect.arrayContaining<string>([]),
          sourceSecurityGroup: expect.objectContaining({
            ownerAlias: expect.any(String),
            groupName: expect.any(String),
          }),
          instances: expect.objectContaining({
            connectionDraining: expect.any(String),
            connectionDrainingTimeout: expect.any(String),
            instancesIds: expect.arrayContaining<string>([]),
          }),
          healthCheck: expect.objectContaining({
            target: expect.any(String),
            interval: expect.any(String),
            timeout: expect.any(String),
            healthyThreshold: expect.any(Number),
            unhealthyThreshold: expect.any(Number),
          }),
          listeners: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              name: expect.any(String),
              loadBalancerPort: expect.any(String),
              loadBalancerProtocol: expect.any(Boolean),
              instancePort: expect.any(Boolean),
              instanceProtocol: expect.any(Boolean),
            }),
          ]),
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

  it.todo('getConnections(subnet): should create the connection to subnet')

  it('getConnections(sg): should create the connection to security groups', () => {
    expect(elbConnections).toEqual({})
  })
})
