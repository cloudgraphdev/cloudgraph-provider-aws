import CloudGraph from '@cloudgraph/sdk'
import Vpc from '../src/services/vpc'
import { credentials, region, account } from '../src/properties/test'

describe('VPC Service Test: ', () => {
  let getDataResult
  let formatResult
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const vpcClass = new Vpc({ logger: CloudGraph.logger })
          getDataResult = await vpcClass.getData({
            credentials,
            regions: region,
          })
          formatResult = getDataResult[region].map(igw =>
            vpcClass.format({ service: igw, region, account })
          )
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
            CidrBlock: expect.any(String),
            DhcpOptionsId: expect.any(String),
            State: expect.any(String),
            VpcId: expect.any(String),
            InstanceTenancy: expect.any(String),
            // Ipv6CidrBlockAssociationSet: [],
            CidrBlockAssociationSet: expect.arrayContaining([
              expect.objectContaining({
                AssociationId: expect.any(String),
                CidrBlock: expect.any(String),
                CidrBlockState: expect.objectContaining({
                  State: expect.any(String),
                }),
              }),
            ]),
            IsDefault: expect.any(Boolean),
            region: expect.any(String),
            EnableDnsSupport: expect.any(Boolean),
            EnableDnsHostnames: expect.any(Boolean),
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
    test('should return data in wthe correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            arn: expect.any(String),
            ipV4Cidr: expect.any(String),
            ipV6Cidr: expect.any(String),
            dhcpOptionsSet: expect.any(String),
            instanceTenancy: expect.any(String),
            // enableDnsSupport: expect.any(Boolean),
            // enableDnsHostnames: expect.any(Boolean),
            state: expect.any(String),
            defaultVpc: expect.any(Boolean),
            // tags,
          }),
        ])
      )
    })
  })
})
