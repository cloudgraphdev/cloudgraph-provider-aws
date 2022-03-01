import { Config } from 'aws-sdk/lib/config'
import ES from 'aws-sdk/clients/es'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'
import { convertToPromise, fetchAllPaginatedData } from '../../utils/fetchUtils'
import { initTestEndpoint } from '../../utils'
import { convertAwsTagsToTagMap } from '../../utils/format'
import AwsErrorLog from '../../utils/errorLog'
import { TagMap } from '../../types'

const serviceName = 'elasticSearchDomain'
const errorLog = new AwsErrorLog(serviceName)
const endpoint = initTestEndpoint(serviceName)

export interface RawAwsElasticSearchDomain extends ES.ElasticsearchDomainStatus {
  region: string
  Tags: TagMap
}

/**
 * ElasticSearchDomain
 */

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{ [region: string]: RawAwsElasticSearchDomain[] }> => {
  const result: RawAwsElasticSearchDomain[] = []

  const activeRegions = regions.split(',')

  for (const region of activeRegions) {
    const client = new ES({ ...config, region, endpoint })
    let elasticSearchDomainData: ES.DomainInfo[]
    try {
      elasticSearchDomainData = await fetchAllPaginatedData({
        getResourcesFn: convertToPromise({
          sdkContext: client,
          fnName: 'listDomainNames',
        }),
        accessor: '',
      })
    } catch (err) {
      errorLog.generateAwsErrorLog({ functionName: 'listDomainNames', err })
    }
    if (!isEmpty(elasticSearchDomainData)) {
      const domainNames = elasticSearchDomainData.map(({ DomainName }) => DomainName)
      let elasticSearchDomainDetails: ES.ElasticsearchDomainStatusList
      try {
        elasticSearchDomainDetails = await fetchAllPaginatedData({
          getResourcesFn: convertToPromise({
            sdkContext: client,
            fnName: 'describeElasticsearchDomains',
          }),
          initialParams: {
            DomainNames: domainNames
          },
          accessor: '',
        }) 
      } catch (err) {
        errorLog.generateAwsErrorLog({ functionName: 'listDomainNames', err })
      }
      for (const domain of elasticSearchDomainDetails) {
        const tags = await client.listTags({ ARN: domain.ARN }).promise()
        result.push({ ...domain, Tags: convertAwsTagsToTagMap(tags?.TagList ?? []), region })
      }
    }
  }
  errorLog.reset()
  return groupBy(result, 'region')
}
