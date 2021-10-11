import COGUSER, {
  UserPoolDescriptionType,
  UserPoolType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider'
import { Config } from 'aws-sdk/lib/config'

import CloudGraph from '@cloudgraph/sdk'
import { groupBy } from 'lodash'
import { TagMap } from '../../types'
import { generateAwsErrorLog, initTestEndpoint } from '../../utils'
import awsLoggerText from '../../properties/logger'

const serviceName = 'Cognito User Pool'
const endpoint = initTestEndpoint(serviceName)
const lt = { ...awsLoggerText }
const { logger } = CloudGraph

/**
 * Cognito User Pool
 */

const MAX_RESULTS = 60

export interface RawAwsCognitoUserPool extends Omit<UserPoolType, 'UserPoolTags'> {
  region: string
  Tags: TagMap
}

const listUserPoolIds = async (cogUser: COGUSER): Promise<UserPoolDescriptionType[]> => {
  try {
    const fullResources: UserPoolDescriptionType[] = []
  
    let userPools = await cogUser.listUserPools({
      MaxResults: MAX_RESULTS,
    }).promise()
    fullResources.push(...userPools.UserPools)
    let nextToken = userPools.NextToken

    while (nextToken) {
      userPools = await cogUser.listUserPools({
        MaxResults: MAX_RESULTS,
        NextToken: nextToken,
      }).promise()
      fullResources.push(...userPools.UserPools)
      nextToken = userPools.NextToken
    }
    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'cognitoUserPool:listUserPoolIds', err)
  }
  return []
}

const describeUserPool = async ({
  cogUser, 
  userPoolId: UserPoolId, 
}: {
  cogUser: COGUSER, 
  userPoolId: string, 
}): Promise<Omit<UserPoolType, 'UserPoolTags'> & {Tags?: TagMap}> => {
  try {
    const userPool = await cogUser.describeUserPool({UserPoolId}).promise()
    logger.debug(lt.fetchedCognitoUserPool(UserPoolId))
    const Tags: TagMap = userPool.UserPool.UserPoolTags
    delete userPool.UserPool.UserPoolTags
    const pool = {
      ...userPool.UserPool,
      Tags
    }
    return pool
  } catch (err) {
    generateAwsErrorLog(serviceName, 'cognitoUserPool:describeUserPool', err)
  }
  return {}
}

const listUserPoolData = async ({
  cogUser,
  region,
}: {
  cogUser: COGUSER,
  region: string,
}): Promise<RawAwsCognitoUserPool[]> => {
  const userPoolData = []
  const userPoolIds = await listUserPoolIds(cogUser)

  for (const userPoolId of userPoolIds) {
    const userPool = await describeUserPool({cogUser, userPoolId: userPoolId.Id})
    userPoolData.push({
      ...userPool,
      region,
    })
  }

  logger.debug(lt.fetchedCognitoUserPools(userPoolData.length))

  return userPoolData
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: Config
}): Promise<{
  [region: string]: RawAwsCognitoUserPool[]
}> => {
  const cognitoData = []
  
  for (const region of regions.split(',')) {
    const cogUser = new COGUSER({ ...config, region, endpoint })

    /**
     * Fetch all  User Pools
     */
    const userPoolData = await listUserPoolData({cogUser, region})
    cognitoData.push(...userPoolData)
  }
  logger.debug(lt.addingUserPools(cognitoData.length))

  return groupBy(cognitoData, 'region')
}
