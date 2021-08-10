import CloudGraph from '@cloudgraph/sdk'
import { EC2 } from 'aws-sdk'

import Ebs from '../src/services/ebs'
import environment from '../src/config/environment'

// TODO: Probably solved by ENG-89
const credentials = {
  accessKeyId: 'test',
  secretAccessKey: 'test',
}

// TODO: Single region for now to match free license Localstack limitation
const account = environment.LOCALSTACK_AWS_ACCOUNT_ID
const region = 'us-east-1'
const ec2 = new EC2({
  region,
  credentials,
  endpoint: environment.LOCALSTACK_AWS_ENDPOINT,
})
const ebsMockData = {
  AvailabilityZone: 'us-east-1',
  Size: 100,
  MultiAttachEnabled: false,
  TagSpecifications: [
    {
      ResourceType: 'volume',
      Tags: [{ Key: 'Volume', Value: 'EBS' }],
    },
  ],
}

const ec2MockData = {
  BlockDeviceMappings: [
    {
      DeviceName: '/dev/sdh',
      Ebs: {
        VolumeSize: 100,
      },
    },
  ],
  ImageId: 'ami-abc12345',
  InstanceType: 't2.micro',
  KeyName: 'my-key-pair',
  MaxCount: 1,
  MinCount: 1,
  SecurityGroupIds: ['sg-1a2b3c4d'],
  TagSpecifications: [
    {
      ResourceType: 'instance',
      Tags: [
        {
          Key: 'Purpose',
          Value: 'test',
        },
      ],
    },
  ],
}

const vpcMockData = {
  CidrBlock: '10.0.0.0/16',
  TagSpecifications: [
    { ResourceType: 'vpc', Tags: [{ Key: 'vpc', Value: 'example' }] },
  ],
}

let ebsVolumeId: string
let vpcId = ''
let subnetId = ''
let instanceId = ''
let ebsGetDataResult
let formatResult

describe('EBS Service Test: ', () => {
  beforeAll(async () => {
    ebsGetDataResult = {}
    formatResult = {}
    try {
      // Create VPC
      const {
        Vpc: { VpcId, CidrBlock },
      } = await ec2.createVpc(vpcMockData).promise()
      vpcId = VpcId

      // Create Subnet
      const {
        Subnet: { SubnetId },
      } = await ec2
        .createSubnet({
          VpcId,
          CidrBlock,
        })
        .promise()
      subnetId = SubnetId

      // Create EC2
      const { Instances } = await ec2
        .runInstances({ ...ec2MockData, SubnetId })
        .promise()
      const [Instance] = Instances
      instanceId = Instance.InstanceId

      // Create EBS Volume
      const { VolumeId } = await ec2.createVolume(ebsMockData).promise()
      ebsVolumeId = VolumeId

      // Attach volume
      await ec2
        .attachVolume({
          VolumeId: ebsVolumeId,
          InstanceId: instanceId,
          Device: '/dev/sdh',
        })
        .promise()

      const ebs = new Ebs({ logger: CloudGraph.logger })
      ebsGetDataResult = await ebs.getData({
        credentials,
        regions: region,
      })

      ebsGetDataResult = ebsGetDataResult[region].filter(
        ebsResult => ebsResult.VolumeId === ebsVolumeId
      )

      formatResult = ebsGetDataResult.map(ebsData =>
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
    expect(ebsGetDataResult).toEqual(
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

  it('format: should return data in wthe correct format matching the schema type', () => {
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
  it.todo('initiator(ec2): should create the connection to ebs')

  afterAll(async () => {
    await ec2
      .detachVolume({ VolumeId: ebsVolumeId, InstanceId: instanceId })
      .promise()
    await ec2.terminateInstances({ InstanceIds: [instanceId] }).promise()
    await ec2.deleteVpc({ VpcId: vpcId }).promise()
    await ec2.deleteSubnet({ SubnetId: subnetId }).promise()
    await ec2.deleteVolume({ VolumeId: ebsVolumeId }).promise()
  })
})
