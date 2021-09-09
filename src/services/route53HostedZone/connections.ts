import isEmpty from 'lodash/isEmpty'
import kebabCase from 'lodash/kebabCase'
import last from 'lodash/last'
import flatMap from 'lodash/flatMap'

import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsRoute53HostedZone } from './data'
import { RawAwsRoute53Record } from '../route53Record/data'
import resources from '../../enums/resources'
import { RawAwsVpc } from '../vpc/data'

/**
 * Route53 Hosted Zone
 */

export default ({
  service: hostedZone,
  data,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsRoute53HostedZone
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []
  const { Id, VPCs = [] } = hostedZone

  const id = last(Id.split('/'))

  /**
   * Find Records
   * related to this Hosted Zone
   */
  const records: {
    name: string
    data: { [property: string]: RawAwsRoute53Record[] }
  } = data.find(({ name }) => name === services.route53Record)
  if (records?.data?.global) {
    const recordsFound = records.data.global.filter(
      ({ HostedZoneId }: RawAwsRoute53Record) => HostedZoneId.includes(id)
    )

    if (!isEmpty(recordsFound)) {
      for (const record of recordsFound) {
        const hostedZoneId = last(record.HostedZoneId.split('/'))
        const recordId = `${hostedZoneId}_${record.Name}-${
          record.Type
        }-${kebabCase(resources.route53ZRecord)}`
        connections.push({
          id: recordId,
          resourceType: services.route53Record,
          relation: 'child',
          field: 'route53Record',
        })
      }
    }
  }

  /**
   * Find VPCs
   * related to this Hosted zone
   */
  const vpcs: RawAwsVpc[] =
    flatMap(
      data.find(({ name: serviceName }) => serviceName === services.vpc)?.data
    ) || []
  const vpcIds = VPCs.map(({ VPCId }) => VPCId)

  if (vpcs && VPCs.length > 0) {
    const associatedVPCs = vpcs.filter(({ VpcId }: RawAwsVpc) =>
      vpcIds.includes(VpcId)
    )

    if (!isEmpty(associatedVPCs)) {
      for (const vpc of associatedVPCs) {
        connections.push({
          id: vpc.VpcId,
          resourceType: services.vpc,
          relation: 'child',
          field: 'vpc',
        })
      }
    }
  }

  const hostedZoneResult = {
    [id]: connections,
  }
  return hostedZoneResult
}
