import CloudGraph from '@cloudgraph/sdk'
import Ebs from '../src/services/ebs'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

initTestConfig()

let ebsGetDataResult
let formatResult

describe('EBS Service Test: ', () => {
  beforeAll(async () => {
    ebsGetDataResult = {}
    formatResult = {}
    try {
      const ebs = new Ebs({ logger: CloudGraph.logger })
      ebsGetDataResult = await ebs.getData({
        credentials,
        regions: region,
      })

      formatResult = ebsGetDataResult[region].map(ebsData =>
        ebs.format({ service: ebsData, region, account })
      )
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
    return Promise.resolve()
  })

  it('should return a truthy value ', () => {
    expect(ebsGetDataResult).toBeTruthy()
  })

  it('getData: should return data from a region in the correct format', async () => {
    expect(ebsGetDataResult[region]).toEqual(
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
          // Tags: expect.arrayContaining([
          //   expect.objectContaining({
          //     Key: expect.any(String),
          //     Value: expect.any(String),
          //   }),
          // ]),
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

  // TODO: Implement when EC2 service is ready
  it.todo('initiator(ec2): should verify the connection to ec2')
})
