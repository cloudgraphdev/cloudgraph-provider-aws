/* eslint-disable no-shadow */
import t from '../../properties/translations'
import { AwsSecurityGroup } from './data'
import { AwsSecurityGroup as AwsSgType } from '../../types/generated'
import { toCamel } from '../../utils'

/**
 * Security Group
 */

const all = '-1'

export default ({
  service: rawData,
  account,
  region,
}: // allTagData,
{
  service: AwsSecurityGroup
  account: string
  region: string
  // allTagData: Array<Tags>
}): AwsSgType => {
  const {
    Tags: tags,
    GroupId: id,
    OwnerId: owner,
    GroupName: name,
    Description: description,
    VpcId: vpcId,
  } = rawData

  const { ipPermissions: ingress, ipPermissionsEgress: egress } =
    toCamel(rawData)

  /**
   * Add these tags to the list of global tags so we can filter by tag on the front end
   */
  // combineElementsTagsWithExistingGlobalTags({ tags, allTagData })

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
        [property: string]: string
        description: string
        descriptionDescription?: string
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

      ;(rule.ipRanges || []).map(({ cidrIp, description = '' }) => {
        allRules.push({ [direction]: cidrIp, description })
      })
      ;(rule.ipv6Ranges || []).map(({ cidrIpv6, description = '' }) => {
        allRules.push({ [direction]: cidrIpv6, description })
      })
      ;(rule.prefixListIds || []).map(({ prefixListId, description = '' }) => {
        allRules.push({ [direction]: prefixListId, description })
      })
      ;(rule.userIdGroupPairs || []).map(
        ({ groupId, description = '', ...rest }) => {
          allRules.push({
            [direction]: groupId,
            description,
            ...rest,
          })
        }
      )

      return allRules.flatMap(rule => ({ protocol, portRange, ...rule }))
    })
  )

  const inboundRules = ibr.flat()
  const outboundRules = obr.flat()

  return {
    id,
    name,
    vpcId,
    arn: `arn:aws:ec2:${region}:${account}:security-group/${id}`,
    description,
    tags,
    owner,
    default: name === t.default,
    inboundRules,
    outboundRules,
    inboundRuleCount: inboundRules.length,
    outboundRuleCount: outboundRules.length,
  }
}
