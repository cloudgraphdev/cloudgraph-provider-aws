// file: igw.test.ts
import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'

import Igw from '../src/services/igw'
import Vpc from '../src/services/vpc'
import services from '../src/enums/services'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

initTestConfig()

jest.setTimeout(30000)

let igwGetDataResult
let formatResult
let initiatorTestData
let initiatorGetConnectionsResult
beforeAll(async () => {
  try {
    const igwClass = new Igw({ logger: CloudGraph.logger })
    const vpcClass = new Vpc({ logger: CloudGraph.logger })
    igwGetDataResult = await igwClass.getData({
      credentials,
      regions: region,
    })
    formatResult = igwGetDataResult[region].map(igw =>
      igwClass.format({ service: igw, region, account })
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
    console.error(error) // eslint-disable-line no-console
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
          // TODO: Haven't found a way to match this as an optional property
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
  it('should return data in wthe correct format matching the schema type', () => {
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
          // TODO: Haven't found a way to match this as an optional property
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

describe('IGWs', () => {
  it('should have the connection to a VPC', () => {
    expect(initiatorGetConnectionsResult.length).toEqual(
      igwGetDataResult[region].length
    )
    const lambdaKmsConnections: ServiceConnection[] =
      initiatorGetConnectionsResult
        ?.find(l => lambdaFunctionName in l)
        [lambdaFunctionName].find(
          (c: ServiceConnection) =>
            c.resourceType === services.kms && c.id === keyId
        ) || undefined
    expect(lambdaKmsConnections).toBeTruthy()
  })
})
