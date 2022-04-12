import cuid from 'cuid'
import { ReplicationStatusType } from 'aws-sdk/clients/secretsmanager'
import { RawAwsSecretsManager } from './data'
import {
  AwsSecretsManager,
  AwsSecretsManagerReplicationStatus,
} from '../../types/generated'
import { formatTagsFromMap } from '../../utils/format'

export const formatReplicationStatus = (
  replicationStatus?: ReplicationStatusType[]
): AwsSecretsManagerReplicationStatus[] => {
  return (
    replicationStatus?.map(rs => ({
      id: cuid(),
      region: rs.Region,
      kmsKeyId: rs.KmsKeyId,
      status: rs.Status,
      statusMessage: rs.StatusMessage,
      lastAccessedDate: rs.LastAccessedDate?.toISOString(),
    })) || []
  )
}

/**
 * Secrets Manager
 */

export default ({
  service,
  account,
  region,
}: {
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
    ReplicationStatus: replicationStatus = [],
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
    rotationRules: {
      id: cuid(),
      automaticallyAfterDays: rotationRules?.AutomaticallyAfterDays,
    },
    lastRotatedDate: lastRotatedDate?.toISOString(),
    lastChangedDate: lastChangedDate?.toISOString(),
    lastAccessedDate: lastAccessedDate?.toISOString(),
    deletedDate: deletedDate?.toISOString(),
    createdDate: createdDate?.toISOString(),
    owningService,
    replicationStatus: formatReplicationStatus(replicationStatus),
  }
}
