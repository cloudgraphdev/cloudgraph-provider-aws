import { AwsSageMakerExperiment } from '../../types/generated'
import { RawAwsSageMakerExperiment } from './data'

/**
 * SageMakerExperiment
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsSageMakerExperiment
  region: string
}): AwsSageMakerExperiment => {
  const {
    ExperimentArn: experimentArn,
    ExperimentName: experimentName,
    DisplayName: displayName,
    ExperimentSource: {
      SourceArn: sourceArn,
      SourceType: sourceType
    },
    CreationTime: creationTime,
    LastModifiedTime: lastModifiedTime,
  } = rawData

  return {
    id: experimentArn,
    arn: experimentArn,
    region,
    accountId: account,
    experimentName,
    displayName,
    experimentSource: {
      sourceArn,
      sourceType
    },
    creationTime: creationTime?.toISOString(),
    lastModifiedTime: lastModifiedTime?.toISOString()
  }
}
