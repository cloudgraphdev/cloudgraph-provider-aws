import { UserPoolType, LambdaConfigType } from 'aws-sdk/clients/cognitoidentityserviceprovider'

import { ServiceConnection } from '@cloudgraph/sdk'
import { isEmpty } from 'lodash'
import services from '../../enums/services'
import { sesArn } from '../../utils/generateArns'
import { RawAwsLambdaFunction } from '../lambda/data'
import { RawAwsSes } from '../ses/data'
import { RawAwsIamRole } from '../iamRole/data'
import { AwsKms } from '../kms/data'

const getLambdasArn = (
  lambdaConfig?: LambdaConfigType
): string[] => {
  if (isEmpty(lambdaConfig)) {
    return []
  }

  const {
    PreSignUp,
    CustomMessage,
    PostConfirmation,
    PreAuthentication,
    PostAuthentication,
    DefineAuthChallenge,
    CreateAuthChallenge,
    VerifyAuthChallengeResponse,
    PreTokenGeneration,
    UserMigration,
  } = lambdaConfig

  return [
    PreSignUp,
    CustomMessage,
    PostConfirmation,
    PreAuthentication,
    PostAuthentication,
    DefineAuthChallenge,
    CreateAuthChallenge,
    VerifyAuthChallengeResponse,
    PreTokenGeneration,
    UserMigration,
  ]?.filter(l => l)
}

/**
 * Cognito User Pool
 */

export default ({
  service: userPool,
  data,
  region,
  account,
}: {
  account: string
  data: { name: string; data: { [property: string]: any[] } }[]
  service: UserPoolType & {
    region: string
  }
  region: string
}): { [key: string]: ServiceConnection[] } => {
  const connections: ServiceConnection[] = []

  const {
    Id: id,
    LambdaConfig: lambdaConfig,
    EmailConfiguration: emailConfiguration,
    SmsConfiguration: smsConfiguration,
  } = userPool

  /**
   * Find Lambda Functions
   * related to this cognito user pool
   */
  const lambdasArn: string[] = getLambdasArn(lambdaConfig)
  const lambdas = data.find(({ name }) => name === services.lambda)

  if (lambdasArn?.length > 0 && lambdas?.data?.[region]) {
    const lambdasInRegion: RawAwsLambdaFunction[] = lambdas.data[region].filter(
      ({ FunctionArn }: RawAwsLambdaFunction) =>
        lambdasArn.includes(FunctionArn)
    )

    if (!isEmpty(lambdasInRegion)) {
      for (const lambda of lambdasInRegion) {
        connections.push({
          id: lambda.FunctionArn,
          resourceType: services.lambda,
          relation: 'child',
          field: 'lambdas',
        })
      }
    }
  }

  /**
   * Find MKS
   * related to this cognito user pool
   */
  const kmsKeyID = lambdaConfig?.KMSKeyID
  const kms = data.find(({ name }) => name === services.kms)

  if (kmsKeyID && kms?.data?.[region]) {
    const kmsInRegion: AwsKms = kms.data[region].find(
      ({ KeyArn }: AwsKms) => kmsKeyID === KeyArn
    )

    if (kmsInRegion) {
      connections.push({
        id: kmsInRegion.KeyId,
        resourceType: services.kms,
        relation: 'child',
        field: 'kms',
      })
    }
  }

  /**
   * Find SES sender
   * related to this cognito user pool
   */
  const emailConfigSourceArn = emailConfiguration?.SourceArn
  const emails = data.find(({ name }) => name === services.ses)

  if (emailConfigSourceArn && emails?.data?.[region]) {
    const emailInRegion: RawAwsSes = emails.data[region].find(
      ({ Identity }: RawAwsSes) =>
        emailConfigSourceArn === sesArn({ region, account, email: Identity })
    )

    if (emailInRegion) {
      connections.push({
        id: sesArn({ region, account, email: emailInRegion.Identity }),
        resourceType: services.ses,
        relation: 'child',
        field: 'ses',
      })
    }
  }

  /**
   * Find SNS caller
   * related to this cognito user pool
   */
  const smsConfigSnsCallerArn = smsConfiguration?.SnsCallerArn
  const iamRoles = data.find(({ name }) => name === services.iamRole)

  if (smsConfigSnsCallerArn && iamRoles?.data?.[region]) {
    const iamRoleInRegion: RawAwsIamRole = iamRoles.data[region].find(
      ({ Arn }: RawAwsIamRole) => smsConfigSnsCallerArn === Arn
    )

    if (iamRoleInRegion) {
      connections.push({
        id: iamRoleInRegion.Arn,
        resourceType: services.iamRole,
        relation: 'child',
        field: 'iamRole',
      })
    }
  }

  const userPoolResult = {
    [id]: connections,
  }
  return userPoolResult
}