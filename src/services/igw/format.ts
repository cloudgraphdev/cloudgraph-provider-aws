import { AwsIgw } from '../../types/generated'
import { toCamel } from '../../utils'
import { formatTagsFromMap } from '../../utils/format'
import { RawAwsIgw } from './data'

/**
 * IGW Converter
 */
export default ({
  // allTagData,
  account,
  service: rawData,
  region,
}: {
  // allTagData: Tags[]
  account: string
  service: RawAwsIgw
  region: string
}): AwsIgw => {
  const { Tags } = rawData
  const {
    internetGatewayId: id,
    ownerId: owner,
    attachments,
    // tags,
  } = toCamel(rawData)

  /**
   * Add these tags to the list of global tags so we can filter by tag on the front end
   */
  // combineElementsTagsWithExistingGlobalTags({ tags, allTagData })

  return {
    arn: `arn:aws:ec2:${region}:${account}:internet-gateway/${id}`,
    attachments,
    id,
    owner,
    tags: formatTagsFromMap(Tags),
  }
}
