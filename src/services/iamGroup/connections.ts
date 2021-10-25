// import flatMap from 'lodash/flatMap'
// import isEmpty from 'lodash/isEmpty'
// import kebabCase from 'lodash/kebabCase'

// import { ServiceConnection } from '@cloudgraph/sdk'

// import services from '../../enums/services'
// import { RawAwsIamGroup } from './data'
// import { RawAwsIamPolicy } from '../iamPolicy/data'
// import { RawAwsIamUser } from '../iamUser/data'
// import resources from '../../enums/resources'
// import { getIamId } from '../../utils/ids'

// /**
//  * IAM Group
//  */

// export default ({
//   service: group,
//   data,
// }: {
//   account: string
//   data: { name: string; data: { [property: string]: any[] } }[]
//   service: RawAwsIamGroup
//   region: string
// }): { [key: string]: ServiceConnection[] } => {
//   const connections: ServiceConnection[] = []
//   const {
//     GroupId: id,
//     GroupName: name,
//     ManagedPolicies: managedPolicies,
//   } = group

//   /**
//    * Find Managed Policies
//    * related to this IAM Group
//    */

//   const policies: RawAwsIamPolicy[] =
//     flatMap(
//       data.find(({ name: serviceName }) => serviceName === services.iamPolicy)
//         ?.data
//     ) || []

//   const attachedPolicies = policies.filter(({ Arn: arn }: RawAwsIamPolicy) =>
//     managedPolicies.find(p => p.PolicyArn === arn)
//   )

//   if (!isEmpty(attachedPolicies)) {
//     for (const instance of attachedPolicies) {
//       const { PolicyId: policyId, PolicyName: policyName } = instance

//       connections.push({
//         id: `${policyName}-${policyId}-${kebabCase(resources.iamPolicy)}`,
//         resourceType: services.iamPolicy,
//         relation: 'child',
//         field: 'iamAttachedPolicies',
//       })
//     }
//   }

//   /**
//    * Find Belonging Users
//    * related to this IAM User
//    */

//   const users: RawAwsIamUser[] =
//     flatMap(
//       data.find(({ name: serviceName }) => serviceName === services.iamUser)
//         ?.data
//     ) || []

//   const belonginUsers = users.filter(({ Groups: groups }: RawAwsIamUser) =>
//     groups.includes(id)
//   )

//   if (!isEmpty(belonginUsers)) {
//     for (const instance of belonginUsers) {
//       const { UserId: userId, UserName: userName } = instance

//       connections.push({
//         id: `${userName}-${userId}-${kebabCase(resources.iamUser)}`,
//         resourceType: services.iamUser,
//         relation: 'child',
//         field: 'iamUsers',
//       })
//     }
//   }

//   return {
//     [getIamId({
//       resourceId: id,
//       resourceName: name,
//       resourceType: resources.iamGroup,
//     })]: connections,
//   }
// }
