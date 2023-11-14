
import { AwsCodePipeline } from '../../types/generated'
import { codePipelineArn } from '../../utils/generateArns'
import { RawAwsPipelineSummary } from './data'

/**
 * Code Pipeline
 */
export default ({
  account,
  region,
  service: pipeline,
}: {
  account: string
  region: string
  service: RawAwsPipelineSummary
}): AwsCodePipeline => {
  const { name } = pipeline

  const arn = codePipelineArn({ region, account, name })

  return {
    accountId: account,
    arn,
    id: arn,
    name,
    region,
  }
}
