import { Logger } from '@cloudgraph/sdk'

export default class BaseService {
  constructor(config: any) {
    this.logger = config.logger
  }

  logger: Logger
}
