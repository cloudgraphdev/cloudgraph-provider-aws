import CloudGraph from '@cloudgraph/sdk'

import IamPolicyService from '../src/services/iamPolicy'
import IamRoleService from '../src/services/iamRole'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'
import { globalRegionName } from '../src/enums/regions'
import kebabCase from 'lodash/kebabCase'
import resources from '../src/enums/resources'

describe('IAM Role Service Test: ', () => {
  let getDataResult
  let formatResult
  let roleConnections
  let roleId
  let roleName
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const iamPolicyService = new IamPolicyService({
        logger: CloudGraph.logger,
      })
      const iamRoleService = new IamRoleService({
        logger: CloudGraph.logger,
      })
      getDataResult = await iamRoleService.getData({
        credentials,
        regions: globalRegionName,
      })

      formatResult = (getDataResult?.[globalRegionName] || []).map(
        iamGroupData =>
          iamRoleService.format({ service: iamGroupData, region, account })
      )

      // // Get Policy data
      const policyData = await iamPolicyService.getData({
        credentials,
        regions: globalRegionName,
      })

      const iamRole = getDataResult?.[globalRegionName]?.find(
        ({ RoleName }) => RoleName === 'test_role'
      )
      const { RoleId, RoleName } = iamRole
      roleId = RoleId
      roleName = RoleName

      roleConnections = iamRoleService.getConnections({
        service: iamRole,
        data: [
          {
            name: services.iamPolicy,
            data: policyData,
            account,
            region,
          },
        ],
        region,
        account,
      })
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
            Arn: expect.any(String),
            RoleId: expect.any(String),
            RoleName: expect.any(String),
            Path: expect.any(String),
            AssumeRolePolicyDocument: expect.any(String),
            CreateDate: expect.any(Date),
            MaxSessionDuration: expect.any(Number),
            Policies: expect.arrayContaining<String>([]),
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
            arn: expect.any(String),
            name: expect.any(String),
            path: expect.any(String),
            accountId: expect.any(String),
            assumeRolePolicy: null,
            createdAt: expect.any(String),
            description: expect.any(String),
            maxSessionDuration: expect.any(Number),
            inlinePolicies: expect.arrayContaining<String>([]),
          }),
        ])
      )
    })

    test('should return data in the correct format using default values when fields are not available', () => {
      const iamRoleService = new IamRoleService({
        logger: CloudGraph.logger,
      })

      const result = iamRoleService.format({ service: {}, region, account })

      expect(result).toEqual(
        expect.objectContaining({
          id: `--${kebabCase(resources.iamRole)}`,
          arn: '',
          name: '',
          path: '',
          accountId: account,
          assumeRolePolicy: null,
          createdAt: '',
          description: '',
          maxSessionDuration: 0,
          inlinePolicies: [],
          tags: [],
        })
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to Attached Policies', () => {
      const policiesConnections = roleConnections[
        `${roleName}-${roleId}-${kebabCase(resources.iamRole)}`
      ]?.filter(connection => connection.resourceType === services.iamPolicy)

      expect(policiesConnections).toBeDefined()
      expect(policiesConnections.length).toBe(1)
    })
  })
})
