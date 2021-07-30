import { Aws_Igw } from '../../types/generated'
import { toCamel } from '../../utils'
import { AwsIgw } from './data'

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
  service: AwsIgw
  region: string
}): Aws_Igw => {
  const { Tags: tags } = rawData
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
    tags,
  }
}
