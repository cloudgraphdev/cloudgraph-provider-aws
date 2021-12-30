import cuid from 'cuid'
import t from '../../properties/translations'
import { AwsSecurityGroup } from './data'
import { AwsSecurityGroup as AwsSgType } from '../../types/generated'
import { toCamel } from '../../utils'
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
        ({ cidrIp, description: ipRangesDescription = '' }) => {
          allRules.push({
            id: cuid(),
            [direction]: cidrIp,
            description: ipRangesDescription,
          })
        }
      )
      ;(rule.ipv6Ranges || []).map(
        ({ cidrIpv6, description: ipv6RangesDescription = '' }) => {
          allRules.push({
            id: cuid(),
            [direction]: cidrIpv6,
            description: ipv6RangesDescription,
          })
        }
      )
      ;(rule.prefixListIds || []).map(
        ({ prefixListId, description: prefixListIdsDescription = '' }) => {
          allRules.push({
            id: cuid(),
            [direction]: prefixListId,
            description: prefixListIdsDescription,
          })
        }
      )
      ;(rule.userIdGroupPairs || []).map(
        ({
          groupId,
          userId = '',
          groupName = '',
          peeringStatus = '',
          description: descriptionUserIdGroupPairs = '',
        }) => {
          allRules.push({
            id: cuid(),
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
    arn: securityGroupArn({ region, account, id }),
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
