import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'

import Igw from '../src/services/igw'
import Vpc from '../src/services/vpc'
import services from '../src/enums/services'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import { AwsIgw } from '../src/types/generated'
import { RawAwsIgw } from '../src/services/igw/data'

let getDataResult: RawAwsIgw[]
let formatResult: AwsIgw[]
let initiatorTestData: Array<{
  name: string
  data: { [property: string]: any[] }
}>
let initiatorGetConnectionsResult: Array<{
  [property: string]: ServiceConnection[]
}>
describe('IGW Service Test: ', () => {
  initTestConfig()

  beforeAll(async () => {
    try {
      const igwClass = new Igw({ logger: CloudGraph.logger })
      const vpcClass = new Vpc({ logger: CloudGraph.logger })
      getDataResult = await igwClass.getData({
        credentials,
        regions: region,
      })
      formatResult = getDataResult[region].map(igw =>
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
          data: getDataResult,
        },
      ]
      initiatorGetConnectionsResult = initiatorTestData[0].data[region].map(
        vpc =>
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

  it('should return a truthy value ', () => {
    expect(getDataResult).toBeTruthy()
  })

  it('getData: should return data from a region in the correct format', async () => {
    expect(getDataResult[region]).toEqual(
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
          // Tags: expect.arrayContaining([
          //   expect.objectContaining({
          //     key: expect.any(String),
          //     value: expect.any(String),
          //   }),
          // ]),
          region: expect.any(String),
        }),
      ])
    )
  })

  it('format: should return data in wthe correct format matching the schema type', () => {
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

  it('initiator(vpc): should verify the connection to igw', () => {
    const vpcIgwConnections: ServiceConnection[] = []
    initiatorGetConnectionsResult.map(
      (vpc: { [property: string]: ServiceConnection[] }) => {
        const connections: ServiceConnection[] = vpc[Object.keys(vpc)[0]]
        vpcIgwConnections.push(
          ...connections.filter(c => c.resourceType === services.igw)
        )
      }
    )
    expect(initiatorGetConnectionsResult).toEqual(
      expect.arrayContaining([expect.any(Object)])
    )
    expect(getDataResult[region].length).toStrictEqual(vpcIgwConnections.length)
  })
})
