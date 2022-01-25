import { ServiceConnection } from '@cloudgraph/sdk'

import services from '../../enums/services'
import { RawAwsAlb } from './data'

/**
 * ALBs
 */

export default ({
  service: alb,
  data,
  region,
}: {
  service: RawAwsAlb
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const {
    LoadBalancerArn: id,
    SecurityGroups: securityGroups = [],
    AvailabilityZones: azs = [],
  }: RawAwsAlb = alb

  const connections: ServiceConnection[] = []
  /**
   * Find any EC2 Instances
   */
  const ec2Instances = data.find(({ name }) => name === services.ec2Instance)
  if (ec2Instances?.data?.[region]) {
    const dataAtRegion = ec2Instances.data[region].filter(instance =>
      alb.targetIds.includes(instance.InstanceId)
    )
    for (const instance of dataAtRegion) {
      const instanceId = instance.InstanceId

      connections.push({
        id: instanceId,
        resourceType: services.ec2Instance,
        relation: 'child',
        field: 'ec2Instance',
      })
    }
  }

  /**
   * Add subnets
   */
  connections.push(
    ...azs
      .filter(i => i.SubnetId)
      .map(({ SubnetId }) => ({
        id: SubnetId,
        resourceType: services.subnet,
        relation: 'child',
        field: 'subnet',
      }))
  )

  /**
   * Add Security Groups
   */
  connections.push(
    ...securityGroups.map(sg => ({
      id: sg,
      resourceType: services.sg,
      relation: 'child',
      field: 'securityGroups',
    }))
  )
  /**
   * Find any Route53 data
   */
  //  const route53ConnectionsData = []
  //  const {data: route53Data} = data.find(
  //    ({name}: {name: string}) => name === awsServices.route53
  //  ) || {data: []}
  //  if (!isEmpty(route53Data)) {
  //   const hostedZones: Array<any> = route53Data.map(
  //     awsRoute53HostedZoneConverter
  //   )

  //   if (!isEmpty(hostedZones)) {
  //     /**
  //      * Check for any connection between route 53 and other entities like CF, ELB
  //      * API Gateway... etc, and if we find them then add them to the route53ConnectionsData
  //      */
  //     hostedZones.map(data => {
  //       const {
  //         connectionLinks
  //       } = data

  //       if (!isEmpty(connectionLinks)) {
  //         connectionLinks.map(link => {
  //           /**
  //            * Make sure we have not already added the connection
  //            */
  //           const existingEntity = !route53ConnectionsData.find(
  //             ({id, connection: {id: connectionId}}) =>
  //               id === link.id && connectionId === link.connection.id
  //           )
  //           if (existingEntity) {
  //             route53ConnectionsData.push(link)
  //           }
  //         })
  //       }
  //       /**
  //        * Get rid of the connection links since those will live on the actual
  //        * Connected entities.
  //        */
  //       delete data.connectionLinks
  //     })
  //   }
  // }
  // const connections = route53ConnectionsData
  //   .filter(
  //     (
  //       {name, resourceType} // TODO: Fix this once ELB is converted
  //     ) =>
  //       resourceType === resourceTypes.elb &&
  //             name.includes(get(alb, albNames.dnsName))
  //   )
  //   .map(({connection}) => connection)
  const albResult = {
    [id]: connections,
  }
  return albResult
}
