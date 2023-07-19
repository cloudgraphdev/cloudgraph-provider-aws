import { AwsSystemsManagerParameter } from '../../types/generated'
import { ssmParameterArn } from '../../utils/generateArns'
import { RawAwsParameterMetadata } from './data'

/**
 * Systems Manager Parameter
 */
export default ({
  account,
  region,
  service: parameter,
}: {
  account: string
  region: string
  service: RawAwsParameterMetadata
}): AwsSystemsManagerParameter => {
  const { Name: name } = parameter

  const arn = ssmParameterArn({ region, account, name })

  return {
    accountId: account,
    arn,
    id: arn,
    name,
    region,
  }
}
