import { Config } from 'aws-sdk/lib/config'
import WAFV2, { WebACLSummaries } from 'aws-sdk/clients/wafv2'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
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
  // TODO: how to support global instances
  activeRegions.push('global')
  for (const region of activeRegions) {
    const client = new WAFV2({ ...config, region: region === 'global' ? 'us-east-1' : region, endpoint })
    const scope = region === 'global' ? scopes.cloudfront : scopes.regional
    const WafV2WebAclData: WebACLSummaries = []
    try {
      const { WebACLs, NextMarker } = await client.listWebACLs({ Scope: scope, Limit: 10 }).promise()
      WafV2WebAclData.push(...WebACLs)
      let marker = NextMarker
      while(marker) {
        const { WebACLs, NextMarker } = await client.listWebACLs({ Scope: scope, Limit: 10, NextMarker: marker }).promise()
        // There is some issue with wafV2 where it always returns a next marker
        if (WebACLs.find(({ Name }) => Name === NextMarker)) {
          marker = undefined
        } else {
          marker = NextMarker
          WafV2WebAclData.push(...WebACLs)
        }
      }
    } catch (err) {
      errorLog.generateAwsErrorLog({ functionName: 'listWebAcls', err })
    }
    if (!isEmpty(WafV2WebAclData)) {
      for (const waf of WafV2WebAclData) {
        let wafData
        try {
          wafData = await client
            .getWebACL({ Name: waf.Name, Id: waf.Id, Scope: scope })
            .promise()

          const arn = wafData?.WebACL?.ARN
          const loggingConfiguration = await client.getLoggingConfiguration({ ResourceArn: arn }).promise()
          wafData.loggingConfiguration = loggingConfiguration.LoggingConfiguration
        } catch (err) {
          errorLog.generateAwsErrorLog({ functionName: 'getWebACL', err })
        }
        result.push({ ...wafData?.WebACL, loggingConfiguration: wafData?.loggingConfiguration, region })
      }
    }
  }
  errorLog.reset()
  return groupBy(result, 'region')
}
