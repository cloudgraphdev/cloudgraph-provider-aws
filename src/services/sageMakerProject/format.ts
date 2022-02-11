import { AwsSageMakerProject } from '../../types/generated'
import { RawAwsSageMakerProject } from './data'

/**
 * SageMakerProject
 */

export default ({
  account,
  service: rawData,
  region,
}: {
  account: string
  service: RawAwsSageMakerProject
  region: string
}): AwsSageMakerProject => {
  const {
    ProjectName: projectName,
    ProjectArn: projectArn,
    ProjectId: projectId,
    CreationTime: creationTime,
    ProjectStatus: projectStatus,
  } = rawData

  return {
    id: projectId,
    arn: projectArn,
    region,
    accountId: account,
    projectName,
    projectId,
    creationTime: creationTime?.toISOString(),
    projectStatus,
  }
}
