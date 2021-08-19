describe('ALB', () => {
  it.todo('To be enable when integrated with Localstack Pro version')
})
// import CloudGraph, { ServiceConnection } from '@cloudgraph/sdk'
// import { credentials, region, account } from '../src/properties/test'

// import Alb from '../src/services/alb/index'
// import Vpc from '../src/services/vpc'
// import services from '../src/enums/services'
// import { RawAwsAlb } from '../src/services/alb/data'
// import { AwsAlb } from '../src/types/generated'

// jest.setTimeout(30000)

// let getData: RawAwsAlb[]
// let formatData: AwsAlb[]
// let initiatorTestData: Array<{
//   name: string
//   data: { [property: string]: any[] }
// }>
// let initiatorGetConnectionsResult: Array<{
//   [property: string]: ServiceConnection[]
// }>
// beforeAll(async () => {
//   try {
//     const albClass = new Alb({ logger: CloudGraph.logger })
//     const vpcClass = new Vpc({ logger: CloudGraph.logger })
//     getData = await albClass.getData({
//       credentials,
//       regions: region,
//     })
//     formatData = getData[region].map(item =>
//       albClass.format({ service: item, region, account })
//     )
//     initiatorTestData = [
//       {
//         name: services.vpc,
//         data: await vpcClass.getData({
//           credentials,
//           regions: region,
//         }),
//       },
//       {
//         name: services.alb,
//         data: getData,
//       },
//     ]
//     initiatorGetConnectionsResult = initiatorTestData[0].data[region].map(vpc =>
//       vpcClass.getConnections({
//         service: vpc,
//         data: initiatorTestData,
//         account,
//         region,
//       })
//     )
//     return Promise.resolve()
//   } catch (error) {
//     console.error(error) // eslint-disable-line no-console
//     return Promise.reject()
//   }
// })

// describe('getData', () => {
//   it('should return a truthy value ', () => {
//     expect(getData).toBeTruthy()
//   })

//   it('should return data from a region in the correct format', async () => {
//     expect(getData[region]).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           Attachments: expect.arrayContaining([
//             expect.objectContaining({
//               State: expect.any(String),
//               VpcId: expect.any(String),
//             }),
//           ]),
//           InternetGatewayId: expect.any(String),
//           // TODO: Haven't found a way to match this as an optional property
//           // OwnerId: expect.any(String) || expect.any(undefined),
//           Tags: expect.arrayContaining([
//             expect.objectContaining({
//               key: expect.any(String),
//               value: expect.any(String),
//             }),
//           ]),
//           region: expect.any(String),
//         }),
//       ])
//     )
//   })
// })

// describe('format', () => {
//   it('should return data in wthe correct format matching the schema type', () => {
//     expect(formatData).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           arn: expect.any(String),
//           attachments: expect.arrayContaining([
//             expect.objectContaining({
//               state: expect.any(String),
//               vpcId: expect.any(String),
//             }),
//           ]),
//           id: expect.any(String),
//           // TODO: Haven't found a way to match this as an optional property
//           // owner: expect.any(String),
//           tags: expect.arrayContaining([
//             expect.objectContaining({
//               key: expect.any(String),
//               value: expect.any(String),
//             }),
//           ]),
//         }),
//       ])
//     )
//   })
// })

// describe('initiator(vpc)', () => {
//   it('should create the connection to alb', () => {
//     const vpcAlbConnections: ServiceConnection[] = []
//     initiatorGetConnectionsResult.map(
//       (vpc: { [property: string]: ServiceConnection[] }) => {
//         const connections: ServiceConnection[] = vpc[Object.keys(vpc)[0]]
//         vpcAlbConnections.push(
//           ...connections.filter(c => c.resourceType === services.alb)
//         )
//       }
//     )
//     expect(initiatorGetConnectionsResult).toEqual(
//       expect.arrayContaining([expect.any(Object)])
//     )
//     expect(getData[region].length).toStrictEqual(
//       vpcAlbConnections.length
//     )
//   })
// })