// file: cloudwatch.test.ts
import CloudGraph from '@cloudgraph/sdk'
import Cloudwatch from '../src/services/cloudwatch'

// TODO: Probably solved by ENG-89
const credentials = {
  accessKeyId: 'test',
  secretAccessKey: 'test',
}

// TODO: Single region for now to match free license Localstack limitation
const regions = 'us-east-1'

test('should be a valid request', async () => {
  const config = { logger: CloudGraph.logger }
  const classInstance = new Cloudwatch(config)
  const response = await classInstance.getData({ credentials, regions })
  expect(response[regions][0].tags).toBeDefined()
})
