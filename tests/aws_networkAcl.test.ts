import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'

import NetworkAclClass from '../src/services/nacl'
// import SubnetClass from '../src/services/subnet'
import VpcClass from '../src/services/vpc'
import { RawAwsNetworkAcl } from '../src/services/nacl/data'
import { credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'

describe('NACL Service Test: ', () => {
  let getDataResult
  let formatResult
  let initiatorConnections
  let naclId

  initTestConfig()

  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const naclClass = new NetworkAclClass({ logger: CloudGraph.logger })
          // const subnetClass = new SubnetClass({ logger: CloudGraph.logger })
          const vpcClass = new VpcClass({ logger: CloudGraph.logger })

          getDataResult = await naclClass.getData({
            credentials,
            regions: region,
          })
          formatResult = getDataResult[region].map((item: RawAwsNetworkAcl) =>
            naclClass.format({ service: item, region })
          )
          const [nacl] = getDataResult[region]
          naclId = nacl.NetworkAclId
          initiatorConnections = naclClass.getConnections({
            service: nacl,
            region,
            data: [
              {
                name: services.vpc,
                data: await vpcClass.getData({
                  credentials,
                  regions: region,
                }),
              },
              // {
              //   name: services.subnet,
              //   data: await subnetClass.getData({
              //     credentials,
              //     regions: region,
              //   }),
              // },
              {
                name: services.nacl,
                data: getDataResult,
              },
            ],
          })
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
        }
        resolve()
      })
  )

  describe('getData', () => {
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', () => {
      expect(getDataResult[region]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            NetworkAclId: expect.any(String),
            IsDefault: expect.any(Boolean),
            VpcId: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('format', () => {
    test('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            arn: expect.any(String),
            vpcId: expect.any(String),
            region: expect.any(String),
            associatedSubnets: expect.arrayContaining([
              expect.objectContaining({
                networkAclAssociationId: expect.any(String),
                subnetId: expect.any(String),
              }),
            ]),
            inboundRules: expect.arrayContaining([
              expect.objectContaining({
                allowOrDeny: expect.any(String),
                ruleNumber: expect.any(Number),
                protocol: expect.any(String),
                portRange: expect.any(String),
              }),
            ]),
            outboundRules: expect.arrayContaining([
              expect.objectContaining({
                allowOrDeny: expect.any(String),
                ruleNumber: expect.any(Number),
                protocol: expect.any(String),
                portRange: expect.any(String),
              }),
            ]),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connections to vpc', () => {
      const connections = initiatorConnections[naclId]?.filter(
        (c: ServiceConnection) => c.resourceType === services.vpc
      )
      expect(connections).toBeDefined()
      expect(connections.length).toBe(1)
    })
  })
})
