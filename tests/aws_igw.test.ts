// file: cloudwatch.test.ts
require('dotenv').config()
import CloudGraph, { ServiceConnection } from 'cloud-graph-sdk'
import { EC2 } from 'aws-sdk'
import Igw from '../src/services/igw'
import Vpc from '../src/services/vpc'
import services from '../src/enums/services'

// TODO: Probably solved by ENG-89
const credentials = {
  accessKeyId: 'test',
  secretAccessKey: 'test',
}

// TODO: Single region for now to match free license Localstack limitation
const account = process.env.LOCALSTACK_AWS_ACCOUNT_ID
const region = 'us-east-1'
const igw = new EC2({
  region: region,
  credentials,
  endpoint: process.env.LOCALSTACK_AWS_ENDPOINT,
})
const igwMockData = {
  TagSpecifications: [
    {
      ResourceType: 'vpc',
      Tags: [{ Key: 'testTag', Value: 'YEET' }],
    },
  ],
}
const vpcMockData = {
  CidrBlock: '10.0.0.0/16',
  TagSpecifications: [
    { ResourceType: 'vpc', Tags: [{ Key: 'vpc', Value: 'example' }] },
  ],
}

jest.setTimeout(30000)

// TODO: Will be better implemented using a terraform integration
let igwId,
  vpcId,
  igwGetDataResult,
  formatResult,
  initiatorTestData,
  initiatorGetConnectionsResult
beforeAll(async () => {
  try {
    const vpcData = await igw.createVpc(vpcMockData).promise()
    const igwData = await igw.createInternetGateway(igwMockData).promise()
    vpcId = vpcData.Vpc.VpcId
    igwId = igwData.InternetGateway.InternetGatewayId
    await igw
      .attachInternetGateway({ InternetGatewayId: igwId, VpcId: vpcId })
      .promise()
    const igwClass = new Igw({ logger: CloudGraph.logger })
    const vpcClass = new Vpc({ logger: CloudGraph.logger })
    igwGetDataResult = await igwClass.getData({
      credentials,
      regions: region,
    })
    formatResult = igwGetDataResult[region].map(igw =>
      igwClass.format({ igw, region, account })
    )
    initiatorTestData = [
      {
        name: services.vpc,
        data: await vpcClass.getData({
          credentials,
          regions: region,
        }),
      },
      {
        name: services.igw,
        data: igwGetDataResult,
      },
    ]
    initiatorGetConnectionsResult = initiatorTestData[0].data[region].map(vpc =>
      vpcClass.getConnections({
        service: vpc,
        data: initiatorTestData,
        account,
        region,
      })
    )
  } catch (error) {
    console.error(error)
  }
  return Promise.resolve()
})

describe('getData', () => {
  it('should return a truthy value ', () => {
    expect(igwGetDataResult).toBeTruthy()
  })

  it('should return data from a region in the correct format', async () => {
    expect(igwGetDataResult[region]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          Attachments: expect.arrayContaining([
            expect.objectContaining({
              State: expect.any(String),
              VpcId: expect.any(String),
            }),
          ]),
          InternetGatewayId: expect.any(String),
          //TODO: Haven't found a way to match this as an optional property
          // OwnerId: expect.any(String) || expect.any(undefined),
          Tags: expect.arrayContaining([
            expect.objectContaining({
              key: expect.any(String),
              value: expect.any(String),
            }),
          ]),
          region: expect.any(String),
        }),
      ])
    )
  })
})

describe('format', () => {
  it('should return data in the correct format matching the schema type', () => {
    expect(formatResult).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          arn: expect.any(String),
          attachments: expect.arrayContaining([
            expect.objectContaining({
              state: expect.any(String),
              vpcId: expect.any(String),
            }),
          ]),
          id: expect.any(String),
          //TODO: Haven't found a way to match this as an optional property
          // owner: expect.any(String),
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

describe('initiator(vpc)', () => {
  it('should create the connection to igw', () => {
    const vpcIgwConnections: ServiceConnection[] = initiatorGetConnectionsResult
      .find(v => vpcId in v)[vpcId]
      .find((c: ServiceConnection) => c.field === services.igw)
    expect(vpcIgwConnections).toBeTruthy()
  })
})

afterAll(done => {
  igw.deleteVpc({ VpcId: vpcId }, () => done())
  igw.deleteInternetGateway({ InternetGatewayId: igwId }, () => done())
})
