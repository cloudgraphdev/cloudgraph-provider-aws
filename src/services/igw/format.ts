import { AwsIgw } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'
import { igwArn } from '../../utils/generateArns'
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
    accountId: account,
    arn: igwArn({region, account, id}),
    region,
    attachments: attachments.map(({ VpcId: vpcId, State: state }) => ({
      vpcId,
      state,
    })),
    id,
    owner,
    tags: formatTagsFromMap(Tags),
  }
}
