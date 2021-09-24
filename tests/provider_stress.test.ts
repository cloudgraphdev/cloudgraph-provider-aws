import CloudGraph from '@cloudgraph/sdk'
import services from '../src/enums/services'
import Provider from '../src/services'
import { initTestConfig } from '../src/utils'

const { logger } = CloudGraph

const executeGetDataNTimesInParallel = async (times: number) => {
  const array: number[] = [...Array(times).keys()]
  const client = new Provider({
    logger,
  })
  client.config = {
    regions: 'us-east-1,us-east-2',
    resource: Object.values(services).join(',')
  }
  const clientInterfaceSpy = jest.spyOn(client.interface, 'prompt')
  clientInterfaceSpy.mockResolvedValueOnce({ approved: true })
  await Promise.all(
    array.map(_ =>
      client.getData({ opts: { logger, devMode: false, debug: true } })
    )
  )
}

initTestConfig()
jest.mock('inquirer')

// Skipped
xdescribe('Stress Test: ', () => {
  beforeAll(
    async () =>
      new Promise<void>(async resolve => {
        resolve()
      })
  )

  // This doesn't assert anything, I'm leaving it here for future tests
  describe('Tries 100 getData in parallel', () => {
    test('should return too many connections error', async () => {
      await executeGetDataNTimesInParallel(100)
    })
  })
})
