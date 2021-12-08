import { TransitGatewayOptions } from 'aws-sdk/clients/ec2'
import isEmpty from 'lodash/isEmpty'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsTransitGateway, RawAwsTransitGatewayVpcAttachment } from './data'
import { AwsTransitGateway, AwsVpcAttachment }  from '../../types/generated'
import t from '../../properties/translations'

/**
 * Transit Gateway
 */

const awsTransitGatewayVpcAttachmentConverter = ({
  vpcAttachments,
  options
}: {
  vpcAttachments: RawAwsTransitGatewayVpcAttachment[]
  options: TransitGatewayOptions
}): AwsVpcAttachment[] => {

  const attachments: AwsVpcAttachment[] = []
  if (!isEmpty(vpcAttachments)) {
    for (const vpc of vpcAttachments) {
      const vpcAttachmentTags = formatTagsFromMap(vpc.Tags)

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
    Tags: tags,
    VpcAttachments: vpcAttachments
  } = rawData

   // Transit Gateway Tags
  const transitGatewayTags = formatTagsFromMap(tags)

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
