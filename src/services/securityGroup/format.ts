import { generateUniqueId, toCamel } from '@cloudgraph/sdk'

import t from '../../properties/translations'
import { AwsSecurityGroup } from './data'
import { AwsSecurityGroup as AwsSgType } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { securityGroupArn } from '../../utils/generateArns'

/**
 * Security Group
 */

const all = '-1'

export default ({
  service: rawData,
  account,
  region,
}: {
  service: AwsSecurityGroup
  account: string
  region: string
}): AwsSgType => {
  const {
    Tags,
    GroupId: id,
    OwnerId: owner,
    GroupName: name,
    Description: description,
    VpcId: vpcId,
  } = rawData

  const arn = securityGroupArn({ region, account, id })

  const { ipPermissions: ingress, ipPermissionsEgress: egress } =
    toCamel(rawData)

  const [obr, ibr] = [
    { data: egress, direction: t.destination },
    { data: ingress, direction: t.source },
  ].map(({ data, direction }) =>
    data.map(rule => {
      const protocol = rule.ipProtocol === all ? t.all : rule.ipProtocol

      const [toPort, fromPort] = [rule.toPort, rule.fromPort]

      let portRange = ''

      if ((!fromPort && !toPort) || (toPort === -1 && fromPort === -1)) {
        portRange = t.all
      } else if (fromPort === toPort) {
        portRange = fromPort.toString()
      } else {
        portRange = `${fromPort} - ${toPort}`
      }

      const allRules: Array<{
        id: string // We need this id here to ensure no duplicate data is entered
        description: string
        source?: string
        destination?: string
        groupId?: string
        groupName?: string
        peeringStatus?: string
        userId?: string
        vpcId?: string
        vpcPeeringConnectionId?: string
      }> = []
      /**
       * For each possible target, get the info so we can create a unique rule for it
       */

      ;(rule.ipRanges || []).map(
        ({ cidrIp, description: ipRangesDescription = '' }, index) => {
          allRules.push({
            id: generateUniqueId({
              arn,
              protocol,
              portRange,
              cidrIp,
              ipRangesDescription,
              ipRanges: `ipRanges_${index}`,
            }),
            [direction]: cidrIp,
            description: ipRangesDescription,
          })
        }
      )
      ;(rule.ipv6Ranges || []).map(
        ({ cidrIpv6, description: ipv6RangesDescription = '' }, index) => {
          allRules.push({
            id: generateUniqueId({
              arn,
              protocol,
              portRange,
              cidrIpv6,
              ipv6RangesDescription,
              ipv6Ranges: `ipv6Ranges_${index}`,
            }),
            [direction]: cidrIpv6,
            description: ipv6RangesDescription,
          })
        }
      )
      ;(rule.prefixListIds || []).map(
        (
          { prefixListId, description: prefixListIdsDescription = '' },
          index
        ) => {
          allRules.push({
            id: generateUniqueId({
              arn,
              protocol,
              portRange,
              prefixListId,
              prefixListIdsDescription,
              prefixListIds: `prefixListIds_${index}`,
            }),
            [direction]: prefixListId,
            description: prefixListIdsDescription,
          })
        }
      )
      ;(rule.userIdGroupPairs || []).map(
        (
          {
            groupId,
            userId = '',
            groupName = '',
            peeringStatus = '',
            description: descriptionUserIdGroupPairs = '',
          },
          index
        ) => {
          allRules.push({
            id: generateUniqueId({
              arn,
              protocol,
              portRange,
              groupId,
              descriptionUserIdGroupPairs,
              groupName,
              peeringStatus,
              userId,
              userIdGroupPairs: `userIdGroupPairs_${index}`,
            }),
            [direction]: groupId,
            description: descriptionUserIdGroupPairs,
            groupName,
            peeringStatus,
            userId,
          })
        }
      )

      return allRules.flatMap(allRulesRule => ({
        protocol,
        portRange,
        toPort,
        fromPort,
        ...allRulesRule,
      }))
    })
  )

  const inboundRules = ibr.flat()
  const outboundRules = obr.flat()

  return {
    id,
    name,
    vpcId,
    accountId: account,
    arn,
    region,
    description,
    tags: formatTagsFromMap(Tags),
    owner,
    default: name === t.default,
    inboundRules,
    outboundRules,
    inboundRuleCount: inboundRules.length,
    outboundRuleCount: outboundRules.length,
  }
}
