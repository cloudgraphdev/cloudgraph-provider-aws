// import get from 'lodash/get'
// import head from 'lodash/head'
// import kebabCase from 'lodash/kebabCase'

// import {
//   Vpc,
//   SubnetList,
//   NetworkAclList,
//   RouteTableList,
//   SecurityGroupList,
//   InternetGatewayList,
// } from 'aws-sdk/clients/ec2'

import vpcNames from './names'

// import { VpcResult } from './types'

// import resourceTypes from '../../enums/resources'

// import { combineElementsTagsWithExistingGlobalTags } from '../../utils/formattingUtils'

// import { Tags } from '../../types'

import t from '../../properties/translations'

// import {
//   generateElement,
//   generateConnection,
// } from '../../../../shared/visualServiceDiscovery/utils/formattingUtils'

import { toCamel } from '../../utils/index'

// import { awsRouteTableConverter } from '../routeTable/format'
// import { RouteTable } from '../routeTable/types'
// import { awsNaclConverter } from '../nacl/format'
// import { Nacl } from '../nacl/types'
// import { SecurityGroup } from '../securityGroup/types'
// import { awsSecurityGroupConverter } from '../securityGroup/format'
// import { awsIgwConverter } from '../igw/format'
// import { InternetGateway } from '../igw/types'

// import { Vpc as VpcType } from './types'

/**
 * VPC
 */

export default ({
  // nacls,
  service: rawData,
  // subnets,
  account,
  region,
  // allTagData,
  // routeTables,
  // securityGroups,
  // internetGateways,
}: {
  // nacls: NetworkAclList
  service: any
  // subnets: SubnetList
  account: string
  region: string
  // allTagData: Tags[]
  // routeTables: RouteTableList
  // securityGroups: SecurityGroupList
  // internetGateways: InternetGatewayList
}): any => {
  const vpcData = toCamel(rawData)

  // const { Tags: tags } = rawData

  const id = vpcData[vpcNames.vpcId]

  /**
   * Add these tags to the list of global tags so we can filter by tag on the front end
   */
  // combineElementsTagsWithExistingGlobalTags({ tags, allTagData })

  // const name: string = tags[vpcNames.name] || id

  // const vpcRouteTables: RouteTable[] = routeTables.map(routeTable =>
  //   awsRouteTableConverter({
  //     subnets,
  //     vpcName: name,
  //     routeTable,
  //     allTagData,
  //   })
  // )

  // const mainRouteTable: string = (
  //   vpcRouteTables.find(
  //     ({ displayData: { mainRouteTable } }) => mainRouteTable
  //   ) || { name: '' }
  // ).name

  // const vpcNacls: Nacl[] = nacls.map(nacl =>
  //   awsNaclConverter({ nacl, subnets, vpcName: name, allTagData })
  // )

  // const networkAcl: string = (
  //   vpcNacls.find(({ displayData: { default: isDefault } }) => isDefault) || {
  //     name: '',
  //   }
  // ).name

  // const vpcSecurityGroups: SecurityGroup[] = securityGroups.map(sg =>
  //   awsSecurityGroupConverter({
  //     sg,
  //     account,
  //     vpcName: name,
  //     allTagData,
  //     region,
  //   })
  // )

  // const defaultSecurityGroup: string = (
  //   vpcSecurityGroups.find(
  //     ({ displayData: { default: isDefault } }) => isDefault
  //   ) || { name: '' }
  // ).name

  // const vpcIgws: InternetGateway[] = internetGateways.map(igw =>
  //   awsIgwConverter({ igw, attachedVpc: id, allTagData })
  // )

  /**
   * Add connection from route tables to IGWs and vice versa
   */

  // vpcRouteTables.map(routeTable =>
  //   (routeTable.displayData.routes || []).map(({ target }) => {
  //     if (head(target.split('-')) === 'igw') {
  //       const foundIgw = vpcIgws.find(
  //         ({ displayData }) => displayData.id === target
  //       )
  //       if (foundIgw) {
  //         routeTable.metaData = {
  //           ...routeTable.metaData,
  //           connections: [
  //             ...(routeTable.metaData.connections || []),
  //             generateConnection({
  //               id: foundIgw.id,
  //               name: foundIgw.name,
  //               resourceType: resourceTypes.igw,
  //             }),
  //           ],
  //         }
  //         foundIgw.metaData = {
  //           ...foundIgw.metaData,
  //           connections: [
  //             ...(foundIgw.metaData.connections || []),
  //             generateConnection({
  //               id: routeTable.id,
  //               name: routeTable.name,
  //               resourceType: resourceTypes.routeTable,
  //             }),
  //           ],
  //         }
  //       }
  //     }
  //   })
  // )

  const vpc = {
    id,
    arn: `arn:aws:ec2:${region}:${account}:vpc/${id}`,
    // tags,
    ipV4Cidr: vpcData[vpcNames.cidrBlock],
    ipV6Cidr: (vpcData[vpcNames.ipv6CidrBlockAssociationSet] || [])
      .map(({ ipv6CidrBlock }) => ipv6CidrBlock)
      .join(', '),
    dhcpOptionsSet: vpcData[vpcNames.dhcpOptionsId],
    instanceTenancy: vpcData[vpcNames.instanceTenancy],
    enableDnsSupport: vpcData[vpcNames.enableDnsSupport] ? t.true : t.false,
    enableDnsHostnames: vpcData[vpcNames.enableDnsHostnames]
      ? t.true
      : t.false,
    state: vpcData[vpcNames.state],
    defaultVpc: vpcData[vpcNames.isDefault],
  }
  // const vpcToAdd: VpcType = generateElement({
  //   id: `${id}-${kebabCase(resourceTypes.vpc)}`,
  //   name,
  //   resourceType: resourceTypes.vpc,
  //   displayData: {
  //     id,
  //     arn: `arn:aws:ec2:${regionName}:${account}:vpc/${id}`,
  //     tags,
  //     ipV4Cidr: vpcData[vpcNames.cidrBlock],
  //     ipV6Cidr: (vpcData[vpcNames.ipv6CidrBlockAssociationSet] || [])
  //       .map(({ ipv6CidrBlock }) => ipv6CidrBlock)
  //       .join(', '),
  //     networkAcl,
  //     mainRouteTable,
  //     defaultSecurityGroup,
  //     dhcpOptionsSet: vpcData[vpcNames.dhcpOptionsId],
  //     instanceTenancy: vpcData[vpcNames.instanceTenancy],
  //     enableDnsSupport: vpcData[vpcNames.enableDnsSupport] ? t.true : t.false,
  //     enableDnsHostnames: vpcData[vpcNames.enableDnsHostnames]
  //       ? t.true
  //       : t.false,
  //     state: vpcData[vpcNames.state],
  //     defaultVpc: vpcData[vpcNames.isDefault],
  //   },
  //   children: [...vpcSecurityGroups, ...vpcIgws],
  // })

  return vpc
}
