import { Service } from '@cloudgraph/sdk'
import BaseService from '../base'
import format from './format'
import getConnections from '../systemsManagerAssociation/connections';
import getData from './data'
import mutation from './mutation'

export default class SystemManagerAssociation extends BaseService implements Service {
  format = format.bind(this)

  getConnections = getConnections.bind(this)

  getData = getData.bind(this)

  mutation = mutation
}