import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import { RawAwsSecretsManager } from './data'
import { AwsKms } from '../kms/data'
import { RawAwsLambdaFunction } from '../lambda/data'
import services from '../../enums/services'

export default ({
  service,
  data,
  region,
}: {
  account: string
  service: RawAwsSecretsManager
  data: Array<{ name: string; data: { [property: string]: any[] } }>
  region: string
}): {
  [property: string]: ServiceConnection[]
} => {
  const connections: ServiceConnection[] = []
  const {
    ARN: id,
    KmsKeyId: kmsKeyId,
    RotationLambdaARN: rotationLambdaARN,
    ReplicationStatus: replicationStatus,
  } = service

  /**
   * Find KMS
   * related to this Secrets Manager
   */
  const kmsKeyIds: string[] = replicationStatus?.map(rs => rs.KmsKeyId)
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region]) {
    const kmsKeyInRegion: AwsKms[] = kmsKeys.data[region].filter(
      ({ Arn: arn, KeyId: keyId, Aliases: aliases = [] }: AwsKms) =>
        kmsKeyId === arn ||
        kmsKeyIds?.includes(arn) ||
        kmsKeyIds?.includes(keyId) ||
        aliases?.some(a => kmsKeyIds?.includes(a.AliasName))
    )

    if (!isEmpty(kmsKeyInRegion)) {
      for (const kms of kmsKeyInRegion) {
        const { KeyId: keyId }: AwsKms = kms
        connections.push({
          id: keyId,
          resourceType: services.kms,
          relation: 'child',
          field: 'kms',
        })
      }
    }
  }

  /**
   * Find Lambda Functions
   * related to this Secrets Manager
   */
  const lambdas = data.find(({ name }) => name === services.lambda)

  if (rotationLambdaARN && lambdas?.data?.[region]) {
    const lambdaInRegion: RawAwsLambdaFunction = lambdas.data[region].find(
      ({ FunctionArn: functionArn }: RawAwsLambdaFunction) =>
        rotationLambdaARN === functionArn
    )

    if (lambdaInRegion) {
      const { FunctionArn: functionArn }: RawAwsLambdaFunction = lambdaInRegion

      connections.push({
        id: functionArn,
        resourceType: services.lambda,
        relation: 'child',
        field: 'lambda',
      })
    }
  }

  const snsResult = {
    [id]: connections,
  }
  return snsResult
}
