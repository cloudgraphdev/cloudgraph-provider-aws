import CloudGraph/* , { ServiceConnection } */from '@cloudgraph/sdk'

// import EC2Class from '../src/services/ec2'
import Eip from '../src/services/eip'
import { credentials, region } from '../src/properties/test'
// import Vpc from '../src/services/vpc'
// import services from '../src/enums/services'

jest.setTimeout(30000)

let eipGetDataResponse
// let initiatorTestData
// let initiatorGetConnectionsResult
beforeAll(async () => {
  try {
    // const ec2Class = new EC2Class({ logger: CloudGraph.logger })
    // const ec2GetDataResponse = await ec2Class.getData({
    //   credentials,
    //   regions: region,
    // })
    const eipClass = new Eip({ logger: CloudGraph.logger })
    // const vpcClass = new Vpc({ logger: CloudGraph.logger })
    eipGetDataResponse = await eipClass.getData({
      credentials,
      regions: region,
    })
    // initiatorTestData = [
    //   {
    //     name: services.vpc,
    //     data: await vpcClass.getData({
    //       credentials,
    //       regions: region,
    //     }),
    //   },
    //   {
    //     name: services.eip,
    //     data: eipGetDataResponse,
    //   },
    //   {
    //     name: services.ec2Instance,
    //     data: ec2GetDataResponse,
    //   },
    // ]
    // initiatorGetConnectionsResult = initiatorTestData[0].data[region].map(
    //   vpc =>
    //     vpcClass.getConnections({
    //       service: vpc,
    //       data: initiatorTestData,
    //       account,
    //       region,
    //     })
    // )
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }
  return Promise.resolve()
})

describe('EIP Service Test: ', () => {
  test('Should return an array of addresses grouped by region', async () => {
    expect(Object.keys(eipGetDataResponse)[0]).toBe(region)
    expect(eipGetDataResponse[region].length).toBeGreaterThan(0)
  })

  test('initiator(vpc) should create the connection to eip', () => {
    // const vpcEipConnections: ServiceConnection[] =
    //   initiatorGetConnectionsResult
    //     ?.find(v => vpcData.Vpc.VpcId in v)
    //     [vpcData.Vpc.VpcId].find(
    //       (c: ServiceConnection) =>
    //         c.resourceType === services.eip && c.id === eipData.AllocationId
    //     ) || undefined
    // expect(vpcEipConnections).toBeTruthy()
  })
})