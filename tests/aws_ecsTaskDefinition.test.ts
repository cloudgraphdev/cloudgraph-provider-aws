import CloudGraph from '@cloudgraph/sdk'

import EcsTaskDefinition from '../src/services/ecsTaskDefinition'
import { initTestConfig } from '../src/utils'
import { credentials, region } from '../src/properties/test'
import { RawAwsEcsTaskDefinition } from '../src/services/ecsTaskDefinition/data'

describe('ECS Task Definition Test: ', () => {

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
