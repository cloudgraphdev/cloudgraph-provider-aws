import BaseService from '../base'
import format from './format'
import getData from './data'
import mutation from './mutation'
import { Service } from 'cloud-graph-sdk'

export default class CloudWatch extends BaseService implements Service {
  format = format.bind(this)
  getData = getData.bind(this)
  mutation = mutation
}
