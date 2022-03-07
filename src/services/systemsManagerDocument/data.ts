import { Config } from 'aws-sdk/lib/config'
import SSM, { DescribeDocumentPermissionResponse } from 'aws-sdk/clients/ssm'
import STS, { GetCallerIdentityResponse } from 'aws-sdk/clients/sts'
import { PromiseResult } from 'aws-sdk/lib/request'
import { AWSError } from 'aws-sdk/lib/error'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { convertAwsTagsToTagMap } from '../../utils/format'
import { TagMap } from '../../types'
import { initTestEndpoint } from '../../utils'
import AwsErrorLog from '../../utils/errorLog'

const serviceName = 'systemsManagerDocument'
const endpoint = initTestEndpoint(serviceName)
const errorLog = new AwsErrorLog(serviceName)
export interface RawAwsSystemsManagerDocument
  extends Omit<SSM.DocumentIdentifier, 'Tags'> {
  region: string
  accountId: string
  permissions: {
    accountIds: string[]
    accountSharingInfoList: {
      AccountId?: string
      SharedDocumentVersion?: string
    }[]
  }
  Tags: TagMap
}

/**
 * SystemsManagerDocument
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsSystemsManagerDocument[] }> => {
  const result: RawAwsSystemsManagerDocument[] = []

  const activeRegions = regions.split(',')
  // We need the account in the raw data so we can connect to trags
  let account: PromiseResult<GetCallerIdentityResponse, AWSError>
  try {
    account = await new STS(config).getCallerIdentity().promise()
  } catch (err) {
    errorLog.generateAwsErrorLog({ functionName: 'getCallerIdentity', err })
  }
  const accountId = account?.Account
  for (const region of activeRegions) {
    const client = new SSM({ ...config, region, endpoint })
    const systemsManagerDocumentData: SSM.DocumentIdentifier[] = []
    try {
      const filterParam = { Filters: [{ Key: 'Owner', Values: ['Self'] }] }
      const data = await client.listDocuments(filterParam).promise()
      systemsManagerDocumentData.push(...data.DocumentIdentifiers)
      let marker = data.NextToken
      while (marker) {
        const nextPage = await client
          .listDocuments({ ...filterParam, NextToken: marker })
          .promise()
        if (!isEmpty(data.DocumentIdentifiers)) {
          systemsManagerDocumentData.push(...nextPage.DocumentIdentifiers)
          marker = nextPage.NextToken
        }
      }
    } catch (err) {
      errorLog.generateAwsErrorLog({ functionName: 'listDocuments', err })
    }
    for (const doc of systemsManagerDocumentData) {
      let documentPermissions: PromiseResult<
        DescribeDocumentPermissionResponse,
        AWSError
      >
      try {
        documentPermissions = await client
          .describeDocumentPermission({
            Name: doc.Name,
            PermissionType: 'Share',
          })
          .promise()
      } catch (err) {
        errorLog.generateAwsErrorLog({
          functionName: 'describeDocumentPermission',
          err,
        })
      }
      result.push({
        ...doc,
        accountId,
        permissions: {
          accountIds: documentPermissions?.AccountIds,
          accountSharingInfoList: documentPermissions?.AccountSharingInfoList,
        },
        Tags: convertAwsTagsToTagMap(doc.Tags ?? []),
        region,
      })
    }
  }

  errorLog.reset()
  return groupBy(result, 'region')
}
