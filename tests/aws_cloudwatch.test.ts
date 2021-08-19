// file: cloudwatch.test.ts
import CloudGraph from '@cloudgraph/sdk'

import Cloudwatch from '../src/services/cloudwatch'
import { credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'

initTestConfig()

it('should be a valid request', async () => {
  const config = { logger: CloudGraph.logger }
  const classInstance = new Cloudwatch(config)
  const response = await classInstance.getData({ credentials, regions: region })
  expect(response[region][0].tags).toBeDefined()
})
