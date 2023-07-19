import CloudGraph from '@cloudgraph/sdk'
import SecurityHub, {
  ListMembersRequest,
  ListMembersResponse,
  Member,
  MemberList,
} from 'aws-sdk/clients/securityhub'
import { AWSError } from 'aws-sdk/lib/error'
import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Config } from 'aws-sdk/lib/config'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'
import awsLoggerText from '../../properties/logger'

const { logger } = CloudGraph
const lt = { ...awsLoggerText }
const serviceName = 'SecurityHub Member'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsSecurityHubMember extends Member {
  region: string
}

const getMembersForRegion = async ({
  securityHub,
}: {
  securityHub: SecurityHub
}): Promise<MemberList> =>
  new Promise<MemberList>(resolve => {
    const memberList: MemberList = []
    const listMemberOpts: ListMembersRequest = {}
    const listAllMembers = (token?: string): void => {
      if (token) {
        listMemberOpts.NextToken = token
      }
      try {
        securityHub.listMembers(
          listMemberOpts,
          (err: AWSError, data: ListMembersResponse) => {
            const { NextToken: nextToken, Members = [] } = data || {}
            if (err) {
              errorLog.generateAwsErrorLog({
                functionName: 'securityHub:listMembers',
                err,
              })
            }

            memberList.push(...Members)

            if (nextToken) {
              listAllMembers(nextToken)
            } else {
              resolve(memberList)
            }
          }
        )
      } catch (err) {
        resolve([])
      }
    }
    listAllMembers()
  })

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [property: string]: RawAwsSecurityHubMember[] }> =>
  new Promise(async resolve => {
    const memberData: RawAwsSecurityHubMember[] = []
    const regionPromises = []

    regions.split(',').forEach(region => {
      const securityHub = new SecurityHub({ ...config, region, endpoint })

      const regionPromise = new Promise<void>(async resolveRegion => {
        const members = await getMembersForRegion({ securityHub })
        if (!isEmpty(members)) {
          memberData.push(
            ...members.map(member => ({
              ...member,
              region,
            }))
          )
        }
        resolveRegion()
      })
      regionPromises.push(regionPromise)
    })

    await Promise.all(regionPromises)
    logger.debug(lt.fetchedSecurityHubMembers(memberData.length))
    errorLog.reset()

    resolve(groupBy(memberData, 'region'))
  })
