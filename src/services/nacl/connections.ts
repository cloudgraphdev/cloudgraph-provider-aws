// import { ServiceConnection } from '@cloudgraph/sdk'
// import isEmpty from 'lodash/isEmpty'

// import services from '../../enums/services'
// import { RawAwsVpc } from '../vpc/data'
// import { RawAwsNetworkAcl } from './data'

// /**
//  * Network ACL
//  */
// export default ({
//   service: nacl,
//   data,
//   region,
// }: {
//   account: string
//   data: { name: string; data: { [property: string]: any[] } }[]
//   region: string
//   service: RawAwsNetworkAcl
// }): { [key: string]: ServiceConnection[] } => {
//   const connections: ServiceConnection[] = []
//   const { NetworkAclId: id, VpcId: NaclVpcId } = nacl

//   // TODO: Add subnet connection

//   /**
//    * Find related Vpc
//    */
//   const vpcs: { name: string; data: { [property: string]: RawAwsVpc[] } } =
//     data.find(({ name }) => name === services.vpc)
//   if (vpcs?.data?.[region]) {
//     const vpc: RawAwsVpc = vpcs.data[region].find(
//       ({ VpcId }: RawAwsVpc) => VpcId === NaclVpcId
//     )
//     if (!isEmpty(vpc)) {
//       connections.push({
//         id: vpc.VpcId,
//         resourceType: services.vpc,
//         relation: 'child',
//         field: 'vpc',
//       })
//     }
//   }

//   const naclResult = {
//     [id]: connections,
//   }
//   return naclResult
// }
