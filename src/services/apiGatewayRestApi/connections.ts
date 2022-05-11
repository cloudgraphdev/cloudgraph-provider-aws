import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'

import { RawAwsApiGatewayRestApi } from './data'
import { RawAwsApiGatewayResource } from '../apiGatewayResource/data'
import { RawAwsApiGatewayStage } from '../apiGatewayStage/data'
import {
  apiGatewayRestApiArn,
  apiGatewayStageArn,
  apiGatewayArn,
  domainNameArn,
} from '../../utils/generateArns'
import { RawAwsApiGatewayDomainName } from '../apiGatewayDomainName/data'
import services from '../../enums/services'

export default ({
  service,
  data,
  region,
  account,
}: {
  account: string
  service: RawAwsApiGatewayRestApi
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const { id } = service
  const connections: ServiceConnection[] = []
  /**
   * Find Resources
   */
  const resources: {
    name: string
    data: { [property: string]: RawAwsApiGatewayResource[] }
  } = data.find(({ name }) => name === services.apiGatewayResource)
  if (resources?.data?.[region]) {
    const resourcesInRegion: RawAwsApiGatewayResource[] = resources.data[
      region
    ].filter(({ restApiId }: RawAwsApiGatewayResource) => restApiId === id)
    if (!isEmpty(resourcesInRegion)) {
      for (const resource of resourcesInRegion) {
        const { id } = resource
        connections.push({
          id,
          resourceType: services.apiGatewayResource,
          relation: 'child',
          field: 'resources',
        })
      }
    }
  }

  /**
   * Find Stages
   */
  const stages: {
    name: string
    data: { [property: string]: RawAwsApiGatewayStage[] }
  } = data.find(({ name }) => name === services.apiGatewayStage)
  if (stages?.data?.[region]) {
    const stagesInRegion: RawAwsApiGatewayStage[] = stages.data[region].filter(
      ({ restApiId }: RawAwsApiGatewayStage) => restApiId === id
    )
    if (!isEmpty(stagesInRegion)) {
      for (const stage of stagesInRegion) {
        const { stageName: name, region: stageRegion, restApiId } = stage
        const arn = apiGatewayStageArn({
          restApiArn: apiGatewayRestApiArn({
            restApiArn: apiGatewayArn({ region: stageRegion }),
            id: restApiId,
          }),
          name,
        })
        connections.push({
          id: arn,
          resourceType: services.apiGatewayStage,
          relation: 'child',
          field: 'stages',
        })
      }
    }
  }

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
