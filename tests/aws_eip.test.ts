import { EC2 } from 'aws-sdk'
import CloudGraph from '@cloudgraph/sdk'

import environment from '../src/config/environment'
import EIPService from '../src/services/eip'

const credentials = {
  accessKeyId: 'test',
  secretAccessKey: 'test',
}

const regions = 'us-east-1'
const ec2 = new EC2({
  region: regions,
  credentials,
  endpoint: environment.LOCALSTACK_AWS_ENDPOINT,
})

let publicIp = ''

describe('EIP Service Test: ', () => {
  beforeAll(done => {
    // Create new Elastic IP
    ec2.allocateAddress((error, data) => {
      publicIp = data.PublicIp
      done()
    })
  })

  test('Should return an array of addresses grouped by region', async () => {
    const config = { logger: CloudGraph.logger }
    const classInstance = new EIPService(config)
    const response = await classInstance.getData({ credentials, regions })
    expect(Object.keys(response)[0]).toBe(regions)
    expect(response[regions].length).toBeGreaterThan(0)
  })

  afterAll(done => {
    ec2.releaseAddress({ PublicIp: publicIp }, () => done())
  })
})
