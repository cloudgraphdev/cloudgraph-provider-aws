import CloudGraph from '@cloudgraph/sdk'

import ALBService from '../src/services/alb'
import ELBService from '../src/services/elb'
import Route53RecordService from '../src/services/route53Record'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'
import last from 'lodash/last'
import kebabCase from 'lodash/kebabCase'
import resources from '../src/enums/resources'

xdescribe('Route53 Record Service Test: ', () => {
  let getDataResult
  let formatResult
  let route53Connections
  let recordId
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      // TODO: Test when Localstack PRO is enabled
      // const elbService = new ELBService({
      //   logger: CloudGraph.logger,
      // })
      // const albService = new ALBService({
      //   logger: CloudGraph.logger,
      // })
      const recordService = new Route53RecordService({
        logger: CloudGraph.logger,
      })
      getDataResult = await recordService.getData({
        credentials,
        regions: region,
      })

      formatResult = (getDataResult?.global || []).map(recordData =>
        recordService.format({ service: recordData, region, account })
      )

      // // Get ELB data
      // const elbData = await elbService.getData({
      //   credentials,
      //   regions: region,
      // })

      // // Get ALB data
      // const albData = await albService.getData({
      //   credentials,
      //   regions: region,
      // })

      // const [route53Record] = getDataResult.global
      // const { HostedZoneId: Id, Name: name, Type: type } = route53Record

      // const hostedZoneId = getHostedZoneId(Id)

      // recordId = getRecordId({ hostedZoneId, name, type })

      // route53Connections = recordService.getConnections({
      //   service: getDataResult,
      //   data: [
      //     {
      //       name: services.elb,
      //       data: elbData,
      //       account,
      //       region,
      //     },
      //     {
      //       name: services.alb,
      //       data: albData,
      //       account,
      //       region,
      //     },
      //   ],
      //   region,
      //   account,
      // })
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
            HostedZoneId: expect.any(String),
            Name: expect.any(String),
            TTL: expect.any(Number),
            Type: expect.any(String),
            ResourceRecords: expect.arrayContaining([
              expect.objectContaining({
                Value: expect.any(String),
              }),
            ]),
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
            zoneId: expect.any(String),
            ttl: expect.any(Number),
            type: expect.any(String),
            alias: expect.objectContaining({
              evaluateTargetHealth: expect.any(Boolean),
              name: expect.any(String),
              zoneId: expect.any(String),
            }),
            records: expect.arrayContaining<String>([]),
          }),
        ])
      )
    })
  })

  // TODO: Test when Localstack PRO is enabled
  describe.skip('connections', () => {
    test('should verify the connection to alb', () => {
      const sgConnections = route53Connections[recordId]?.filter(
        connection => connection.resourceType === services.alb
      )

      expect(sgConnections).toBeDefined()
      expect(sgConnections.length).toBe(1)
    })

    test('should verify the connection to elb', () => {
      const ec2Connections = route53Connections[recordId]?.filter(
        connection => connection.resourceType === services.elb
      )

      expect(ec2Connections).toBeDefined()
      expect(ec2Connections.length).toBe(1)
    })
  })
})
