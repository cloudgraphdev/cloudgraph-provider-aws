// import { ServiceConnection } from '@cloudgraph/sdk'
// import { Stack } from 'aws-sdk/clients/cloudformation'
// import services from '../../enums/services'
// import { RawAwsCloudFormationStack } from './data'
// import { TagMap } from '../../types'

// /**
//  * Cloud Formation Stack
//  */

// export default ({
//   service: cfStack,
//   data,
//   region,
// }: {
//   data: { name: string; data: { [property: string]: any[] } }[]
//   service: Stack & {
//     region: string
//     Tags: TagMap
//   }
//   region: string
// }): { [key: string]: ServiceConnection[] } => {
//   const connections: ServiceConnection[] = []

//   const {
//     StackId: id,
//     // RoleARN: roleArn, // TODO needed to add connection to IAM role
//     // NotificationARNs: notificationARNs, // TODO needed to add connection SNS notification
//     ParentId: parentId,
//     RootId: rootId,
//   } = cfStack

//   /**
//    * Find related Cloudformation stacks
//    */
//   const CFStacks: { name: string; data: { [property: string]: any[] } } =
//     data.find(({ name }) => name === services.cloudFormationStack)
//   if (CFStacks?.data?.[region]) {
//     // Find root stack
//     if (rootId) {
//       const rootStack: RawAwsCloudFormationStack = CFStacks.data[region].find(
//         ({ StackId }) => StackId === rootId
//       )
//       if (rootStack) {
//         connections.push({
//           id: rootStack.StackId,
//           resourceType: services.cloudFormationStack,
//           relation: 'child',
//           field: 'rootStack',
//         })
//       }
//     }
//     // Find parent stack
//     if (parentId) {
//       const parentStack: RawAwsCloudFormationStack = CFStacks.data[region].find(
//         ({ StackId }) => StackId === parentId
//       )
//       if (parentStack) {
//         connections.push({
//           id: parentStack.StackId,
//           resourceType: services.cloudFormationStack,
//           relation: 'child',
//           field: 'parentStack',
//         })
//       }
//     }
//   }

//   const cfStackResult = {
//     [id]: connections,
//   }
//   return cfStackResult
// }
