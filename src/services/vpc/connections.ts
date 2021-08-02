import { ServiceConnection } from 'cloud-graph-sdk'

import services from '../../enums/services'
import { AwsIgw } from '../igw/data'

/**
 * ALBs
 */

export default ({ service: vpc, data, region }): any => {
  const { VpcId: id }: any = vpc
  // let metaData: any = {}

  // if (!isEmpty(connections)) {
  //   metaData = { connections }
  // }
  const connections: ServiceConnection[] = []
  /**
   * Find any ALB Instances
   */
  const albInstances = data.find(({ name }) => name === services.alb)
  if (albInstances?.data?.[region]) {
    const dataAtRegion = albInstances.data[region].filter(
      ({ VpcId: vpcId }) => vpcId === id
    )
    for (const instance of dataAtRegion) {
      const { LoadBalancerArn: loadBalancerArn } = instance

      connections.push({
        id: loadBalancerArn,
        resourceType: services.alb,
        relation: 'child',
        field: 'alb',
      })
    }
  }
  /**
   * Find any IGW data
   */
  const igws = data.find(({ name }) => name === services.igw)
  if (igws?.data?.[region]) {
    const dataAtRegion: AwsIgw[] = igws.data[region].filter((igw: AwsIgw) =>
      igw.Attachments.find(({ VpcId }) => VpcId === id)
    )
    for (const igw of dataAtRegion) {
      connections.push({
        id: igw.InternetGatewayId,
        resourceType: services.igw,
        relation: 'child',
        field: 'igw',
      })
    }
  }

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
  //   console.log('hosted zones')
  //   console.log(JSON.stringify(hostedZones))

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
  // const arn = `arn:aws:ec2:${region}:${account}:vpc/${id}`
  const VpcResult = {
    [id]: connections,
  }
  return VpcResult
}
