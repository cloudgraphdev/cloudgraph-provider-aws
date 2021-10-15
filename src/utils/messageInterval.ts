import CloudGraph from '@cloudgraph/sdk'
import { MESSAGE_INTERVAL } from '../config/constants'

const { logger } = CloudGraph

export default class MessageInterval {
  constructor(resource: string) {
    this.resource = resource
  }

  private intervalId: NodeJS.Timeout

  private resource = ''

  private count = 0

  start(): void {
    this.intervalId = setInterval(
      () =>
        logger.warn(
          `Still fetching ${this.resource}... ${this.count} fetched so far`
        ),
      MESSAGE_INTERVAL
    )
  }

  updateFetchedCounter(count: number): void {
    this.count += count
  }

  stop(): void {
    clearInterval(this.intervalId)
  }
}
