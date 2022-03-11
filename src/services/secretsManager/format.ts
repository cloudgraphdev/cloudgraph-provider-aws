import { RawAwsSecretsManager } from './data'
import { AwsSecretsManager } from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

/**
 * Secrets Manager
 */

export default ({ 
  service,
  account,
  region
}:{
  service: RawAwsSecretsManager
  account: string
  region: string
}): AwsSecretsManager => {
  const {
    ARN: arn,
    Name: name,
    Description: description,
    KmsKeyId: kmsKeyId,
    RotationEnabled: rotationEnabled,
    RotationLambdaARN: rotationLambdaARN,
    RotationRules: rotationRules,
    LastRotatedDate: lastRotatedDate,
    LastChangedDate: lastChangedDate,
    LastAccessedDate: lastAccessedDate,
    DeletedDate: deletedDate,
    OwningService: owningService,
    CreatedDate: createdDate,
    Tags,
  } = service

  return {
    id: arn,
    accountId: account,
    arn,
    region,
    name,
    description,
    kmsKeyId,
    tags: formatTagsFromMap(Tags),
    rotationEnabled,
    rotationLambdaARN,
    rotationRules: { automaticallyAfterDays: rotationRules?.AutomaticallyAfterDays },
    lastRotatedDate: lastRotatedDate?.toISOString(),
    lastChangedDate: lastChangedDate?.toISOString(),
    lastAccessedDate: lastAccessedDate?.toISOString(),
    deletedDate: deletedDate?.toISOString(),
    createdDate: createdDate?.toISOString(),
    owningService,
  }
}