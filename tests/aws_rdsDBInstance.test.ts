import CloudGraph from '@cloudgraph/sdk'

import RDSDbInstance from '../src/services/rdsDbInstance'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'
import { RawAwsRDSDbInstance } from '../src/services/rdsDbInstance/data'

describe('RDS DB Cluster Service Test: ', () => {

  initTestConfig()

  describe('getData', () => {
    test.todo('should return a truthy value ')

    test.todo('should return data from a region in the correct format')
  })

  describe('format', () => {
    test.todo('should return data in the correct format matching the schema type')
  })

})
