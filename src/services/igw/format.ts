import { AwsIgw } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsIgw } from './data'

/**
 * IGW Converter
 */
export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsIgw
  region: string
}): AwsIgw => {
  const {
    InternetGatewayId: id,
    OwnerId: owner,
    Attachments: attachments = [],
    Tags,
  } = rawData

  return {
    arn: `arn:aws:ec2:${region}:${account}:internet-gateway/${id}`,
    attachments: attachments.map(({ VpcId: vpcId, State: state }) => ({
      vpcId,
      state,
    })),
    id,
    owner,
    tags: formatTagsFromMap(Tags),
  }
}
