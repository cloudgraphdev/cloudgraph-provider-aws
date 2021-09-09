import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'
import last from 'lodash/last'
import flatMap from 'lodash/flatMap'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsRoute53Record } from './data'
import resources from '../../enums/resources'
import { RawAwsAlb } from '../alb/data'
import { RawAwsElb } from '../elb/data'

/**
 * Route53 Record
 */

export default ({
  service: hostedZone,
  data,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsRoute53Record
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const {
    HostedZoneId: Id,
    Name: name,
    Type: type,
    AliasTarget: alias,
  } = hostedZone
  const hostedZoneId = last(Id.split('/'))

  const id = `${hostedZoneId}_${name}-${type}-${kebabCase(
    resources.route53ZRecord
  )}`

  /**
   * Find ELBs
   * related to this Hosted Zone
   */
  const elbs: RawAwsElb[] =
    flatMap(
      data.find(({ name: serviceName }) => serviceName === services.elb)?.data
    ) || []

  if (elbs && alias?.HostedZoneId) {
    const elbsInRegion = elbs.filter(
      ({ CanonicalHostedZoneNameID: hostedZoneNameId }: RawAwsElb) =>
        hostedZoneNameId === alias?.HostedZoneId
    )

    if (!isEmpty(elbsInRegion)) {
      for (const instance of elbsInRegion) {
        const { LoadBalancerName: lbId } = instance

        connections.push({
          id: lbId,
          resourceType: services.elb,
          relation: 'child',
          field: 'elb',
        })
      }
    }
  }

  /**
   * Find ALBs
   * related to this Hosted Zone
   */
  const albs: RawAwsAlb[] =
    flatMap(
      data.find(({ name: serviceName }) => serviceName === services.alb)?.data
    ) || []

  if (albs && alias?.HostedZoneId) {
    const albsInRegion = albs.filter(
      ({ CanonicalHostedZoneId }: RawAwsAlb) =>
        CanonicalHostedZoneId === alias?.HostedZoneId
    )

    if (!isEmpty(albsInRegion)) {
      for (const instance of albsInRegion) {
        const { LoadBalancerName: lbId } = instance

        connections.push({
          id: lbId,
          resourceType: services.alb,
          relation: 'child',
          field: 'alb',
        })
      }
    }
  }

  const hostedZoneResult = {
    [id]: connections,
  }
  return hostedZoneResult
}
