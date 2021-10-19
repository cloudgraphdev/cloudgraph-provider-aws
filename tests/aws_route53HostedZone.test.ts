import CloudGraph from '@cloudgraph/sdk'

import Route53HostedZoneService from '../src/services/route53HostedZone'
import VPCService from '../src/services/vpc'
import Route53RecordService from '../src/services/route53Record'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'
import { getHostedZoneId } from '../src/utils/ids'

xdescribe('Route53 Hosted Zone Service Test: ', () => {
  let getDataResult
  let formatResult
  let route53Connections
  let hostedZoneId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const vpcService = new VPCService({ logger: CloudGraph.logger })
      const recordService = new Route53RecordService({
        logger: CloudGraph.logger,
      })
      const hostedZoneService = new Route53HostedZoneService({
        logger: CloudGraph.logger,
      })
      getDataResult = await hostedZoneService.getData({
        credentials,
        regions: region,
      })

      formatResult = (getDataResult?.global || []).map(hostedZoneData =>
        hostedZoneService.format({ service: hostedZoneData, region, account })
      )

      // // Get VPC data
      const vpcData = await vpcService.getData({
        credentials,
        regions: region,
      })

      // // Get Records data
      const recordData = await recordService.getData({
        credentials,
        regions: region,
      })

      const route53HostedZone = getDataResult.global.find(
        ({ Name }) => Name === 'cloudgraph.com.'
      )
      const { Id } = route53HostedZone

      hostedZoneId = getHostedZoneId(Id)

      route53Connections = hostedZoneService.getConnections({
        service: route53HostedZone,
        data: [
          {
            name: services.vpc,
            data: vpcData,
            account,
            region,
          },
          {
            name: services.route53Record,
            data: recordData,
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

  describe('getData', () => {
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', async () => {
      expect(getDataResult.global).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            Id: expect.any(String),
            Name: expect.any(String),
            ResourceRecordSetCount: expect.any(Number),
            Config: expect.objectContaining({
              Comment: expect.any(String),
              PrivateZone: expect.any(Boolean),
            }),
            DelegationSet: expect.objectContaining({
              NameServers: expect.arrayContaining<String>([]),
            }),
            VPCs: expect.arrayContaining<String>([]),
            region: expect.any(String),
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
            name: expect.any(String),
            comment: expect.any(String),
            delegationSetId: expect.any(String),
            nameServers: expect.arrayContaining<String>([]),
          }),
        ])
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to route53 records', () => {
      const recordConnections = route53Connections[hostedZoneId]?.filter(
        connection => connection.resourceType === services.route53Record
      )

      expect(recordConnections).toBeDefined()
      expect(recordConnections.length).toBe(2)
    })

    test('should verify the connection to vpc', () => {
      const vpcConnections = route53Connections[hostedZoneId]?.filter(
        connection => connection.resourceType === services.vpc
      )

      expect(vpcConnections).toBeDefined()
      expect(vpcConnections.length).toBe(0)
    })
  })
})
