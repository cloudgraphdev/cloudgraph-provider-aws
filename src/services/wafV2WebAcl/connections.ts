import isEmpty from 'lodash/isEmpty'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsAlb } from '../alb/data'
import { RawAwsApiGatewayStage } from '../apiGatewayStage/data'
import { RawAwsAppSync } from '../appSync/data'
import { RawAwsWafV2WebAcl } from './data'

/**
 * WAF
 */

export default ({
  service: waf,
  data,
  region,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsWafV2WebAcl
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { Id: id, wafResources } = waf

  /**
   * Find ALBs
   * related to this WAF
   */
  const albs: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.alb)

  if (albs?.data?.[region] && wafResources?.elasticloadbalancing?.length > 0) {
    const associatedALBs: RawAwsAlb[] = albs.data[region].filter(
      ({ LoadBalancerArn }: RawAwsAlb) =>
        wafResources?.elasticloadbalancing?.find(arn => arn === LoadBalancerArn)
    )

    if (!isEmpty(associatedALBs)) {
      for (const { LoadBalancerArn } of associatedALBs) {
        connections.push({
          id: LoadBalancerArn,
          resourceType: services.alb,
          relation: 'child',
          field: 'albs',
        })
      }
    }
  }
  /**
   * Find Rest API Stages
   * related to this WAF
   */
  const stages: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.apiGatewayStage)

  if (stages?.data?.[region] && wafResources?.apigateway?.length > 0) {
    const associatedStages: RawAwsApiGatewayStage[] = stages.data[
      region
    ].filter(({ arn: stageArn }: RawAwsApiGatewayStage) =>
      wafResources?.apigateway?.find(arn => arn === stageArn)
    )

    if (!isEmpty(associatedStages)) {
      for (const { arn } of associatedStages) {
        connections.push({
          id: arn,
          resourceType: services.apiGatewayStage,
          relation: 'child',
          field: 'apiGatewayStages',
        })
      }
    }
  }

  /**
   * Find Apps Sync
   * related to this WAF
   */
  const apps: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.appSync)

  if (apps?.data?.[region] && wafResources?.appsync?.length > 0) {
    const associatedApps: RawAwsAppSync[] = apps.data[region].filter(
      ({ arn: apiArn }: RawAwsAppSync) =>
        wafResources?.appsync?.find(arn => arn === apiArn)
    )

    if (!isEmpty(associatedApps)) {
      for (const { apiId } of associatedApps) {
        connections.push({
          id: apiId,
          resourceType: services.appSync,
          relation: 'child',
          field: 'appSync',
        })
      }
    }
  }

  return {
    [id]: connections,
  }
}
