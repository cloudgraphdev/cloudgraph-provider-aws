import { AwsIamAccessAnalyzer } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

import { RawAwsAnalyzerSummary } from './data'

/**
 * IAM Access Analyzer
 */

export default ({
  service: rawData,
  account,
}: {
  service: RawAwsAnalyzerSummary
  account: string
  region: string
}): AwsIamAccessAnalyzer => {
  const {
    arn,
    createdAt,
    lastResourceAnalyzed,
    lastResourceAnalyzedAt,
    name,
    status,
    statusReason,
    Tags: tags = {},
    type,
    region,
  } = rawData

  return {
    id: arn,
    arn,
    accountId: account,
    region,
    createdAt: createdAt?.toISOString(),
    lastResourceAnalyzed,
    lastResourceAnalyzedAt: lastResourceAnalyzedAt?.toISOString(),
    name,
    status,
    statusReasonCode: statusReason?.code || '',
    type,
    tags: formatTagsFromMap(tags),
  }
}
