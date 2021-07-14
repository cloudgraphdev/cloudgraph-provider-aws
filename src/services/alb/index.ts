import format from './format'
import getData from './data'
import getConnections from './connections'
import mutation from './mutation'
import {Service} from 'cloud-graph-sdk'

export default class Alb implements Service {
  format = format
  getData = getData
  getConnections = getConnections
  mutation = mutation
}