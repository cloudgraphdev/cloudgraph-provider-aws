import CloudGraph from '@cloudgraph/sdk'
import EIPService from '../src/services/eip'

const credentials = {
  accessKeyId: 'test',
  secretAccessKey: 'test',
}

const regions = 'us-east-1'

describe('EIP Service Test: ', () => {
  test('Should return an array of addresses grouped by region', async () => {
    const config = { logger: CloudGraph.logger }
    const classInstance = new EIPService(config)
    const response = await classInstance.getData({ credentials, regions })
    expect(Object.keys(response)[0]).toBe(regions)
    expect(response[regions].length).toBeGreaterThan(0)
  })
})
