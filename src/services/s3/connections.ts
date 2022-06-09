import { ServiceConnection } from '@cloudgraph/sdk'
import isEmpty from 'lodash/isEmpty'
import services from '../../enums/services'
import { RawAwsS3 } from './data'
import { RawAwsIamRole } from '../iamRole/data'
import { RawAwsLambdaFunction } from '../lambda/data'
import { RawAwsSns } from '../sns/data'
import { AwsSqs } from '../sqs/data'
import { globalRegionName } from '../../enums/regions'

/**
 * S3
 */

export default ({
  service,
  data,
  region,
}: {
  data: { name: string; data: { [property: string]: any[] } }[]
  service: RawAwsS3
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const {
    Id: id,
    AdditionalInfo: {
      ReplicationConfig: replicationConfig,
      NotificationConfiguration: {
        LambdaFunctionConfigurations: lambdaFunctionConfigurations,
        TopicConfigurations: topicConfigurations,
        QueueConfigurations: queueConfigurations,
      },
      EncryptionInfo: encryptionInfo,
    },
  } = service

  /**
   * Find IAM Roles
   * related to this S3
   */
  const roles: { name: string; data: { [property: string]: any[] } } =
    data.find(({ name }) => name === services.iamRole)
  if (replicationConfig?.Role && roles?.data?.[globalRegionName]) {
    const dataAtRegion: RawAwsIamRole[] = roles.data[globalRegionName].filter(
      role => role.Arn === replicationConfig.Role
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const { Arn: arn }: RawAwsIamRole = instance

        connections.push({
          id: arn,
          resourceType: services.iamRole,
          relation: 'child',
          field: 'iamRole',
        })
      }
    }
  }

  /**
   * Find lambda functions
   * related to this S3
   */
  const lambdaFunctions: {
    name: string
    data: { [property: string]: any[] }
  } = data.find(({ name }) => name === services.lambda)

  const functionArns = lambdaFunctionConfigurations?.map(
    lambdaConfig => lambdaConfig?.LambdaFunctionArn
  )

  if (!isEmpty(functionArns) && lambdaFunctions?.data?.[region]) {
    const dataAtRegion: RawAwsLambdaFunction[] = lambdaFunctions.data[
      region
    ].filter(({ FunctionArn }: RawAwsLambdaFunction) =>
      functionArns.includes(FunctionArn)
    )

    if (!isEmpty(dataAtRegion)) {
      for (const lambdaFunction of dataAtRegion) {
        const { FunctionArn: functionArn }: RawAwsLambdaFunction =
          lambdaFunction
        connections.push({
          id: functionArn,
          resourceType: services.lambda,
          relation: 'child',
          field: 'lambdas',
        })
      }
    }
  }

  /**
   * Find SNS topic
   * related to this S3
   */
  const snsTopics = data.find(({ name }) => name === services.sns)
  const topicArns = topicConfigurations?.map(topic => topic?.TopicArn)
  if (!isEmpty(topicArns) && snsTopics?.data?.[region]) {
    const snsTopicsInRegion: RawAwsSns[] = snsTopics.data[region].filter(
      ({ TopicArn: topicArn }: RawAwsSns) => topicArns.includes(topicArn)
    )

    if (!isEmpty(snsTopicsInRegion)) {
      for (const topic of snsTopicsInRegion) {
        const { TopicArn: topicArn }: RawAwsSns = topic
        connections.push({
          id: topicArn,
          resourceType: services.sns,
          relation: 'child',
          field: 'sns',
        })
      }
    }
  }

  /**
   * Find SQS
   * related to this S3
   */
  const sqsQueues = data.find(({ name }) => name === services.sqs)
  const sqsArns = queueConfigurations?.map(queue => queue?.QueueArn)
  if (!isEmpty(sqsArns) && sqsQueues?.data?.[region]) {
    const dataAtRegion: AwsSqs[] = sqsQueues.data[region].filter(
      ({ sqsAttributes: { QueueArn: queueArn } }: AwsSqs) =>
        sqsArns.includes(queueArn)
    )
    if (!isEmpty(dataAtRegion)) {
      for (const instance of dataAtRegion) {
        const {
          sqsAttributes: { QueueArn: queueArn },
        }: AwsSqs = instance

        connections.push({
          id: queueArn,
          resourceType: services.sqs,
          relation: 'child',
          field: 'sqs',
        })
      }
    }
  }

  /**
   * Find KMS
   * related to the S3
   */
  const kmsKeyIds = encryptionInfo?.Rules?.map(
    r => r.ApplyServerSideEncryptionByDefault?.KMSMasterKeyID
  )
  const kmsKeys = data.find(({ name }) => name === services.kms)
  if (kmsKeys?.data?.[region] && kmsKeyIds?.length > 0) {
    const kmsKeyInRegion = kmsKeys.data[region].filter(kmsKey =>
      kmsKeyIds.includes(kmsKey.Arn)
    )

    if (!isEmpty(kmsKeyInRegion)) {
      for (const kms of kmsKeyInRegion) {
        connections.push({
          id: kms.KeyId,
          resourceType: services.kms,
          relation: 'child',
          field: 'kms',
        })
      }
    }
  }

  const s3Result = {
    [id]: connections,
  }
  return s3Result
}
