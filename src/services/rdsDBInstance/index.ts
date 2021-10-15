import { Service } from '@cloudgraph/sdk'
import BaseService from '../base'
import getConnections from './connections'
import format from './format'
import getData from './data'
import mutation from './mutation'

export default class RDSDbInstance extends BaseService implements Service {
  format = format.bind(this)

  getConnections = getConnections.bind(this)

  getData = getData.bind(this)

  mutation = mutation
}
