import CloudGraph from '@cloudgraph/sdk'
import RSClass from '../src/services/redshift'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'
import { RawAwsRedshiftCluster } from '../src/services/redshift/data'

describe('Redshift Cluster Service Test: ', () => {

  initTestConfig()

  describe('getData', () => {
    test.todo('should return a truthy value ')

    test.todo('should return data from a region in the correct format')
  })

  describe('format', () => {
    test.todo('should return data in the correct format matching the schema type')
  })
})