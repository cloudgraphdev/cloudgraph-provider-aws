import { TransitGatewayVpcAttachmentList, TransitGatewayOptions } from 'aws-sdk/clients/ec2'
import { formatTagsFromMap, convertTagListToTagMap } from '../../utils/format'
import { RawAwsTransitGateway } from './data'
import { AwsTransitGateway, AwsVpcAttachment }  from '../../types/generated'
import t from '../../properties/translations'

/**
 * Transit Gateway
 */

const awsTransitGatewayVpcAttachmentConverter = ({
  vpcAttachments,
  options
}: {
  vpcAttachments: TransitGatewayVpcAttachmentList
  options: TransitGatewayOptions
}): AwsVpcAttachment[] => {

  const attachments: AwsVpcAttachment[] = []
  for (const vpc of vpcAttachments) {
    const tagsMap = convertTagListToTagMap(vpc.Tags)
    const vpcAttachmentTags = formatTagsFromMap(tagsMap)

    const attachment: AwsVpcAttachment = {
      vpcId: vpc.VpcId,
      vpcOwnerId: vpc.VpcOwnerId,
      dnsSupport: vpc.Options?.DnsSupport,
      ipv6Support: vpc.Options?.Ipv6Support,
      transitGatewayId: vpc.TransitGatewayId,
      transitGatewayDefaultRouteTableAssociation: options?.DefaultRouteTableAssociation === t.enable,
      transitGatewayDefaultRouteTablePropagation: options?.DefaultRouteTablePropagation === t.enable,
      subnetIds: vpc.SubnetIds,
      tags: vpcAttachmentTags
    }

    attachments.push(attachment)
  }

  return attachments;
}

export default ({
  service: rawData,
  account,
  region,
}: {
  service: RawAwsTransitGateway
  account: string
  region: string
}): AwsTransitGateway => {
  const {
    TransitGatewayId: id,
    TransitGatewayArn: arn,
    OwnerId: ownerId,
    Description: description,
    Options: options,
    Tags: tagList,
    VpcAttachments: vpcAttachments
  } = rawData

   // Transit Gateway Tags
  const tagsMap = convertTagListToTagMap(tagList)
  const transitGatewayTags = formatTagsFromMap(tagsMap)

  const transitGateway = {
    id,
    accountId: account,
    arn,
    region,
    ownerId,
    description,
    dnsSupport: options?.DnsSupport,
    vpnEcmpSupport: options?.VpnEcmpSupport,
    amazonSideAsn: options?.AmazonSideAsn?.toString(),
    autoAcceptSharedAttachments: options?.AutoAcceptSharedAttachments,
    defaultRouteTableAssociation: options?.DefaultRouteTableAssociation,
    defaultRouteTablePropagation: options?.DefaultRouteTablePropagation,
    associationDefaultRouteTableId: options?.AssociationDefaultRouteTableId,
    propagationDefaultRouteTableId: options?.PropagationDefaultRouteTableId,
    tags: transitGatewayTags,
    children: awsTransitGatewayVpcAttachmentConverter({ vpcAttachments, options })
  }

  return transitGateway
}
