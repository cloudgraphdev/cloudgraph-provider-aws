import CloudGraph from '@cloudgraph/sdk'
import ALBService from '../src/services/alb'
import SGService from '../src/services/securityGroup'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'

initTestConfig()

let albGetDataResult
let formatResult
let albConnections
let loadBalancerId

// TODO: Test when Localstack PRO is enabled
describe.skip('ALB Service Test: ', () => {
  beforeAll(async () => {
    albGetDataResult = {}
    formatResult = {}
    try {
      const sgService = new SGService({ logger: CloudGraph.logger })
      const albService = new ALBService({ logger: CloudGraph.logger })
      albGetDataResult = await albService.getData({
        credentials,
        regions: region,
      })

      formatResult = albGetDataResult[region].map(albData =>
        albService.format({ service: albData, region, account })
      )

      // Get SG data
      const sgData = await sgService.getData({
        credentials,
        regions: region,
      })

      const [loadBalancer] = albGetDataResult[region]
      loadBalancerId = loadBalancer.LoadBalancerArn

      albConnections = albService.getConnections({
        service: albGetDataResult,
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

  it('should return a truthy value ', () => {
    expect(albGetDataResult).toBeTruthy()
  })

  it('getData: should return data from a region in the correct format', async () => {
    expect(albGetDataResult[region]).toEqual(
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

  it('format: should return data in the correct format matching the schema type', () => {
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

  it('initiator(sg): should verify the connection to sg', () => {
    const sgConnections = albConnections[loadBalancerId]?.filter(
      connection => connection.resourceType === services.sg
    )

    expect(sgConnections).toBeDefined()
    expect(sgConnections.length).toBe(1)
  })

  // TODO: Implement when EC2 service is ready
  it.todo('initiator(ec2): should verify the connection to ec2')

  // TODO: Implement when Subnet service is ready
  it.todo('initiator(subnet): should verify the connection to subnet')

  // TODO: Implement when Route53 service is ready
  it.todo('initiator(route53): should verify the connection to route53')
})
