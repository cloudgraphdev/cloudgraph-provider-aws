import { Logger } from '@cloudgraph/sdk'

export interface Account {
  profile: string
  roleArn: string | undefined
  externalId: string | undefined
  accessKeyId?: string
  secretAccessKey?: string
}

export interface rawDataInterface {
  className: string
  name: string
  accountId?: string
  data: any
}
export default class BaseService {
  constructor(config: any) {
    this.logger = config.logger
  }

  logger: Logger
}
