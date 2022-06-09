import { generateUniqueId } from '@cloudgraph/sdk'
import { VpcPeeringConnectionVpcInfo } from 'aws-sdk/clients/ec2'
import { isEmpty } from 'lodash'

import { formatTagsFromMap } from '../../utils/format'
import { RawAwsVpcPeeringConnection } from './data'
import {
  AwsVpcPeeringConnection,
  AwsVpcPeeringConnectionVpcInfo,
} from '../../types/generated'
import { vpcPeeringConnectionArn } from '../../utils/generateArns'

const formatVpcInfo = (
  vpcInfo: VpcPeeringConnectionVpcInfo
): AwsVpcPeeringConnectionVpcInfo => {
  if (isEmpty(vpcInfo)) {
    return {}
  }

  return {
    cidrBlock: vpcInfo.CidrBlock,
    ipv6CidrBlockSet:
      vpcInfo.Ipv6CidrBlockSet?.map(c => ({
        id: generateUniqueId({
          cidrBlock: vpcInfo.CidrBlock,
          ...vpcInfo.Ipv6CidrBlockSet,
        }),
        ipv6CidrBlock: c.Ipv6CidrBlock,
      })) || [],
    cidrBlockSet:
      vpcInfo.CidrBlockSet?.map(c => ({
        id: generateUniqueId({
          cidrBlock: vpcInfo.CidrBlock,
          ...vpcInfo.CidrBlockSet,
        }),
        cidrBlock: c.CidrBlock,
      })) || [],
    peeringOptions: vpcInfo.PeeringOptions
      ? {
          allowDnsResolutionFromRemoteVpc:
            vpcInfo.PeeringOptions.AllowDnsResolutionFromRemoteVpc,
          allowEgressFromLocalClassicLinkToRemoteVpc:
            vpcInfo.PeeringOptions.AllowEgressFromLocalClassicLinkToRemoteVpc,
          allowEgressFromLocalVpcToRemoteClassicLink:
            vpcInfo.PeeringOptions.AllowEgressFromLocalVpcToRemoteClassicLink,
        }
      : {},
    vpcId: vpcInfo.VpcId,
  }
}

/**
 * Vpc Peering Connection
 */

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsVpcPeeringConnection
  account: string
  region: string
}): AwsVpcPeeringConnection => {
  const {
    VpcPeeringConnectionId: id,
    AccepterVpcInfo: accepterVpcInfo = {},
    ExpirationTime: expirationTime,
    RequesterVpcInfo: requesterVpcInfo = {},
    Status: status = {},
    Tags: tags = {},
  } = rawData

  const vpcPeeringConnection = {
    id,
    accountId: account,
    arn: vpcPeeringConnectionArn({ region, account, id }),
    region,
    accepterVpcInfo: formatVpcInfo(accepterVpcInfo),
    expirationTime: expirationTime?.toISOString(),
    requesterVpcInfo: formatVpcInfo(requesterVpcInfo),
    statusCode: status?.Code,
    statusMessage: status?.Message,
    tags: formatTagsFromMap(tags),
  }

  return vpcPeeringConnection
}
