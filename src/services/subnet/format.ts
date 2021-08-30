// TODO: Uncomment when working on ENG-222
// import t from '../../properties/translations'
// import { AwsSubnet as AwsSubnetType } from '../../types/generated'
// import { AwsSubnet } from './data'

// /**
//  * Subnet
//  */

// export default ({
//   service: rawData,
//   // account,
//   // region,
// }: {
//   service: AwsSubnet
//   // account: string
//   // region: string
// }): AwsSubnetType => {
//   const {
//     AssignIpv6AddressOnCreation: autoAssignPublicIpv6Address,
//     AvailabilityZone: availabilityZone,
//     AvailableIpAddressCount: availableIpV4Addresses,
//     CidrBlock: ipV4Cidr,
//     DefaultForAz: defaultForAz,
//     Ipv6CidrBlockAssociationSet: ipV6CidrSet,
//     MapPublicIpOnLaunch: autoAssignPublicIpv4Address,
//     State: state,
//     SubnetArn: arn,
//     SubnetId: id,
//     tags,
//   } = rawData

//   return {
//     id,
//     arn,
//     tags,
//     availabilityZone,
//     autoAssignPublicIpv4Address: autoAssignPublicIpv4Address ? t.yes : t.no,
//     autoAssignPublicIpv6Address: autoAssignPublicIpv6Address ? t.yes : t.no,
//     ipV4Cidr,
//     ipV6Cidr: (ipV6CidrSet || [])
//       .map(({ Ipv6CidrBlock }) => Ipv6CidrBlock)
//       .join(', '),
//     state,
//     defaultForAz,
//     availableIpV4Addresses,
//   }
// }
