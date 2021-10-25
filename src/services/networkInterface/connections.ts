// import { ServiceConnection } from '@cloudgraph/sdk'
// import { isEmpty } from 'lodash'

// import services from '../../enums/services'
// import { RawAwsSubnet } from '../subnet/data'
// import { RawNetworkInterface } from './data'

// export default ({
//   service: networkInterface,
//   data,
//   region,
// }: {
//   service: RawNetworkInterface
//   data: Array<{ name: string; data: { [property: string]: any[] } }>
//   region: string
// }): {
//   [property: string]: ServiceConnection[]
// } => {
//   const { NetworkInterfaceId, SubnetId } = networkInterface
//   const connections: ServiceConnection[] = []
//   /**
//    * Find Subnets used in Network Interface
//    */
//   const subnets: {
//     name: string
//     data: { [property: string]: any[] }
//   } = data.find(({ name }) => name === services.subnet)
//   if (subnets?.data?.[region]) {
//     const subnetsInRegion: RawAwsSubnet[] = subnets.data[region].filter(
//       ({ SubnetId: sId }: RawAwsSubnet) => sId === SubnetId
//     )
//     if (!isEmpty(subnetsInRegion)) {
//       for (const subnet of subnetsInRegion) {
//         const { SubnetId: id } = subnet
//         connections.push({
//           id,
//           resourceType: services.subnet,
//           relation: 'child',
//           field: 'subnet',
//         })
//       }
//     }
//   }

//   const natResult = {
//     [NetworkInterfaceId]: connections,
//   }
//   return natResult
// }
