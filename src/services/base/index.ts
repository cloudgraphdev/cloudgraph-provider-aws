import {Logger} from 'cloud-graph-sdk'

export default class BaseService {
  constructor(config: any) {
    this.logger = config.logger
  }

  logger: Logger
}