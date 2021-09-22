import { UserPoolType } from 'aws-sdk/clients/cognitoidentityserviceprovider';

import { ServiceConnection } from '@cloudgraph/sdk';
import services from '../../enums/services';

/**
 * Cognito User Pool
 */

export default ({
  service: userPool,
  data,
  region,
}: {
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
  } = userPool

  const defineAuthChallengeArn = lambdaConfig?.DefineAuthChallenge

  /**
   * Find Lambda Functions
   * related to this Auto Scaling Group
   */
  const lambdas = data.find(({ name }) => name === services.lambda)

  if (defineAuthChallengeArn && lambdas?.data?.[region]) {
    const lambdaInRegion = lambdas.data[region].find(lambda =>
      defineAuthChallengeArn === lambda.FunctionArn)
      
    if (lambdaInRegion) {
      const lambdaFunctionArn = lambdaInRegion.FunctionArn

      connections.push({
        id: lambdaFunctionArn,
        resourceType: services.lambda,
        relation: 'child',
        field: 'lambda',
      })
    }
  }

  // TODO Email Sender

  // TODO SMS Sender

  const userPoolResult = {
    [id]: connections,
  }
  return userPoolResult
}
