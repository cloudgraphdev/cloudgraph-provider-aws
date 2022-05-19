import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'

import { RawAwsApiGatewayHttpApi } from './data'

import { domainNameArn } from '../../utils/generateArns'
import { RawAwsApiGatewayDomainName } from '../apiGatewayDomainName/data'
import services from '../../enums/services'

export default ({
  service,
  data,
  region,
  account,
}: {
  account: string
  service: RawAwsApiGatewayHttpApi
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { ApiId: id } = service
  const connections: ServiceConnection[] = []

  /**
   * Find Domain Names
   */
  const domainNames: {
    name: string
    data: { [property: string]: RawAwsApiGatewayDomainName[] }
  } = data.find(({ name }) => name === services.apiGatewayDomainName)
  if (domainNames?.data?.[region]) {
    const domainNamesInRegion: RawAwsApiGatewayDomainName[] = domainNames.data[
      region
    ].filter(({ ApiMappings }: RawAwsApiGatewayDomainName) =>
      ApiMappings.find(m => m.ApiId === id)
    )
    if (!isEmpty(domainNamesInRegion)) {
      for (const domain of domainNamesInRegion) {
        const { DomainName: domainName, region: domainRegion } = domain
        const arn = domainNameArn({
          region: domainRegion,
          account,
          name: domainName,
        })
        connections.push({
          id: arn,
          resourceType: services.apiGatewayDomainName,
          relation: 'child',
          field: 'domainNames',
        })
      }
    }
  }

  const restApiResult = {
    [id]: connections,
  }
  return restApiResult
}
