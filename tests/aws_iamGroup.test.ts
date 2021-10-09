import CloudGraph from '@cloudgraph/sdk'
import kebabCase from 'lodash/kebabCase'

import IamPolicyService from '../src/services/iamPolicy'
import IamGroupService from '../src/services/iamGroup'
import IamUserService from '../src/services/iamUser'
import { account, credentials, region } from '../src/properties/test'
import { initTestConfig } from '../src/utils'
import services from '../src/enums/services'
import { globalRegionName } from '../src/enums/regions'
import resources from '../src/enums/resources'

describe('IAM Group Service Test: ', () => {
  let getDataResult
  let formatResult
  let groupConnections
  let groupId
  let groupName
  initTestConfig()
  beforeAll(async () => {
    getDataResult = {}
    formatResult = {}
    try {
      const iamPolicyService = new IamPolicyService({
        logger: CloudGraph.logger,
      })
      const iamUserService = new IamUserService({
        logger: CloudGraph.logger,
      })
      const iamGroupService = new IamGroupService({
        logger: CloudGraph.logger,
      })
      getDataResult = await iamGroupService.getData({
        credentials,
        regions: globalRegionName,
      })

      formatResult = (getDataResult?.[globalRegionName] || []).map(
        iamGroupData =>
          iamGroupService.format({ service: iamGroupData, region, account })
      )

      // // Get User data
      const userData = await iamUserService.getData({
        credentials,
        regions: globalRegionName,
      })

      // // Get Policy data
      const policyData = await iamPolicyService.getData({
        credentials,
        regions: globalRegionName,
      })

      const iamGroup = getDataResult?.[globalRegionName]?.find(
        ({ GroupName }) => GroupName === 'ReadOnlyAccess'
      )
      const { GroupId, GroupName } = iamGroup
      groupId = GroupId
      groupName = GroupName

      groupConnections = iamGroupService.getConnections({
        service: iamGroup,
        data: [
          {
            name: services.iamUser,
            data: userData,
            account,
            region,
          },
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
            GroupId: expect.any(String),
            GroupName: expect.any(String),
            Arn: expect.any(String),
            Path: expect.any(String),
            Policies: expect.arrayContaining<String>([]),
            ManagedPolicies: expect.arrayContaining<String>([
              // expect.objectContaining({
              // })
            ]),
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
            accountId: expect.any(String),
            path: expect.any(String),
          }),
        ])
      )
    })

    test('should return data in the correct format using default values when fields are not available', () => {
      const iamGroupService = new IamGroupService({
        logger: CloudGraph.logger,
      })

      const result = iamGroupService.format({ service: {}, region, account })

      expect(result).toEqual(
        expect.objectContaining({
          id: `--${kebabCase(resources.iamGroup)}`,
          arn: '',
          name: '',
          accountId: account,
          path: '',
        })
      )
    })
  })

  describe('connections', () => {
    test('should verify the connection to iamUsers', () => {
      const usersConnections = groupConnections[
        `${groupName}-${groupId}-${kebabCase(resources.iamGroup)}`
      ]?.filter(connection => connection.resourceType === services.iamUser)

      expect(usersConnections).toBeDefined()
      expect(usersConnections.length).toBe(1)
    })

    test('should verify the connection to Attached Policies', () => {
      const policiesConnections = groupConnections[
        `${groupName}-${groupId}-${kebabCase(resources.iamGroup)}`
      ]?.filter(connection => connection.resourceType === services.iamPolicy)

      expect(policiesConnections).toBeDefined()
      expect(policiesConnections.length).toBe(1)
    })
  })
})
