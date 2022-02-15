import { Config } from 'aws-sdk/lib/config'
import WAFV2 from 'aws-sdk/clients/wafv2'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import ErrorLog from '../../utils/errorLog'

const serviceName = 'wafV2WebAcl'
const errorLog = new ErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

const scopes = {
  cloudfront: 'CLOUDFRONT',
  regional: 'REGIONAL',
}

export interface RawAwsWafV2WebAcl extends WAFV2.WebACL {
  region: string
  loggingConfiguration: WAFV2.LoggingConfiguration
}

/**
 * WafV2WebAcl
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{[region: string]: RawAwsWafV2WebAcl[]}> => {
  const result: RawAwsWafV2WebAcl[] = []

  const activeRegions = regions.split(',')
  activeRegions.push('global')
  for (const region of activeRegions) {
    const client = new WAFV2({ ...config, region, endpoint })
    const scope = region === 'global' ? scopes.cloudfront : scopes.regional
    let WafV2WebAclData: WAFV2.WebACLSummary[]
    try {
      WafV2WebAclData = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: client,
          fnName: 'listWebACLs',
        }),
        initialParams: {
          Scope: scope,
        },
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({ functionName: 'listWebAcls', err })
    }

    if (!isEmpty(WafV2WebAclData)) {
      WafV2WebAclData.forEach(async waf => {
        try {
          const wafData = await client
            .getWebACL({ Name: waf.Name, Id: waf.Id, Scope: scope })
            .promise()
          const loggingConfiguration = await client.getLoggingConfiguration({ ResourceArn: wafData?.WebACL?.ARN }).promise()
          result.push({ ...wafData.WebACL, loggingConfiguration: loggingConfiguration.LoggingConfiguration, region })
        } catch (err) {
          errorLog.generateAwsErrorLog({ functionName: 'getWebAcl', err })
        }
      })
    }
  }
  errorLog.reset()
  return groupBy(result, 'region')
}
