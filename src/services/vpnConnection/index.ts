import { Service } from '@cloudgraph/sdk'
import BaseService from '../base'
import format from './format'
import getData from './data'
import mutation from './mutation'

export default class VpnConnection extends BaseService implements Service {
  format = format.bind(this)

  getData = getData.bind(this)

  // TODO: Will be added when transitGateway and customerGateway services are available
  // getConnections = getConnections.bind(this)

  mutation = mutation
}
