import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'

import { AwsApiGatewayResource } from '../apiGatewayResource/data'
import { RestApi } from 'aws-sdk/clients/apigateway'
import { AwsApiGatewayStage } from '../apiGatewayStage/data'
import {
  apiGatewayArn,
  apiGatewayStageArn,
} from '../../utils/generateArns'

import services from '../../enums/services'

export default ({
  service,
  data,
  region,
}: {
  service: RestApi
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const {
    id,
  } = service
  const connections: ServiceConnection[] = []
  /**
   * Find Resources
   */
  const resources: { name: string; data: { [property: string]: AwsApiGatewayResource[] } } =
    data.find(({ name }) => name === services.apiGatewayResource)
  if (resources?.data?.[region]) {
    const resourcesInRegion: AwsApiGatewayResource[] = resources.data[region].filter(
      ({ restApiId }: AwsApiGatewayResource) => restApiId === id
    )
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
    data: { [property: string]: AwsApiGatewayStage[] }
  } = data.find(({ name }) => name === services.apiGatewayStage)
  if (stages?.data?.[region]) {
    const stagesInRegion: AwsApiGatewayStage[] = stages.data[region].filter(
      ({ restApiId }: AwsApiGatewayStage) => restApiId === id
    )
    if (!isEmpty(stagesInRegion)) {
      for (const stage of stagesInRegion) {
        const { stageName: name, region } = stage
        const arn = apiGatewayStageArn({
          restApiArn: apiGatewayArn({ region: region }),
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

  const restApiResult = {
    [id]: connections,
  }
  return restApiResult
}
