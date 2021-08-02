import { Aws_Api_Gateway_Rest_Api } from '../../types/generated'
import { toCamel } from '../../utils'
import {
  apiGatewayArn,
  apiGatewayRestApiArn,
} from '../../utils/generateArns'

/**
 * APIGateway
 */
export default ({
  // allTagData,
  service: rawData,
}: 
{
  // allTagData
  service: any
}): Aws_Api_Gateway_Rest_Api => {
  const apiGateway = toCamel(rawData)
  const { tags } = rawData
  const id = apiGateway.id
  const arn = apiGatewayRestApiArn({
    restApiArn: apiGatewayArn({ region: apiGateway.region }),
    id,
  })
  const {
    name,
    description,
    policy,
    endpointType,
    apiKeySource,
    createdDate,
    minimumCompressionSize,
    binaryMediaTypes,
    stages,
    resources,
  } = apiGateway

  /**
   * Add these tags to the list of global tags so we can filter by tag on the front end
   */
  // combineElementsTagsWithExistingGlobalTags({ tags, allTagData })

  return {
    id: name,
    arn,
    description,
    policy,
    endpointType,
    apiKeySource,
    createdDate,
    minimumCompressionSize,
    binaryMediaTypes,
    tags,
    stages,
    resources,
  }
}
