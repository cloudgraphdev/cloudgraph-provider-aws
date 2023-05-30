import { ParameterMetadata } from '@aws-sdk/client-ssm'
import { AwsSystemsManagerParameter } from '../../types/generated'
import { ssmParameterArn } from '../../utils/generateArns'

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
  service: ParameterMetadata
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
