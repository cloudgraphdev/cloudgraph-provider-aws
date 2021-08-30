import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'

import services from '../src/enums/services'
import SgClass from '../src/services/securityGroup'
import LambdaClass from '../src/services/lambda'
import { AwsSecurityGroup } from '../src/services/securityGroup/data'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

describe('SG Service Test: ', () => {
  let getDataResult
  let formatResult
  let initiatorTestData: Array<{
    name: string
    data: { [property: string]: any[] }
  }>
  let initiatorGetConnectionsResult: Array<{
    [property: string]: ServiceConnection[]
  }>
  initTestConfig()
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        try {
          const sgClass = new SgClass({ logger: CloudGraph.logger })
          const lambdaClass = new LambdaClass({ logger: CloudGraph.logger })
          getDataResult = await sgClass.getData({
            credentials,
            regions: region,
          })
          formatResult = getDataResult[region].map((item: AwsSecurityGroup) =>
            sgClass.format({ service: item, region, account })
          )
          initiatorTestData = [
            {
              name: services.lambda,
              data: await lambdaClass.getData({
                credentials,
                regions: region,
              }),
            },
            {
              name: services.sg,
              data: getDataResult,
            },
          ]
          initiatorGetConnectionsResult = initiatorTestData[0].data[region].map(
            item =>
              lambdaClass.getConnections({
                service: item,
                data: initiatorTestData,
                account,
                region,
              })
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
            Description: expect.any(String),
            GroupName: expect.any(String),
            // TODO: Conditional matching
            // IpPermissions: expect.arrayContaining([
            //   expect.objectContaining({
            //     FromPort: expect.any(Number),
            //     IpProtocol: expect.any(String),
            //     IpRanges: expect.arrayContaining([
            //       expect.objectContaining({
            //         CidrIp: expect.any(String),
            //         Description: expect.any(String),
            //       }),
            //     ]),
            //     Ipv6Ranges: expect.arrayContaining([
            //       expect.objectContaining({
            //         CidrIpv6: expect.any(String),
            //         Description: expect.any(String),
            //       }),
            //     ]),
            //     PrefixListIds: expect.arrayContaining([
            //       expect.objectContaining({
            //         Description: expect.any(String),
            //         PrefixListId: expect.any(String),
            //       })
            //     ]),
            //     ToPort: expect.any(Number),
            //     UserIdGroupPairs: expect.arrayContaining([expect.objectContaining({
            //       Description: expect.any(String),
            //       GroupId: expect.any(String),
            //       GroupName: expect.any(String),
            //       PeeringStatus: expect.any(String),
            //       UserId: expect.any(String),
            //       VpcId: expect.any(String),
            //       VpcPeeringConnectionId: expect.any(String),
            //     })])
            //   }),
            // ]),
            OwnerId: expect.any(String),
            GroupId: expect.any(String),
            // TODO: Conditional matching
            // IpPermissionsEgress: expect.arrayContaining([
            //   expect.objectContaining({
            //     FromPort: expect.any(Number),
            //     IpProtocol: expect.any(String),
            //     IpRanges: expect.arrayContaining([
            //       expect.objectContaining({
            //         CidrIp: expect.any(String),
            //         Description: expect.any(String),
            //       }),
            //     ]),
            //     Ipv6Ranges: expect.arrayContaining([
            //       expect.objectContaining({
            //         CidrIpv6: expect.any(String),
            //         Description: expect.any(String),
            //       }),
            //     ]),
            //     PrefixListIds: expect.arrayContaining([
            //       expect.objectContaining({
            //         Description: expect.any(String),
            //         PrefixListId: expect.any(String),
            //       })
            //     ]),
            //     ToPort: expect.any(Number),
            //     UserIdGroupPairs: expect.arrayContaining([expect.objectContaining({
            //       Description: expect.any(String),
            //       GroupId: expect.any(String),
            //       GroupName: expect.any(String),
            //       PeeringStatus: expect.any(String),
            //       UserId: expect.any(String),
            //       VpcId: expect.any(String),
            //       VpcPeeringConnectionId: expect.any(String),
            //     })])
            //   }),
            // ]),
            VpcId: expect.any(String),
            // TODO: Conditional matching
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
  })

  describe('format', () => {
    test('should return data in wthe correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            arn: expect.any(String),
            default: expect.any(Boolean),
            description: expect.any(String),
            id: expect.any(String),
            inboundRuleCount: expect.any(Number),
            name: expect.any(String),
            outboundRuleCount: expect.any(Number),
            owner: expect.any(String),
            // TODO: Conditional matching
            // vpcId: expect.any(String),
            // inboundRules: expect.arrayContaining([
            //   expect.objectContaining({
            //     protocol: expect.any(String),
            //     portRange: expect.any(String),
            //     destination: expect.any(String),
            //     description: expect.any(String),
            //   }),
            // ]),
            // outboundRules: expect.arrayContaining([
            //   expect.objectContaining({
            //     protocol: expect.any(String),
            //     portRange: expect.any(String),
            //     destination: expect.any(String),
            //     description: expect.any(String),
            //   }),
            // ]),
            // tags: expect.arrayContaining([
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

  describe('connections', () => {
    test('should verify the connections to sg', () => {
      const lambdaSgConnections: ServiceConnection[] = []
      initiatorGetConnectionsResult.map(
        (lambda: { [property: string]: ServiceConnection[] }) => {
          const connections: ServiceConnection[] =
            lambda[Object.keys(lambda)[0]]
          lambdaSgConnections.push(
            ...connections.filter(c => c.resourceType === services.sg)
          )
        }
      )
      expect(initiatorGetConnectionsResult).toEqual(
        expect.arrayContaining([expect.any(Object)])
      )
      // TODO: Think how to handle many(sg) to one(lambda) connections
    })
  })
})
