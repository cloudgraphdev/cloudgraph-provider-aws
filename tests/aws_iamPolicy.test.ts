import CloudGraph from '@cloudgraph/sdk'

import IamPolicyService from '../src/services/iamPolicy'
import { account, credentials, region } from '../src/properties/test'
import { globalRegionName } from '../src/enums/regions'
import { initTestConfig } from '../src/utils'
import kebabCase from 'lodash/kebabCase'
import resources from '../src/enums/resources'

describe('IAM Policy Service Test: ', () => {
  let getDataResult
  let formatResult
  initTestConfig()

  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const iamPolicy = new IamPolicyService({
        logger: CloudGraph.logger,
      })

      getDataResult = await iamPolicy.getData({
        credentials,
        regions: globalRegionName,
      })

      formatResult = (getDataResult?.[globalRegionName] || []).map(
        iamPolicyData =>
          iamPolicy.format({ service: iamPolicyData, region, account })
      )
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
    }
    return Promise.resolve()
  })

  describe('getData', () => {
    test('should return a truthy value ', () => {
      expect(getDataResult).toBeTruthy()
    })

    test('should return data from a region in the correct format', async () => {
      expect(getDataResult?.[globalRegionName]).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            PolicyId: expect.any(String),
            PolicyName: expect.any(String),
            Arn: expect.any(String),
            Path: expect.any(String),
            Document: expect.any(String),
            DefaultVersionId: expect.any(String),
            AttachmentCount: expect.any(Number),
            CreateDate: expect.any(Date),
            UpdateDate: expect.any(Date),
            region: expect.any(String),
          }),
        ])
      )
    })
  })

  describe('format', () => {
    test('should return data in the correct format matching the schema type', () => {
      expect(formatResult).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            accountId: expect.any(String),
            name: expect.any(String),
            arn: expect.any(String),
            description: expect.any(String),
            path: expect.any(String),
            policyContent: expect.objectContaining({
              id: expect.any(String),
              statement: expect.arrayContaining([
                expect.objectContaining({
                  action: expect.arrayContaining([expect.any(String)]),
                  effect: expect.any(String),
                  resource: expect.arrayContaining([expect.any(String)]),
                }),
              ]),
              version: expect.any(String),
            }),
          }),
        ])
      )
    })

    test('should return data in the correct format using default values when fields are not available', () => {
      const iamPolicy = new IamPolicyService({
        logger: CloudGraph.logger,
      })

      const result = iamPolicy.format({ service: {}, region, account })

      expect(result).toEqual(
        expect.objectContaining({
          id: `--${kebabCase(resources.iamPolicy)}`,
          accountId: account,
          name: '',
          arn: '',
          description: '',
          path: '',
          policyContent: null,
          tags: [],
        })
      )
    })
  })
})
