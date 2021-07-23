import isEmpty from 'lodash/isEmpty'
import startCase from 'lodash/startCase'

import kebabCase from 'lodash/kebabCase'

import albNames from './names'

import resourceTypes from '../../enums/resources'

import t from '../../properties/translations'

import {Alb, Listener} from '../../types/generated'

/**
 * ALBs
 */

const awsAlbListernerGraphFormat = (listener): Listener => {
  const { DefaultActions: rules = [] }: any = listener

  const id = listener[albNames.listenerArn]

  return {
    settings: {
      arn: id,
      sslPolicy: listener[albNames.ListenerSSL],
      protocol: `${listener[albNames.protocol]}:${
        listener[albNames.port]
      } ${id}`,
      rules: rules.map(
        ({ Order: order, Type: type, TargetGroupArn: targetGroupArn }) => ({
          type,
          order,
          targetGroupArn,
        })
      ),
    }
  }
}

export default ({service: alb, account, region}): Alb => {
  const {
    tags = {},
    State: { Code: status = '' } = {},
    listeners = [],
    attributes = {},
    SecurityGroups: securityGroups = [],
    AvailabilityZones: azs = [],
  }: any = alb
  // console.log('ALB data')
  // console.log(alb)
  /**
   * Add these tags to the list of global tags so we can filter by tag on the front end
   */
  // combineElementsTagsWithExistingGlobalTags({ tags, allTagData })

  // let metaData: any = {}

  // if (!isEmpty(connections)) {
  //   metaData = { connections }
  // }

  /**
   * Add any EC2 Instances
   */

  // const instanceConnections = ec2Instances
  // .filter(instance =>
  //   alb.targetIds.includes(instance.InstanceId)
  // )
  // .map(instance => {
  //   const instanceId = instance.InstanceId

  //   return {
  //     id: instanceId,
  //     resourceType: resourceTypes.ec2Instance,
	// 		relation: 'child'
  //   }
  // })

//   if (!isEmpty(instanceData)) {
//     metaData = {
//       connections: [
//         ...(metaData.connections || []),
//         ...instanceData.map(({ instanceId, name }) => ({
//           id: ec2InstanceId(instanceId),
//           name,
//           resourceType: resourceTypes.ec2Instance,
//         })),
//       ],
//     }
//   }

//   const albResult = generateElement({
//     /**
//      * Don't suffix the id with the resourceType for alb and elb. When we create connections from
//      * CloudFront we don't know if the LB is an ALB or an ELB
//      */
//     id: alb[albNames.dnsName],
//     name: tags[albNames.name] || alb[albNames.lbName],
//     resourceType: resourceTypes.alb,
//     metaData,
//     displayData: {
//       arn: alb[albNames.loadBalancerArn],
//       dnsName: alb[albNames.dnsName],
//       scheme: alb[albNames.scheme],
//       type: startCase(alb[albNames.type]),
//       subnets: azs.map(({ SubnetId }) => SubnetId),
//       hostedZone: alb[albNames.hostedZone],
//       vpc: alb[albNames.vpc],
//       defaultVpc: vpcToAdd.displayData.defaultVpc,
//       ipAddressType: alb[albNames.ipAddressType],
//       securityGroups,
//       idleTimeout: `${attributes[albNames.idleTimeout]} ${t.seconds}`,
//       deletionProtection:
//         attributes[albNames.deletionProtection] === t.true ? t.yes : t.no,
//       http2: attributes[albNames.http2] === t.true ? t.yes : t.no,
//       accessLogsEnabled:
//         attributes[albNames.accessLogs] === t.true ? t.yes : t.no,
//       instanceData,
//       dropInvalidHeaderFields:
//         attributes[albNames.dropInvalidHeaderFields] === t.true ? t.yes : t.no,
//       tags,
//       createdAt: alb[albNames.createdAt],
//       status,
//     },
//     children: listeners.map(awsAlbListenerConverter),
//   })

  /**
   * Add the alb to the list of members of whatever security groups it uses
   */

//   checkForAndAddEntityToSecurityGroupMembers({
//     entityToAdd: albResult,
//     resourceType: resourceTypes.alb,
//     securityGroupsInVpc,
//     entitySecurityGroups: securityGroups,
//   })
  const albResult = {
      id: alb[albNames.loadBalancerArn],
			arn: alb[albNames.loadBalancerArn],
			dnsName: alb[albNames.dnsName],
			scheme: alb[albNames.scheme],
			type: startCase(alb[albNames.type]),
			hostedZone: alb[albNames.hostedZone],
			defaultVpc: 'test',
			ipAddressType: alb[albNames.ipAddressType],
			idleTimeout: `${attributes[albNames.idleTimeout]} ${t.seconds}`,
			deletionProtection:
					attributes[albNames.deletionProtection] === t.true ? t.yes : t.no,
			http2: attributes[albNames.http2] === t.true ? t.yes : t.no,
			accessLogsEnabled:
					attributes[albNames.accessLogs] === t.true ? t.yes : t.no,
			dropInvalidHeaderFields:
					attributes[albNames.dropInvalidHeaderFields] === t.true ? t.yes : t.no,
			tags,
			createdAt: alb[albNames.createdAt],
			status,
      listeners: listeners.map(awsAlbListernerGraphFormat)
  }
  return albResult
}
