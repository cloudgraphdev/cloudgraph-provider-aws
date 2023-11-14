import { RawAwsVpcLink } from './data'
import { AwsVpcLink } from '../../types/generated'
import { apiVpcLinkArn } from '../../utils/generateArns'
import { formatTagsFromMap } from '../../utils/format'

export default ({
  service,
  account: accountId,
  region,
}: {
  service: RawAwsVpcLink
  account: string
  region: string
}): AwsVpcLink => {
  const {
    CreatedDate,
    Name: name,
    SecurityGroupIds: securityGroupIds = [],
    SubnetIds: subnetIds = [],
    VpcLinkId: vpcLinkId,
    VpcLinkStatus: vpcLinkStatus,
    VpcLinkStatusMessage: vpcLinkStatusMessage,
    VpcLinkVersion: vpcLinkVersion,
    Tags = {},
  } = service

  const arn = apiVpcLinkArn({ region: service.region, vpcLinkId })

  return {
    id: vpcLinkId,
    accountId,
    arn,
    region,
    createdDate: CreatedDate?.toISOString(),
    name,
    securityGroupIds,
    subnetIds,
    vpcLinkId,
    vpcLinkStatus,
    vpcLinkStatusMessage,
    vpcLinkVersion,
    tags: formatTagsFromMap(Tags),
  }
}
