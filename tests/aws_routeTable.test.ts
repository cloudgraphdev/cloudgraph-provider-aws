import CloudGraph from '@cloudgraph/sdk'
import RouteTableService from '../src/services/routeTable'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

describe('Route Table Service Test: ', () => {
  let getDataResult
  let formatResult
  let instanceId
  initTestConfig()
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        getDataResult = {}
        formatResult = {}
        try {
          const routeTableService = new RouteTableService({
            logger: CloudGraph.logger,
          })

          // Get Route Table data
          getDataResult = await routeTableService.getData({
            credentials,
            regions: region,
          })

          // Format Route Table data
          formatResult = getDataResult[region].map(routeTableData =>
            routeTableService.format({
              service: routeTableData,
              region,
              account,
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
            RouteTableId: expect.any(String),
            VpcId: expect.any(String),
            Routes: expect.arrayContaining([
              expect.objectContaining({
                DestinationCidrBlock: expect.any(String),
                GatewayId: expect.any(String),
                Origin: expect.any(String),
                State: expect.any(String),
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
            vpcId: expect.any(String),
            mainRouteTable: expect.any(Boolean),
            subnetAssociations: expect.arrayContaining<String>([]),
            routes: expect.arrayContaining([
              expect.objectContaining({
                destination: expect.any(String),
                target: expect.any(String),
              }),
            ]),
            explicitlyAssociatedWithSubnets: expect.any(Number),
          }),
        ])
      )
    })
  })
})
