import { AwsCodeCommitRepository } from '../../types/generated'
import { codeCommitRepositoryArn } from '../../utils/generateArns'
import { RawAwsRepository } from './data'

/**
 * Code Commit Repository
 */
export default ({
  account,
  region,
  service: parameter,
}: {
  account: string
  region: string
  service: RawAwsRepository
}): AwsCodeCommitRepository => {
  const { repositoryName, repositoryId } = parameter

  const arn = codeCommitRepositoryArn({ region, account, name: repositoryName })

  return {
    accountId: account,
    arn,
    id: repositoryId,
    name: repositoryName,
    region,
  }
}
