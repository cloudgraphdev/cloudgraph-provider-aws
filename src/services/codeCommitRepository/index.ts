import { Service } from '@cloudgraph/sdk'
import BaseService from '../base'
import getData from './data'
import format from './format'
import mutation from './mutation'

export default class CodeCommitRepository extends BaseService implements Service {
  format = format.bind(this)

  getData = getData.bind(this)

  mutation = mutation
}
