import CloudGraph from '@cloudgraph/sdk'

import EfsMountTarget from '../src/services/efsMountTarget'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'
import { RawAwsEfsMountTarget } from '../src/services/efsMountTarget/data'

describe('EFS Mount Target Test: ', () => {

  initTestConfig()

  describe('getData', () => {
    test.todo('should return a truthy value ')

    test.todo('should return data from a region in the correct format')
  })

  describe('format', () => {
    test.todo('should return data in the correct format matching the schema type')
  })

  describe('connections', () => {
    test.todo('should verify the connections to instances')
  })
})