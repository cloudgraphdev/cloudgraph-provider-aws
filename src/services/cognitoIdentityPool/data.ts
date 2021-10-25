import { CognitoIdentity, IdentityPool, IdentityPoolShortDescription } from '@aws-sdk/client-cognito-identity'
// import { Config } from 'aws-sdk/lib/config'

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
 * Cognito Identity Pool
 */

const MAX_RESULTS = 60

export interface RawAwsCognitoIdentityPool extends Omit<IdentityPool, 'IdentityPoolTags'> {
  region: string
  Tags: TagMap
}

const listIdentityPoolIds = async (cogId: CognitoIdentity): Promise<IdentityPoolShortDescription[]> => {
  try {
    const fullResources: IdentityPoolShortDescription[] = []
  
    let identityPools = await cogId.listIdentityPools({
      MaxResults: MAX_RESULTS,
    })
    fullResources.push(...identityPools.IdentityPools)
    let nextToken = identityPools.NextToken

    while (nextToken) {
      identityPools = await cogId.listIdentityPools({
        MaxResults: MAX_RESULTS,
        NextToken: nextToken,
      })
      fullResources.push(...identityPools.IdentityPools)
      nextToken = identityPools.NextToken
    }
    return fullResources
  } catch (err) {
    generateAwsErrorLog(serviceName, 'cognitoIdentityPool:listIdentityPoolIds', err)
  }
  return []
}

const describeIdentityPool = async ({
  cogId, 
  IdentityPoolId, 
}: {
  cogId: CognitoIdentity, 
  IdentityPoolId: string, 
}): Promise<Omit<IdentityPool, 'IdentityPoolTags'> & {Tags: TagMap}> => {
  try {
    const identityPool = await cogId.describeIdentityPool({IdentityPoolId})
    logger.debug(lt.fetchedCognitoIdentityPool(IdentityPoolId))
    const Tags = identityPool.IdentityPoolTags || {}
    delete identityPool.IdentityPoolTags
    const pool = {
      ...identityPool,
      Tags
    }
    return pool
  } catch (err) {
    generateAwsErrorLog(serviceName, 'cognitoIdentityPool:describeIdentityPool', err)
  }
  return null
}

const listIdentityPoolData = async ({
  cogId,
  region,
}: {
  cogId: CognitoIdentity,
  region: string,
}): Promise<RawAwsCognitoIdentityPool[]> => {
  const identityPoolData = []
  const identityPoolIds = await listIdentityPoolIds(cogId)

  for (const identityPoolId of identityPoolIds) {
    const identityPool = await describeIdentityPool({cogId, IdentityPoolId: identityPoolId.IdentityPoolId})
    identityPoolData.push({
      ...identityPool,
      region,
    })
  }

  logger.debug(lt.fetchedCognitoIdentityPools(identityPoolIds.length))
  
  return identityPoolData
}

export default async ({
  regions,
  config,
}: {
  regions: string
  config: any
}): Promise<{
  [region: string]: RawAwsCognitoIdentityPool[]
}> => {
  const cognitoData = []
  
  for (const region of regions.split(',')) {
    const cogId = new CognitoIdentity({ ...config, region, endpoint })

    /**
     * Fetch all Identity Pools
     */

    const identityPoolData = await listIdentityPoolData({cogId, region})
    cognitoData.push(...identityPoolData)
  }

  logger.debug(lt.addingIdentityPools(cognitoData.length))

  return groupBy(cognitoData, 'region')
}
