// file: awsNatGateway.test.ts
import CloudGraph from '@cloudgraph/sdk'

import NatGWClass from '../src/services/natGateway'
import { RawAwsNATGateway } from '../src/services/natGateway/data'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

initTestConfig()
let getDataResult
let formatResult
beforeAll(
  async () =>
    new Promise<void>(async (resolve, reject) => {
      try {
        const natGWClass = new NatGWClass({ logger: CloudGraph.logger })
        getDataResult = await natGWClass.getData({
          credentials,
          regions: region,
        })
        formatResult = getDataResult[region].map((item: RawAwsNATGateway) =>
          natGWClass.format({ service: item, region, account })
        )
        resolve()
      } catch (error) {
        console.error(error) // eslint-disable-line no-console
        reject()
      }
    })
)

describe('getData', () => {
  it('should return a truthy value ', () => {
    expect(getDataResult).toBeTruthy()
  })

  it('should return data from a region in the correct format', () => {
    expect(getDataResult[region]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          CreateTime: expect.any(Date),
          NatGatewayAddresses: expect.arrayContaining([
            expect.objectContaining({
              AllocationId: expect.any(String),
              NetworkInterfaceId: expect.any(String),
              PrivateIp: expect.any(String),
              PublicIp: expect.any(String),
            })
          ]),
          NatGatewayId: expect.any(String),
          State: expect.any(String),
          SubnetId: expect.any(String),
          VpcId: expect.any(String),
          region: expect.any(String),
          // Tags: expect.arrayContaining([
          //   expect.objectContaining({
          //     key: expect.any(String),
          //     value: expect.any(String),
          //   }),
          // ]),
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
          id: expect.any(String),
          arn: expect.any(String),
          state: expect.any(String),
          // subnetId: expect.any(String),
          createTime: expect.any(String),
          // tags,
        }),
      ])
    )
  })
})
