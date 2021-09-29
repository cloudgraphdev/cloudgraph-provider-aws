// TODO: Enable when IAM is added
// import { ServiceConnection } from '@cloudgraph/sdk';
// import { Stack } from 'aws-sdk/clients/cloudformation';
// import { TagMap } from '../../types'

// /**
//  * Cloud Formation StackSet
//  */

// export default ({
//   service: cfStackSet,
//   data,
//   region,
// }: {
//   data: { name: string; data: { [property: string]: any[] } }[]
//   service: Stack & {
//     region: string
//     Tags: TagMap,
//   },
//   region: string
// }): { [key: string]: ServiceConnection[] } => {
//   const connections: ServiceConnection[] = []

//   const {
//     StackId: id,
//     // TODO add connection role
//     // AdministrationRoleARN: administrationRoleARN
//   } = cfStackSet

//   const cfStackSetResult = {
//     [id]: connections,
//   }
//   return cfStackSetResult
// }